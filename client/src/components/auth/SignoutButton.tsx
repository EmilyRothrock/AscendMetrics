import React from "react";
import Button from "@mui/material/Button";
import { useAuth0 } from "@auth0/auth0-react";

const SignoutButton: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <Button
      color="inherit"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      sx={{ mx: 1 }}
    >
      Signout
    </Button>
  );
};

export default SignoutButton;
