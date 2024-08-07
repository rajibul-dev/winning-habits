import styled from "styled-components";
import Row from "./Row.jsx";

const Card = styled(Row)`
  border: 1px solid var(--color-grey-400);
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1.4rem 3rem;
`;
const IconCol = styled.div`
  & svg {
    width: 4rem;
    height: 4rem;
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
`;
const Label = styled.p`
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-grey-500);
`;

export default function StatCard({ icon, value, label }) {
  return (
    <Card type="horizontal">
      <IconCol>{icon}</IconCol>
      <ValueCol>
        <Value>{value}</Value>
        <Label>{label}</Label>
      </ValueCol>
    </Card>
  );
}
