import { useContext } from "react";
import styled, { css } from "styled-components";
import { HiEllipsisVertical } from "react-icons/hi2";
import Popover, { PopoverContext } from "./Popover";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border: var(--usual-layout-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.4rem 1.8rem;
  padding-right: 5rem;
  font-size: var(--font-size-base);
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    background-color: var(--color-grey-50);
  }
  ${(props) =>
    props.$isDanger &&
    css`
      color: var(--color-red-700);
    `}

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    ${(props) =>
      props.$isDanger &&
      css`
        color: var(--color-red-600);
      `}
    transition: all 0.3s;
  }
`;

function Menus({ children }) {
  return (
    <Popover placementX="end" placementY="bottom" triggerType="click" noBox>
      {children}
    </Popover>
  );
}

function Toggle({ id, children, type }) {
  console.log(id);
  return (
    <Popover.Trigger id={id}>
      <StyledToggle>
        {type === "container" ? children : <HiEllipsisVertical />}
      </StyledToggle>
    </Popover.Trigger>
  );
}

function List({ children, id }) {
  console.log(id);
  return (
    <Popover.Content id={id}>
      <StyledList>{children}</StyledList>
    </Popover.Content>
  );
}

function Button({ children, icon, onClick, isDanger = false }) {
  const { close } = useContext(PopoverContext);

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li className="menu">
      <StyledButton $isDanger={isDanger} onClick={handleClick}>
        {icon}
        <span
          style={{
            display: "inline-block",
            transform: "translateY(1px)",
          }}
        >
          {children}
        </span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
