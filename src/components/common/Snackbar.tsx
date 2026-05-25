import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useSnackbarStore } from "@/store/snackbar-store";

export default function AppSnackbar() {
  const { isOpen, message, severity, closeSnackbar } = useSnackbarStore();

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={1400}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={closeSnackbar}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
