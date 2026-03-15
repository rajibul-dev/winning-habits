import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import Button from "../../ui/Button.jsx";
import Empty from "../../ui/Empty.jsx";
import Heading from "../../ui/Heading.jsx";
import ProgressBar from "../../ui/ProgressBar.jsx";
import Row from "../../ui/Row.jsx";
import Spinner from "../../ui/Spinner.jsx";
import useSingleHabit from "./useSingleHabit.js";
import Menus from "../../ui/Menu.jsx";
import HabitActionButtons from "./HabitActionButtons.jsx";
import HabitMenuOptions from "./HabitMenuOptions.jsx";
import streakColor from "./streakColor.js";
import HabitStatistics from "./HabitStatistics.jsx";
import HabitCalender from "./HabitCalendar.jsx";
import { pixelToEm } from "../../styles/GlobalStyles.js";

const FULL_POINTS = 1000;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(3, max-content);
  row-gap: 3rem;
  column-gap: 3rem;
  padding: 3rem;
  border-radius: 2.8rem;
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-0);
  /* background-image: radial-gradient(
    circle at top left,
    var(--habit-brand-tint),
    transparent 28%
  ); */
  box-shadow: var(--shadow-sm);

  @media (max-width: ${pixelToEm(900)}) {
    grid-template-columns: repeat(2, auto);
    grid-template-rows: repeat(4, auto);
    padding: 2.4rem;
  }

  @media (max-width: ${pixelToEm(500)}) {
    padding: 1.8rem;
    border-radius: 2.2rem;
  }

  @media (max-width: ${pixelToEm(400)}) {
    padding-inline: 0;
    padding-bottom: 2rem;
  }
`;

const GoBackLink = styled(Link)``;

const HeadingWithBackBtnWrapper = styled(Row)`
  grid-column: 1 / -1;
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 1.2rem;
  margin-bottom: 0.4rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-grey-200);

  & svg {
    display: inline-grid;
    place-items: center;
    width: 4.2rem;
    height: 4.2rem;
    padding: 0.8rem;
    border-radius: 50%;
    cursor: pointer;
    background-color: var(--color-grey-100);
    color: var(--color-grey-700);
    transition: all 0.2s;

    @media (max-width: ${pixelToEm(400)}) {
      background-color: transparent;
    }

    &.back-btn:hover {
      background-color: var(--color-grey-200);
      transform: translateX(-2px);
    }
  }
`;

const StyledHeading = styled(Heading)`
  margin-right: auto;
  color: var(--color-grey-800);
  letter-spacing: -0.04em;
`;

const ActionButtonWrapper = styled.div`
  grid-row: 2 / span 2;
  grid-column: 5 / -1;
  justify-self: stretch;
  align-self: stretch;

  @media (max-width: ${pixelToEm(900)}) {
    grid-row: 4 / 5;
    grid-column: 1 / -1;
    justify-self: center;

    & > div {
      width: 100%;
    }

    ${({ $isAchieved }) =>
      $isAchieved &&
      css`
        grid-row: 5 / 6;
      `}
  }
`;

const ProgressBarWrapper = styled.div`
  grid-row: 3 /4;
  grid-column: 1 / span 4;

  ${({ $isAchieved }) =>
    $isAchieved &&
    css`
      background-image: linear-gradient(
          180deg,
          rgba(255, 251, 233, 0.24),
          rgba(255, 255, 255, 0.06)
        ),
        var(--achievement-gold-bar);
      border-color: rgba(255, 251, 233, 0.4);

      & div {
        background-color: transparent;
        background-image: var(--achievement-gold-bar);
        box-shadow: 0 0 0 1px var(--achievement-gold-color--shine-2);

        & div {
          background-image: var(--achievement-gold-bar);
        }
        & span {
          color: var(--achievement-gold-color--shine-2);
        }
      }
    `}

  @media (max-width: ${pixelToEm(900)}) {
    grid-column: 1 / -1;
  }
`;

const CalendarWrapper = styled.div`
  grid-column: 1 / span 4;
  justify-self: stretch;

  @media (max-width: ${pixelToEm(430)}) {
    justify-self: center;
    & > div {
      display: inline-block;
      padding-inline: 3rem;
    }
  }

  & > div {
    ${({ $isAchieved }) =>
      $isAchieved &&
      css`
        border: 2px solid var(--achievement-gold-color--shine-2);
        background-image: var(--achievement-gold-bar);

        & span,
        & div {
          color: var(--achievement-gold-color--shine-3);
        }

        & .rdp-button:hover {
          background-color: var(--achievement-gold-color--shadow-2) !important;
        }

        & .rdp-day.yes div span {
          color: var(--achievement-gold-color--shade);
        }

        & .rdp-day_today::before {
          background-color: var(--achievement-gold-color--shine-3);
        }

        & .rdp-day_today.yes::before {
          background-color: var(--achievement-gold-color--shade);
        }
      `}
  }

  @media (max-width: ${pixelToEm(900)}) {
    grid-column: 1 / -1;
  }
`;

export default function SingleHabitFeature() {
  const { data, isLoading, error, isAchieved } = useSingleHabit();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <>
        <Empty resourceName="Habit" />
        <GoBackLink to={-1}>
          <Button>Go back to habits page</Button>
        </GoBackLink>
      </>
    );

  const {
    name,
    totalPoints,
    streak,
    _id: habitID,
    dailyRecords,
    isArchived,
  } = data.habit;
  const latestRecord = dailyRecords[dailyRecords.length - 1] || null;
  const { didIt, _id: latestRecordID } = latestRecord || false;
  const isAnswered = didIt !== "unanswered" && didIt;

  const streakFireColor =
    streak === 0 ? `var(--color-grey-300)` : streakColor(streak);

  return (
    <Menus>
      <GridContainer>
        <HeadingWithBackBtnWrapper type="horizontal">
          <IoArrowBack className="back-btn" onClick={() => navigate(-1)} />
          <StyledHeading>{name}</StyledHeading>
          <HabitMenuOptions
            habitID={habitID}
            isAnswered={isAnswered}
            name={name}
            latestRecordID={latestRecordID}
            isArchived={isArchived}
          />
        </HeadingWithBackBtnWrapper>

        <HabitStatistics
          isAnswered={isAnswered}
          streak={streak}
          streakFireColor={streakFireColor}
          totalPoints={totalPoints}
          isAchieved={isAchieved}
        />

        <ActionButtonWrapper $isAchieved={isAchieved}>
          <HabitActionButtons
            habitID={habitID}
            didIt={didIt}
            isAnswered={isAnswered}
            variant="design-2"
          />
        </ActionButtonWrapper>

        <ProgressBarWrapper $isAchieved={isAchieved}>
          <ProgressBar
            percentage={(totalPoints / FULL_POINTS) * 100}
            streak={streak}
            startValueNum={0}
            endValueNum={FULL_POINTS}
          />
        </ProgressBarWrapper>

        <CalendarWrapper $isAchieved={isAchieved}>
          <HabitCalender
            streakFireColor={streakFireColor}
            streak={streak}
            dailyRecords={dailyRecords}
            habitID={habitID}
            isAchieved={isAchieved}
          />
        </CalendarWrapper>
      </GridContainer>
    </Menus>
  );
}
