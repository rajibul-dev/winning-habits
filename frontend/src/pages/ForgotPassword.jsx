import ForgotPasswordForm from "../features/authentication/ForgotPasswordForm.jsx";
import Heading from "../ui/Heading.jsx";
import NoAccountHeader from "../ui/NoAccountHeader.jsx";
import { LoginLayout } from "./Login.jsx";

export default function ForgotPassword() {
  return (
    <>
      <NoAccountHeader />
      <LoginLayout>
        <Heading as="h4">Forgot password?</Heading>
        <ForgotPasswordForm />
      </LoginLayout>
    </>
  );
}
