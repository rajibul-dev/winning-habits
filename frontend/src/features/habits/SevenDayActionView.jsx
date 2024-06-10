import styled, { css } from "styled-components";

const sharedStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  line-height: 1;
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
  font-weight: 600;

  position: relative;
  &:last-child {
    color: var(--color-brand-700);
  }
  &:last-child::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 3.6rem;
    width: 3.6rem;
    border: 1px solid var(--color-brand-700);
    border-radius: 1000px;
  }

  ${(props) => (props.$didIt ? css`` : props.$didIt === false ? css`` : css``)}
`;

function prepareLastSevenDayView(dailyRecords) {
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const result = [];

  // Get today's date and weekday for reference
  const today = new Date();

  // Populate the result array
  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);

    const date = targetDate.getDate();
    const weekdayIndex = targetDate.getDay();

    const didIt = dailyRecords[i]
      ? dailyRecords[i].didIt === "yes"
        ? true
        : dailyRecords[i].didIt === "no"
          ? false
          : null
      : null;

    result.push({
      weekday: daysOfWeek[weekdayIndex],
      didIt,
      date,
    });
  }

  return result.reverse();
}

export default function SevenDayActionView({ dailyRecords }) {
  const lastSevenDayActions = prepareLastSevenDayView(dailyRecords);

  return (
    <Wrapper>
      {lastSevenDayActions.map((action) => (
        <Weekdays key={action.weekday}>{action.weekday}</Weekdays>
      ))}
      {lastSevenDayActions.map((action) => (
        <Dates key={action.date} $didIt={action.didIt}>
          {action.date}
        </Dates>
      ))}
    </Wrapper>
  );
}
