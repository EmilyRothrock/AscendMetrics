import React from "react";
import Button from "@mui/material/Button";
import { logout } from "../../services/authService";

const SignOutButton: React.FC = () => {
  const frontendURL = import.meta.env.VITE_BASE_URL;

  const returnToUrl = frontendURL + "/signin";

  return (
    <Button color="inherit" onClick={() => logout(returnToUrl)} sx={{ mx: 1 }}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
