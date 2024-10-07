import { createPortal } from "react-dom";
import useOutsideClick from "../hooks/useOutsideClick";
import styled from "styled-components";
import { modalIndex } from "../styles/zIndexManager";

const StyledModal = styled.div`
  display: inline-block;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
  width: 53rem;

  @media (max-width: 32em) {
    width: 95%;
  }

  @media (max-height: 27em) {
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);

  z-index: ${modalIndex};
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

export default function PresentationModal({ children }) {
  const ref = useOutsideClick(() => console.log("close the modal"));

  return createPortal(
    <Overlay>
      <StyledModal className="modal" ref={ref}>
        <div>{children}</div>
      </StyledModal>
    </Overlay>,
    document.body,
  );
}
