import axios, { type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import type { ApiResponse } from "./apiResponse";
import router from "../../router/index";
import { useAlertStore } from "../../stores/Alert/alertStore";
import { useLoadingStore } from "../../stores/LoadingStore";

// API Constants
const API_BASE_URL = "https://localhost:5001/api/";
const TOKEN_REFRESH_LIMIT = 1;

// Create stores outside of interceptors to prevent reactivity issues
let loadingStore: ReturnType<typeof useLoadingStore> | null = null;
let alertStore: ReturnType<typeof useAlertStore> | null = null;

// Define interfaces for error responses
interface ApiErrorResponse {
  error?: string | string[];
  Errors?: string | string[];
  [key: string]: any; // Allow other properties
}

// Initialize stores with lazy loading
const getLoadingStore = () => {
  if (!loadingStore) {
    loadingStore = useLoadingStore();
  }
  return loadingStore;
};

const getAlertStore = () => {
  if (!alertStore) {
    alertStore = useAlertStore();
  }
  return alertStore;
};

// Create Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// First, let's create an interface for our extended Axios config
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {    
    // Add auth token if available
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for performance tracking
    config.headers["X-Request-Time"] = new Date().toISOString();
    
    return config;
  },
  (error: AxiosError) => {
    // Handle request configuration errors
    console.error("Request configuration error:", error);
    getLoadingStore().stopLoading();
    getAlertStore().showAlert("Error preparing request: " + (error.message || "Unknown error"), "error");
    return Promise.reject(error);
  }
);

// Token renewal function
async function renewToken(): Promise<boolean> {
  const token = Cookies.get("auth_token");
  let refreshCount = parseInt(Cookies.get("refresh_count") || "0", 10);
  const userEmail = localStorage.getItem("user_email");
  const alertStore = getAlertStore();

  // Validate token renewal prerequisites
  if (!token || !userEmail || refreshCount >= TOKEN_REFRESH_LIMIT) {
    console.log("Token renewal limit reached or missing credentials");
    alertStore.showAlert(
      "Your session has expired. Please log in again.",
      "error"
    );
    return false;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}Auth/renew-token`,
      { email: userEmail },
      { 
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000 // 10 second timeout for token renewal
      }
    );

    if (response.status === 200 && response.data?.data) {
      console.log("Token renewed successfully");
      
      // Update token and refresh count
      Cookies.set("auth_token", response.data.data);
      refreshCount += 1;
      Cookies.set("refresh_count", refreshCount.toString());

      return true;
    }
  } catch (error) {
    console.error("Token renewal failed:", error);
    alertStore.showAlert("Authentication error: Unable to refresh your session", "error");
  }

  return false;
}

// Helper function to extract error messages from various API error formats
function extractErrorMessages(errorData: any): string[] {
  if (!errorData) return ["Unknown error occurred"];
  
  // Cast to our error response interface
  const apiError = errorData as ApiErrorResponse;
  
  // Check for error property
  if (apiError.error) {
    return Array.isArray(apiError.error) ? apiError.error : [apiError.error];
  }
  
  // Check for Errors property
  if (apiError.Errors) {
    return Array.isArray(apiError.Errors) ? apiError.Errors : [apiError.Errors];
  }
  
  // Try to convert the entire object to string if nothing else works
  if (typeof errorData === 'object') {
    try {
      const errorString = JSON.stringify(errorData);
      return [errorString !== '{}' ? errorString : "Unknown error format"];
    } catch {
      return ["Could not parse error message"];
    }
  }
  
  return ["Unknown error occurred"];
}

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate and log request duration
    const requestTime = response.config.headers?.["X-Request-Time"] as string;
    if (requestTime) {
      const duration = new Date().getTime() - new Date(requestTime).getTime();
      console.debug(`Request to ${response.config.url} completed in ${duration}ms`);
    }
    
    // Stop loading indicator
    getLoadingStore().stopLoading();
    
    // Check for API-level errors in successful HTTP responses
    if (response.data && !response.data.success && response.data.error) {
      // Format error message for display
      const errorMessage = Array.isArray(response.data.error) 
        ? response.data.error.join(", ") 
        : response.data.error;
      
      // Show API error message
      getAlertStore().showAlert(errorMessage, "error");
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Handle authentication errors (401)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("Authentication token expired, attempting to renew...");

      const renewed = await renewToken();

      if (renewed) {
        // Update auth header with new token and retry request
        const newToken = Cookies.get("auth_token");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }

      // Token renewal failed, log user out
      console.log("Authentication failed, redirecting to login");
      Cookies.remove("auth_token");
      Cookies.remove("user_role");
      localStorage.removeItem("user_email");
      Cookies.remove("refresh_count");
      router.replace("/login");
    } 
    // Handle forbidden errors (403)
    else if (error.response?.status === 403) {
      getAlertStore().showAlert("You don't have permission to access this resource", "error");
      router.push("/unauthorized");
    }
    // Handle not found errors (404)
    else if (error.response?.status === 404) {
      getAlertStore().showAlert("Resource not found", "warning");
    }
    // Handle server errors (500)
    else if (error.response?.status && error.response.status >= 500) {
      getAlertStore().showAlert("Server error. Please try again later", "error");
    }
    // Handle timeout errors
    else if (error.code === "ECONNABORTED") {
      getAlertStore().showAlert("Request timed out. Please try again", "warning");
    }
    // Handle network errors
    else if (!error.response) {
      getAlertStore().showAlert("Network error. Please check your connection", "warning");
    }
    
    // Stop loading indicator
    getLoadingStore().stopLoading();
    
    // Log the error details
    console.error("API request failed:", {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: error.message
    });
    
    // Extract error messages using our helper function
    const errorMessages = extractErrorMessages(error.response?.data);
    
    // Create a properly typed error response
    const errorResponse: AxiosResponse<ApiResponse<null>> = {
      data: {
        data: null,
        success: false,
        error: errorMessages.length ? errorMessages : [error.message || "An unknown error occurred"]
      },
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      headers: error.response?.headers || {},
      config: originalRequest,
    };
    
    return Promise.resolve(errorResponse);
  },
);

// Helper function for handling API errors in services
export const handleApiError = (error: any, defaultMessage = "An error occurred"): never => {
  console.error("API error:", error);
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(defaultMessage);
};
