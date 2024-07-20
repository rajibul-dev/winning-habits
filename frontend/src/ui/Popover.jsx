import React, { createContext, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Portal from "./Portal.jsx";
import { usePopper } from "react-popper";

const TriggerContainer = styled.div`
  position: relative;
`;
const ContentContainer = styled.div`
  position: absolute;
  display: inline-block;
  background-color: var(--color-grey-100);
  padding: 2rem;
`;

const PopoverContext = createContext();

function Popover({ children, placementX, placementY }) {
  const [openId, setOpenId] = useState("");
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);

  let placementYPart;
  switch (placementY) {
    case "top":
      placementYPart = "top";
      break;
    case "bottom":
      placementYPart = "bottom";
      break;
    case "left":
      placementYPart = "left";
      break;
    case "right":
      placementYPart = "right";
      break;
    default:
      placementYPart = "bottom";
      break;
  }

  let placementXPart;
  switch (placementX) {
    case "center":
      placementXPart = "";
      break;
    case "start":
      placementXPart = "-start";
      break;
    case "end":
      placementXPart = "-end";
      break;
    default:
      placementXPart = "";
      break;
  }

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: `${placementYPart}${placementXPart}`,
    modifiers: [
      { name: "arrow", options: { element: arrowElement, padding: 5 } },
    ],
  });

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <PopoverContext.Provider
      value={{
        openId,
        close,
        open,
        setReferenceElement,
        setPopperElement,
        styles,
        attributes,
        setArrowElement,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

function Trigger({ children, triggerType, id, state }) {
  const { openId, close, open, setReferenceElement } =
    useContext(PopoverContext);
  const [selected, setSelected] = useState(false);

  function handleClick() {
    if (triggerType === "both" && !selected) {
      setSelected(true);
      return;
    }

    if (openId === id) {
      setSelected(false);
      close();
    } else {
      open(id);
    }
  }

  const handleMouseEnter = () => {
    open(id);
  };

  const handleMouseLeave = () => {
    if (selected) return;
    close();
  };

  useEffect(() => {
    if (triggerType === "boolean" && state !== undefined) {
      state ? open(id) : close();
    }
  }, [state, triggerType, id, open, close]);

  const clonedChild = React.cloneElement(children, {
    ref: setReferenceElement,
    onClick:
      triggerType === "click" || triggerType === "both"
        ? handleClick
        : undefined,
    onMouseEnter:
      triggerType === "hover" || triggerType === "both"
        ? handleMouseEnter
        : undefined,
    onMouseLeave:
      triggerType === "hover" || triggerType === "both"
        ? handleMouseLeave
        : undefined,
  });

  return <TriggerContainer>{clonedChild}</TriggerContainer>;
}

function Content({ children, id }) {
  const { openId, setPopperElement, styles, attributes, setArrowElement } =
    useContext(PopoverContext);

  if (openId !== id) return null;

  return (
    <Portal>
      <ContentContainer
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        {children}
        <div ref={setArrowElement} style={styles.arrow} />
      </ContentContainer>
    </Portal>
  );
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
