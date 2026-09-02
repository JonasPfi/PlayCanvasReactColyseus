import { useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { client } from "../../core/colyseus";

function SignIn() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [signInError, setSignInError] = useState("");

  // navigate to root ("/") once authenticated.
  if (user) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;
    try {
      setIsLoading(true);
      setSignInError("");
      await client.auth.signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      setSignInError(`${e.name} - ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        </div>

        <form
          onSubmit={onSubmit}
          className={`rounded-xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur transition-opacity ${
            isLoading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs text-slate-400">
                Email
              </label>
              <input
                id="email"
                className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-white placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-xs text-slate-400">
                Password
              </label>
              <input
                id="password"
                className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-white placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
                type="password"
                name="password"
                placeholder="Your password"
                required
              />
            </div>

            {signInError && (
              <p className="rounded-lg bg-red-500/10 p-2 text-sm text-red-400">
                {signInError}
              </p>
            )}

            <button
              type="submit"
              className="mt-2 rounded-lg bg-white p-2 font-medium text-slate-900 transition-colors hover:bg-slate-200 disabled:cursor-wait"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <NavLink to="/create-account" className="text-white hover:underline">
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
