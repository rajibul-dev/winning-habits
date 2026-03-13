import styled from "styled-components";
import { MdDeleteForever } from "react-icons/md";
import Button from "../../ui/Button.jsx";
import Heading from "../../ui/Heading.jsx";
import Modal from "../../ui/Modal.jsx";
import ConfirmDelete from "../habits/ConfirmDelete.jsx";
import useDeleteAccount from "./useDeleteAccount.js";
import useIsMobile from "../../hooks/useIsMobile.js";
import { pixelToEm } from "../../styles/GlobalStyles.js";

const Section = styled.section`
  display: grid;
  gap: 1.6rem;
  padding: 2.4rem 4rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-red-400);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);

  @media (max-width: ${pixelToEm(432)}) {
    padding: 2.4rem 2rem;
  }
`;

const Copy = styled.p`
  color: var(--color-grey-500);
  max-width: 60ch;
`;

const DeleteButton = styled(Button)`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
`;

export default function DeleteAccountSection() {
  const { deleteAccount, isDeletingAccount } = useDeleteAccount();
  const isMobile = useIsMobile();

  return (
    <Section>
      <Heading as="h2">Delete account</Heading>
      <Copy>
        Permanently delete your account and all related data, including your
        habits, achievements, avatar, and active sessions.
      </Copy>

      <Modal>
        <Modal.Open opens="delete-account">
          <DeleteButton
            type="button"
            $variation="danger"
            size={isMobile ? "large" : "medium"}
          >
            <MdDeleteForever />
            <span>Delete account</span>
          </DeleteButton>
        </Modal.Open>
        <Modal.Window name="delete-account">
          <ConfirmDelete
            resourceName="account"
            onConfirm={deleteAccount}
            disabled={isDeletingAccount}
          />
        </Modal.Window>
      </Modal>
    </Section>
  );
}
