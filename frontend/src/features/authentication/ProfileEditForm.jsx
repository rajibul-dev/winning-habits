import styled, { css } from "styled-components";
import Input from "../../ui/Input.jsx";
import FormRowVertical from "../../ui/FormRowVertical.jsx";
import { useForm } from "react-hook-form";
import useUser from "./useUser.js";
import Button from "../../ui/Button.jsx";
import InlineLink from "../../ui/InlineAppLink.jsx";
import { MdDelete, MdEdit } from "react-icons/md";
import buttonWithIconStyles from "../../styles/buttonWithIconStyles.js";

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(12, auto);
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
  const { name, email, avatar } = user;
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name,
      email,
    },
  });

  function onSubmit() {}
  function onError() {}

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRowVerticalModified label="Your name">
        <Input id="name" {...register("name")} />
      </FormRowVerticalModified>
      <AvatarPortion>
        <Avatar src={avatar || "default-user.jpg"} alt={`Avatar of ${name}`} />
        <UploadImageButton type="button" size="small">
          <MdEdit /> <span>Update avatar</span>
        </UploadImageButton>
        <RemoveButton as="button" type="button" $usage="pale-color">
          <MdDelete /> <span>Remove avatar</span>
        </RemoveButton>
      </AvatarPortion>
      <FormRowVerticalModified label="Your email address">
        <Input
          {...register("email", {
            disabled: true,
          })}
        />
      </FormRowVerticalModified>
      <SubmitButton>Save changes</SubmitButton>
    </StyledForm>
  );
}
