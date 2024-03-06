import axios from "axios";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await axios.post(`http://localhost:5000/api/v1/auth/login`, {
      email,
      password,
    });

    console.log(res.data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email"
        type="email"
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <input
        placeholder="Password"
        type="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
