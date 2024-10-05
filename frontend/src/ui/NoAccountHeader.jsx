import Logo from "../ui/Logo";
import DarkModeToggleBtn from "../ui/DarkModeToggleBtn";
import styled from "styled-components";

export const Section = styled.div`
  padding: 6rem 0;
`;

export const Container = styled.div`
  max-width: 130rem;
  margin-inline: auto;
  padding: 0 3rem;
`;

const HeaderSection = styled(Section)`
  padding: 3rem 0;
`;

const Header = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > div {
    text-align: start;
  }

  & button svg {
    width: 4rem;
    height: 4rem;
  }
`;

export default function NoAccountHeader() {
  return (
    <HeaderSection>
      <Header>
        <Logo />
        <DarkModeToggleBtn />
      </Header>
    </HeaderSection>
  );
}
