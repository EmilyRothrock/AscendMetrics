import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { signout } from "../../services/authService";

const SignoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleSignout = async () => {
    try {
      await signout();
      navigate("/signin");
    } catch (error) {
      console.error("Signout failed", error);
    }
  };

  return (
    <Button color="inherit" onClick={handleSignout} sx={{ mx: 1 }}>
      Signout
    </Button>
  );
};

export default SignoutButton;
