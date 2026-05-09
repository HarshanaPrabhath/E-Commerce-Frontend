import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <>
      <Router>
        <AppRouter />
        <Toaster position="bottom-center" />
      </Router>
    </>
  );
}

export default App;
