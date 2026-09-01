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
      await client.auth.signInWithEmailAndPassword(email, password);

    } catch (e: any) {
      setSignInError(`${e.name} - ${e.message}`);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={(isLoading) ? "pointer-events-none opacity-50 transition-all cursor-wait" : ""}>

      {/*
        * Sign-in with Email/Password
        */}
      <h2 className="text-xl mb-2">Login</h2>
      <form onSubmit={onSubmit} className="flex mb-8">
        <div className="flex gap-2">
          <input className="p-2 rounded text-slate-800" type="text" name="email" placeholder="Email" />
          <input className="p-2 rounded text-slate-800" type="password" name="password" placeholder="Password" />
          <button type="submit" className="p-2 border rounded border-slate-500 hover:border-slate-400">Sign in</button>
          {/* Error message */}
          {(signInError) && <p className="text-red-500">{signInError}</p>}
        </div>
      </form>
      <NavLink to="/create-account">Create an account</NavLink>
    </div>
  )
}

export default SignIn
