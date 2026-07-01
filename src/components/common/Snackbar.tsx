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
      sx={{
        ".MuiAlert-root": {
          fontSize: "0.84rem",
          padding: "0.16rem",
          paddingInline: "0.85rem",
        },
        ".MuiSvgIcon-root": {
          fontSize: "1.2rem",
        },
      }}
    >
      <Alert onClose={closeSnackbar} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
