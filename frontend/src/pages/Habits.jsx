import Heading from "../ui/Heading.jsx";
import HabitList from "../features/habits/HabitList.jsx";
import Button from "../ui/Button.jsx";
import Modal from "../ui/Modal.jsx";
import CreateHabitForm from "../features/habits/CreateHabitForm.jsx";

export default function Habits() {
  return (
    <>
      <Heading>Habits</Heading>
      <HabitList />
      <Modal>
        <Modal.Open opens="create-habit">
          <Button>Create Habit</Button>
        </Modal.Open>
        <Modal.Window name="create-habit">
          <CreateHabitForm />
        </Modal.Window>
      </Modal>
    </>
  );
}
