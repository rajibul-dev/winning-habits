import { motion } from "framer-motion";
import styled, { css } from "styled-components";
import Row from "../../ui/Row.jsx";
import Button from "../../ui/Button.jsx";
import useAddAction from "./useAddAction.js";
import { IoIosArrowForward } from "react-icons/io";
import SevenDayActionView from "./SevenDayActionView.jsx";

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

const ProgressBar = styled.div`
  height: 2rem;
  background-color: var(--color-grey-200);
  position: relative;
  border-radius: var(--border-radius-lg);
  width: 100%;
`;

const ProgressValue = styled(motion.span)`
  display: inline-block;
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: var(--border-radius-lg);
  background-color: grey;
`;

const BottomRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
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
  color: var(--color-grey-500);
`;

const NumericValueLabel = styled.span`
  display: inline-block;
  font-size: 1.2rem;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--color-grey-400);
  letter-spacing: 1pt;
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
  font-size: 2.4rem;
  text-transform: uppercase;
  text-align: center;
  padding: 0.2rem;
  font-weight: 500;

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
          color: var(--color-red-700);
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
  const { totalPoints, streak, name, _id: habitID, dailyRecords } = habit;
  const latestRecord = dailyRecords[dailyRecords.length - 1] || null;
  const { didIt, _id: latestRecordID } = latestRecord || false;
  const isAnswered = didIt !== "unanswered";
  const targetPoints = calculateTargetPoints(totalPoints);
  const barMinimumPoints = targetPoints - 100;
  const streakFireLit = streak >= 3;
  const { addDailyAction, isAnswering } = useAddAction();
  const sevenDayViewObj = prepareLastSevenDayView(dailyRecords);

  function handleAnswer(answer) {
    addDailyAction({ habitID, answer });
  }

  return (
    <StyledItem>
      <TopRow type="horizontal">
        <Name>{name}</Name>
        <IoIosArrowForward
          style={{
            fontSize: `2rem`,
            color: `var(--color-grey-400)`,
          }}
        />
      </TopRow>

      <BarRow type="horizontal">
        <ProgressBar>
          <ProgressValue
            initial={{
              width: 0,
            }}
            animate={{
              width: `${((totalPoints - barMinimumPoints) / (targetPoints - barMinimumPoints)) * 100}%`,
            }}
          />
        </ProgressBar>
      </BarRow>

      <BottomRow type="horizontal">
        <CoolNumericDisplayWrapper>
          <Points>{totalPoints}</Points>
          <NumericValueLabel>Points</NumericValueLabel>
        </CoolNumericDisplayWrapper>
        <SevenDayActionView actions={sevenDayViewObj} />
        <QuestionWrapper>
          <Question>Did you do this today?</Question>
          {!isAnswered ? (
            <ButtonsRow type="horizontal">
              <ActionButton onClick={() => handleAnswer("yes")}>
                Yes
              </ActionButton>
              <ActionButton onClick={() => handleAnswer("no")}>No</ActionButton>
            </ButtonsRow>
          ) : (
            <Answer $didIt={didIt}>{didIt}</Answer>
          )}
        </QuestionWrapper>
      </BottomRow>
    </StyledItem>
  );
}
