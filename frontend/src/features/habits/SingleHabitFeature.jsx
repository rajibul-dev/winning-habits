import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
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

const FULL_POINTS = 1000;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(3, max-content);
  row-gap: 3rem;
  column-gap: 3rem;
`;

const GoBackLink = styled(Link)``;

const HeadingWithBackBtnWrapper = styled(Row)`
  grid-column: 1 / -1;
  grid-row: 1 / 2;

  display: flex;
  align-items: center;
  justify-content: start;
  gap: 1rem;
  margin-bottom: 1rem;

  & svg {
    display: inline-block;
    width: 3.4rem;
    height: 3.4rem;
    cursor: pointer;
    &.back-btn:hover {
      background-color: var(--color-grey-200);
    }
  }
`;

const StyledHeading = styled(Heading)`
  margin-right: auto;
`;

const ActionButtonWrapper = styled.div`
  grid-row: 2 / span 2;
  grid-column: 5 / -1;
  justify-self: stretch;
  align-self: stretch;
`;

const ProgressBarWrapper = styled.div`
  grid-row: 3 /4;
  grid-column: 1 / span 4;
`;

const CalendarWrapper = styled.div`
  grid-column: 1 / span 4;
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
        />

        <ActionButtonWrapper>
          <HabitActionButtons
            habitID={habitID}
            didIt={didIt}
            isAnswered={isAnswered}
            variant="design-2"
          />
        </ActionButtonWrapper>

        <ProgressBarWrapper>
          <ProgressBar
            percentage={(totalPoints / FULL_POINTS) * 100}
            streak={streak}
            startValueNum={0}
            endValueNum={FULL_POINTS}
            isAchieved={isAchieved}
          />
        </ProgressBarWrapper>

        <CalendarWrapper>
          <HabitCalender
            streakFireColor={streakFireColor}
            streak={streak}
            dailyRecords={dailyRecords}
            habitID={habitID}
          />
        </CalendarWrapper>
      </GridContainer>
    </Menus>
  );
}
