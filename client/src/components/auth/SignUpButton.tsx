import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const SignUpButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/dashboard",
      },
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  return (
    <Button variant={"contained"} onClick={handleSignUp}>
      Sign Up
    </Button>
  );
};

export default SignUpButton;
