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

const FULL_POINTS = 1000;

const GoBackLink = styled(Link)``;

const StyledHeading = styled(Heading)`
  display: flex;
  align-items: center;
  gap: 1rem;

  & svg {
    display: inline-block;
    width: 3.4rem;
    height: 3.4rem;
    cursor: pointer;
    &:hover {
      background-color: var(--color-grey-200);
    }
  }
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

  const { name, totalPoints, streak } = data.habit;

  const streakFireColor = streakColor(streak);

  return (
    <>
      <StyledHeading>
        <IoArrowBack onClick={() => navigate(-1)} />
        {name}
      </StyledHeading>

      <StatsRow type="horizontal">
        <StatCard
          icon={<IoSparkles color="var(--color-yellow-400)" />}
          value={totalPoints}
          label="Points"
        />
        <StatCard
          icon={<PiFireSimpleFill color={streakFireColor} />}
          value={streak}
          label="Day streak"
        />
      </StatsRow>

      <ProgressBarRow>
        <ProgressBar
          percentage={(totalPoints / FULL_POINTS) * 100}
          startValueNum={0}
          endValueNum={FULL_POINTS}
        />
      </ProgressBarRow>
    </>
  );
}
