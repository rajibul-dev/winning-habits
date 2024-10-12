import Popover, { usePopoverManager } from "../../ui/Popover.jsx";
import styled, { css } from "styled-components";
import { isSameDay, format, isToday } from "date-fns";
import Heading from "../../ui/Heading.jsx";
import useSingleHabit from "./useSingleHabit.js";
import Tag from "../../ui/Tag.jsx";
import Button from "../../ui/Button.jsx";
import useUpdateAction from "./useUpdateAction.js";
import { useState } from "react";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import useAddAction from "./useAddAction.js";
import { pixelToEm } from "../../styles/GlobalStyles.js";

const SHOULD_GRAY_OUT_NON_EXISTENT_RECORD_DATE = false;

interface CustomDayComponentProps {
  date: any;
  dailyRecords: Array<{
    date: string;
    didIt: "yes" | "no" | "unanswered";
    _id: string;
  }>;
  habitID: any;
}

interface StyledDayProps {
  $hasRecord: boolean;
}

export interface TagProps {
  type: "green" | "red" | "silver";
}

// @ts-ignore
const StyledDay = styled.span<StyledDayProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  ${({ $hasRecord }) =>
    SHOULD_GRAY_OUT_NON_EXISTENT_RECORD_DATE &&
    !$hasRecord &&
    css`
      color: var(--color-grey-500);
    `}
`;

const UpdateAnswerContainerGrid = styled.div`
  display: grid;
  gap: 2rem;
  max-width: 40rem;

  @media (max-width: ${pixelToEm(500)}) {
    padding: 1.2rem;
    max-width: 35rem;
  }
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const UpdateAnswerP = styled.p`
  margin-bottom: 0.6rem;
  @media (max-width: ${pixelToEm(500)}) {
    font-size: var(--font-size-base);
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: stretch;
  justify-content: space-between;

  @media (max-width: ${pixelToEm(500)}) {
    gap: 1.2rem;
  }

  & button {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
`;

const tagColorBasedOnAnswer: Record<string, "green" | "red" | "silver"> = {
  yes: "green",
  no: "red",
  unanswered: "silver",
};

const CustomDayComponent: React.FC<CustomDayComponentProps> = ({
  date,
  dailyRecords,
  habitID,
}) => {
  const currentRecordInstence = dailyRecords.find((record: any) =>
    isSameDay(new Date(record.date), date),
  );
  const { data } = useSingleHabit();
  const { name } = data.habit;

  const hasRecordForDate = Boolean(currentRecordInstence);
  const isTodayInstenceBeforeAnyAnswer = isToday(date);

  const { addDailyAction } = useAddAction();

  const { updateAction, isUpdating } = useUpdateAction();
  const [updatingButton, setUpdatingButton] = useState<string | null>(null);
  const currentAnswer = currentRecordInstence?.didIt;
  const { close } = usePopoverManager();

  function handleUpdateAnswer(updatedAnswer: string) {
    setUpdatingButton(updatedAnswer);
    // @ts-ignore
    updateAction(
      // @ts-ignore
      {
        habitID,
        targetRecordID: currentRecordInstence?._id,
        updatedAnswer,
      },
      {
        onSettled: () => {
          setUpdatingButton(null);
          close();
        },
      },
    );
  }
  function handleAddAnswer(answer: string) {
    setUpdatingButton(answer);
    addDailyAction(
      // @ts-ignore
      { habitID, answer },
      {
        onSettled: () => {
          setUpdatingButton(null);
          close();
        },
      },
    );
  }

  return (
    <Popover
      placementX={"center" as string}
      placementY={"top" as string}
      triggerType={"click" as string}
    >
      <Popover.Trigger id={date.getDate() as number}>
        <StyledDay $hasRecord={hasRecordForDate}>{date.getDate()}</StyledDay>
      </Popover.Trigger>

      {/* @ts-ignore */}
      <Popover.Content id={date.getDate() as number}>
        {hasRecordForDate ? (
          <UpdateAnswerContainerGrid>
            <HeadingRow>
              <Heading as="h3">
                {name} on {format(date, "MMM dd, yyyy")}
              </Heading>
              <Tag
                // @ts-ignore
                type={
                  // @ts-ignore
                  tagColorBasedOnAnswer[
                    currentRecordInstence?.didIt ?? "silver"
                  ] as "green" | "red" | "silver"
                }
              >
                {currentRecordInstence?.didIt ?? ""}
              </Tag>
            </HeadingRow>
            <ActionRow>
              <UpdateAnswerP>Update your answer:</UpdateAnswerP>
              <ButtonsWrapper>
                <Button
                  disabled={isUpdating || currentAnswer === "yes"}
                  onClick={() => handleUpdateAnswer("yes")}
                  // @ts-ignore
                  size="medium"
                >
                  {updatingButton === "yes" && (
                    <>
                      <SpinnerMini />{" "}
                    </>
                  )}
                  Yes
                </Button>
                <Button
                  onClick={() => handleUpdateAnswer("unanswered")}
                  // @ts-ignore
                  size="medium"
                  $variation="constGrey"
                  disabled={isUpdating || currentAnswer === "unanswered"}
                >
                  {updatingButton === "unanswered" && (
                    <>
                      <SpinnerMini />{" "}
                    </>
                  )}
                  Unanswered
                </Button>

                <Button
                  onClick={() => handleUpdateAnswer("no")}
                  // @ts-ignore
                  size="medium"
                  $variation="constRed"
                  disabled={isUpdating || currentAnswer === "no"}
                >
                  {updatingButton === "no" && (
                    <>
                      <SpinnerMini />{" "}
                    </>
                  )}
                  No
                </Button>
              </ButtonsWrapper>
            </ActionRow>
          </UpdateAnswerContainerGrid>
        ) : isTodayInstenceBeforeAnyAnswer ? (
          <UpdateAnswerContainerGrid>
            <HeadingRow>
              <Heading as="h3">{name} today?</Heading>
              <Tag
                // @ts-ignore
                type={
                  // @ts-ignore
                  tagColorBasedOnAnswer[
                    currentRecordInstence?.didIt ?? "silver"
                  ] as "green" | "red" | "silver"
                }
              >
                {currentRecordInstence?.didIt ?? ""}
              </Tag>
            </HeadingRow>
            <ActionRow>
              <UpdateAnswerP>Add your answer:</UpdateAnswerP>
              <ButtonsWrapper>
                <Button
                  disabled={isUpdating || currentAnswer === "yes"}
                  // @ts-ignore
                  onClick={() => handleAddAnswer("yes")}
                  // @ts-ignore
                  size="medium"
                >
                  {updatingButton === "yes" && (
                    <>
                      <SpinnerMini />{" "}
                    </>
                  )}
                  Yes
                </Button>
                <Button
                  onClick={() => handleAddAnswer("no")}
                  // @ts-ignore
                  size="medium"
                  $variation="constRed"
                  disabled={isUpdating || currentAnswer === "no"}
                >
                  {updatingButton === "no" && (
                    <>
                      <SpinnerMini />{" "}
                    </>
                  )}
                  No
                </Button>
              </ButtonsWrapper>
            </ActionRow>
          </UpdateAnswerContainerGrid>
        ) : (
          <p>You can't access this date</p>
        )}
      </Popover.Content>
    </Popover>
  );
};

export default CustomDayComponent;
