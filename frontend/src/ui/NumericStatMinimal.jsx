import styled, { css } from "styled-components";
import { pixelToEm } from "../styles/GlobalStyles";

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 13rem;
  padding: 0.8rem;

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 251, 233, 0.45);
      box-shadow: inset 0 0 0 1px rgba(255, 251, 233, 0.08);
    `}
`;

const StyledNumber = styled.span`
  display: inline-block;
  font-size: var(--font-size-5xl);
  white-space: nowrap;
  line-height: 1;
  font-weight: 700;
  color: var(--color-grey-800);

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      color: var(--achievement-gold-color--shine);
      text-shadow: var(--achievement-text-shadow--gold);

      @media (max-width: ${pixelToEm(1100)}) {
        font-size: var(--font-size-5xl);
      }
    `}

  @media (max-width: ${pixelToEm(430)}) {
    font-size: var(--font-size-4xl);
  }
`;

const Label = styled.span`
  display: inline-block;
  font-size: var(--font-size-xsm);
  text-transform: uppercase;
  font-weight: 800;
  color: var(--color-grey-500);
  letter-spacing: 0.12em;

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
