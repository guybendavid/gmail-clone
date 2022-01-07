import create from "zustand";
import { Email, Participant } from "interfaces/interfaces";

type SnackBarMessage = {
  content: string;
  severity: "error" | "info" | "success" | "warning";
};

interface Store {
  snackBarMessage: SnackBarMessage;
  setSnackBarMessage: (snackBarMessage: SnackBarMessage) => void;
  clearSnackBarMessage: () => void;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  selectedEmails: Email[];
  setSelectedEmails: (selectedEmails: Email[]) => void;
  isComposeOpened: boolean;
  setIsComposeOpened: (isComposeOpened: boolean) => void;
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  emailsToFullNames: Participant[];
  setEmailToFullName: (emailToFullName: Participant) => void;
  logout: () => void;
  handleErrors: (error: any) => void;
}

const initalSnackBarMessage: SnackBarMessage = { content: "", severity: "error" };

function store(set: any, get: any) {
  return {
    snackBarMessage: initalSnackBarMessage,
    setSnackBarMessage: (snackBarMessage: SnackBarMessage) => set(() => ({ snackBarMessage })),
    clearSnackBarMessage: () => set(() => ({ snackBarMessage: initalSnackBarMessage })),
    searchValue: "",
    setSearchValue: (searchValue: string) => set(() => ({ searchValue })),
    selectedEmails: [],
    setSelectedEmails: (selectedEmails: Email[]) => set(() => ({ selectedEmails })),
    isComposeOpened: false,
    setIsComposeOpened: (isComposeOpened: boolean) => set(() => ({ isComposeOpened })),
    activeTab: 0,
    setActiveTab: (activeTab: number) =>
      set((state: Store) => activeTab !== state.activeTab && ({ activeTab, selectedEmails: [], searchValue: "" })),
    emailsToFullNames: [],
    setEmailToFullName: (emailToFullName: Participant) => set((state: Store) => state.emailsToFullNames.push(emailToFullName)),
    logout: () => {
      set({ setIsComposeOpened: false });
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

export const useStore = create(store);
export type { Store };