import styled, { css } from "styled-components";
import SevenDayActionView from "./SevenDayActionView.jsx";
import HabitMenuOptions from "./HabitMenuOptions.jsx";
import ProgressBar from "../../ui/ProgressBar.jsx";
import NumericStatsMinimal from "../../ui/NumericStatMinimal.jsx";
import HabitActionButtons from "./HabitActionButtons.jsx";
import StreakFire from "./StreakFire.jsx";
import { useNavigate } from "react-router-dom";
import { goldFlexText, pixelToEm } from "../../styles/GlobalStyles.js";

const StyledItem = styled.li`
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: repeat(3, auto);
  row-gap: 3rem;
  align-items: center;
  position: relative;
  overflow: hidden;

  background-color: var(--color-grey-0);

  padding: 3rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 2.4rem;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    border-color: var(--color-grey-300);
  }

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      background-image: var(--achievement-gold-bar);
      color: var(--achievement-text-color--dark);
      border: 1px solid rgba(255, 251, 233, 0.42);

      &::before {
        background: var(--achievement-gold-color--shine-3);
        opacity: 0.65;
      }
    `}

  @media (max-width: ${pixelToEm(1100)}) {
    grid-template-columns: repeat(2, auto);
    grid-template-rows: repeat(4, auto);

    ${({ $isAchieved }) =>
      $isAchieved &&
      css`
        grid-template-rows: repeat(3, auto);
      `}

    @media (max-width: ${pixelToEm(430)}) {
      padding-inline: 2rem;
      row-gap: 3.2rem;
      border-radius: 2rem;
    }
  }
`;

const Name = styled.p`
  grid-row: 1 / 2;
  grid-column: 1 / -2;

  font-size: var(--font-size-2xl);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.03em;
  color: var(--color-grey-800);

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      font-size: var(--font-size-3xl);
      ${goldFlexText}
    `}

  @media (max-width: ${pixelToEm(1100)}) {
    grid-column: 1 / 3;
    width: 93%;
  }
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
  padding: 0.5rem;

  @media (max-width: ${pixelToEm(1100)}) {
    grid-column: 2/3;
  }
`;

const PointsWrapper = styled.div`
  grid-row: 3 / 4;
  grid-column: 1 / 2;

  @media (max-width: ${pixelToEm(1100)}) {
    grid-row: 4 / 5;
  }

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      @media (max-width: ${pixelToEm(1100)}) {
        grid-column: 1 / 2;
        grid-row: 3 / 4;
        justify-self: start;
      }
    `}
`;

const FireWrapper = styled.div`
  grid-row: 3 / 4;
  grid-column: 3 / 4;
  width: fit-content;

  @media (max-width: ${pixelToEm(1300)}) {
    grid-column: 2 / 3;
  }

  @media (max-width: ${pixelToEm(1100)}) {
    grid-column: 1 / 2;
  }

  @media (max-width: ${pixelToEm(430)}) {
    transform: translateY(0.5rem);
  }
`;

const SevenDayViewWrapper = styled.div`
  grid-row: 3 / 4;
  grid-column: 4 / span 4;

  @media (max-width: ${pixelToEm(1100)}) {
    grid-column: 2 / 3;
    justify-self: end;
  }
`;

const ActionWrapper = styled.div`
  grid-row: 3 / 4;
  grid-column: -4 / -1;
  justify-self: end;

  @media (max-width: ${pixelToEm(1100)}) {
    grid-row: 4 / 5;
    grid-column: 2 / 3;
    justify-self: end;
  }
`;

const CompletedTextWrapper = styled.div`
  grid-row: 3 / 4;
  grid-column: 3 / -1;
  justify-self: end;
  background-color: rgba(255, 251, 233, 0.9);
  padding: 1rem 2rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 251, 233, 0.58);
  box-shadow: var(--shadow-sm);

  @media (max-width: ${pixelToEm(1100)}) {
    grid-column: 2 / 3;
    grid-row: 3 / 4;
    justify-self: end;
  }

  & p {
    font-size: var(--font-size-lg);
    text-transform: uppercase;
    color: var(--achievement-gold-color--shade);
    font-weight: 800;
    letter-spacing: 0.08em;

    @media (max-width: ${pixelToEm(1100)}) {
      font-size: var(--font-size-base);
    }

    @media (max-width: ${pixelToEm(355)}) {
      font-size: 1.1rem;
    }
  }
`;

function calculateTargetPoints(currentPoints, isAchieved) {
  if (isAchieved) return 1000;

  if (currentPoints < 100) {
    return 100;
  }

  const roundedHundred = Math.ceil(currentPoints / 100) * 100;
  return roundedHundred;
}

export default function HabitListItem({ habit, basePath = "/habits" }) {
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
    let importantClasses = ["habit-menu", "action-buttons", "menu", "modal"];
    if (isAnswered) {
      importantClasses = ["habit-menu", "menu", "modal"];
    }
    if (!importantClasses.some((cls) => e.target.closest(`.${cls}`))) {
      navigate(`${basePath}/${habitID}`);
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

      <PointsWrapper $isAchieved={isAchieved}>
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
          <p>Goal completed</p>
        </CompletedTextWrapper>
      )}
    </StyledItem>
  );
}
