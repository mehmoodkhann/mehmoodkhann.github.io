import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { setPageMeta } from "../../utils/seo";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const reduceMotion = useReducedMotion();
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setPageMeta({
      title: "Local admin login | Mehmood Khan",
      description: "Local portfolio editor. This is demo authentication.",
      noindex: true,
    });
  }, []);

  if (isAuthenticated) {
    return (
      <Navigate
        to={location.state?.from?.pathname || "/admin/dashboard"}
        replace
      />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let ok = false;
    try {
      ok = await login(password);
    } catch {
      setError(
        "Browser storage is unavailable. Enable site storage to use this local editor.",
      );
      setLoading(false);
      return;
    }
    setLoading(false);
    if (ok) {
      navigate(location.state?.from?.pathname || "/admin/dashboard", {
        replace: true,
      });
    } else {
      setError("Incorrect password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base grid-field px-4">
      <motion.form
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.4 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl card-border bg-base p-8"
      >
        <h1 className="font-display text-xl text-ink">Admin Login</h1>
        <p className="text-sm text-muted mt-1">
          Manage the portfolio's content.
        </p>

        <div className="mt-6">
          <label htmlFor="password" className="block text-sm text-ink mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md card-border bg-transparent px-3.5 py-2.5 text-sm text-ink focus:outline-none"
          />
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-accent text-white py-2.5 text-sm font-medium hover:bg-[#4a58e0] transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="mt-6 text-xs text-muted font-mono leading-relaxed">
          Demo/local auth only — this is not secure production authentication.
          See services/authService.js.
        </p>
      </motion.form>
    </div>
  );
}
