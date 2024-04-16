import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import DarkModeToggleBtn from "./DarkModeToggleBtn.jsx";

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.4rem;
`;

function HeaderMenu() {
  const navigate = useNavigate();

  return (
    <StyledHeaderMenu>
      <DarkModeToggleBtn />
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
