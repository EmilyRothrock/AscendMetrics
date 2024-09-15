import React from "react";
import Button from "@mui/material/Button";
import { logout } from "../../services/authService";

const SignOutButton: React.FC = () => {
  const returnToUrl =
    import.meta.env.VITE_AUTH0_LOGOUT_URL || "http://localhost:5173/signin";

  return (
    <Button color="inherit" onClick={() => logout(returnToUrl)} sx={{ mx: 1 }}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
