import { useEffect, useState } from "react";
import FormRowVertical from "../../ui/FormRowVertical";
import Form from "../../ui/Form";
import Button from "../../ui/Button.jsx";
import Input from "../../ui/Input.jsx";
import useRegister from "./useRegister.js";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";
import InlineLink from "../../ui/InlineAppLink.jsx";
import useResendVerificationLink from "./useResendVerificationLink.js";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, isRegistering, error, isSuccess } = useRegister();
  const [countdown, setCountdown] = useState(null);
  const {
    resendVerificationLink,
    isSuccess: isResent,
    isResending,
  } = useResendVerificationLink();

  useEffect(() => {
    let countdownInterval; // Declare variable outside the callback

    if (isResent) {
      setCountdown(30);
      countdownInterval = setInterval(() => {
        // Assign to the variable
        setCountdown((prevCount) => {
          if (prevCount <= 0) {
            clearInterval(countdownInterval); // Clear using the variable
            return null; // Return null to reset countdown state
          } else {
            return prevCount - 1;
          }
        });
      }, 1000);
    } else {
      setCountdown(null);
    }

    return () => clearInterval(countdownInterval);
  }, [isResent]);

  function handleSubmit(e) {
    e.preventDefault();
    register(
      { name, email, password },
      {
        onSuccess: () => {
          setPassword("");
        },
      },
    );
  }

  function handleResendVerificationLink(e) {
    e.preventDefault();
    resendVerificationLink(email);
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <FormRowVertical>
          <PageLevelNotificationToast type="error">
            {error.response.data.msg}
          </PageLevelNotificationToast>
        </FormRowVertical>
      )}
      {!isSuccess && (
        <>
          <FormRowVertical label="Name">
            <Input
              type="name"
              id="name"
              // This makes this form better for password managers
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormRowVertical>
          <FormRowVertical label="Email address">
            <Input
              type="email"
              id="email"
              name="email"
              // This makes this form better for password managers
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormRowVertical>
          <FormRowVertical label="Password">
            <Input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormRowVertical>
          <FormRowVertical>
            <Button disabled={isRegistering}>
              {!isRegistering ? "Login" : "Creating account..."}
            </Button>
          </FormRowVertical>
        </>
      )}
      {isSuccess && (
        <>
          <FormRowVertical>
            <PageLevelNotificationToast>
              Thank you for registering! Please check your email ({email}) for a
              verification link to complete your registration.
            </PageLevelNotificationToast>
          </FormRowVertical>
          <FormRowVertical>
            <p>
              Didn't recieve?&nbsp;&nbsp;&nbsp;
              <InlineLink
                as="button"
                onClick={handleResendVerificationLink}
                disabled={countdown > 0 || isResending}
              >
                {countdown > 0
                  ? `Request after ${countdown} second${countdown >= 2 ? "s" : ""}`
                  : "Resend link"}
              </InlineLink>
            </p>
          </FormRowVertical>
        </>
      )}
    </Form>
  );
}
