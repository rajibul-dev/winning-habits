import styled from "styled-components";
import Input from "../../ui/Input.jsx";
import FormRowVertical from "../../ui/FormRowVertical.jsx";
import { useForm } from "react-hook-form";
import useUser from "./useUser.js";
import Button from "../../ui/Button.jsx";
import InlineLink from "../../ui/InlineAppLink.jsx";
import { MdDelete, MdEdit } from "react-icons/md";
import buttonWithIconStyles from "../../styles/buttonWithIconStyles.js";
import Modal from "../../ui/Modal.jsx";
import ImageSelector from "./ImageSelector.jsx";
import Spinner from "../../ui/Spinner.jsx";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";
import apiErrorFormat from "../../api/apiErrorFormat.js";
import useUpdateUser from "./useUpdateUser.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import useRemoveAvatar from "./useRemoveAvatar.js";

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(12, auto);
  column-gap: 2rem;
  align-items: center;
  padding: 2.4rem 4rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  @media (max-width: 27em) {
    padding: 2.4rem 2rem;
  }
`;
const FormRowVerticalModified = styled(FormRowVertical)`
  grid-row: span 2;
`;
const AvatarPortion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  justify-self: center;
  align-self: center;
  grid-row: 1/4;
  grid-column: 2;
`;
const Avatar = styled.img`
  display: block;
  width: 20rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;
const paddingBlock = 0.9;

const UploadImageButton = styled(Button)`
  ${buttonWithIconStyles}
  gap: 0.5rem;
  padding-top: ${paddingBlock}rem;
  padding-bottom: ${paddingBlock}rem;
  padding-inline: 4rem;
  text-transform: none;

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;
const RemoveButton = styled(InlineLink)`
  ${buttonWithIconStyles}
  font-size: 1.2rem;
  color: var(--color-red-700);

  &:hover {
    text-decoration: none;
    border-bottom: 1px solid var(--color-red-700);
  }
`;

const SubmitButton = styled(Button)`
  margin-top: 2.4rem;
  justify-self: stretch;
`;

export default function ProfileEditForm() {
  const { user, isLoading, error } = useUser();
  const name = user?.name || "Default Name";
  const email = user?.email || "user@example.com";
  const avatar = user?.avatar || "/default-avatar.png";
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name,
      email,
    },
  });
  const { updateUser, isUpdating } = useUpdateUser();
  const { removeAvatar, isRemoving } = useRemoveAvatar();

  function onSubmit(data) {
    if (data.name === name) return;
    updateUser(data.name);
  }

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <PageLevelNotificationToast type="error">
        {apiErrorFormat(error)}
      </PageLevelNotificationToast>
    );

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <FormRowVerticalModified label="Your name">
        <Input id="name" {...register("name")} />
      </FormRowVerticalModified>

      <AvatarPortion>
        <Avatar src={avatar || "default-user.jpg"} alt={`Avatar of ${name}`} />

        <Modal>
          <Modal.Open opens="image-upload">
            <UploadImageButton type="button" size="small">
              <MdEdit /> <span>Update avatar</span>
            </UploadImageButton>
          </Modal.Open>
          <Modal.Window name="image-upload" noXButton>
            <ImageSelector />
          </Modal.Window>
        </Modal>

        <RemoveButton
          onClick={removeAvatar}
          disabled={isRemoving}
          as="button"
          type="button"
          $usage="pale-color"
        >
          {!isRemoving ? (
            <>
              <MdDelete /> <span>Remove avatar</span>
            </>
          ) : (
            <SpinnerMini />
          )}
        </RemoveButton>
      </AvatarPortion>

      <FormRowVerticalModified label="Your email address">
        <Input
          {...register("email", {
            disabled: true,
          })}
        />
      </FormRowVerticalModified>

      <SubmitButton disabled={isUpdating}>
        {!isUpdating ? "Save changes" : <SpinnerMini />}
      </SubmitButton>
    </StyledForm>
  );
}
