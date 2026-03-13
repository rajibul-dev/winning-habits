import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateCurrentUser as apiUpdateCurrentUser } from "../../api/apiUsers.js";
import toast from "react-hot-toast";
import apiErrorFormat from "../../api/apiErrorFormat.js";

export default function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: (name) => apiUpdateCurrentUser({ name }),
    onSuccess: (data) => {
      const name = data.user.name;
      toast.success(`Successfully updated name to ${name}`);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (error) => {
      toast.error(apiErrorFormat(error));
    },
  });

  return { updateUser, isUpdating };
}
