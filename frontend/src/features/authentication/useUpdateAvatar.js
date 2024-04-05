import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateAvatar as apiUpdateAvatar } from "../../api/apiAuth.js";
import toast from "react-hot-toast";
import apiErrorFormat from "../../api/apiErrorFormat.js";

export default function useUpdateAvatar() {
  const queryClient = useQueryClient();
  const {
    mutate: updateAvatar,
    isPending: isUpdatingAvatar,
    isSuccess: isUpdatedAvatar,
  } = useMutation({
    mutationFn: (imageFile) => apiUpdateAvatar(imageFile),
    onSuccess: () => {
      toast.success(`Successfully uploaded image!`);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (error) => {
      toast.error(apiErrorFormat(error));
    },
  });

  return { updateAvatar, isUpdatingAvatar, isUpdatedAvatar };
}
