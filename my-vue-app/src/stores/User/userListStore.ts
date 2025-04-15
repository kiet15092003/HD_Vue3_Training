import { defineStore } from "pinia";
import type { UserReadDto } from "../../models/Auth/UserReadDto";
import { userService } from "../../services/User/userService";

interface UserListState {
  users: UserReadDto[];
  loading: boolean;
  error: string[];
  success: boolean;
  selectedUser: UserReadDto | null;
}

export const useUserListStore = defineStore("userListStore", {
  state: (): UserListState => ({
    users: [],
    loading: false,
    error: [],
    success: false,
    selectedUser: null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = [];
      this.success = false;

      try {
        const response = await userService.getUsers();

        if (response.success) {
          this.users = response.data || [];
          this.success = true;
        } else {
          this.error = response.error;
        }
      } catch (error) {
        this.error = [(error as Error).message];
      } finally {
        this.loading = false;
      }
    },

    async fetchUserById(id: string) {
      this.loading = true;
      this.error = [];
      this.success = false;
      this.selectedUser = null;

      try {
        const response = await userService.getUserById(id);

        if (response.success) {
          this.selectedUser = response.data;
          this.success = true;
        } else {
          this.error = response.error;
        }
      } catch (error) {
        this.error = [(error as Error).message];
      } finally {
        this.loading = false;
      }
    }
  },
});
