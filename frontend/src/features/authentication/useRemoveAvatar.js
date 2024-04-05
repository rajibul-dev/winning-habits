import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAvatar as apiRemoveAvatar } from "../../api/apiAuth.js";
import toast from "react-hot-toast";
import apiErrorFormat from "../../api/apiErrorFormat.js";

export default function useRemoveAvatar() {
  const queryClient = useQueryClient();
  const { mutate: removeAvatar, isPending: isRemoving } = useMutation({
    mutationFn: apiRemoveAvatar,
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
