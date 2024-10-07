import styled from "styled-components";
import { pixelToEm } from "../styles/GlobalStyles";

const Input = styled.input`
  font-size: var(--font-size-base);
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);

  @media (max-width: ${pixelToEm(500)}) {
    font-size: 1.8rem;
  }
`;

export default Input;
