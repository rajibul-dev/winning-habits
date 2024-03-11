import LoginForm from "../features/authentication/LoginForm";
import styled from "styled-components";
import Heading from "../ui/Heading.jsx";

export const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

export default function Login() {
  return (
    <LoginLayout>
      <Heading as="h4">Login to your account</Heading>
      <LoginForm />
    </LoginLayout>
  );
}
