import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";
import { Provider as StoreProvider } from "react-redux";
import store from "./store/store";
import AppRouter from "./routes/routes";
import { initAuth0Client } from "./services/auth0Client";

const renderApp = async () => {
  const rootElement =
    document.getElementById("root") ||
    (() => {
      throw new Error("Root element not found");
    })();

  const root = createRoot(rootElement as HTMLElement);

  try {
    await initAuth0Client();
    root.render(
      <React.StrictMode>
        <StoreProvider store={store}>
          <ThemeProvider theme={theme}>
            <AppRouter />
          </ThemeProvider>
        </StoreProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Error initializing Auth0Client", error);
  }
};

renderApp();
