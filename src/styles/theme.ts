import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Source Sans 3", sans-serif',
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1b1a1a",
          color: "#fff",
          fontSize: "0.75rem",
        },
        arrow: {
          color: "#1b1a1a",
        },
      },
    },
  },
});

export default theme;
