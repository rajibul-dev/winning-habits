import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register as apiRegister } from "../../api/apiAuth.js";
import { useNavigate } from "react-router-dom";

export default function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: register, isPending: isRegistering } = useMutation({
    mutationFn: ({ name, email, password }) =>
      apiRegister({ name, email, password }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      navigate("/verify-email", { replace: true });
    },
  });

  return { register, isRegistering };
}
