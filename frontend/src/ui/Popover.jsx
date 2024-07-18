import React, { createContext, useContext, useEffect, useState } from "react";
import styled from "styled-components";

const TriggerContainer = styled.div`
  position: relative;
`;
const ContentContainer = styled.div`
  position: absolute;
  right: ${({ $position }) => $position.x}px;
  top: ${({ $position }) => $position.y}px;
`;

const PopoverContext = createContext();

function Popover({ children }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState(null);

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <PopoverContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

function Trigger({ children, triggerType, id, state }) {
  const { openId, close, open, setPosition } = useContext(PopoverContext);

  function handleClick(e) {
    if (openId === id) {
      close();
    } else {
      open(id);

      const rect = e.target.closest("button").getBoundingClientRect();
      setPosition({
        x: window.innerWidth - rect.width - rect.x,
        y: rect.y + rect.height + 8,
      });
    }
  }

  const handleMouseEnter = (e) => {
    open(id);

    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
  };

  const handleMouseLeave = () => {
    close();
  };

  useEffect(() => {
    if (triggerType === "boolean" && state !== undefined) {
      state ? open(id) : close();
    }
  }, [state, triggerType, id, open, close]);

  const clonedChild = React.cloneElement(children, {
    onClick: triggerType === "click" ? handleClick : undefined,
    onMouseEnter: triggerType === "hover" ? handleMouseEnter : undefined,
    onMouseLeave: triggerType === "hover" ? handleMouseLeave : undefined,
  });

  return <TriggerContainer>{clonedChild}</TriggerContainer>;
}

function Content({ children, id }) {
  const { openId, position } = useContext(PopoverContext);

  if (openId !== id) return null;

  return <ContentContainer $position={position}>{children}</ContentContainer>;
}

Popover.Trigger = Trigger;
Popover.Content = Content;

export default Popover;

/*
<Popover>
  <Popover.Trigger triggerType='click' id='unique'>
    <button>View details</button>
    // the button inside will then get the onClick with clonecomponent method for children
  </Poopover.Trigger>
  <Popover.Content>
    <div>Content</div>
  </Popover.Content>
</Popover>

// triggerType can be 'boolean' 'hover' 'click'
// boolean means a boolean state basically
*/
