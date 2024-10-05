import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styled, { css } from "styled-components";
import {
  isSunday,
  isSaturday,
  isFirstDayOfMonth,
  isLastDayOfMonth,
} from "date-fns";
import CustomDayComponent from "./CustomDayComponent";
import { pixelToEm } from "../../styles/GlobalStyles";

const IS_FULL_ROUND = true;

const sharedStylesYesCellParent = css`
  z-index: 2;
  color: white;
  font-weight: 700;
  position: relative;
`;
const sharedStylesYesCellAfterPseudo = (streakFireColor) => css`
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 4rem;
  width: 4rem;
  background-color: ${streakFireColor};
  z-index: -1;
`;

const StyledDayPicker = styled(DayPicker)`
  --rdp-cell-size: 4.8rem;
  --rdp-caption-font-size: 2rem;
  --rdp-accent-color: var(--color-brand-700);
  --rdp-accent-color-dark: "";
  --rdp-background-color: var(--color-brand-500-modified-1-shadow);
  --rdp-background-color-dark: "";
  --rdp-outline: "";
  --rdp-outline-selected: "";
  --rdp-selected-color: "";

  margin: 0 !important;
  background-color: var(--color-grey-100);
  display: flex;
  font-size: 1.6rem;
  justify-content: center;
  padding: 2rem 0;
  border: var(--usual-layout-border);
  transition: all 0.2s;

  & .rdp-day {
    overflow: visible;
    display: inline-block;
    transition: all 0.2s;
  }

  & .rdp-day_selected,
  .rdp-day_selected:hover {
    color: #fff;
  }

  & .yes:hover {
    color: var(--color-brand-200);
    --rdp-background-color: none;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  & .yes span {
    transition: all 0.1s;
  }
  & .yes:hover span {
    transform: translateY(-1px);
  }
  & .yes:hover.rdp-day_today {
    &::before {
      transform: translateY(-1.5px) translateX(-50%);
      background-color: var(--color-brand-200);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
  }

  & .rdp-day_today {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 0.8rem;
      height: 2px;
      border-radius: 100px;
      background-color: var(--color-grey-900);
      bottom: 25%;
      left: 50%;
      transform: translateX(-50%);
      transition: all 0.2s;
    }
    &.rdp-day_selected::before {
      background-color: #fff;
    }
    &.yes::before {
      background-color: #fff;
    }
  }

  & .left {
    ${sharedStylesYesCellParent}
    &::after {
      ${({ $streakFireColor }) =>
        sharedStylesYesCellAfterPseudo($streakFireColor)}

      box-shadow: 10px 0 0 ${({ $streakFireColor }) => $streakFireColor};
      border-top-left-radius: 50%;
      border-bottom-left-radius: 50%;
    }
  }

  & .middle {
    ${sharedStylesYesCellParent}
    &::after {
      ${({ $streakFireColor }) =>
        sharedStylesYesCellAfterPseudo($streakFireColor)}

      width: 120%;
    }
  }

  & .right {
    ${sharedStylesYesCellParent}
    &::after {
      ${({ $streakFireColor }) =>
        sharedStylesYesCellAfterPseudo($streakFireColor)}

      box-shadow: -10px 0 0 ${({ $streakFireColor }) => $streakFireColor};
      border-top-right-radius: 50%;
      border-bottom-right-radius: 50%;
    }
  }

  & .left--right-edge {
    ${sharedStylesYesCellParent}
    &::after {
      ${({ $streakFireColor }) =>
        sharedStylesYesCellAfterPseudo($streakFireColor)}

      ${!IS_FULL_ROUND
        ? css`
            border-top-left-radius: 50%;
            border-bottom-left-radius: 50%;
          `
        : css`
            border-radius: 50%;
          `}
    }
  }

  & .middle--right-edge {
    ${sharedStylesYesCellParent}
    &::after {
      ${({ $streakFireColor }) =>
        sharedStylesYesCellAfterPseudo($streakFireColor)}

      box-shadow: -5px 0 0 ${({ $streakFireColor }) => $streakFireColor};

      // new
      ${!IS_FULL_ROUND
        ? css``
        : css`
            border-top-right-radius: 50%;
            border-bottom-right-radius: 50%;
          `}
    }
  }

  & .right--left-edge {
    ${sharedStylesYesCellParent}
    &::after {
      ${({ $streakFireColor }) =>
        sharedStylesYesCellAfterPseudo($streakFireColor)}

      // new
      ${!IS_FULL_ROUND
        ? css`
            border-top-right-radius: 50%;
            border-bottom-right-radius: 50%;
          `
        : css`
            border-radius: 50%;
          `}
    }
  }

  & .middle--left-edge {
    ${sharedStylesYesCellParent}
    &::after {
      ${({ $streakFireColor }) =>
        sharedStylesYesCellAfterPseudo($streakFireColor)}

      box-shadow: 5px 0 0 ${({ $streakFireColor }) => $streakFireColor};

      // new
      ${!IS_FULL_ROUND
        ? css``
        : css`
            border-top-left-radius: 50%;
            border-bottom-left-radius: 50%;
          `}
    }
  }

  & .single {
    ${sharedStylesYesCellParent}
    &::after {
      ${({ $streakFireColor }) =>
        sharedStylesYesCellAfterPseudo($streakFireColor)}

      border-radius: 50%;
    }
  }

  & .no {
    color: var(--color-red-700-mod);
  }
  & .no.rdp-day_today::before {
    background-color: var(--color-red-700-mod);
  }

  @media (max-width: ${pixelToEm(430)}) {
    --rdp-cell-size: 4.6rem;
    --rdp-caption-font-size: 1.8rem;
    font-size: 1.6rem;
  }

  @media (max-width: ${pixelToEm(355)}) {
    --rdp-cell-size: 4.2rem;
    --rdp-caption-font-size: 1.8rem;
    font-size: 1.3rem;
  }
`;

export default function HabitCalender({
  dailyRecords,
  streakFireColor,
  habitID,
  streak,
  isAchieved,
}) {
  let modifiedStreakFireColor =
    streak === 0 ? "var(--color-lime-500)" : streakFireColor;

  if (isAchieved) {
    modifiedStreakFireColor = `var(--achievement-gold-color--shine)`;
  }

  const dailyRecordsFormatted = dailyRecords.map((record, index, records) => {
    const recordDate = new Date(record.date);

    let position = null;
    const prevAnswer = records[index - 1]?.didIt === "yes" ?? null;
    const nextAnswer = records[index + 1]?.didIt === "yes" ?? null;
    if (prevAnswer && nextAnswer) {
      position = "middle";
    } else if (!prevAnswer && nextAnswer) {
      position = "left";
    } else if (prevAnswer && !nextAnswer) {
      position = "right";
    } else {
      position = "single";
    }

    let sunOrSat = false;
    if (isSunday(recordDate)) sunOrSat = "sun";
    if (isSaturday(recordDate)) sunOrSat = "sat";

    let edge = false;
    if (
      (position === "left" && sunOrSat === "sat") ||
      (position === "middle" && sunOrSat === "sat") ||
      (position === "left" && isLastDayOfMonth(recordDate)) ||
      (position === "middle" && isLastDayOfMonth(recordDate))
    ) {
      edge = "right-edge";
    } else if (
      (position === "right" && sunOrSat === "sun") ||
      (position === "middle" && sunOrSat === "sun") ||
      (position === "right" && isFirstDayOfMonth(recordDate)) ||
      (position === "middle" && isFirstDayOfMonth(recordDate))
    ) {
      edge = "left-edge";
    }

    return { ...record, date: new Date(record.date), position, edge };
  });

  return (
    <StyledDayPicker
      mode="single"
      components={{
        DayContent: ({ date }) => (
          <CustomDayComponent
            date={date}
            dailyRecords={dailyRecords}
            habitID={habitID}
          />
        ),
      }}
      modifiers={{
        yes: dailyRecordsFormatted
          .filter((record) => record.didIt === "yes")
          .map((record) => record.date),
        left: dailyRecordsFormatted
          .filter((record) => record.didIt === "yes")
          .filter((record) => record.position === "left" && !record.edge)
          .map((record) => record.date),
        middle: dailyRecordsFormatted
          .filter((record) => record.didIt === "yes")
          .filter((record) => record.position === "middle" && !record.edge)
          .map((record) => record.date),
        right: dailyRecordsFormatted
          .filter((record) => record.didIt === "yes")
          .filter((record) => record.position === "right" && !record.edge)
          .map((record) => record.date),
        leftOnRightEdge: dailyRecordsFormatted
          .filter((record) => record.didIt === "yes")
          .filter(
            (record) =>
              record.position === "left" && record.edge === "right-edge",
          )
          .map((record) => record.date),
        middleOnRightEdge: dailyRecordsFormatted
          .filter((record) => record.didIt === "yes")
          .filter(
            (record) =>
              record.position === "middle" && record.edge === "right-edge",
          )
          .map((record) => record.date),
        rightOnLeftEdge: dailyRecordsFormatted
          .filter((record) => record.didIt === "yes")
          .filter(
            (record) =>
              record.position === "right" && record.edge === "left-edge",
          )
          .map((record) => record.date),
        middleOnLeftEdge: dailyRecordsFormatted
          .filter((record) => record.didIt === "yes")
          .filter(
            (record) =>
              record.position === "middle" && record.edge === "left-edge",
          )
          .map((record) => record.date),
        single: dailyRecordsFormatted
          .filter((record) => record.didIt === "yes")
          .filter((record) => record.position === "single")
          .map((record) => record.date),
        no: dailyRecordsFormatted
          .filter((record) => record.didIt === "no")
          .map((record) => record.date),
      }}
      modifiersClassNames={{
        yes: "yes",
        left: "left",
        middle: "middle",
        right: "right",
        leftOnRightEdge: "left--right-edge",
        middleOnRightEdge: "middle--right-edge",
        rightOnLeftEdge: "right--left-edge",
        middleOnLeftEdge: "middle--left-edge",
        single: "single",
        no: "no",
      }}
      $streakFireColor={modifiedStreakFireColor}
    />
  );
}

// how many classes to generate for yeses?
// left
// middle
// right
// left--right-edge
// middle--right-edge
// right--left-edge
// middle--left-edge
// left--month-end
// middle--month-end
// right--month-start
// middle--month-start
