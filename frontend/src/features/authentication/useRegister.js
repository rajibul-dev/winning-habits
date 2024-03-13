import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register as apiRegister } from "../../api/apiAuth.js";

export default function useRegister() {
  const queryClient = useQueryClient();

  const {
    mutate: register,
    isPending: isRegistering,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: ({ name, email, password }) =>
      apiRegister({ name, email, password }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
    },
  });

  return { register, isRegistering, error, isSuccess };
}
