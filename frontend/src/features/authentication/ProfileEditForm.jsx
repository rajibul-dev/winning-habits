import styled from "styled-components";
import Input from "../../ui/Input.jsx";
import FormRowVertical from "../../ui/FormRowVertical.jsx";
import { useForm } from "react-hook-form";
import useUser from "./useUser.js";
import Button from "../../ui/Button.jsx";
import InlineLink from "../../ui/InlineAppLink.jsx";

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 2.4rem 4rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  @media (max-width: 27em) {
    padding: 2.4rem 2rem;
  }
`;
const AvatarPortion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  justify-self: center;
  align-self: center;
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
const UploadImageButton = styled(Button)`
  padding-inline: 4rem;
`;
const RemoveButton = styled(InlineLink)`
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

export default function ProfileEditForm() {
  const { user, isLoading, error } = useUser();
  const { name, avatar } = user;
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name,
    },
  });

  function onSubmit() {}
  function onError() {}

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRowVertical label="Name">
        <Input {...register("name")} />
      </FormRowVertical>
      <AvatarPortion>
        <Avatar src={avatar || "default-user.jpg"} alt={`Avatar of ${name}`} />
        <UploadImageButton size="small">Update avatar</UploadImageButton>
        <RemoveButton as="button" usage="pale-color">
          Remove avatar
        </RemoveButton>
      </AvatarPortion>
    </StyledForm>
  );
}
