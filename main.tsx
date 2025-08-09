import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "next-themes";
import { pwaManager } from "./pwa";

// Cache buster - updated at 18:55 with new mobile header component
console.log("App loading with mobile header changes - v1.2");

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class">
    <App />
  </ThemeProvider>
);
