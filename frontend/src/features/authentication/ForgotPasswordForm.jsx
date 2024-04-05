import { useState } from "react";
import Form from "../../ui/Form.jsx";
import FormRowVertical from "../../ui/FormRowVertical.jsx";
import Input from "../../ui/Input.jsx";
import Button from "../../ui/Button.jsx";
import useForgotPassword from "./useForgotPassword.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";
import apiErrorFormat from "../../api/apiErrorFormat.js";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { onForgotPassword, pendingForgotPassword, error, isSuccess } =
    useForgotPassword();

  function handleSubmit(e) {
    e.preventDefault();
    onForgotPassword(email, {
      onSuccess: () => {
        setEmail("");
      },
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <FormRowVertical>
          <PageLevelNotificationToast type="error">
            {apiErrorFormat(error)}
          </PageLevelNotificationToast>
        </FormRowVertical>
      )}
      {isSuccess && (
        <FormRowVertical>
          <PageLevelNotificationToast>
            Password reset link has been sent to your email!
          </PageLevelNotificationToast>
        </FormRowVertical>
      )}
      <FormRowVertical label="Enter your account email">
        <Input
          type="email"
          id="email"
          name="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button disabled={pendingForgotPassword}>
          {!pendingForgotPassword ? "Get password reset link" : <SpinnerMini />}
        </Button>
      </FormRowVertical>
    </Form>
  );
}
