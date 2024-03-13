import { useState } from "react";
import FormRowVertical from "../../ui/FormRowVertical";
import Form from "../../ui/Form";
import Button from "../../ui/Button.jsx";
import Input from "../../ui/Input.jsx";
import useRegister from "./useRegister.js";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, isRegistering, error, isSuccess } = useRegister();

  function handleSubmit(e) {
    e.preventDefault();
    register(
      { name, email, password },
      {
        onSettled: () => {
          setName("");
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
      <FormRowVertical className="mb-4" label="Name">
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
    </Form>
  );
}
