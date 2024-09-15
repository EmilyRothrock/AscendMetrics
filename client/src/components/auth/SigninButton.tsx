import { Button } from "@mui/material";
import { login } from "../../services/authService";

const SignInButton = () => {
  const handleSignIn = async () => {
    await login({
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
