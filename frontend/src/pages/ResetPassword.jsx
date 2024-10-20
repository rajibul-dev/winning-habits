import ResetPasswordForm from "../features/authentication/ResetPasswordForm.jsx";
import Heading from "../ui/Heading.jsx";
import NoAccountHeader from "../ui/NoAccountHeader.jsx";
import { LoginLayout as ResetPasswordLayout } from "./Login.jsx";

export default function ResetPassword() {
  return (
    <>
      <NoAccountHeader />
      <ResetPasswordLayout $page="reset-password">
        <Heading as="h4">Create new password</Heading>
        <ResetPasswordForm />
      </ResetPasswordLayout>
    </>
  );
}
