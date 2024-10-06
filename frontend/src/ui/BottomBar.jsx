import styled, { css } from "styled-components";
import { bottomBarIndex } from "../styles/zIndexManager";
import { VscChecklist } from "react-icons/vsc";
import { PiArchive, PiTrophy } from "react-icons/pi";
import { HiOutlineUsers } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import Popover, { usePopoverManager } from "./Popover";

const StyledBottomBar = styled.ul`
  display: flex;
  width: 100%;
  justify-content: center;
  z-index: ${bottomBarIndex};
  grid-area: bottom-bar;
  background-color: var(--color-grey-0);
  border-top: var(--usual-layout-border);

  & li {
    flex-grow: 1;
    flex-shrink: 1;
  }
`;

const sharedNavStylesBase = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;

  color: var(--color-grey-600);
  font-size: var(--font-size-base);
  font-weight: 500;
  padding: 1.2rem 2.4rem;
  transition: all 0.3s;
`;

const sharedMenuStyleIcon = css`
  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const sharedNavStylesHover = css`
  color: var(--color-grey-800);
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
`;
const sharedNavStylesHoverIcon = css`
  color: var(--color-brand-600);
`;

const navLinkStyles = css`
  &:link,
  &:visited {
    ${sharedNavStylesBase}
  }
  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    ${sharedNavStylesHover}
  }
  ${sharedMenuStyleIcon}
  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    ${sharedNavStylesHoverIcon}
  }
`;

const StyledNavLink = styled(NavLink)`
  ${navLinkStyles}
`;
const NavButtonRather = styled.a`
  ${navLinkStyles}
`;
const Label = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-grey-600);
`;

const RestList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const RestListItem = styled.li``;

const frontNavItems = [
  { label: "Habits", icon: <VscChecklist />, path: "habits" },
  { label: "Achievements", icon: <PiTrophy />, path: "achievements" },
];

const restNavItems = [
  { label: "Archive", icon: <PiArchive />, path: "archive" },
  { label: "Other users", icon: <HiOutlineUsers />, path: "users" },
];

export default function BottomBar() {
  const { close } = usePopoverManager();

  return (
    <StyledBottomBar>
      {frontNavItems.map((item) => (
        <li key={item.path}>
          <StyledNavLink to={item.path}>
            {item.icon}
            <Label>{item.label}</Label>
          </StyledNavLink>
        </li>
      ))}
      <li>
        <Popover placementX="start" placementY="top" triggerType="click">
          <Popover.Trigger id="navRest">
            <NavButtonRather
              onClick={(e) => {
                e.preventDefault();
              }}
              href=""
            >
              <BsThreeDots />
              <Label>More</Label>
            </NavButtonRather>
          </Popover.Trigger>
          <Popover.Content id="navRest">
            <RestList>
              {restNavItems.map((item) => (
                <RestListItem key={item.path}>
                  <StyledNavLink onClick={() => close()} to={item.path}>
                    {item.icon}
                    <Label>{item.label}</Label>
                  </StyledNavLink>
                </RestListItem>
              ))}
            </RestList>
          </Popover.Content>
        </Popover>
      </li>
    </StyledBottomBar>
  );
}
