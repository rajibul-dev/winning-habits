import styled, { css } from "styled-components";
import UserAvatarHeader from "../features/authentication/UserAvatarHeader.jsx";
import HeaderMenu from "./HeaderMenu.jsx";
import { headerIndex } from "../styles/zIndexManager.js";
import Logo from "./Logo.jsx";
import { pixelToEm } from "../styles/GlobalStyles.js";

const StyledHeader = styled.header`
  grid-area: header;
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);

  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;
  z-index: ${headerIndex};

  ${({ $isMobile }) =>
    $isMobile &&
    css`
      justify-content: space-between;
      padding-inline: 3rem;
    `}

  @media (max-width: ${pixelToEm(355)}) {
    padding-inline: 1.5rem;
  }
`;

const smallerLogoForMobileStyles = css`
  width: 14rem;
`;

export default function Header({ isMobile }) {
  return (
    <StyledHeader $isMobile={isMobile}>
      {isMobile && (
        <Logo $isMobile={isMobile} styles={smallerLogoForMobileStyles} />
      )}

      <HeaderMenu isMobile={isMobile} />
      <UserAvatarHeader isMobile={isMobile} />
    </StyledHeader>
  );
}
