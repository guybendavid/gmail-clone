import { SectionEmail } from "types/types";
import create from "zustand";

type EmailsStore = {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  selectedEmails: SectionEmail[];
  setSelectedEmails: (selectedEmails: SectionEmail[]) => void;
  isComposeOpen: boolean;
  setIsComposeOpen: (isComposeOpen: boolean) => void;
};

type SetFunction = (fn: (state: EmailsStore) => Partial<EmailsStore> | false) => void;

const getEmailsStore = (set: SetFunction) => ({
  activeTab: 0,
  setActiveTab: (activeTab: number) =>
    set((state: EmailsStore) => activeTab !== state.activeTab && { activeTab, selectedEmails: [], searchValue: "" }),
  searchValue: "",
  setSearchValue: (searchValue: string) => set(() => ({ searchValue })),
  selectedEmails: [] as SectionEmail[],
  setSelectedEmails: (selectedEmails: SectionEmail[]) => set(() => ({ selectedEmails })),
  isComposeOpen: false,
  setIsComposeOpen: (isComposeOpen: boolean) => set(() => ({ isComposeOpen }))
});

export const useEmailsStore = create(getEmailsStore);
