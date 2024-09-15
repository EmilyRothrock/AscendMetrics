import { initAuth0Client } from "./auth0Client";

export const handleRedirectCallback = async () => {
  const auth0 = await initAuth0Client();
  const result = await auth0.handleRedirectCallback();
  window.history.replaceState({}, document.title, "/"); // Clean up URL
  return result;
};

export const login = async (options: {
  appState: {
    returnTo: "/dashboard";
  };
}) => {
  const auth0 = await initAuth0Client();
  await auth0.loginWithRedirect(options);
};

export const logout = async (returnToUrl: string) => {
  const auth0 = await initAuth0Client();
  auth0.logout({
    logoutParams: {
      returnTo: returnToUrl,
    },
  });
};

export const isAuthenticated = async () => {
  const auth0 = await initAuth0Client();
  return await auth0.isAuthenticated();
};

export const getAccessToken = async () => {
  const auth0 = await initAuth0Client();
  return await auth0.getTokenSilently();
};

export const getUser = async () => {
  const auth0 = await initAuth0Client();
  return await auth0.getUser();
};
