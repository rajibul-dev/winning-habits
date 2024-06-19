import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineUsers } from "react-icons/hi2";
import { VscChecklist } from "react-icons/vsc";
import { PiArchive, PiTrophy } from "react-icons/pi";
import { BiUser } from "react-icons/bi";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    color: var(--color-grey-600);
    font-size: var(--font-size-base);
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  /* This works because react-router places the active class on the active NavLink */
  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

function MainNav() {
  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="habits">
            <VscChecklist />
            <span>Habits</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="achievements">
            <PiTrophy />
            <span>Achievements</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="archive">
            <PiArchive />
            <span>Archive</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="users">
            <HiOutlineUsers />
            <span>Other users</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="profile">
            <BiUser />
            <span>Profile</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;
