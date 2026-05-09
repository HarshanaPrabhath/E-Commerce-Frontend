import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.jsx";
import { AppDataProvider } from "./app/context/AppDataContext.jsx";


createRoot(document.getElementById("root")).render(
  <AppDataProvider>
      <App />
  </AppDataProvider>
);
