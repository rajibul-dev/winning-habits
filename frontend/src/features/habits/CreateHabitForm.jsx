import { useForm } from "react-hook-form";
import Button from "../../ui/Button.jsx";
import Form from "../../ui/Form.jsx";
import FormRow from "../../ui/FormRow.jsx";
import FormRowVertical from "../../ui/FormRowVertical.jsx";
import Input from "../../ui/Input.jsx";
import useCreateHabit from "./useCreateHabit.js";
import { useEffect } from "react";

export default function CreateHabitForm({ onCloseModal }) {
  const { register, handleSubmit } = useForm();
  const { createHabit, isCreating, isCreated } = useCreateHabit();

  function onSubmit(data) {
    createHabit({ name: data.habit.trim() });
  }
  function onError(errors) {
    console.log(errors);
  }

  useEffect(
    function () {
      if (isCreated) {
        onCloseModal();
      }
    },
    [isCreated, onCloseModal],
  );

  return (
    <Form type="modal" onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRowVertical label="Habit name">
        <Input
          maxLength={100}
          type="text"
          autoFocus
          {...register("habit", {
            required: true,
          })}
        />
      </FormRowVertical>
      <FormRow>
        <Button disabled={isCreating}>Create Habit</Button>
      </FormRow>
    </Form>
  );
}
