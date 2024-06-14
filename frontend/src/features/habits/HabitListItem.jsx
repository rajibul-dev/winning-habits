import styled from "styled-components";
import Row from "../../ui/Row.jsx";
import SevenDayActionView from "./SevenDayActionView.jsx";
import HabitMenuOptions from "./HabitMenuOptions.jsx";
import ProgressBar from "../../ui/ProgressBar.jsx";
import NumericStatsMinimal from "../../ui/NumericStatMinimal.jsx";
import HabitActionButtons from "./HabitActionButtons.jsx";
import StreakFire from "./StreakFire.jsx";
import { useNavigate } from "react-router-dom";

const StyledItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 2.3rem;
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
  font-size: 2.4rem;
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
  const navigate = useNavigate();

  function goToSingleHabitPage(e) {
    const importantClasses = ["habit-menu", "action-buttons", "menu", "modal"];
    if (!importantClasses.some((cls) => e.target.closest(`.${cls}`))) {
      navigate(habitID);
    }
  }

  return (
    <StyledItem onClick={goToSingleHabitPage}>
      <TopRow type="horizontal">
        <Name>{name}</Name>
        <div className="habit-menu">
          <HabitMenuOptions
            habitID={habitID}
            isAnswered={isAnswered}
            name={name}
            latestRecordID={latestRecordID}
            isArchived={isArchived}
          />
        </div>
      </TopRow>

      <BarRow type="horizontal">
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
      </BarRow>

      <BottomRow type="horizontal">
        <NumericStatsMinimal
          label={`Point${totalPoints !== 1 ? "s" : ""}`}
          number={totalPoints}
        />

        <StreakFire streak={streak} didIt={didIt} />

        <SevenDayActionView dailyRecords={dailyRecords} streak={streak} />

        <HabitActionButtons
          habitID={habitID}
          didIt={didIt}
          isAnswered={isAnswered}
        />
      </BottomRow>
    </StyledItem>
  );
}
