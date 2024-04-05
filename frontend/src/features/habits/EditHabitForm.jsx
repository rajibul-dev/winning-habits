import { useForm } from "react-hook-form";
import Button from "../../ui/Button.jsx";
import Form from "../../ui/Form.jsx";
import FormRow from "../../ui/FormRow.jsx";
import FormRowVertical from "../../ui/FormRowVertical.jsx";
import Input from "../../ui/Input.jsx";
import { useEffect } from "react";
import useUpdateHabit from "./useUpdateHabit.js";

export default function EditHabitForm({ onCloseModal, habitID, name }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      habit: name,
    },
  });
  const { updateHabit, isUpdating, isEdited } = useUpdateHabit();

  function onSubmit(data) {
    if (data.habit === name) return onCloseModal();
    updateHabit({ id: habitID, name: data.habit });
  }
  function onError(errors) {
    console.log(errors);
  }

  useEffect(
    function () {
      if (isEdited) {
        onCloseModal();
      }
    },
    [isEdited, onCloseModal],
  );

  return (
    <Form type="modal" onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRowVertical label="Habit name">
        <Input
          type="text"
          autoFocus
          {...register("habit", {
            required: true,
          })}
        />
      </FormRowVertical>
      <FormRow>
        <Button disabled={isUpdating}>Save changes</Button>
      </FormRow>
    </Form>
  );
}
