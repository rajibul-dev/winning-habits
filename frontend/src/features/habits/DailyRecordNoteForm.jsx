import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import Heading from "../../ui/Heading.jsx";
import Button from "../../ui/Button.jsx";
import Tag from "../../ui/Tag.jsx";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import { pixelToEm } from "../../styles/GlobalStyles.js";
import useUpsertDailyRecordNote from "./useUpsertDailyRecordNote.js";

const NOTE_MAX_LENGTH = 800;

const Wrapper = styled.form`
  display: grid;
  gap: 1.8rem;
  width: min(100%, 48rem);
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const HelperText = styled.p`
  color: var(--color-grey-500);
  line-height: 1.5;
`;

const Textarea = styled.textarea`
  min-height: 16rem;
  width: 100%;
  resize: vertical;
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: 1.6rem;
  padding: 1.4rem 1.6rem;
  box-shadow: var(--shadow-sm);
  line-height: 1.6;
  cursor: text;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const CountText = styled.span`
  color: var(--color-grey-500);
  font-size: var(--font-size-sm);
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: ${pixelToEm(500)}) {
    & > button {
      width: 100%;
      justify-content: center;
    }
  }
`;

const statusTagType = {
  yes: "green",
  no: "red",
  unanswered: "silver",
};

export default function DailyRecordNoteForm({
  habitID,
  targetRecord,
  onCloseModal,
}) {
  const [note, setNote] = useState(targetRecord?.note || "");
  const { saveDailyRecordNote, isSavingNote } = useUpsertDailyRecordNote();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!targetRecord?._id) return undefined;

    const focusTimer = window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusTimer);
    };
  }, [targetRecord?._id]);

  useEffect(() => {
    setNote(targetRecord?.note || "");
  }, [targetRecord?._id, targetRecord?.note]);

  if (!targetRecord?._id) return null;

  const trimmedNote = note.trim();
  const initialTrimmedNote = (targetRecord.note || "").trim();
  const isUnchanged = trimmedNote === initialTrimmedNote;
  const isExistingNote = Boolean(initialTrimmedNote);

  function handleSubmit(e) {
    e.preventDefault();

    if (isUnchanged) {
      onCloseModal?.();
      return;
    }

    saveDailyRecordNote(
      {
        habitID,
        targetRecordID: targetRecord._id,
        note: trimmedNote,
      },
      {
        onSuccess: () => onCloseModal?.(),
      },
    );
  }

  function handleRemoveNote() {
    saveDailyRecordNote(
      {
        habitID,
        targetRecordID: targetRecord._id,
        note: "",
      },
      {
        onSuccess: () => onCloseModal?.(),
      },
    );
  }

  function stopEventPropagation(e) {
    e.stopPropagation();
  }

  return (
    <Wrapper onSubmit={handleSubmit} onClick={stopEventPropagation}>
      <HeadingRow>
        <Heading as="h3">
          {format(new Date(targetRecord.date), "MMM dd, yyyy")}
        </Heading>
        <Tag type={statusTagType[targetRecord.didIt] || "silver"}>
          {targetRecord.didIt}
        </Tag>
      </HeadingRow>

      <HelperText>
        Add a short note about what happened that day. This can be useful
        context for missed days, wins, or anything you want to remember later.
      </HelperText>

      <Textarea
        ref={textareaRef}
        autoFocus
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onClick={stopEventPropagation}
        maxLength={NOTE_MAX_LENGTH}
        placeholder="What happened this day?"
      />

      <MetaRow>
        <CountText>
          {trimmedNote.length}/{NOTE_MAX_LENGTH} characters
        </CountText>
      </MetaRow>

      <ActionsRow>
        {isExistingNote ? (
          <Button
            type="button"
            $variation="danger"
            size="medium"
            onClick={handleRemoveNote}
            disabled={isSavingNote}
          >
            {isSavingNote && !trimmedNote ? <SpinnerMini /> : "Remove note"}
          </Button>
        ) : null}

        <Button
          type="button"
          $variation="secondary"
          size="medium"
          onClick={() => onCloseModal?.()}
          disabled={isSavingNote}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          size="medium"
          disabled={isSavingNote || isUnchanged}
        >
          {isSavingNote ? (
            <SpinnerMini />
          ) : isExistingNote ? (
            "Save note"
          ) : (
            "Add note"
          )}
        </Button>
      </ActionsRow>
    </Wrapper>
  );
}
