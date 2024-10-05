import styled, { css } from "styled-components";
import Row from "./Row.jsx";
import { pixelToEm } from "../styles/GlobalStyles.js";

const Card = styled(Row)`
  border: 1px solid var(--color-grey-400);
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1.4rem 3rem;

  ${({ $goldFlex }) =>
    $goldFlex &&
    css`
      border: 1px solid var(--achievement-gold-color--shine-2);
      background-image: var(--achievement-gold-bar);
    `}
`;
const IconCol = styled.div`
  & svg {
    width: 4rem;
    height: 4rem;

    ${({ $goldFlex }) => $goldFlex && css``}

    @media (max-width: ${pixelToEm(430)}) {
      width: 3rem;
      height: 3rem;
    }
  }
`;
const ValueCol = styled(Row)`
  align-items: start;
  gap: 0.2rem;
`;
const Value = styled.p`
  font-size: var(--font-size-5xl);
  font-weight: 600;
  line-height: 1;

  ${({ $goldFlex }) =>
    $goldFlex &&
    css`
      color: var(--achievement-gold-color--shine-2);
    `}
`;
const Label = styled.p`
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-grey-500);

  ${({ $goldFlex }) =>
    $goldFlex &&
    css`
      color: var(--achievement-gold-color--shine);
    `}

  @media (max-width: ${pixelToEm(430)}) {
    font-size: 1.1rem;
    text-transform: uppercase;
  }
`;

export default function StatCard({ icon, value, label, goldFlex }) {
  return (
    <Card type="horizontal" $goldFlex={goldFlex}>
      <IconCol $goldFlex={goldFlex}>{icon}</IconCol>
      <ValueCol>
        <Value $goldFlex={goldFlex}>{value}</Value>
        <Label $goldFlex={goldFlex}>{label}</Label>
      </ValueCol>
    </Card>
  );
}
