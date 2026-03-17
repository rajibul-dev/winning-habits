import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import Heading from "../../ui/Heading.jsx";
import Modal from "../../ui/Modal.jsx";
import Tag from "../../ui/Tag.jsx";
import Button from "../../ui/Button.jsx";
import DailyRecordNoteForm from "./DailyRecordNoteForm.jsx";
import { pixelToEm } from "../../styles/GlobalStyles.js";
import useViewportLessThan from "../../hooks/useViewportLessThan.js";

const MOBILE_INITIAL_NOTES = 6;
const MOBILE_LOAD_STEP = 6;
const DESKTOP_INITIAL_NOTES = 16;
const DESKTOP_LOAD_STEP = 12;

const Panel = styled.section`
  display: grid;
  grid-template-rows: auto 1fr;
  overflow-y: auto;
  max-height: 37.75rem;
  padding: 2rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 2.6rem;
  background: radial-gradient(
      circle at top right,
      var(--habit-brand-tint),
      transparent 30%
    ),
    var(--color-grey-0);
  box-shadow: var(--shadow-sm);

  @media (max-width: ${pixelToEm(900)}) {
    height: auto;
    overflow: visible;
  }

  @media (max-width: ${pixelToEm(500)}) {
    padding: 1.8rem;
    border-radius: 2rem;
  }

  @media (max-width: ${pixelToEm(400)}) {
    border-bottom: none;
    box-shadow: none;
    padding-bottom: 0;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1.4rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
  min-height: 3rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background-color: var(--color-grey-100);
  color: var(--color-grey-700);
  font-size: var(--font-size-sm);
  font-weight: 700;
`;

const EmptyState = styled.p`
  margin-top: 1.6rem;
  color: var(--color-grey-500);
  line-height: 1.6;
`;

const NotesBody = styled.div`
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
`;

const NotesScroller = styled.div`
  min-height: 0;
  overflow-y: auto;
  padding-top: 1.6rem;
  padding-right: 0.6rem;
  margin-right: -0.6rem;

  @media (max-width: ${pixelToEm(900)}) {
    overflow: visible;
    padding-right: 0;
    margin-right: 0;
  }
`;

const NotesList = styled.ul`
  display: grid;
  gap: 1.2rem;
`;

const NoteItem = styled.li`
  display: grid;
  gap: 1rem;
  padding: 1.4rem;
  border: 1px solid var(--habit-surface-border-soft);
  border-radius: 1.8rem;
  background-color: var(--habit-surface-soft);
`;

const NoteHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
`;

const Meta = styled.div`
  display: grid;
  gap: 0.6rem;
`;

const NoteDate = styled.p`
  color: var(--color-grey-800);
  font-size: var(--font-size-base);
  font-weight: 700;
`;

const NoteBody = styled.p`
  color: var(--color-grey-600);
  line-height: 1.6;
  white-space: pre-wrap;
`;

const EditButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 3.8rem;
  height: 3.8rem;
  border-radius: 1.2rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  color: var(--color-grey-600);
  transition:
    background-color 0.2s,
    color 0.2s,
    transform 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
    color: var(--color-grey-800);
    transform: translateY(-1px);
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 1.4rem;
  margin-top: 1.4rem;
  border-top: 1px solid var(--color-grey-200);
`;

const statusTagType = {
  yes: "green",
  no: "red",
  unanswered: "silver",
};

export default function DailyRecordNotesPanel({ habitID, dailyRecords }) {
  const isCompactLayout = useViewportLessThan(900);

  const noteRecords = useMemo(
    () =>
      [...(dailyRecords || [])]
        .filter((record) => record.note?.trim())
        .sort(
          (recordA, recordB) => new Date(recordB.date) - new Date(recordA.date),
        ),
    [dailyRecords],
  );

  const initialVisibleCount = isCompactLayout
    ? MOBILE_INITIAL_NOTES
    : DESKTOP_INITIAL_NOTES;
  const loadStep = isCompactLayout ? MOBILE_LOAD_STEP : DESKTOP_LOAD_STEP;

  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  useEffect(() => {
    setVisibleCount(initialVisibleCount);
  }, [initialVisibleCount, noteRecords.length]);

  const visibleNotes = noteRecords.slice(0, visibleCount);
  const hasMoreNotes = visibleCount < noteRecords.length;

  return (
    <Panel>
      <Header>
        <Heading as="h3">Daily notes</Heading>
        <CountBadge>{noteRecords.length}</CountBadge>
      </Header>

      {noteRecords.length ? (
        <NotesBody>
          <NotesScroller>
            <NotesList>
              {visibleNotes.map((record) => {
                const windowName = `edit-note-${record._id}`;

                return (
                  <NoteItem key={record._id}>
                    <NoteHeader>
                      <Meta>
                        <NoteDate>
                          {format(new Date(record.date), "MMM dd, yyyy")}
                        </NoteDate>
                        <Tag type={statusTagType[record.didIt] || "silver"}>
                          {record.didIt}
                        </Tag>
                      </Meta>

                      <Modal>
                        <Modal.Open opens={windowName}>
                          <EditButton type="button" aria-label="Edit note">
                            <HiOutlinePencilSquare />
                          </EditButton>
                        </Modal.Open>
                        <Modal.Window name={windowName}>
                          <DailyRecordNoteForm
                            habitID={habitID}
                            targetRecord={record}
                          />
                        </Modal.Window>
                      </Modal>
                    </NoteHeader>

                    <NoteBody>{record.note}</NoteBody>
                  </NoteItem>
                );
              })}
            </NotesList>
          </NotesScroller>

          {hasMoreNotes ? (
            <Footer>
              <Button
                type="button"
                size="medium"
                $variation="secondary"
                onClick={() => setVisibleCount((count) => count + loadStep)}
              >
                Show {Math.min(loadStep, noteRecords.length - visibleCount)}{" "}
                more
              </Button>
            </Footer>
          ) : null}
        </NotesBody>
      ) : (
        <EmptyState>
          Notes you add from the calendar will show up here. On desktop this
          rail keeps them visible without pushing the calendar around.
        </EmptyState>
      )}
    </Panel>
  );
}
