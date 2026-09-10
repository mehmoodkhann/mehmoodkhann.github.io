// ---------------------------------------------------------------------------
// AUTH SERVICE — DEMO / LOCAL AUTHENTICATION ONLY
// ---------------------------------------------------------------------------
// IMPORTANT — READ BEFORE DEPLOYING PUBLICLY:
//
// This is NOT secure authentication. It checks a password against a value
// read from a Vite environment variable (VITE_ADMIN_PASSWORD). Vite inlines
// VITE_* variables into the JavaScript bundle at build time, which means
// this "password" ships to the browser in plain text and can be read by
// anyone who opens devtools or views the bundled source. There is no server
// verifying anything — a user could also just flip `mk_portfolio_v1:auth`
// in localStorage by hand.
//
// This exists ONLY so the admin panel is usable during local development
// while the real backend doesn't exist yet. Do not rely on it to protect
// real secrets or gate anything sensitive in a deployed build.
//
// REPLACING THIS WITH REAL AUTH:
// When the FastAPI backend exists, replace the body of `login()` with a
// POST to /api/v1/auth/login that returns a JWT or session cookie, store
// the token (ideally an httpOnly cookie set by the server, not localStorage),
// and have `isAuthenticated()` verify that token/cookie with the server
// instead of reading a local flag. The function signatures below are kept
// stable on purpose so that swap doesn't touch any component.
// ---------------------------------------------------------------------------

const SESSION_KEY = "mk_portfolio_v1:auth";
const DEMO_PASSWORD = import.meta.env?.VITE_ADMIN_PASSWORD || "demo-admin";

export const authService = {
  login: async (password) => {
    const ok = password === DEMO_PASSWORD;
    if (ok) {
      window.localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ authenticated: true, at: Date.now() }),
      );
    }
    return ok;
  },
  logout: async () => {
    window.localStorage.removeItem(SESSION_KEY);
  },
  isAuthenticated: () => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (!raw) return false;
      return Boolean(JSON.parse(raw).authenticated);
    } catch {
      return false;
    }
  },
};
