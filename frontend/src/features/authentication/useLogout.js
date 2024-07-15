import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as apiLogout } from "../../api/apiAuth.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      toast.success(`User logged out`);
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
  });
  return { logout, isLoggingOut };
}
