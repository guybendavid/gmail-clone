import create from "zustand";
import { Participant, Email } from "interfaces/interfaces";

interface EmailsStore {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  emailsToFullNames: Participant[];
  setEmailToFullName: (emailToFullName: Participant) => void;
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
    emailsToFullNames: [],
    setEmailToFullName: (emailToFullName: Participant) =>
      set((state: EmailsStore) => state.emailsToFullNames.push(emailToFullName)),
    selectedEmails: [],
    setSelectedEmails: (selectedEmails: Email[]) => set(() => ({ selectedEmails })),
    isComposeOpen: false,
    setIsComposeOpen: (isComposeOpen: boolean) => set(() => ({ isComposeOpen })),
  };
}

export const useEmailsStore = create(emailsStore);
export type { EmailsStore };