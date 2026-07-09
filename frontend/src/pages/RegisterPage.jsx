import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ErrorMessage } from "../components/Feedback.jsx";
import { register } from "../store/authSlice.js";

export function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { token, status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (token && status !== "failed") return <Navigate to="/projects" replace />;

  const submit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
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
          <span className="eyebrow">Join the workspace</span>
          <h1>
            Start moving
            <br />
            work forward.
          </h1>
          <p>
            Create your account, build a project, and collaborate with your team
            in real time.
          </p>
        </div>
        <small>Project planning · Real-time collaboration</small>
      </section>
      <section className="login-panel">
        <form className="login-form" onSubmit={submit}>
          <span className="eyebrow">Get started</span>
          <h2>Create your account</h2>
          <p>Use your details to set up a new workspace account.</p>
          <ErrorMessage message={error} />
          <label>
            Full name
            <input
              required
              minLength="2"
              maxLength="80"
              autoComplete="name"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="Your name"
            />
          </label>
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
              maxLength="128"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              placeholder="At least 8 characters"
            />
          </label>
          <button className="button wide" disabled={status === "loading"}>
            {status === "loading" ? "Creating account…" : "Create account"}
          </button>
          <p className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
