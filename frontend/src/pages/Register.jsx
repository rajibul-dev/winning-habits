import RegisterForm from "../features/authentication/RegisterForm";
import Heading from "../ui/Heading.jsx";
import { LoginLayout as RegisterLayout } from "./Login.jsx";

export default function Signup() {
  return (
    <RegisterLayout>
      <Heading as="h4">Create your account</Heading>
      <RegisterForm />
    </RegisterLayout>
  );
}
