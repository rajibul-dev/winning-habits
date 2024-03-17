import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHabit as apiDeleteHabit } from "../../api/apiHabits.js";
import toast from "react-hot-toast";

export default function useDeleteHabit() {
  const queryClient = useQueryClient();
  const { mutate: deleteHabit, isPending: isDeleting } = useMutation({
    mutationFn: (id) => apiDeleteHabit(id),
    onSuccess: () => {
      toast.success(`Habit successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ["my-habits"] });
    },
    onError: (err) => toast.error(err.response.data.msg),
  });

  return { deleteHabit, isDeleting };
}
