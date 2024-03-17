import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDailyAction as apiAddDailyAction } from "../../api/apiHabits.js";
import toast from "react-hot-toast";

export default function useAddAction() {
  const queryClient = useQueryClient();
  const { mutate: addDailyAction, isPending: isAnswering } = useMutation({
    mutationFn: ({ habitID, answer }) => apiAddDailyAction({ habitID, answer }),
    onError: (err) => toast.error(err.message),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["single-habit"],
      });
    },
  });

  return { addDailyAction, isAnswering };
}
