import { AuthForm } from "@/components/auth/AuthForm";

const Login = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md text-center mb-8">
        <div className="flex justify-center mb-8">
          <img
            src="/uploads/spell out logo.png"
            alt="AEGL - Auditive Engine Generative Ledger"
            className="h-28 w-auto mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-teal-400 mb-2">
          AEGL
        </h1>
        <p className="text-slate-400 text-lg">
          Auditive Engine Generative Ledger
        </p>
      </div>

      <AuthForm />
    </div>
  );
};

export default Login;
