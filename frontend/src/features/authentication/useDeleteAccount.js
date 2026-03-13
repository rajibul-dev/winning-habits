import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiErrorFormat from "../../api/apiErrorFormat.js";
import { deleteCurrentUser as apiDeleteCurrentUser } from "../../api/apiUsers.js";

export default function useDeleteAccount() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteAccount, isPending: isDeletingAccount } = useMutation({
    mutationFn: apiDeleteCurrentUser,
    onSuccess: () => {
      toast.success("Your account has been deleted");
      queryClient.removeQueries();
      navigate("/", { replace: true });
    },
    onError: (error) => {
      toast.error(apiErrorFormat(error));
    },
  });

  return { deleteAccount, isDeletingAccount };
}
