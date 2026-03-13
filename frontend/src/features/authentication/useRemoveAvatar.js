import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCurrentUserAvatar as apiDeleteCurrentUserAvatar } from "../../api/apiUsers.js";
import toast from "react-hot-toast";
import apiErrorFormat from "../../api/apiErrorFormat.js";

export default function useRemoveAvatar() {
  const queryClient = useQueryClient();
  const { mutate: removeAvatar, isPending: isRemoving } = useMutation({
    mutationFn: apiDeleteCurrentUserAvatar,
    onSuccess: () => {
      toast.success(`Successfully removed avatar`);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error(apiErrorFormat(error));
    },
  });
  return { removeAvatar, isRemoving };
}
