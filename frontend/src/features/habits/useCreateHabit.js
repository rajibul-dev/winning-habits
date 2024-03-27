import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHabit as apiCreateHabit } from "../../api/apiHabits.js";
import toast from "react-hot-toast";

export default function useCreateHabit() {
  const queryClient = useQueryClient();
  const {
    mutate: createHabit,
    isPending: isCreating,
    isSuccess: isCreated,
  } = useMutation({
    mutationFn: (habit) => apiCreateHabit(habit),
    onSuccess: () => {
      toast.success(`Habit successfully created!`);
      queryClient.invalidateQueries({ queryKey: ["my-habits"] });
    },
    onError: (err) => toast.error(err.response.data.msg),
  });

  return { createHabit, isCreating, isCreated };
}
