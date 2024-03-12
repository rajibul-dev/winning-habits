import ResetPasswordForm from "../features/authentication/ResetPasswordForm.jsx";
import Heading from "../ui/Heading.jsx";
import { LoginLayout as ResetPasswordLayout } from "./Login.jsx";

export default function ResetPassword() {
  return (
    <ResetPasswordLayout>
      <Heading as="h4">Create new password</Heading>
      <ResetPasswordForm />
    </ResetPasswordLayout>
  );
}
