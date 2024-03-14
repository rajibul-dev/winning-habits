import { useMutation } from "@tanstack/react-query";
import { register as apiRegister } from "../../api/apiAuth.js";

export default function useRegister() {
  const {
    mutate: register,
    isPending: isRegistering,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: ({ name, email, password }) =>
      apiRegister({ name, email, password }),
  });

  return { register, isRegistering, error, isSuccess };
}
