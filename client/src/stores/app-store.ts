import create from "zustand";

type SnackBarMessage = {
  content: string;
  severity: "error" | "info" | "success" | "warning";
};

const initialSnackBarMessage: SnackBarMessage = { content: "", severity: "error" };

type SetFunction = (fn: (state: unknown) => unknown) => void;
type GetFunction = () => { logout: () => void };

type ServerError = {
  message: string;
  networkError?:
    | Error
    | {
        result?: {
          errors?: { message?: string }[];
        };
      }
    | null;
};

const getAppStore = (set: SetFunction, get: GetFunction) => ({
  snackBarMessage: initialSnackBarMessage,
  setSnackBarMessage: (snackBarMessage: SnackBarMessage) => set(() => ({ snackBarMessage })),
  clearSnackBarMessage: () => set(() => ({ snackBarMessage: initialSnackBarMessage })),
  handleServerErrors: (error: ServerError) => {
    const { message: gqlErrorMessage, networkError } = error;
    const networkErrorWithResult = networkError as { result?: { errors?: { message?: string }[] } };

    const gqlContextErrorMessage = networkErrorWithResult?.result?.errors?.[0]?.message
      ?.split("Context creation failed: ")
      .pop();

    const content = gqlContextErrorMessage || gqlErrorMessage || "Something went wrong...";
    set(() => ({ snackBarMessage: { content, severity: "error" } }));

    if (content === "Unauthenticated") {
      const { logout } = get();
      logout();
    }
  },
  logout: () => {
    set(() => ({ setIsComposeOpen: false }));
    localStorage.clear();
    window.location.reload();
  }
});

export const useAppStore = create(getAppStore);
