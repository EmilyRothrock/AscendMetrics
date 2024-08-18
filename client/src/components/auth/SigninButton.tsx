import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const SigninButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/dashboard",
      },
    });
  };

  return (
    <Button variant={"contained"} onClick={handleLogin}>
      Sign In
    </Button>
  );
};

export default SigninButton;
