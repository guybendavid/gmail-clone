import create from "zustand";
import { Email } from "types/types";

export interface EmailsStore {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  selectedEmails: Email[];
  setSelectedEmails: (selectedEmails: Email[]) => void;
  isComposeOpen: boolean;
  setIsComposeOpen: (isComposeOpen: boolean) => void;
}

function emailsStore(set: any) {
  return {
    activeTab: 0,
    setActiveTab: (activeTab: number) =>
      set((state: EmailsStore) => activeTab !== state.activeTab && ({ activeTab, selectedEmails: [], searchValue: "" })),
    searchValue: "",
    setSearchValue: (searchValue: string) => set(() => ({ searchValue })),
    selectedEmails: [],
    setSelectedEmails: (selectedEmails: Email[]) => set(() => ({ selectedEmails })),
    isComposeOpen: false,
    setIsComposeOpen: (isComposeOpen: boolean) => set(() => ({ isComposeOpen })),
  };
}

export const useEmailsStore = create(emailsStore);