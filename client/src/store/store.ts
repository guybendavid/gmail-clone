import create from "zustand";
import { User, Email } from "interfaces/interfaces";

type SnackBarMessage = {
  content: string;
  severity: "error" | "info" | "success" | "warning";
};

type EmailFullNameMap = {
  email: string;
  fullName: string;
};

interface Store {
  loggedInUser: User | {};
  setLoggedInUser: (user: User | {}) => void;
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
  emailsToFullNames: EmailFullNameMap[];
  setEmailToFullName: (emailToFullName: EmailFullNameMap) => void;
}

const initalSnackBarMessage: SnackBarMessage = { content: "", severity: "error" };

const store = (set: any) => ({
  loggedInUser: {},
  setLoggedInUser: (user: User | {}) => set(() => ({ loggedInUser: user })),
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
  setEmailToFullName: (emailToFullName: EmailFullNameMap) => set((state: Store) => state.emailsToFullNames.push(emailToFullName))
});

export const useStore = create(store);
export type { Store };