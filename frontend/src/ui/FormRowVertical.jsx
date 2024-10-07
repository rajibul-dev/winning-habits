import styled from "styled-components";
import { pixelToEm } from "../styles/GlobalStyles";

const StyledFormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 0;
`;

const Label = styled.label`
  font-weight: 500;
  @media (max-width: ${pixelToEm(525)}) {
    margin-bottom: 0.3rem;
    font-size: 1.6rem;
  }
`;

const Error = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-red-700);
`;

function FormRowVertical({ label, error, children }) {
  return (
    <StyledFormRow>
      {label && <Label htmlFor={children.props.id}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRowVertical;
