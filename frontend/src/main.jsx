import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PopoverManagerProvider } from "./ui/Popover.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PopoverManagerProvider>
      <App />
    </PopoverManagerProvider>
  </React.StrictMode>,
);
