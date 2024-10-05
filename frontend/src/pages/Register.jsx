import RegisterForm from "../features/authentication/RegisterForm";
import Heading from "../ui/Heading.jsx";
import NoAccountHeader from "../ui/NoAccountHeader";
import { LoginLayout as RegisterLayout } from "./Login.jsx";

export default function Signup() {
  return (
    <>
      <NoAccountHeader />
      <RegisterLayout $page="register">
        <Heading as="h4">Create your account</Heading>
        <RegisterForm />
      </RegisterLayout>
    </>
  );
}
