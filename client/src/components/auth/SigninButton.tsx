import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const SignInButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignIn = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/dashboard",
      },
    });
  };

  return (
    <Button variant={"contained"} onClick={handleSignIn}>
      Sign In
    </Button>
  );
};

export default SignInButton;
