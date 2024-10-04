import styled from "styled-components";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import Button from "../ui/Button";
import DarkModeToggleBtn from "../ui/DarkModeToggleBtn";
import { useNavigate } from "react-router-dom";
import { pixelToEm } from "../styles/GlobalStyles";

const Section = styled.div`
  padding: 6rem 0;
`;

const HeaderSection = styled(Section)`
  padding: 3rem 0;
`;

const Container = styled.div`
  max-width: 130rem;
  margin-inline: auto;
  padding: 0 3rem;
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

const HeroHeading = styled(Heading)`
  font-size: 4.4rem;
  font-weight: 800;
  max-width: 22ch;
  text-align: center;
  display: table;
  margin-inline: auto;
  margin-top: 6rem;
  margin-bottom: 3rem;

  @media (max-width: ${pixelToEm(634)}) {
    margin-top: 8rem;
  }

  @media (max-width: ${pixelToEm(477)}) {
    font-size: 3.4rem;
  }
`;

const HeroButton = styled(Button)`
  margin-inline: auto;
  display: table;
  padding-inline: 6rem;

  @media (max-width: ${pixelToEm(477)}) {
    font-size: 1.6rem;
    display: block;
    width: 100%;
  }

  @media (max-width: ${pixelToEm(375)}) {
    font-size: 1.6rem;
  }
`;

export default function Root() {
  const navigate = useNavigate();

  return (
    <>
      <HeaderSection>
        <Header>
          <Logo />
          <DarkModeToggleBtn />
        </Header>
      </HeaderSection>

      <Section>
        <Container>
          <HeroHeading as="h1">
            Track your habits with Winning Habits
          </HeroHeading>
          <HeroButton onClick={() => navigate("/app")} size="large">
            Open app
          </HeroButton>
        </Container>
      </Section>
    </>
  );
}
