import styled from "styled-components";
import SevenDayActionView from "./SevenDayActionView.jsx";
import HabitMenuOptions from "./HabitMenuOptions.jsx";
import ProgressBar from "../../ui/ProgressBar.jsx";
import NumericStatsMinimal from "../../ui/NumericStatMinimal.jsx";
import HabitActionButtons from "./HabitActionButtons.jsx";
import StreakFire from "./StreakFire.jsx";
import { useNavigate } from "react-router-dom";

const StyledItem = styled.li`
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: repeat(3, auto);
  row-gap: 3rem;
  align-items: center;

  background-color: var(--color-grey-0);
  padding: 3rem;
  border: 1px solid var(--color-grey-300);
  cursor: pointer;
`;

const Name = styled.p`
  grid-row: 1 / 2;
  grid-column: 1 / -2;

  font-size: var(--font-size-2xl);
  font-weight: 600;
`;

const BarContainer = styled.div`
  grid-row: 2 / 3;
  grid-column: 1 / -1;
`;

const StyledMenu = styled.div`
  grid-row: 1 / 2;
  grid-column: -2 / -1;
  align-self: center;
  justify-self: end;
`;

const PointsWrapper = styled.div`
  grid-row: 3 / 4;
  grid-column: 1 / 2;
`;

const FireWrapper = styled.div`
  grid-row: 3 / 4;
  grid-column: 3 / 4;
`;

const SevenDayViewWrapper = styled.div`
  grid-row: 3 / 4;
  grid-column: 4 / span 4;
`;

const ActionWrapper = styled.div`
  grid-row: 3 / 4;
  grid-column: -4 / -1;
  justify-self: end;
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
    habitStatus,
  } = habit;
  const latestRecord = dailyRecords[dailyRecords.length - 1] || null;
  const { didIt, _id: latestRecordID } = latestRecord || false;
  const isAnswered = didIt !== "unanswered" && didIt;
  const targetPoints = calculateTargetPoints(totalPoints);
  const barMinimumPoints = targetPoints - 100;
  const isAchieved = habitStatus === "strong";

  const navigate = useNavigate();

  function goToSingleHabitPage(e) {
    const importantClasses = ["habit-menu", "action-buttons", "menu", "modal"];
    if (!importantClasses.some((cls) => e.target.closest(`.${cls}`))) {
      navigate(`/app/habits/${habitID}`);
    }
  }

  return (
    <StyledItem onClick={goToSingleHabitPage}>
      <Name>{name}</Name>

      <StyledMenu className="habit-menu">
        <HabitMenuOptions
          habitID={habitID}
          isAnswered={isAnswered}
          name={name}
          latestRecordID={latestRecordID}
          isArchived={isArchived}
        />
      </StyledMenu>

      <BarContainer>
        <ProgressBar
          percentage={
            ((totalPoints - barMinimumPoints) /
              (targetPoints - barMinimumPoints)) *
            100
          }
          streak={streak}
          startValueNum={barMinimumPoints}
          endValueNum={targetPoints}
        />
      </BarContainer>

      <PointsWrapper>
        <NumericStatsMinimal
          label={`Point${totalPoints !== 1 ? "s" : ""}`}
          number={totalPoints}
        />
      </PointsWrapper>

      <FireWrapper>
        <StreakFire streak={streak} didIt={didIt} />
      </FireWrapper>

      <SevenDayViewWrapper>
        <SevenDayActionView dailyRecords={dailyRecords} streak={streak} />
      </SevenDayViewWrapper>

      <ActionWrapper>
        <HabitActionButtons
          habitID={habitID}
          didIt={didIt}
          isAnswered={isAnswered}
        />
      </ActionWrapper>
    </StyledItem>
  );
}
