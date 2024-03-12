import ForgotPasswordForm from "../features/authentication/ForgotPasswordForm.jsx";
import Heading from "../ui/Heading.jsx";
import { LoginLayout } from "./Login.jsx";

export default function ForgotPassword() {
  return (
    <LoginLayout>
      <Heading as="h4">Forgot password? Let's reset it!</Heading>
      <ForgotPasswordForm />
    </LoginLayout>
  );
}
