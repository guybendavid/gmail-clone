import create from "zustand";

type SnackBarMessage = {
  content: string;
  severity: "error" | "info" | "success" | "warning";
};

const initialSnackBarMessage: SnackBarMessage = { content: "", severity: "error" };

function appStore(set: any, get: any) {
  return {
    snackBarMessage: initialSnackBarMessage,
    setSnackBarMessage: (snackBarMessage: SnackBarMessage) => set(() => ({ snackBarMessage })),
    clearSnackBarMessage: () => set(() => ({ snackBarMessage: initialSnackBarMessage })),
    handleServerErrors: (error: any) => {
      const { message: gqlErrorMessage } = error;
      const gqlContextErrorMessage = error.networkError?.result?.errors[0]?.message?.split("Context creation failed: ").pop();
      const content = gqlContextErrorMessage || gqlErrorMessage || "Something went wrong...";
      set({ snackBarMessage: { content, severity: "error" } });

      if (content === "Unauthenticated") {
        const logout = get().logout;
        logout();
      }
    },
    logout: () => {
      set({ setIsComposeOpen: false });
      localStorage.clear();
      window.location.reload();
    }
  };
}

export const useAppStore = create(appStore);
