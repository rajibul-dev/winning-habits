import { useState } from "react";
import FormRowVertical from "../../ui/FormRowVertical";
import Form from "../../ui/Form";
import Button from "../../ui/Button.jsx";
import Input from "../../ui/Input.jsx";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {}

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical className="mb-4" label="Name">
        <Input
          type="name"
          id="name"
          // This makes this form better for password managers
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormRowVertical>

      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormRowVertical>

      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormRowVertical>

      <FormRowVertical>
        <Button>Login</Button>
      </FormRowVertical>
    </Form>
  );
}
