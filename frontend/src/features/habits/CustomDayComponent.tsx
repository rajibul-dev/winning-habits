import {
  useState,
  type ButtonHTMLAttributes,
  type PropsWithChildren,
} from "react";
import Popover, { usePopoverManager } from "../../ui/Popover.jsx";
import styled, { css } from "styled-components";
import { isSameDay, format, isToday, isFuture } from "date-fns";
import Heading from "../../ui/Heading.jsx";
import useSingleHabit from "./useSingleHabit.js";
import Tag from "../../ui/Tag.jsx";
import Button from "../../ui/Button.jsx";
import useUpdateAction from "./useUpdateAction.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import useAddAction from "./useAddAction.js";
import { pixelToEm } from "../../styles/GlobalStyles.js";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

const SHOULD_GRAY_OUT_NON_EXISTENT_RECORD_DATE = false;

type HabitAnswer = "yes" | "no" | "unanswered";
type ButtonSize = "small" | "medium" | "large";
type ButtonVariation =
  | "primary"
  | "secondary"
  | "danger"
  | "constGrey"
  | "constRed";
type TagTone = "green" | "red" | "silver";

interface DailyRecord {
  date: string;
  didIt: HabitAnswer;
  _id: string;
  note?: string;
}

interface CustomDayComponentProps {
  date: Date;
  dailyRecords: DailyRecord[];
  habitID: string;
  onOpenNoteEditor?: (record: DailyRecord) => void;
}

interface StyledDayProps {
  $hasRecord: boolean;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  $variation?: ButtonVariation;
}

interface TagProps {
  type: TagTone;
}

interface UpdateActionVariables {
  habitID: string;
  targetRecordID?: string;
  updatedAnswer: HabitAnswer;
}

interface AddActionVariables {
  habitID: string;
  answer: Extract<HabitAnswer, "yes" | "no">;
}

interface MutationOptions {
  onSettled?: () => void;
}

const TypedButton = Button as unknown as React.ComponentType<
  PropsWithChildren<ButtonProps>
>;
const TypedTag = Tag as unknown as React.ComponentType<
  PropsWithChildren<TagProps>
>;

const tagColorBasedOnAnswer: Record<HabitAnswer, TagTone> = {
  yes: "green",
  no: "red",
  unanswered: "silver",
};

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
  gap: 1.8rem;
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
  flex-wrap: wrap;
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

const NoteActionRow = styled.div`
  display: grid;
  gap: 0.9rem;
  padding-top: 0.2rem;
`;

const NoteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  justify-self: start;
  color: var(--color-grey-600);
  font-size: var(--font-size-sm);
  font-weight: 700;

  &:hover {
    color: var(--color-grey-800);
  }

  & svg {
    width: 1.7rem;
    height: 1.7rem;
  }
`;

const NotePreview = styled.p`
  padding: 1rem 1.2rem;
  border-radius: 1.4rem;
  background-color: var(--color-grey-100);
  color: var(--color-grey-600);
  font-size: var(--font-size-sm);
  line-height: 1.55;
  white-space: pre-wrap;
`;

const EmptyState = styled.p`
  max-width: 20ch;
`;

const CustomDayComponent = ({
  date,
  dailyRecords,
  habitID,
  onOpenNoteEditor,
}: CustomDayComponentProps) => {
  const currentRecordInstence = dailyRecords.find((record) =>
    isSameDay(new Date(record.date), date),
  );
  const { data } = useSingleHabit();
  const name = data?.habit?.name || "Habit";

  const hasRecordForDate = Boolean(currentRecordInstence);
  const isTodayInstenceBeforeAnyAnswer = isToday(date);

  const { addDailyAction, isAnswering } = useAddAction() as unknown as {
    addDailyAction: (
      variables: AddActionVariables,
      options?: MutationOptions,
    ) => void;
    isAnswering: boolean;
  };
  const { updateAction, isUpdating } = useUpdateAction() as unknown as {
    updateAction: (
      variables: UpdateActionVariables,
      options?: MutationOptions,
    ) => void;
    isUpdating: boolean;
  };
  const [updatingButton, setUpdatingButton] = useState<HabitAnswer | null>(
    null,
  );
  const currentAnswer = currentRecordInstence?.didIt;
  const { close } = usePopoverManager();
  const hasNote = Boolean(currentRecordInstence?.note?.trim());

  function handleUpdateAnswer(updatedAnswer: HabitAnswer) {
    setUpdatingButton(updatedAnswer);
    updateAction(
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

  function handleAddAnswer(answer: Extract<HabitAnswer, "yes" | "no">) {
    setUpdatingButton(answer);
    addDailyAction(
      { habitID, answer },
      {
        onSettled: () => {
          setUpdatingButton(null);
          close();
        },
      },
    );
  }

  function handleOpenNoteModal() {
    if (!currentRecordInstence) return;

    close();
    window.setTimeout(() => {
      onOpenNoteEditor?.(currentRecordInstence);
    }, 0);
  }

  return (
    <Popover placementX="center" placementY="top" triggerType="click">
      <Popover.Trigger id={date.getDate()}>
        <StyledDay $hasRecord={hasRecordForDate}>{date.getDate()}</StyledDay>
      </Popover.Trigger>

      <Popover.Content id={date.getDate()} isTopOfHeader={false}>
        {hasRecordForDate ? (
          <UpdateAnswerContainerGrid>
            <HeadingRow>
              <Heading as="h3">
                {name} on {format(date, "MMM dd, yyyy")}
              </Heading>
              <TypedTag
                type={
                  tagColorBasedOnAnswer[
                    currentRecordInstence?.didIt ?? "unanswered"
                  ]
                }
              >
                {currentRecordInstence?.didIt ?? ""}
              </TypedTag>
            </HeadingRow>
            <ActionRow>
              <UpdateAnswerP>Update your answer:</UpdateAnswerP>
              <ButtonsWrapper>
                {currentAnswer !== "yes" && (
                  <TypedButton
                    onClick={() => handleUpdateAnswer("yes")}
                    size="medium"
                  >
                    {updatingButton === "yes" && <SpinnerMini />}
                    Yes
                  </TypedButton>
                )}

                {currentAnswer !== "unanswered" && (
                  <TypedButton
                    onClick={() => handleUpdateAnswer("unanswered")}
                    size="medium"
                    $variation="constGrey"
                  >
                    {updatingButton === "unanswered" && <SpinnerMini />}
                    Unanswered
                  </TypedButton>
                )}

                {currentAnswer !== "no" && (
                  <TypedButton
                    onClick={() => handleUpdateAnswer("no")}
                    size="medium"
                    $variation="constRed"
                  >
                    {updatingButton === "no" && <SpinnerMini />}
                    No
                  </TypedButton>
                )}
              </ButtonsWrapper>
            </ActionRow>

            <NoteActionRow>
              <NoteButton type="button" onClick={handleOpenNoteModal}>
                {hasNote ? (
                  <HiOutlinePencilSquare />
                ) : (
                  <HiOutlineChatBubbleBottomCenterText />
                )}
                <span>{hasNote ? "Edit note" : "Add note"}</span>
              </NoteButton>

              {hasNote ? (
                <NotePreview>{currentRecordInstence?.note}</NotePreview>
              ) : null}
            </NoteActionRow>
          </UpdateAnswerContainerGrid>
        ) : isTodayInstenceBeforeAnyAnswer ? (
          <UpdateAnswerContainerGrid>
            <HeadingRow>
              <Heading as="h3">{name} today?</Heading>
              <TypedTag
                type={
                  tagColorBasedOnAnswer[
                    currentRecordInstence?.didIt ?? "unanswered"
                  ]
                }
              >
                {currentRecordInstence?.didIt ?? ""}
              </TypedTag>
            </HeadingRow>
            <ActionRow>
              <UpdateAnswerP>Add your answer:</UpdateAnswerP>
              <ButtonsWrapper>
                <TypedButton
                  disabled={
                    isUpdating || isAnswering || currentAnswer === "yes"
                  }
                  onClick={() => handleAddAnswer("yes")}
                  size="medium"
                >
                  {updatingButton === "yes" && <SpinnerMini />}
                  Yes
                </TypedButton>
                <TypedButton
                  onClick={() => handleAddAnswer("no")}
                  size="medium"
                  $variation="constRed"
                  disabled={isUpdating || isAnswering || currentAnswer === "no"}
                >
                  {updatingButton === "no" && <SpinnerMini />}
                  No
                </TypedButton>
              </ButtonsWrapper>
            </ActionRow>
          </UpdateAnswerContainerGrid>
        ) : (
          <EmptyState>
            {isFuture(date)
              ? "This date is in the future."
              : "The date is 60 days prior to this habit's creation. That's outside the time leaping threshold."}
          </EmptyState>
        )}
      </Popover.Content>
    </Popover>
  );
};

export default CustomDayComponent;
