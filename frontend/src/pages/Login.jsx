import LoginForm from "../features/authentication/LoginForm";

export default function Login() {
  return (
    <div className="flex h-dvh w-full flex-col justify-center bg-zinc-100 px-4">
      <h2 className="mb-9 text-center text-3xl font-bold">
        Login to your account
      </h2>
      <LoginForm />
    </div>
  );
}
