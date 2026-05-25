import { create } from "zustand";

type SnackbarSeverity = "success" | "error" | "warning" | "info";

type SnackbarState = {
  isOpen: boolean;
  message: string;
  severity: SnackbarSeverity;
  showSnackbar: (message?: string, severity?: SnackbarSeverity) => void;
  closeSnackbar: () => void;
};

// Example Usage
// showSnackbar("Something went wrong.", "error")

export const useSnackbarStore = create<SnackbarState>((set) => ({
  isOpen: false,
  message: "Completed successfully.",
  severity: "success",
  showSnackbar: (message = "Completed successfully.", severity = "success") =>
    set({ isOpen: true, message, severity }),
  closeSnackbar: () => set({ isOpen: false }),
}));
