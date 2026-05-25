// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "./assets/vite.svg";
// import heroImg from "./assets/hero.png";
// import "./App.css";
import AppSnackbar from "./components/common/Snackbar";
import AppRouter from "./routes/AppRouter";
import "./styles/global-styles.scss";

function App() {
  return (
    <div className="h-full w-full">
      <AppRouter />
      <AppSnackbar />
    </div>
  );
}

export default App;
