import Container from "@mui/material/Container";
import SigninButton from "./SigninButton";
import { SignupButton } from "./SignUpButton";

const SigninPage = () => {
  return (
    <Container>
      <SigninButton />
      <SignupButton />
    </Container>
  );
};

export default SigninPage;
