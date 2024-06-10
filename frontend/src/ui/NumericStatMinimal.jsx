import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
`;

const StyledNumber = styled.span`
  display: inline-block;
  font-size: 6.4rem;
  white-space: nowrap;
  line-height: 1;
  font-weight: 500;
  color: var(--color-grey-700);
`;

const Label = styled.span`
  display: inline-block;
  font-size: 1.2rem;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--color-grey-600);
  letter-spacing: 0.5pt;
`;

export default function NumericStatsMinimal({ number, label }) {
  return (
    <Wrapper>
      <StyledNumber>{number}</StyledNumber>
      <Label>{label}</Label>
    </Wrapper>
  );
}
