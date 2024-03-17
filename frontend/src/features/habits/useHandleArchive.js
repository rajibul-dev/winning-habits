import { useMutation } from "@tanstack/react-query";
import { handleArchive as apiHandleArchive } from "../../api/apiHabits.js";
import toast from "react-hot-toast";

export default function useHandleArchive() {
  const { mutate: handleArchive, isPending } = useMutation({
    mutationFn: ({ id, isArchive }) => apiHandleArchive({ id, isArchive }),
    onSuccess: (data) => {
      // TODO: to show whether archived or unarchived
      toast.success(`Action successful!`);
    },
  });
  return { handleArchive, isPending };
}
