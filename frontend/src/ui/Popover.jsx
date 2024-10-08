import React, { createContext, useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Portal from "./Portal.jsx";
import { usePopper } from "react-popper";
import useOutsideClick from "../hooks/useOutsideClick.js";
import {
  headerMenuDropDownIndex,
  popoverContentIndex,
} from "../styles/zIndexManager.js";

const TriggerContainer = styled.div`
  position: relative;
  height: 100%;
`;

const ContentContainer = styled.div`
  position: absolute;
  display: inline-block;
  ${({ $noBox }) =>
    !$noBox &&
    css`
      background-color: var(--color-grey-100);
      padding: 2rem;
      border: var(--usual-layout-border);
    `}
  box-shadow: var(--box-shadow-lg);
  z-index: ${popoverContentIndex};

  ${({ $isTopOfHeader }) =>
    $isTopOfHeader &&
    css`
      z-index: ${headerMenuDropDownIndex};
    `}
`;

// for managing signle popover opens at one time
const PopoverManagerContext = createContext();
export function PopoverManagerProvider({ children }) {
  const [openId, setOpenId] = useState(null);

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <PopoverManagerContext.Provider value={{ openId, close, open }}>
      {children}
    </PopoverManagerContext.Provider>
  );
}
export const usePopoverManager = () => useContext(PopoverManagerContext);

export const PopoverContext = createContext();

function Popover({
  children,
  placementX,
  placementY,
  triggerType,
  noBox = false,
}) {
  const { openId, close, open } = usePopoverManager();
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const [selected, setSelected] = useState(false);

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
      { name: "offset", options: { offset: [0, 10] } },
      {
        name: "preventOverflow",
        options: { padding: 15 },
      },
    ],
  });

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
        selected,
        setSelected,
        triggerType,
        noBox,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

function Trigger({ children, id, state = undefined, ...props }) {
  const {
    openId,
    close,
    open,
    setReferenceElement,
    selected,
    setSelected,
    triggerType,
  } = useContext(PopoverContext);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (triggerType === "both" && !selected) {
      setSelected(true);
      open(id);
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

  return (
    <TriggerContainer ref={setReferenceElement} {...props}>
      {clonedChild}
    </TriggerContainer>
  );
}

function Content({ children, id, isTopOfHeader }) {
  const {
    openId,
    setPopperElement,
    styles,
    attributes,
    setArrowElement,
    close,
    selected,
    setSelected,
    triggerType,
    noBox,
  } = useContext(PopoverContext);

  function outsideClickHnadler() {
    close();
    setSelected(false);
  }

  const outsideClickRef = useOutsideClick(outsideClickHnadler, false);

  if (openId !== id) return null;

  return (
    <Portal>
      <div
        ref={(node) => {
          if (triggerType === "hover") return;
          if (triggerType === "both" && !selected) return;
          outsideClickRef.current = node;
        }}
      >
        <ContentContainer
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          $noBox={noBox}
          $isTopOfHeader={isTopOfHeader}
        >
          {children}
          <div ref={setArrowElement} style={styles.arrow} />
        </ContentContainer>
      </div>
    </Portal>
  );
}

Popover.Trigger = Trigger;
Popover.Content = Content;

export default Popover;

/*
<Popover placementX="center" placementY="top" triggerType="hover">
  <Popover.Trigger id="example">
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Content id="example">
    This is right in the middle
  </Popover.Content>
</Popover>

// triggerType can be 'boolean', 'hover', and 'click'
// placmentX can be 'top', 'bottom', 'left', 'right'
// boolean means a boolean state basically
*/
