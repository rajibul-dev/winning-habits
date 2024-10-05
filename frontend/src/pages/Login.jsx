import LoginForm from "../features/authentication/LoginForm";
import styled, { css } from "styled-components";
import Heading from "../ui/Heading.jsx";
import NoAccountHeader from "../ui/NoAccountHeader";

const verticalSpaceOnLessHeight = `6rem`;

export const LoginLayout = styled.main`
  min-height: 100dvh;
  display: grid;
  grid-template-columns: minmax(auto, 48rem);
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  padding: 20dvh 0;
  background-color: var(--color-grey-50);
  padding-inline: 2rem;

  margin-top: -4rem;

  @media (max-height: 24em) {
    min-height: auto;
    padding-top: ${verticalSpaceOnLessHeight};
    padding-bottom: ${verticalSpaceOnLessHeight};
  }

  ${(props) =>
    props.$page === "register" &&
    css`
      @media (max-height: 48em) {
        min-height: auto;
        padding-top: ${verticalSpaceOnLessHeight};
        padding-bottom: ${verticalSpaceOnLessHeight};
      }
    `}
  ${(props) =>
    props.$page === "login" &&
    css`
      @media (max-height: 45em) {
        min-height: auto;
        padding-top: ${verticalSpaceOnLessHeight};
        padding-bottom: ${verticalSpaceOnLessHeight};
      }
    `}
  ${(props) =>
    props.$page === "reset-password" &&
    css`
      @media (max-height: 30em) {
        min-height: auto;
        padding-top: ${verticalSpaceOnLessHeight};
        padding-bottom: ${verticalSpaceOnLessHeight};
      }
    `}
`;

export default function Login() {
  return (
    <>
      <NoAccountHeader />
      <LoginLayout $page="login">
        <Heading as="h4">Login to your account</Heading>
        <LoginForm />
      </LoginLayout>
    </>
  );
}
