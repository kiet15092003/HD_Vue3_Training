import { defineStore } from "pinia";

export interface AlertState {
  message: string | null;
  type: "success" | "error" | "warning" | "info";
  visible: boolean;
}

export const useAlertStore = defineStore("alertStore", {
  state: (): AlertState => ({
    message: null,
    type: "info",
    visible: false,
  }),

  actions: {
    showAlert(message: string, type: "success" | "error" | "warning" | "info" = "info") {
      this.message = message;
      this.type = type;
      this.visible = true;

      setTimeout(() => {
        this.clearAlert();
      }, 3000);
    },

    clearAlert() {
      this.message = null;
      this.visible = false;
    },
  },
});
