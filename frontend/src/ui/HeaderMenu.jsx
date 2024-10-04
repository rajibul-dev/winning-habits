import styled, { css } from "styled-components";
import DarkModeToggleBtn from "./DarkModeToggleBtn.jsx";

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.4rem;

  ${({ $isMobile }) =>
    $isMobile &&
    css`
      & button svg {
        width: 4rem;
        height: 4rem;
      }

      & + div {
        height: auto;
        transform: translateY(1px);
      }
    `}
`;

function HeaderMenu({ isMobile }) {
  return (
    <StyledHeaderMenu $isMobile={isMobile}>
      <DarkModeToggleBtn />
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
