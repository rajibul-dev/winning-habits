import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDailyAction as apiAddDailyAction } from "../../api/apiHabits.js";
import toast from "react-hot-toast";

export default function useAddAction() {
  const queryClient = useQueryClient();
  const {
    mutate: addDailyAction,
    isPending: isAnswering,
    isSuccess: isAnsweredSuccessfully,
  } = useMutation({
    mutationFn: ({ habitID, answer }) => apiAddDailyAction({ habitID, answer }),
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

  return { addDailyAction, isAnswering, isAnsweredSuccessfully };
}
