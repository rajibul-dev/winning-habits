import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
`;

const StyledNumber = styled.span`
  display: inline-block;
  font-size: var(--font-size-6xl);
  white-space: nowrap;
  line-height: 1;
  font-weight: 500;
  color: var(--color-grey-700);

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      color: var(--achievement-gold-color--shine);
      text-shadow: var(--achievement-text-shadow--gold);
      font-weight: 700;
    `}
`;

const Label = styled.span`
  display: inline-block;
  font-size: var(--font-size-xsm);
  text-transform: uppercase;
  font-weight: 800;
  color: var(--color-grey-600);
  letter-spacing: 0.5pt;

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      color: var(--achievement-gold-color--shine);
      text-shadow: var(--achievement-text-shadow--gold);
      font-weight: 900;
    `}
`;

export default function NumericStatsMinimal({ number, label, isAchieved }) {
  return (
    <Wrapper $isAchieved={isAchieved}>
      <StyledNumber $isAchieved={isAchieved}>{number}</StyledNumber>
      <Label $isAchieved={isAchieved}>{label}</Label>
    </Wrapper>
  );
}
