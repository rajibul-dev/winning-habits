import { Link, useNavigate } from "react-router-dom";
import Empty from "../../ui/Empty.jsx";
import Heading from "../../ui/Heading.jsx";
import Spinner from "../../ui/Spinner.jsx";
import useSingleHabit from "./useSingleHabit.js";
import styled from "styled-components";
import Button from "../../ui/Button.jsx";
import { IoArrowBack, IoSparkles } from "react-icons/io5";
import Row from "../../ui/Row.jsx";
import ProgressBar from "../../ui/ProgressBar.jsx";
import StatCard from "../../ui/StatCard.jsx";
import { PiFireSimpleFill } from "react-icons/pi";
import streakColor from "./streakColor.js";
import HabitMenuOptions from "./HabitMenuOptions.jsx";
import Menus from "../../ui/Menu.jsx";
import HabitActionButtons from "./HabitActionButtons.jsx";

const FULL_POINTS = 1000;

const GoBackLink = styled(Link)``;

const TopRow = styled(Row)`
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

const ContentColumn = styled(Row)`
  gap: 4rem;
`;
const SettingsColumn = styled(Row)``;
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.7fr 1fr;
`;

const ActionButtonWrapper = styled.div`
  margin-left: auto;
`;

const StyledHeading = styled(Heading)`
  margin-right: auto;
`;

const ProgressBarRow = styled(Row)``;

const StatsRow = styled(Row)`
  justify-content: start;
  gap: 3rem;
`;

export default function SingleHabitFeature() {
  const { data, isLoading, error } = useSingleHabit();
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

  const streakFireColor = streakColor(streak);

  return (
    <Menus>
      <TopRow type="horizontal">
        <IoArrowBack className="back-btn" onClick={() => navigate(-1)} />
        <StyledHeading>{name}</StyledHeading>
        <HabitMenuOptions
          habitID={habitID}
          isAnswered={isAnswered}
          name={name}
          latestRecordID={latestRecordID}
          isArchived={isArchived}
        />
      </TopRow>

      <GridWrapper type="horizontal">
        <ContentColumn>
          <StatsRow type="horizontal">
            <StatCard
              icon={<IoSparkles color="var(--color-yellow-400)" />}
              value={totalPoints}
              label="Points"
            />
            <StatCard
              icon={
                <PiFireSimpleFill
                  color={isAnswered ? streakFireColor : `var(--color-grey-300)`}
                />
              }
              value={streak}
              label="Day streak"
            />
            <ActionButtonWrapper>
              <HabitActionButtons
                habitID={habitID}
                didIt={didIt}
                isAnswered={isAnswered}
              />
            </ActionButtonWrapper>
          </StatsRow>
          <ProgressBarRow>
            <ProgressBar
              percentage={(totalPoints / FULL_POINTS) * 100}
              startValueNum={0}
              endValueNum={FULL_POINTS}
            />
          </ProgressBarRow>
        </ContentColumn>
        <SettingsColumn></SettingsColumn>
      </GridWrapper>
    </Menus>
  );
}
