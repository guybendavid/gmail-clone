import create from "zustand";

type SnackBarMessage = {
  content: string;
  severity: "error" | "info" | "success" | "warning";
};

export interface AppStore {
  snackBarMessage: SnackBarMessage;
  setSnackBarMessage: (snackBarMessage: SnackBarMessage) => void;
  clearSnackBarMessage: () => void;
  logout: () => void;
  handleServerErrors: (error: any) => void;
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
    handleServerErrors: (error: any) => {
      const { message: gqlErrorMessage } = error;
      const gqlContextErrorMessage = error.networkError?.result?.errors[0]?.message?.split("Context creation failed: ")[1];
      const content = gqlContextErrorMessage || gqlErrorMessage || "Something went wrong...";
      set({ snackBarMessage: { content, severity: "error" } });

      if (content === "Unauthenticated") {
        const logout = get().logout;
        logout();
      }
    }
  };
}

export const useAppStore = create(appStore);