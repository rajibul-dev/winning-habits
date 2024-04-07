import styled from "styled-components";
import Button from "../../ui/Button.jsx";
import Heading from "../../ui/Heading.jsx";

const StyledConfirmDelete = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal }) {
  let heading = "";
  let para = "";
  let action = "";

  switch (resourceName) {
    case "avatar":
      heading = `Remove avatar`;
      para = `Are you sure you want to remove your avatar?`;
      action = `Remove avatar`;
      break;

    default:
      heading = `Delete ${resourceName}`;
      para = `Are you sure you want to delete this ${resourceName} permanently?`;
      action = "Delete";
      break;
  }

  return (
    <StyledConfirmDelete>
      <Heading as="h3">{heading}</Heading>
      <p>{para}</p>

      <div>
        <Button
          $variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button $variation="danger" disabled={disabled} onClick={onConfirm}>
          {action}
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
