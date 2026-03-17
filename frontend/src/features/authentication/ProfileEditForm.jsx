import styled from "styled-components";
import Input from "../../ui/Input.jsx";
import FormRowVertical from "../../ui/FormRowVertical.jsx";
import { useForm } from "react-hook-form";
import useUser from "./useUser.js";
import Button from "../../ui/Button.jsx";
import InlineLink from "../../ui/InlineAppLink.jsx";
import { MdAddAPhoto, MdDelete, MdEdit } from "react-icons/md";
import { FiArrowLeft } from "react-icons/fi";
import buttonWithIconStyles from "../../styles/buttonWithIconStyles.js";
import Modal from "../../ui/Modal.jsx";
import ImageSelector from "./ImageSelector.jsx";
import Spinner from "../../ui/Spinner.jsx";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";
import apiErrorFormat from "../../api/apiErrorFormat.js";
import useUpdateUser from "./useUpdateUser.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import useRemoveAvatar from "./useRemoveAvatar.js";
import ConfirmDelete from "../habits/ConfirmDelete.jsx";
import { pixelToEm } from "../../styles/GlobalStyles.js";
import useIsMobile from "../../hooks/useIsMobile.js";
import Heading from "../../ui/Heading.jsx";

export const defaultImageURL =
  "https://res.cloudinary.com/drtmxi7rn/image/upload/t_no-padding/winning-habits-app/pfps/default-pfp-placeholder.jpg";

const StyledForm = styled.form`
  display: grid;
  gap: 2.4rem;
  padding: 3rem;
  background: radial-gradient(
      circle at top left,
      var(--habit-brand-tint),
      transparent 30%
    ),
    var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: 2.8rem;
  box-shadow: var(--shadow-sm);

  @media (max-width: ${pixelToEm(560)}) {
    padding: 2rem;
    border-radius: 2.2rem;
  }
`;

const FormHeader = styled.div`
  display: flex;
  gap: 1.4rem;
  align-items: flex-start;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const BackButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 4.2rem;
  height: 4.2rem;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: var(--color-grey-100);
  color: var(--color-grey-700);
  transition:
    transform 0.2s,
    background-color 0.2s;

  &:hover {
    background-color: var(--color-grey-200);
    transform: translateX(-2px);
  }

  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

const HeaderCopy = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const HeaderTitle = styled(Heading)`
  color: var(--color-grey-800);
`;

const HeaderText = styled.p`
  max-width: 62ch;
  color: var(--color-grey-500);
  line-height: 1.55;
`;

const FormBody = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(28rem, 0.9fr);
  gap: 2rem;
  align-items: start;

  @media (max-width: ${pixelToEm(860)}) {
    grid-template-columns: 1fr;
  }
`;

const DetailsColumn = styled.div`
  display: grid;
  gap: 1.6rem;
`;

const DetailsCard = styled.div`
  display: grid;
  gap: 0.4rem;
  padding: 2rem;
  border: 1px solid var(--habit-surface-border-soft);
  border-radius: 2.2rem;
  background-color: var(--habit-surface-soft);

  @media (max-width: ${pixelToEm(560)}) {
    padding: 1.6rem;
    border-radius: 1.8rem;
  }
`;

const FieldGroup = styled(FormRowVertical)`
  & input {
    width: 100%;
    min-height: 4.8rem;
  }
`;

const FieldHint = styled.p`
  margin-top: 0.6rem;
  color: var(--color-grey-500);
  font-size: var(--font-size-sm);
  line-height: 1.5;
`;

const AvatarCard = styled.div`
  display: grid;
  gap: 1.6rem;
  padding: 2rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 2.2rem;
  background: linear-gradient(
    180deg,
    var(--habit-surface-soft-strong),
    var(--color-grey-0)
  );
  box-shadow: var(--shadow-sm);
  justify-items: center;

  @media (max-width: ${pixelToEm(560)}) {
    padding: 1.6rem;
    border-radius: 1.8rem;
  }
`;

const AvatarLabel = styled.p`
  color: var(--color-grey-800);
  font-size: var(--font-size-lg);
  font-weight: 700;
  justify-self: start;
`;

const AvatarFrame = styled.div`
  width: 20rem;
  aspect-ratio: 1;
  padding: 0.4rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-brand-500),
    var(--color-blue-700)
  );
  box-shadow: 0 1.4rem 3rem rgba(79, 70, 229, 0.15);

  @media (max-width: ${pixelToEm(860)}) {
    width: 17rem;
  }
`;

const Avatar = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  background-color: var(--color-grey-100);
`;

const AvatarHint = styled.p`
  color: var(--color-grey-500);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  text-align: center;
`;

const AvatarActions = styled.div`
  display: grid;
  gap: 1rem;
  width: 100%;
  justify-items: center;
`;

const paddingBlock = 0.9;

const UploadImageButton = styled(Button)`
  ${buttonWithIconStyles}
  gap: 0.6rem;
  width: min(100%, 22rem);
  justify-content: center;
  padding-top: ${paddingBlock}rem;
  padding-bottom: ${paddingBlock}rem;
  text-transform: none;

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }

  @media (max-width: ${pixelToEm(500)}) {
    padding-top: 1.1rem;
    padding-bottom: 1.1rem;
  }
`;

const RemoveButton = styled(InlineLink)`
  ${buttonWithIconStyles}
  font-size: var(--font-size-sm);
  color: var(--color-red-700-mod);

  &:hover {
    text-decoration: none;
    border-bottom: 1px solid var(--color-red-700);
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 0.2rem;
`;

const SubmitButton = styled(Button)`
  min-width: 18rem;
`;

const CancelButton = styled(Button)`
  min-width: 14rem;
`;

export default function ProfileEditForm({ onCancel }) {
  const { user, isLoading, error } = useUser();
  const name = user?.name || "Default Name";
  const email = user?.email || "user@example.com";
  const avatar = user?.avatar || defaultImageURL;
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name,
      email,
    },
  });
  const { updateUser, isUpdating } = useUpdateUser();
  const { removeAvatar, isRemoving } = useRemoveAvatar();
  const isDefaultAvatar = avatar === defaultImageURL;
  const isMobile = useIsMobile();

  function onSubmit(data) {
    const trimmedName = data.name.trim();

    if (!trimmedName || trimmedName === name) return;
    updateUser(trimmedName);
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
      <FormHeader>
        {onCancel ? (
          <BackButton
            type="button"
            onClick={onCancel}
            aria-label="Back to profile overview"
          >
            <FiArrowLeft />
          </BackButton>
        ) : null}

        <HeaderCopy>
          <HeaderTitle as="h2">Edit profile</HeaderTitle>
          <HeaderText>
            Update the details people see first. Right now that means your
            display name and avatar.
          </HeaderText>
        </HeaderCopy>
      </FormHeader>

      <FormBody>
        <AvatarCard>
          <AvatarLabel>Profile photo</AvatarLabel>

          <AvatarFrame>
            <Avatar
              src={avatar || "default-user.jpg"}
              alt={`Avatar of ${name}`}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </AvatarFrame>

          <AvatarHint>
            A clear photo helps your profile feel more personal across the app.
          </AvatarHint>

          <Modal>
            <AvatarActions>
              <Modal.Open opens="image-upload">
                <UploadImageButton type="button" size="small">
                  {!isDefaultAvatar ? (
                    <>
                      <MdEdit /> <span>Change avatar</span>
                    </>
                  ) : (
                    <>
                      <MdAddAPhoto /> <span>Add avatar</span>
                    </>
                  )}
                </UploadImageButton>
              </Modal.Open>

              {!isDefaultAvatar && (
                <Modal.Open opens="remove-avatar">
                  <RemoveButton as="button" type="button" $usage="pale-color">
                    <MdDelete /> <span>Remove avatar</span>
                  </RemoveButton>
                </Modal.Open>
              )}
            </AvatarActions>

            <Modal.Window name="image-upload" noXButton>
              <ImageSelector />
            </Modal.Window>

            {!isDefaultAvatar && (
              <Modal.Window name="remove-avatar">
                <ConfirmDelete
                  onConfirm={removeAvatar}
                  disabled={isRemoving}
                  resourceName={"avatar"}
                />
              </Modal.Window>
            )}
          </Modal>
        </AvatarCard>

        <DetailsColumn>
          <DetailsCard>
            <FieldGroup label="Your name">
              <Input
                minLength={2}
                maxLength={40}
                id="name"
                {...register("name")}
              />
            </FieldGroup>
            <FieldHint>
              Keep it short and recognizable. This is the name shown around the
              app.
            </FieldHint>
          </DetailsCard>

          <DetailsCard>
            <FieldGroup label="Your email address">
              <Input
                {...register("email", {
                  disabled: true,
                })}
              />
            </FieldGroup>
            <FieldHint>Your email is read-only here for now.</FieldHint>
          </DetailsCard>
        </DetailsColumn>
      </FormBody>

      <ActionsRow>
        {onCancel ? (
          <CancelButton
            type="button"
            $variation="secondary"
            size={isMobile ? "large" : "medium"}
            onClick={onCancel}
          >
            Cancel
          </CancelButton>
        ) : null}

        <SubmitButton
          size={isMobile ? "large" : "medium"}
          disabled={isUpdating}
        >
          {!isUpdating ? "Save changes" : <SpinnerMini />}
        </SubmitButton>
      </ActionsRow>
    </StyledForm>
  );
}
