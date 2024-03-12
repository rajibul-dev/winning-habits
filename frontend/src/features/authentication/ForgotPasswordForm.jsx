import { useState } from "react";
import Form from "../../ui/Form.jsx";
import FormRowVertical from "../../ui/FormRowVertical.jsx";
import Input from "../../ui/Input.jsx";
import Button from "../../ui/Button.jsx";
import useForgotPassword from "./useForgotPassword.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { status, onForgotPassword, pendingForgotPassword } =
    useForgotPassword();
  const isSuccessful = status === "success";

  function handleSubmit(e) {
    e.preventDefault();
    onForgotPassword(email, {
      onSettled: () => {
        setEmail("");
      },
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      {isSuccessful && (
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
