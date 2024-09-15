import { Auth0Client, createAuth0Client } from "@auth0/auth0-spa-js";

let auth0Client: Auth0Client | null = null;

export const initAuth0Client = async (): Promise<Auth0Client> => {
  if (auth0Client) return auth0Client;

  auth0Client = await createAuth0Client({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    },
  });

  return auth0Client;
};
