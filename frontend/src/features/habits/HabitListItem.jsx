import { motion } from "framer-motion";
import styled from "styled-components";
import Row from "../../ui/Row.jsx";
import Button from "../../ui/Button.jsx";

const StyledItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: var(--color-grey-0);
  padding: 3rem;
  border: 1px solid var(--color-grey-300);
`;
const Name = styled.p`
  font-size: 2.2rem;
  font-weight: 600;
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
const Points = styled.span`
  display: inline-block;
  font-size: 1.6rem;
  line-height: 0.5;
  white-space: nowrap;
  min-width: 8ch;
  text-align: end;
`;

const BarRow = styled(Row)`
  gap: 1rem;
  flex-shrink: 0;
  margin-top: 0.8rem;
`;
const ButtonsWrapperRow = styled(Row)`
  gap: 3rem;
  flex-shrink: 0;
  margin-top: 1.4rem;
  align-items: center;
  justify-content: start;
`;
const ButtonsRow = styled(Row)`
  gap: 2rem;
`;
const ActionButton = styled(Button)`
  max-width: 100%;
  padding-inline: 3rem;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
`;
const Question = styled.p`
  font-size: 1.4rem;
  text-transform: uppercase;
  font-weight: 700;
`;

function calculateTargetPoints(currentPoints) {
  if (currentPoints < 100) {
    return 100; // Exception for points below 100
  } else {
    const roundedHundred = Math.ceil(currentPoints / 100) * 100;
    return roundedHundred;
  }
}

export default function HabitListItem({ habit }) {
  const { totalPoints, streak, name, _id: habitID, dailyRecords } = habit;
  const latestRecord = dailyRecords[dailyRecords.length - 1] || null;
  const { didIt, _id: latestRecordID } = latestRecord;
  const isAnswered = didIt !== "unanswered";
  const targetPoints = calculateTargetPoints(totalPoints);
  const barMinimumPoints = targetPoints - 100;

  return (
    <StyledItem>
      <Name>{name}</Name>

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
        <Points>
          {totalPoints} / {targetPoints}
        </Points>
      </BarRow>

      <ButtonsWrapperRow type="horizontal">
        <Question>Did you do this today?</Question>
        <ButtonsRow type="horizontal">
          <ActionButton size="small">Yes</ActionButton>
          <ActionButton size="small" $variation="secondary">
            No
          </ActionButton>
        </ButtonsRow>
      </ButtonsWrapperRow>
    </StyledItem>
  );
}
