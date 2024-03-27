import { motion } from "framer-motion";
import styled, { css } from "styled-components";
import Row from "../../ui/Row.jsx";
import Button from "../../ui/Button.jsx";
import useAddAction from "./useAddAction.js";
import SevenDayActionView from "./SevenDayActionView.jsx";
import Menus from "../../ui/Menu.jsx";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { IoArchive, IoArrowUndo } from "react-icons/io5";
import useUpdateAction from "./useUpdateAction.js";
import useHandleArchive from "./useHandleArchive.js";
import { RiInboxUnarchiveFill } from "react-icons/ri";
import useDeleteHabit from "./useDeleteHabit.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import { capitalizeString } from "../../utils/capitalizeString.js";

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
  const { updateAction, isUpdating } = useUpdateAction();
  const { handleArchive, isPending: isArchiving } = useHandleArchive();
  const { deleteHabit, isDeleting } = useDeleteHabit();
  const sevenDayViewObj = prepareLastSevenDayView(dailyRecords);

  function handleAnswer(answer) {
    addDailyAction({ habitID, answer });
  }

  function handleUnAnswer() {
    updateAction({
      habitID,
      targetRecordID: latestRecordID,
      updatedAnswer: "unanswered",
    });
  }

  function onHandleArchive() {
    handleArchive({ id: habitID, isArchive: !isArchived });
  }

  return (
    <StyledItem>
      <TopRow type="horizontal">
        <Name>{name}</Name>
        <Menus.Menu>
          <Menus.Toggle id={habitID} />

          <Menus.List id={habitID}>
            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>

            {isAnswered && (
              <Menus.Button
                icon={<IoArrowUndo />}
                onClick={handleUnAnswer}
                disabled={isUpdating}
              >
                Un-answer
              </Menus.Button>
            )}

            <Menus.Button
              icon={!isArchived ? <IoArchive /> : <RiInboxUnarchiveFill />}
              onClick={onHandleArchive}
              disabled={isArchiving}
            >
              {!isArchived ? "Archive" : "Unarchive"}
            </Menus.Button>

            <Menus.Button
              icon={<HiTrash />}
              onClick={() => deleteHabit(habitID)}
              disabled={isDeleting}
            >
              Delete
            </Menus.Button>
          </Menus.List>
        </Menus.Menu>
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
          <NumericValueLabel>
            Point{totalPoints !== 1 ? "s" : ""}
          </NumericValueLabel>
        </CoolNumericDisplayWrapper>
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
