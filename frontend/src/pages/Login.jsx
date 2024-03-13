import LoginForm from "../features/authentication/LoginForm";
import styled from "styled-components";
import Heading from "../ui/Heading.jsx";

const verticalSpaceOnLessHeight = `6rem`;

export const LoginLayout = styled.main`
  min-height: 100dvh;
  display: grid;
  grid-template-columns: minmax(auto, 48rem);
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
  padding-inline: 2rem;

  @media (max-height: 31.5em) {
    min-height: auto;
    padding-top: ${verticalSpaceOnLessHeight};
    padding-bottom: ${verticalSpaceOnLessHeight};
  }
`;

export default function Login() {
  return (
    <LoginLayout>
      <Heading as="h4">Login to your account</Heading>
      <LoginForm />
    </LoginLayout>
  );
}
