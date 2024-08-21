import Container from "@mui/material/Container";
import SignInButton from "../auth/SignInButton";
import Typography from "@mui/material/Typography";
import SignUpButton from "../auth/SignUpButton";
import { Divider } from "@mui/material";

const LandingPage: React.FC = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Welcome to Ascend Metrics Web App
      </Typography>
      <Typography variant="h6" component="p" gutterBottom align="center">
        Get started by signing in or creating a new account.
      </Typography>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <SignInButton />
        <Divider sx={{ padding: "10px" }} />
        <SignUpButton />
      </div>
    </Container>
  );
};

export default LandingPage;
