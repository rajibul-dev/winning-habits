import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PopoverManagerProvider } from "./ui/Popover.jsx";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store.js";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ui/ErrorFallback.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace("/")}
    >
      <ReduxProvider store={store}>
        <PopoverManagerProvider>
          <App />
        </PopoverManagerProvider>
      </ReduxProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
