import styled from "styled-components";
import LogoSVG from "../assets/logo-light-mode.svg";

const StyledLogo = styled.div`
  text-align: center;
  line-height: 0;
`;

const Img = styled.img`
  width: 18rem;
`;

export default function Logo() {
  return (
    <StyledLogo>
      <Img src={LogoSVG} alt="winning habits logo" />
    </StyledLogo>
  );
}
