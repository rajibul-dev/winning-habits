import styled from "styled-components";
import DarkModeToggleBtn from "./DarkModeToggleBtn.jsx";

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.4rem;
`;

function HeaderMenu() {
  return (
    <StyledHeaderMenu>
      <DarkModeToggleBtn />
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
