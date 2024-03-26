import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleArchive as apiHandleArchive } from "../../api/apiHabits.js";
import toast from "react-hot-toast";

export default function useHandleArchive() {
  const queryClient = useQueryClient();

  const { mutate: handleArchive, isPending } = useMutation({
    mutationFn: ({ id, isArchive }) => apiHandleArchive({ id, isArchive }),
    onSuccess: (data) => {
      // TODO: to show whether archived or unarchived
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["my-habits"],
      });
      toast.success(`Action successful!`);
    },
  });
  return { handleArchive, isPending };
}
