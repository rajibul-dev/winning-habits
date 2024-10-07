import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PopoverManagerProvider } from "./ui/Popover.jsx";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <PopoverManagerProvider>
        <App />
      </PopoverManagerProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
