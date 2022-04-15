import create from "zustand";

type GlobalMessage = {
  content: string;
  severity: "error" | "info" | "success" | "warning";
};

interface AppStore {
  globalMessage: GlobalMessage;
  setGlobalMessage: (globalMessage: GlobalMessage) => void;
  clearGlobalMessage: () => void;
  logout: () => void;
  handleServerErrors: (error: any) => void;
}

const initialGlobalMessage: GlobalMessage = { content: "", severity: "error" };

function appStore(set: any, get: any) {
  return {
    globalMessage: initialGlobalMessage,
    setGlobalMessage: (globalMessage: GlobalMessage) => set(() => ({ globalMessage })),
    clearGlobalMessage: () => set(() => ({ globalMessage: initialGlobalMessage })),
    logout: () => {
      set({ setIsComposeOpen: false });
      localStorage.clear();
      window.location.reload();
    },
    handleServerErrors: (error: any) => {
      const { message: gqlErrorMessage } = error;
      const gqlContextErrorMessage = error.networkError?.result?.errors[0]?.message?.split("Context creation failed: ")[1];
      const content = gqlContextErrorMessage || gqlErrorMessage || "Something went wrong...";
      set({ globalMessage: { content, severity: "error" } });

      if (content === "Unauthenticated") {
        const logout = get().logout;
        logout();
      }
    }
  };
}

export const useAppStore = create(appStore);
export type { AppStore };