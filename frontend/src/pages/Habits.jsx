import Heading from "../ui/Heading.jsx";
import HabitList from "../features/habits/HabitList.jsx";
import Button from "../ui/Button.jsx";
import Modal from "../ui/Modal.jsx";
import CreateHabitForm from "../features/habits/CreateHabitForm.jsx";
import styled from "styled-components";
import { fixedButtonIndex } from "../styles/zIndexManager.js";
import { pixelToEm } from "../styles/GlobalStyles.js";
import { FaPlus } from "react-icons/fa";

const FixedBottomRightButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  position: fixed;
  z-index: ${fixedButtonIndex};
  bottom: 6rem;
  right: 6rem;
  padding-top: 2rem;
  padding-bottom: 2.3rem;
  filter: drop-shadow(var(--shadow-md));
  border-radius: 14px;

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }

  & span,
  & svg {
    transform: translateY(-1px);
  }

  @media (max-width: ${pixelToEm(700)}) {
    padding-top: 2.4rem;
    padding-bottom: 2.7rem;
    bottom: 12.5rem;
    right: 3rem;
  }
`;

export default function Habits() {
  return (
    <>
      <Heading>Habits</Heading>
      <HabitList />
      <Modal>
        <Modal.Open opens="create-habit">
          <FixedBottomRightButton size="large">
            <FaPlus />
            <span>Create Habit</span>
          </FixedBottomRightButton>
        </Modal.Open>
        <Modal.Window name="create-habit">
          <CreateHabitForm />
        </Modal.Window>
      </Modal>
    </>
  );
}
