import { useRef, useState } from "react";
import Form from "../../ui/Form.jsx";
import FormRowVertical from "../../ui/FormRowVertical.jsx";
import Input from "../../ui/Input.jsx";
import Button from "../../ui/Button.jsx";
import InputPasswordShowHide from "../../ui/InputPasswordShowHide.jsx";
import useResetPassword from "./useResetPassword.js";
import { useLocation, useNavigate } from "react-router-dom";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";

function useURL() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const confirmButtonRef = useRef();
  const { isSuccess, isResetting, resetPassword, error } = useResetPassword();
  const navigate = useNavigate();
  const url = useURL();

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      confirmButtonRef.current.setCustomValidity("Passwords don't match");
      // workaround for not working on initial submit click (or Enter)
      confirmButtonRef.current.reportValidity();
      return;
    }

    resetPassword({
      password,
      token: url.get("token"),
      email: url.get("email"),
    });
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
      {isSuccess && (
        <FormRowVertical>
          <PageLevelNotificationToast>
            Password reset successfully!
          </PageLevelNotificationToast>
        </FormRowVertical>
      )}

      {!isSuccess && (
        <>
          <FormRowVertical label="New password">
            <InputPasswordShowHide
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormRowVertical>
          <FormRowVertical label="Confirm password">
            <Input
              ref={confirmButtonRef}
              id="confirm-password"
              name="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                e.target.setCustomValidity("");
                setConfirmPassword(e.target.value);
              }}
              required
            />
          </FormRowVertical>
        </>
      )}

      {!isSuccess && (
        <FormRowVertical disabled={isResetting}>
          <Button type="submit">
            {!isResetting ? "Reset password" : "Resetting"}
          </Button>
        </FormRowVertical>
      )}

      {isSuccess && (
        <FormRowVertical>
          <Button
            onClick={(e) => {
              e.preventDefault();
              navigate("/login", { replace: true });
            }}
          >
            Go to login page
          </Button>
        </FormRowVertical>
      )}
    </Form>
  );
}
