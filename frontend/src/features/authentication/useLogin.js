import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as apiLogin } from "../../api/apiAuth";
import { useNavigate } from "react-router-dom";

export default function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isPending: isLogining } = useMutation({
    mutationFn: ({ email, password }) => apiLogin({ email, password }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      navigate("/app", { replace: true });
    },
  });

  return { login, isLogining };
}
