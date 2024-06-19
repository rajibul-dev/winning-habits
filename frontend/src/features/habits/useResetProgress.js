import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetHabitProgress } from "../../api/apiHabits.js";
import toast from "react-hot-toast";

export default function useResetProgress() {
  const queryClient = useQueryClient();
  const { mutate: resetProgress, isPending: isResetting } = useMutation({
    mutationFn: (id) => resetHabitProgress(id),
    onSuccess: (data, id) => {
      toast.success(`Habit progress reset successfully`);
      queryClient.invalidateQueries({ queryKey: ["my-habits"] });
      queryClient.invalidateQueries({ queryKey: ["habit", id] });
    },
    onError: (err) => toast.error(err.response.data.msg),
  });
  return { resetProgress, isResetting };
}
