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
  gap: 1.4rem;
  padding: 2.6rem 3rem;
  background:
    linear-gradient(180deg, rgba(248, 113, 113, 0.05), transparent 60%),
    var(--color-grey-0);
  border: 1px solid var(--color-red-400);
  border-radius: 2.4rem;
  box-shadow: var(--shadow-sm);

  @media (max-width: ${pixelToEm(560)}) {
    padding: 2rem;
    border-radius: 2rem;
  }
`;

const HeadingRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const IconWrap = styled.div`
  display: inline-grid;
  place-items: center;
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 1.4rem;
  background-color: var(--color-red-100);
  color: var(--color-red-700-mod);

  & svg {
    width: 2.3rem;
    height: 2.3rem;
  }
`;

const Copy = styled.p`
  color: var(--color-grey-500);
  max-width: 62ch;
  line-height: 1.6;
`;

const DeleteButton = styled(Button)`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.4rem;
`;

export default function DeleteAccountSection() {
  const { deleteAccount, isDeletingAccount } = useDeleteAccount();
  const isMobile = useIsMobile();

  return (
    <Section>
      <HeadingRow>
        <IconWrap>
          <MdDeleteForever />
        </IconWrap>
        <Heading as="h2">Delete account</Heading>
      </HeadingRow>

      <Copy>
        Permanently delete your account and everything tied to it, including
        habits, achievements, your avatar, and active sessions. This action
        cannot be undone.
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
