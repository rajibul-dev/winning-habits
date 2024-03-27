import { useForm } from "react-hook-form";
import Button from "../../ui/Button.jsx";
import Form from "../../ui/Form.jsx";
import FormRow from "../../ui/FormRow.jsx";
import FormRowVertical from "../../ui/FormRowVertical.jsx";
import Input from "../../ui/Input.jsx";
import useCreateHabit from "./useCreateHabit.js";
import { useEffect } from "react";

export default function CreateHabitForm({ onCloseModal }) {
  const { register, handleSubmit, reset } = useForm();
  const { createHabit, isCreating, isCreated } = useCreateHabit();

  function onSubmit(data) {
    createHabit({ name: data.habit });
    reset();
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
        <Input type="text" {...register("habit")} />
      </FormRowVertical>
      <FormRow>
        <Button disabled={isCreating}>Create Habit</Button>
      </FormRow>
    </Form>
  );
}
