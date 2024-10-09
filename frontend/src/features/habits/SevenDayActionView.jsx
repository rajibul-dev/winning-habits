import styled, { css } from "styled-components";
import streakColor from "./streakColor.js";
import { pixelToEm } from "../../styles/GlobalStyles.js";

const sharedStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  line-height: 1;

  @media (max-width: ${pixelToEm(430)}) {
    /* padding-inline: 1rem; */
    font-size: 1.2rem;
    * {
      max-width: 2ch;
      padding: 0;
    }
  }
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
    ${({ $didIt, $streak }) =>
      $didIt === true &&
      css`
        color: ${streakColor($streak)};
      `}
  }
  &:nth-child(7) {
    ${({ $didIt }) =>
      $didIt === false &&
      css`
        color: var(--color-red-700-mod);
      `}
  }
`;
const Dates = styled.span`
  ${sharedStyles}
  color: var(--color-grey-500);
  font-weight: 600;

  position: relative;

  ${({ $didIt }) =>
    $didIt === null &&
    css`
      &:last-child {
        z-index: 0;
        &::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          height: 3.6rem;
          width: 3.6rem;
          background-color: var(--color-grey-300);
          border-radius: 50%;
          z-index: -1;
        }
      }
    `}

  ${({ $didIt, $streak, $position }) =>
    $didIt === true
      ? css`
          z-index: 0;
          color: white;
          font-weight: 700;
          &::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            height: 3.6rem;
            width: 3.6rem;
            background-color: ${streakColor($streak)};

            ${$position === "single" &&
            css`
              border-radius: 50%;
            `}

            ${$position === "middle" &&
            css`
              width: 120%;
            `}

            ${$position === "left" &&
            css`
              box-shadow: 10px 0 0 ${streakColor($streak)};
              border-top-left-radius: 50%;
              border-bottom-left-radius: 50%;
            `}
            
            ${$position === "right" &&
            css`
              box-shadow: -10px 0 0 ${streakColor($streak)};
              border-top-right-radius: 50%;
              border-bottom-right-radius: 50%;
            `}
            
            z-index: -1;
          }
        `
      : $didIt === false
        ? css`
            color: var(--color-red-700-mod);
          `
        : css``}
`;

export function prepareLastSevenDayView(dailyRecords) {
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const result = [];

  const latestRecordDate = new Date(
    dailyRecords[dailyRecords.length - 1]?.date ?? null,
  );

  // Get today's date and normalize to the start of the day
  const today = latestRecordDate || new Date();
  today.setHours(0, 0, 0, 0);

  // Create a map of dates to their corresponding dailyRecords
  const dateRecordMap = dailyRecords.reduce((map, record) => {
    const date = new Date(record.date);
    date.setHours(0, 0, 0, 0);
    map[date.toDateString()] = record;
    return map;
  }, {});

  // Populate the result array with the last seven days
  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);
    const dateStr = targetDate.toDateString();

    const record = dateRecordMap[dateStr];
    const didIt = record
      ? record.didIt === "yes"
        ? true
        : record.didIt === "no"
          ? false
          : null
      : null;

    result.push({
      weekday: daysOfWeek[targetDate.getDay()],
      didIt,
      date: targetDate.getDate(),
    });
  }

  return result;
}

export default function SevenDayActionView({ dailyRecords, streak }) {
  const lastSevenDayActions = prepareLastSevenDayView(dailyRecords);

  return (
    <Wrapper>
      {lastSevenDayActions.map((action) => (
        <Weekdays $didIt={action.didIt} $streak={streak} key={action.weekday}>
          {action.weekday}
        </Weekdays>
      ))}

      {lastSevenDayActions.map((action, index) => {
        let position = null;
        const prevAnswer = lastSevenDayActions[index - 1]?.didIt ?? null;
        const nextAnswer = lastSevenDayActions[index + 1]?.didIt ?? null;
        if (prevAnswer && nextAnswer) {
          position = "middle";
        } else if (!prevAnswer && nextAnswer) {
          position = "left";
        } else if (prevAnswer && !nextAnswer) {
          position = "right";
        } else {
          position = "single";
        }

        return (
          <Dates
            key={action.date}
            $didIt={action.didIt}
            $streak={streak}
            $position={position}
          >
            {action.date}
          </Dates>
        );
      })}
    </Wrapper>
  );
}
