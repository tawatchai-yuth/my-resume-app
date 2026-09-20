import { LoginForm } from "@/features/auth/components/login-form";

const Login = () => {
  return (
    <main className="min-h-screen">
      <div className="flex min-h-screen items-center justify-center p-6">
        <LoginForm />
      </div>
    </main>
  );
};

export default Login;
