import { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { HiXMark } from "react-icons/hi2";
import { modalIndex } from "../../styles/zIndexManager.js";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background-color: var(--backdrop-color);
  z-index: ${modalIndex};
`;

const ModalCard = styled.div`
  position: relative;
  width: min(48rem, calc(100vw - 3rem));
  padding: 3.2rem 4rem;
  border-radius: var(--border-radius-lg);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-lg);

  @media (max-width: 32em) {
    padding: 2.4rem 2rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-500);
  }
`;

export default function DailyRecordNoteModal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleOverlayMouseDown(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  return createPortal(
    <Overlay onMouseDown={handleOverlayMouseDown}>
      <ModalCard
        className="modal"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton type="button" onClick={onClose} aria-label="Close note editor">
          <HiXMark />
        </CloseButton>
        {children}
      </ModalCard>
    </Overlay>,
    document.body,
  );
}
