import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCustomDateAction } from "../../api/apiHabits.js";

export default function useUpdateAction() {
  const queryClient = useQueryClient();
  const { mutate: updateAction, isPending: isUpdating } = useMutation({
    mutationFn: ({ habitID, targetRecordID, updatedAnswer }) =>
      updateCustomDateAction({ habitID, targetRecordID, updatedAnswer }),
    onError: (err) => toast.error(err.response.data.msg),
    onSuccess: (data, { habitID }) => {
      queryClient.invalidateQueries({
        queryKey: ["my-habits"],
      });
      queryClient.invalidateQueries({
        queryKey: ["habit", habitID],
      });
    },
  });

  return { updateAction, isUpdating };
}
