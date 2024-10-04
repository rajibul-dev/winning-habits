import styled from "styled-components";
import LogoSVG from "../assets/logo-light-mode.svg";
import LogoSVGDark from "../assets/logo-dark-mode.svg";
import { useDarkMode } from "../context/DarkModeContext";
import { useNavigate } from "react-router-dom";

const StyledLogo = styled.div`
  text-align: center;
  line-height: 0;
  cursor: pointer;
`;

const Img = styled.img`
  width: 18rem;

  ${({ $styles }) => Boolean($styles) && $styles}
`;

export default function Logo({ styles }) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const src = isDarkMode ? LogoSVGDark : LogoSVG;

  return (
    <StyledLogo onClick={() => navigate("/")}>
      <Img src={src} alt="winning habits logo" $styles={styles} />
    </StyledLogo>
  );
}
