import type { UserReadDto } from "../../models/Auth/UserReadDto";
import { apiClient } from "../http/apiClient";
import type { ApiResponse } from "../http/apiResponse";

export const userService = {
    async getUsers(): Promise<ApiResponse<UserReadDto[]>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await apiClient.get<ApiResponse<UserReadDto[]>>("/users");
            
            if (!response.data.success) {
                throw new Error(response.data.error.join(', '));
            }
            
            return response.data;
        } catch (error) {
            return {
                data: null,
                success: false,
                error: [(error as Error).message || 'Failed to fetch users'],
            };
        }
    },
    
    async getUserById(id: string): Promise<ApiResponse<UserReadDto>> {
        try {
            const response = await apiClient.get<ApiResponse<UserReadDto>>(`/users/${id}`);
            
            if (!response.data.success) {
                throw new Error(response.data.error.join(', '));
            }
            
            return response.data;
        } catch (error) {
            return {
                data: null,
                success: false,
                error: [(error as Error).message || 'Failed to fetch user details'],
            };
        }
    }
}