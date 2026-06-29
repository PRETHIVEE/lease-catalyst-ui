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
