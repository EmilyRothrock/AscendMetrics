import React from "react";
import { initAuth0Client } from "../../services/auth0Client";
import { Button } from "@mui/material";

const SignUpButton: React.FC = () => {
  const handleSignUp = async () => {
    const auth0Client = await initAuth0Client();
    if (auth0Client) {
      await auth0Client.loginWithRedirect({
        authorizationParams: {
          screen_hint: "signup",
        },
      });
    } else {
      console.error("Auth0Client not initialized");
    }
  };

  return (
    <Button variant={"contained"} onClick={handleSignUp}>
      Sign Up
    </Button>
  );
};

export default SignUpButton;
