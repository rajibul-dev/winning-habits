import styled, { css } from "styled-components";
import Row from "../../ui/Row.jsx";
import Button from "../../ui/Button.jsx";
import useAddAction from "./useAddAction.js";
import SevenDayActionView from "./SevenDayActionView.jsx";
import useUpdateAction from "./useUpdateAction.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import { capitalizeString } from "../../utils/capitalizeString.js";
import { PiFireSimpleFill } from "react-icons/pi";
import HabitMenuOptions from "./HabitMenuOptions.jsx";
import ProgressBar from "../../ui/ProgressBar.jsx";

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

const CoolNumericDisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
`;

const Points = styled.span`
  display: inline-block;
  font-size: 6.4rem;
  white-space: nowrap;
  line-height: 1;
  font-weight: 500;
  color: var(--color-grey-700);
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

const NumericValueLabel = styled.span`
  display: inline-block;
  font-size: 1.2rem;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--color-grey-600);
  letter-spacing: 0.5pt;
`;

const ButtonsRow = styled(Row)`
  gap: 2rem;
  flex-grow: 1;
`;

const QuestionWrapper = styled(Row)``;

const Question = styled.p`
  font-size: 1.4rem;
  text-transform: uppercase;
  font-weight: 700;
`;

const ActionButton = styled(Button)`
  text-transform: uppercase;
  max-width: 100%;
  padding: 1.3rem 2rem;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  width: 100%;
`;

const Answer = styled.span`
  display: inline-block;
  font-size: 1.6rem;
  padding: 0.2rem 1rem;
  font-weight: 500;
  text-align: center;

  ${(props) =>
    props.$didIt === "yes"
      ? css`
          background-color: var(--color-green-100);
          border: 1px solid var(--color-green-700);
          color: var(--color-green-700);
        `
      : css`
          background-color: var(--color-red-100);
          border: 1px solid var(--color-red-700);
          color: var(--color-red-800);
        `}
`;

function calculateTargetPoints(currentPoints) {
  if (currentPoints < 100) {
    return 100;
  } else {
    const roundedHundred = Math.ceil(currentPoints / 100) * 100;
    return roundedHundred;
  }
}

function prepareLastSevenDayView(dailyRecords) {
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const result = [];

  // Get today's date and weekday for reference
  const today = new Date();

  // Populate the result array
  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);

    const date = targetDate.getDate();
    const weekdayIndex = targetDate.getDay();

    const didIt = dailyRecords[i]
      ? dailyRecords[i].didIt === "yes"
        ? true
        : dailyRecords[i].didIt === "no"
          ? false
          : null
      : null;

    result.push({
      weekday: daysOfWeek[weekdayIndex],
      didIt,
      date,
    });
  }

  return result.reverse();
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
  const streakFireLit = streak >= 3;
  const { addDailyAction, isAnswering } = useAddAction();
  const { isUpdating } = useUpdateAction();

  const sevenDayViewObj = prepareLastSevenDayView(dailyRecords);

  function handleAnswer(answer) {
    addDailyAction({ habitID, answer });
  }

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
        <CoolNumericDisplayWrapper>
          <Points>{totalPoints}</Points>
          <NumericValueLabel>
            Point{totalPoints !== 1 ? "s" : ""}
          </NumericValueLabel>
        </CoolNumericDisplayWrapper>

        <Streak answer={didIt}>
          <span>{streak}</span>
          <PiFireSimpleFill />
        </Streak>

        <SevenDayActionView actions={sevenDayViewObj} />
        <QuestionWrapper>
          <Question>Did you do this today?</Question>

          {!isAnswered && !isAnswering && !isUpdating && (
            <ButtonsRow type="horizontal">
              <ActionButton
                onClick={() => handleAnswer("yes")}
                disabled={isAnswering}
              >
                Yes
              </ActionButton>
              <ActionButton
                $variation="constGrey"
                onClick={() => handleAnswer("no")}
                disabled={isAnswering}
              >
                No
              </ActionButton>
            </ButtonsRow>
          )}

          {isAnswered && !isUpdating && (
            <Answer $didIt={didIt}>
              {capitalizeString(didIt)},{" "}
              {didIt === "yes" ? "you did it!" : "you didn't."}
            </Answer>
          )}

          {(isAnswering || isUpdating) && <SpinnerMiniCenter />}
        </QuestionWrapper>
      </BottomRow>
    </StyledItem>
  );
}

const SpinnerMiniCenter = styled(SpinnerMini)`
  text-align: center;
  margin-inline: auto;
`;
