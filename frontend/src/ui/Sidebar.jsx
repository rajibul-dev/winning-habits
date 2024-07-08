import styled from "styled-components";
import Logo from "./Logo.jsx";
import MainNav from "./MainNav.jsx";
import HideScrollbarButStillScroll from "../styles/HideScrollbarButStillScroll.js";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);

  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  gap: 10rem;
  overflow: auto;

  ${HideScrollbarButStillScroll}
`;

export default function Sidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <MainNav />
    </StyledSidebar>
  );
}
