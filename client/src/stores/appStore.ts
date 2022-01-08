import create from "zustand";

type SnackBarMessage = {
  content: string;
  severity: "error" | "info" | "success" | "warning";
};

interface AppStore {
  snackBarMessage: SnackBarMessage;
  setSnackBarMessage: (snackBarMessage: SnackBarMessage) => void;
  clearSnackBarMessage: () => void;
  logout: () => void;
  handleErrors: (error: any) => void;
}

const initialSnackBarMessage: SnackBarMessage = { content: "", severity: "error" };

function appStore(set: any, get: any) {
  return {
    snackBarMessage: initialSnackBarMessage,
    setSnackBarMessage: (snackBarMessage: SnackBarMessage) => set(() => ({ snackBarMessage })),
    clearSnackBarMessage: () => set(() => ({ snackBarMessage: initialSnackBarMessage })),
    logout: () => {
      set({ setIsComposeOpen: false });
      localStorage.clear();
      window.location.reload();
    },
    handleErrors: (error: any) => {
      let content;
      const { message: gqlErrorMessage } = error;
      const gqlContextErrorMessage = error.networkError?.result?.errors[0]?.message?.split("Context creation failed: ")[1];

      if (gqlContextErrorMessage === "Unauthenticated") {
        const logout = get().logout;
        logout();
        content = gqlContextErrorMessage || "Unauthenticated";
      } else if (gqlContextErrorMessage) {
        content = gqlContextErrorMessage;
      } else {
        content = gqlErrorMessage;
      };

      if (content) {
        set({ snackBarMessage: { content, severity: "error" } });
      }
    }
  };
}

export const useAppStore = create(appStore);
export type { AppStore };