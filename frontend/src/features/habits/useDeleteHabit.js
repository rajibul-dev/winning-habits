import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHabit as apiDeleteHabit } from "../../api/apiHabits.js";
import toast from "react-hot-toast";

export default function useDeleteHabit() {
  const queryClient = useQueryClient();
  const { mutate: deleteHabit, isPending: isDeleting } = useMutation({
    mutationFn: (id) => apiDeleteHabit(id),
    onSuccess: (data, id) => {
      toast.success(`Habit successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ["my-habits"] });
      queryClient.invalidateQueries({ queryKey: ["habit", id] });
    },
    onError: (err) => toast.error(err.response.data.msg),
  });

  return { deleteHabit, isDeleting };
}
