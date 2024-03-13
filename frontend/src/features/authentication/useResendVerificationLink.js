import { useMutation } from "@tanstack/react-query";
import { requestNewVerificationEmail } from "../../api/apiAuth.js";

export default function useResendVerificationLink() {
  const {
    mutate: resendVerificationLink,
    isSuccess,
    isError,
    isPending: isResending,
  } = useMutation({
    mutationFn: (email) => requestNewVerificationEmail(email),
  });

  return { resendVerificationLink, isSuccess, isError, isResending };
}
