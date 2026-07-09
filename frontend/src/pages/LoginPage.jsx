import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ErrorMessage } from "../components/Feedback.jsx";
import { login } from "../store/authSlice.js";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { token, status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (token && status !== "failed") return <Navigate to="/projects" replace />;

  const submit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      navigate("/projects");
    } catch {
      /* Redux renders the error. */
    }
  };

  return (
    <main className="login-layout">
      <section className="login-story">
        <div className="brand light">
          <span className="brand-mark">N</span>
          <span>Northstar</span>
        </div>
        <div>
          <span className="eyebrow">Work in sync</span>
          <h1>
            Momentum lives
            <br />
            in the details.
          </h1>
          <p>
            Plan projects, move work forward, and see every update the moment it
            happens.
          </p>
        </div>
        <small>Internal workspace · Real-time collaboration</small>
      </section>
      <section className="login-panel">
        <form className="login-form" onSubmit={submit}>
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in to your workspace</h2>
          <p>Enter your credentials to continue.</p>
          <ErrorMessage message={error} />
          <label>
            Email address
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              placeholder="you@company.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength="8"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              placeholder="At least 8 characters"
            />
          </label>
          <button className="button wide" disabled={status === "loading"}>
            {status === "loading" ? "Signing in…" : "Sign in"}
          </button>
          <p className="auth-switch">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
