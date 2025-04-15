// filepath: d:\SOFT\Vue-tutorial\my-vue-app\src\stores\LoadingStore.ts
import { defineStore } from "pinia";

interface LoadingState {
  isLoading: boolean;
  loadingText: string;
  loadingCount: number;
}

export const useLoadingStore = defineStore("loadingStore", {
  state: (): LoadingState => ({
    isLoading: false,
    loadingText: "Loading...",
    loadingCount: 0
  }),

  actions: {
    startLoading(text: string = "Loading...") {
      this.loadingCount++;
      this.loadingText = text;
      this.isLoading = true;
    },

    stopLoading() {
      this.loadingCount--;
      if (this.loadingCount <= 0) {
        this.loadingCount = 0;
        this.isLoading = false;
      }
    },

    // Force stop all loading states
    resetLoading() {
      this.loadingCount = 0;
      this.isLoading = false;
    }
  }
});