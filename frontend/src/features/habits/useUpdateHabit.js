import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSingleHabit as apiUpdateSingleHabit } from "../../api/apiHabits.js";
import toast from "react-hot-toast";

export default function useUpdateHabit() {
  const queryClient = useQueryClient();
  const {
    mutate: updateHabit,
    isPending: isUpdating,
    isSuccess: isEdited,
  } = useMutation({
    mutationFn: ({ id, name }) => apiUpdateSingleHabit({ id, name }),
    onSuccess: () => {
      toast.success(`Updated habit successfully!`);
      queryClient.invalidateQueries({ queryKey: ["my-habits"] });
    },
    onError: (err) => toast.error(err.response.data.msg),
  });

  return { updateHabit, isUpdating, isEdited };
}
