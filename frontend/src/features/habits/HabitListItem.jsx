import styled, { css } from "styled-components";
import Row from "../../ui/Row.jsx";
import SevenDayActionView from "./SevenDayActionView.jsx";
import { PiFireSimpleFill } from "react-icons/pi";
import HabitMenuOptions from "./HabitMenuOptions.jsx";
import ProgressBar from "../../ui/ProgressBar.jsx";
import NumericStatsMinimal from "../../ui/NumericStatMinimal.jsx";
import HabitActionButtons from "./HabitActionButtons.jsx";
import StreakFire from "./StreakFire.jsx";

const StyledItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: var(--color-grey-0);
  padding: 3rem;
  border: 1px solid var(--color-grey-300);
  cursor: pointer;
`;

const TopRow = styled(Row)`
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.p`
  font-size: 2.2rem;
  font-weight: 600;
`;

const BarRow = styled(Row)`
  gap: 1rem;
  flex-shrink: 0;
  margin-top: 0.8rem;
`;

const BottomRow = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  margin-top: 1.4rem;
  justify-items: center;
  align-items: center;
`;

const Streak = styled.div`
  position: relative;
  transform: translateX(8rem);

  & span {
    font-size: 3.6rem;
    font-weight: 700;
    display: inline-block;
    color: var(--color-grey-500);
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 3;
    transform: translate(-50%, -42%);

    ${(props) =>
      props.answer === "yes" &&
      css`
        color: white;
        text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
      `}
  }

  & svg {
    font-size: 11rem;
    fill: var(--color-grey-300);
    transform: translateY(2px);

    ${(props) =>
      props.answer === "yes" &&
      css`
        /* TODO: */
        fill: var(--color-lime-500);
      `}
  }
`;

function calculateTargetPoints(currentPoints) {
  if (currentPoints < 100) {
    return 100;
  } else {
    const roundedHundred = Math.ceil(currentPoints / 100) * 100;
    return roundedHundred;
  }
}

export default function HabitListItem({ habit }) {
  const {
    totalPoints,
    streak,
    name,
    _id: habitID,
    dailyRecords,
    isArchived,
  } = habit;
  const latestRecord = dailyRecords[dailyRecords.length - 1] || null;
  const { didIt, _id: latestRecordID } = latestRecord || false;
  const isAnswered = didIt !== "unanswered" && didIt;
  const targetPoints = calculateTargetPoints(totalPoints);
  const barMinimumPoints = targetPoints - 100;

  return (
    <StyledItem>
      <TopRow type="horizontal">
        <Name>{name}</Name>
        <HabitMenuOptions
          habitID={habitID}
          isAnswered={isAnswered}
          name={name}
          latestRecordID={latestRecordID}
          isArchived={isArchived}
        />
      </TopRow>

      <BarRow type="horizontal">
        <ProgressBar
          percentage={
            ((totalPoints - barMinimumPoints) /
              (targetPoints - barMinimumPoints)) *
            100
          }
          // TODO: Bar color and shadow
        />
      </BarRow>

      <BottomRow type="horizontal">
        <NumericStatsMinimal
          label={`Point${totalPoints !== 1 ? "s" : ""}`}
          number={totalPoints}
        />

        <StreakFire streak={streak} didIt={didIt} />

        <SevenDayActionView dailyRecords={dailyRecords} />

        <HabitActionButtons
          habitID={habitID}
          didIt={didIt}
          isAnswered={isAnswered}
        />
      </BottomRow>
    </StyledItem>
  );
}
