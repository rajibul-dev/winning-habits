import styled, { css } from "styled-components";
import Row from "./Row.jsx";
import { pixelToEm } from "../styles/GlobalStyles.js";

const Card = styled(Row)`
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  padding: 1.8rem 2.4rem;
  background-color: var(--color-grey-0);
  background-image: radial-gradient(
    circle at top left,
    var(--habit-brand-tint),
    transparent 42%
  );
  border: 1px solid var(--color-grey-200);
  border-radius: 2rem;
  box-shadow: var(--shadow-sm);

  ${({ $goldFlex }) =>
    $goldFlex &&
    css`
      border: 1px solid var(--achievement-gold-color--shine-2);
      background-image: var(--achievement-gold-bar);
    `}
`;

const IconCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;

  & svg {
    width: 3.8rem;
    height: 3.8rem;

    @media (max-width: ${pixelToEm(430)}) {
      width: 3rem;
      height: 3rem;
    }
  }
`;

const ValueCol = styled(Row)`
  align-items: start;
  gap: 0.3rem;
`;

const Value = styled.p`
  font-size: var(--font-size-5xl);
  font-weight: 700;
  line-height: 0.95;
  color: var(--color-grey-800);

  ${({ $goldFlex }) =>
    $goldFlex &&
    css`
      color: var(--achievement-gold-color--shine-2);
    `}
`;

const Label = styled.p`
  font-size: var(--font-size-xsm);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-grey-500);

  ${({ $goldFlex }) =>
    $goldFlex &&
    css`
      color: var(--achievement-gold-color--shine);
    `}

  @media (max-width: ${pixelToEm(430)}) {
    letter-spacing: 0.08em;
  }
`;

export default function StatCard({ icon, value, label, goldFlex }) {
  return (
    <Card type="horizontal" $goldFlex={goldFlex}>
      <IconCol>{icon}</IconCol>
      <ValueCol>
        <Value $goldFlex={goldFlex}>{value}</Value>
        <Label $goldFlex={goldFlex}>{label}</Label>
      </ValueCol>
    </Card>
  );
}
