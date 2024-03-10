import { useState } from "react";
import FormRowVertical from "../../ui/FormRowVertical";
import Button from "../../ui/Button";
import Form from "../../ui/Form";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {}

  return (
    <Form className="mx-auto w-96 px-10 py-10" onSubmit={handleSubmit}>
      <FormRowVertical className="mb-4" label="Name">
        <input
          type="name"
          id="name"
          // This makes this form better for password managers
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
      </FormRowVertical>

      <FormRowVertical className="mb-4" label="Email address">
        <input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
      </FormRowVertical>

      <FormRowVertical label="Password">
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
      </FormRowVertical>

      <Button isBlock className="mt-5">
        Login
      </Button>
    </Form>
  );
}
