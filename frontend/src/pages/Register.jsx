import RegisterForm from "../features/authentication/RegisterForm";

export default function Signup() {
  return (
    <div className="flex h-dvh w-full flex-col justify-center bg-zinc-100 px-4">
      <h2 className="mb-9 text-center text-3xl font-bold">
        Create your account
      </h2>
      <RegisterForm />
    </div>
  );
}
