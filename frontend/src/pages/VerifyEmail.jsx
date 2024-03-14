import useVerifyEmail from "../features/authentication/useVerifyEmail.js";
import useURL from "../hooks/useURL.js";
import FullPage from "../ui/FullPage.jsx";
import Spinner from "../ui/Spinner.jsx";
import { useEffect } from "react";

export default function VerifyEmail() {
  const url = useURL();
  const { verifyEmail, isVerifying } = useVerifyEmail();

  useEffect(function () {
    if (!verifyEmail) return;
    verifyEmail({
      verificationToken: url.get("token"),
      email: url.get("email"),
    });
  }, []);

  if (isVerifying)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
}
