import styled, { css } from "styled-components";
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

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      background-image: linear-gradient(
        to bottom right,
        var(--achievement-gold-color--bright),
        var(--achievement-gold-color--shade)
      );
      color: var(--achievement-text-color--dark);
      border: 1px solid var(--color-grey-300);
    `}
`;

const Name = styled.p`
  grid-row: 1 / 2;
  grid-column: 1 / -2;

  font-size: var(--font-size-2xl);
  font-weight: 600;

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      font-size: var(--font-size-3xl);
      color: var(--achievement-gold-color--shine-2);
      text-shadow: var(--achievement-text-shadow--gold);
      font-weight: 800;
    `}
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

const CompletedTextWrapper = styled.div`
  grid-row: 3 / 4;
  grid-column: 3 / -1;
  justify-self: end;
  background-color: var(--achievement-gold-color--shine);
  padding: 0.5rem 2rem;
  border-radius: 100px;

  & p {
    font-size: var(--font-size-2xl);
    text-transform: uppercase;
    color: var(--achievement-gold-color--shade);
    font-weight: 800;
  }
`;

function calculateTargetPoints(currentPoints, isAchieved) {
  // TODO: hardcoded target points
  if (isAchieved) return 1000;

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
  const isAchieved = habitStatus === "strong";
  const targetPoints = calculateTargetPoints(totalPoints, isAchieved);
  const barMinimumPoints = !isAchieved ? targetPoints - 100 : 0;
  const barPercentage = !isAchieved
    ? ((totalPoints - barMinimumPoints) / (targetPoints - barMinimumPoints)) *
      100
    : 100;

  const navigate = useNavigate();

  function goToSingleHabitPage(e) {
    const importantClasses = ["habit-menu", "action-buttons", "menu", "modal"];
    if (!importantClasses.some((cls) => e.target.closest(`.${cls}`))) {
      navigate(`/app/habits/${habitID}`);
    }
  }

  return (
    <StyledItem $isAchieved={isAchieved} onClick={goToSingleHabitPage}>
      <Name $isAchieved={isAchieved}>{name}</Name>

      <StyledMenu className="habit-menu">
        <HabitMenuOptions
          habitID={habitID}
          isAnswered={isAnswered}
          name={name}
          latestRecordID={latestRecordID}
          isArchived={isArchived}
          isAchieved={isAchieved}
        />
      </StyledMenu>

      <BarContainer>
        <ProgressBar
          percentage={barPercentage}
          streak={streak}
          startValueNum={barMinimumPoints}
          endValueNum={targetPoints}
          isAchieved={isAchieved}
        />
      </BarContainer>

      <PointsWrapper>
        <NumericStatsMinimal
          label={`Point${totalPoints !== 1 ? "s" : ""}`}
          number={totalPoints}
          isAchieved={isAchieved}
        />
      </PointsWrapper>

      {!isAchieved ? (
        <>
          <FireWrapper>
            <StreakFire streak={streak} didIt={didIt} isAchieved={isAchieved} />
          </FireWrapper>

          <SevenDayViewWrapper>
            <SevenDayActionView
              dailyRecords={dailyRecords}
              streak={streak}
              isAchieved={isAchieved}
            />
          </SevenDayViewWrapper>

          <ActionWrapper>
            <HabitActionButtons
              habitID={habitID}
              didIt={didIt}
              isAnswered={isAnswered}
              isAchieved={isAchieved}
            />
          </ActionWrapper>
        </>
      ) : (
        <CompletedTextWrapper>
          <p>🏆 Goal Completed</p>
        </CompletedTextWrapper>
      )}
    </StyledItem>
  );
}
