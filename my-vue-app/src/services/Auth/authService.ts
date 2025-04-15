import Cookies from "js-cookie";
import type { UserLoginDto } from "../../models/Auth/UserLoginDto";
import { apiClient } from "../http/apiClient";
import type { ApiResponse } from "../http/apiResponse";

function decodeJwt(token: string) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}

export const authService = {
  async login(userLoginDto: UserLoginDto): Promise<ApiResponse<string>> {
    const response = await apiClient.post<ApiResponse<string>>("/Auth/login", userLoginDto);

    if (response.data.success && response.data.data) {
      const token = response.data.data;
      const decoded = decodeJwt(token);

      const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      const role = decoded[roleKey] || "customer";

      Cookies.set("auth_token", token);
      Cookies.set("user_role", role);
      localStorage.setItem("user_email", userLoginDto.email);
    }

    return response.data;
  },
};
