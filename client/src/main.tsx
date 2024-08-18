import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./routes/Routes";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";
import { Auth0ProviderWithNavigate } from "./components/auth/Auth0ProviderWithNavigate";
import { Provider as StoreProvider } from "react-redux";
import store from "./store/store";

const rootElement =
  document.getElementById("root") ||
  (() => {
    throw new Error("Root element not found");
  })();

const root = createRoot(rootElement as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <StoreProvider store={store}>
          <ThemeProvider theme={theme}>
            <MyRoutes />
          </ThemeProvider>
        </StoreProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);
