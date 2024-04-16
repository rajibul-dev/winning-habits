import styled from "styled-components";
import LogoSVG from "../assets/logo-light-mode.svg";
import LogoSVGDark from "../assets/logo-dark-mode.svg";
import { useDarkMode } from "../context/DarkModeContext";

const StyledLogo = styled.div`
  text-align: center;
  line-height: 0;
`;

const Img = styled.img`
  width: 18rem;
`;

export default function Logo() {
  const { isDarkMode } = useDarkMode();
  const src = isDarkMode ? LogoSVGDark : LogoSVG;

  return (
    <StyledLogo>
      <Img src={src} alt="winning habits logo" />
    </StyledLogo>
  );
}
