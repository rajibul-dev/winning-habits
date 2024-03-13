import { useState } from "react";
import Form from "../../ui/Form";
import FormRowVertical from "../../ui/FormRowVertical";
import useLogin from "./useLogin";
import Button from "../../ui/Button.jsx";
import Input from "../../ui/Input.jsx";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLogining, error } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      },
    );
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
          id="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FormRowVertical>

      <FormRowVertical>
        <Button disabled={isLogining}>
          {!isLogining ? "Login" : "Logging in..."}
        </Button>
      </FormRowVertical>
    </Form>
  );
}
