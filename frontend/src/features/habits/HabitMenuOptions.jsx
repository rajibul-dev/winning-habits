import { HiPencil, HiTrash } from "react-icons/hi2";
import Menus from "../../ui/Menu.jsx";
import Modal from "../../ui/Modal.jsx";
import ConfirmDelete from "./ConfirmDelete.jsx";
import EditHabitForm from "./EditHabitForm.jsx";
import { IoArchive, IoArrowUndo } from "react-icons/io5";
import { RiInboxUnarchiveFill } from "react-icons/ri";
import useDeleteHabit from "./useDeleteHabit.js";
import useUpdateAction from "./useUpdateAction.js";
import useHandleArchive from "./useHandleArchive.js";

export default function HabitMenuOptions({
  habitID,
  isAnswered,
  name,
  latestRecordID,
  isArchived,
  isAchieved,
}) {
  const { updateAction, isUpdating } = useUpdateAction();
  const { handleArchive, isPending: isArchiving } = useHandleArchive();
  const { deleteHabit, isDeleting } = useDeleteHabit();

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
    <Modal>
      <Menus>
        <Menus.Toggle id={habitID} isAchieved={isAchieved} />

        <Menus.List id={habitID}>
          <Modal.Open opens="edit">
            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
          </Modal.Open>

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

          <Modal.Open opens="delete">
            <Menus.Button
              isDanger
              icon={<HiTrash />}
              onClick={() => deleteHabit(habitID)}
              disabled={isDeleting}
            >
              Delete
            </Menus.Button>
          </Modal.Open>
        </Menus.List>

        <Modal.Window name="edit">
          <EditHabitForm habitID={habitID} name={name} />
        </Modal.Window>

        <Modal.Window name="delete">
          <ConfirmDelete
            onConfirm={() => deleteHabit(habitID)}
            disabled={isDeleting}
            resourceName={`habit "${name}"`}
          />
        </Modal.Window>
      </Menus>
    </Modal>
  );
}
