import styled, { css } from "styled-components";

const sharedStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  line-height: 1;
  border-radius: 1000px;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, auto);
  grid-template-rows: 1rem 1rem;
  row-gap: 2.6rem;
  align-items: center;
  justify-content: center;
`;
const Weekdays = styled.span`
  ${sharedStyles}
  color: var(--color-grey-600);
  font-weight: 600;
  &:nth-child(7) {
    color: var(--color-brand-700);
  }
`;
const Dates = styled.span`
  ${sharedStyles}
  color: var(--color-grey-500);
  &:last-child {
    border: 1px solid var(--color-brand-700);
  }
  ${(props) => (props.didIt ? css`` : props.didIt === false ? css`` : css``)}
`;

export default function SevenDayActionView({ actions }) {
  return (
    <Wrapper>
      {actions.map((action) => (
        <Weekdays key={action.weekday}>{action.weekday}</Weekdays>
      ))}
      {actions.map((action) => (
        <Dates key={action.date} didIt={action.didIt}>
          {action.date}
        </Dates>
      ))}
    </Wrapper>
  );
}
