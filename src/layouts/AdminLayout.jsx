import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  FiGrid,
  FiUser,
  FiFolder,
  FiAward,
  FiClock,
  FiBook,
  FiLayers,
  FiCheckCircle,
  FiMail,
  FiSettings,
  FiLogOut,
  FiExternalLink,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { setPageMeta } from "../utils/seo";
import { useDialog } from "../hooks/useDialog";
import { useAuth } from "../contexts/AuthContext";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/admin/profile", label: "Profile", icon: FiUser },
  { to: "/admin/projects", label: "Projects", icon: FiFolder },
  { to: "/admin/skills", label: "Skills", icon: FiAward },
  { to: "/admin/journey", label: "Journey", icon: FiClock },
  { to: "/admin/education", label: "Education", icon: FiBook },
  { to: "/admin/services", label: "Services", icon: FiLayers },
  { to: "/admin/certifications", label: "Certifications", icon: FiCheckCircle },
  { to: "/admin/messages", label: "Messages", icon: FiMail },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

function SidebarContent({ onNavigate, onLogout }) {
  return (
    <>
      <div className="h-16 shrink-0 flex items-center px-6 border-b card-border">
        <span className="font-display font-semibold">Admin Panel</span>
      </div>
      <nav
        className="flex-1 overflow-y-auto py-4 px-3 space-y-1"
        aria-label="Admin"
      >
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "text-muted hover:text-ink hover:bg-surfacealt"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t card-border space-y-1 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted hover:text-ink hover:bg-surfacealt transition-colors"
        >
          <FiExternalLink size={16} />
          View site
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted hover:text-ink hover:bg-surfacealt transition-colors"
        >
          <FiLogOut size={16} />
          Log out
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawer = useDialog(drawerOpen, () => setDrawerOpen(false));
  useEffect(() => {
    setPageMeta({
      title: "Content editor | Mehmood Khan",
      description: "Local portfolio content editor.",
      noindex: true,
    });
  }, [location.pathname]);

  // Close the mobile drawer automatically whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex bg-base text-ink">
        {/* Desktop sidebar — permanent, hidden below md */}
        <aside className="hidden lg:flex w-64 shrink-0 border-r card-border flex-col">
          <SidebarContent onLogout={handleLogout} />
        </aside>

        {/* Mobile/tablet drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                aria-hidden="true"
              />
              <motion.aside
                ref={drawer}
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-base border-r card-border flex flex-col lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Admin navigation"
              >
                <div className="flex items-center justify-end px-3 pt-3">
                  <button
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close menu"
                    className="rounded-md p-2 text-muted hover:text-ink hover:bg-surfacealt transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <SidebarContent
                  onNavigate={() => setDrawerOpen(false)}
                  onLogout={handleLogout}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 min-w-0">
          {/* Mobile/tablet top bar */}
          <div className="lg:hidden sticky top-0 z-30 flex h-16 items-center gap-3 border-b card-border bg-base px-4">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="rounded-md p-2 text-muted hover:text-ink hover:bg-surfacealt transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <span className="font-display font-semibold">Admin Panel</span>
          </div>

          <main className="p-4 sm:p-6 md:p-10 max-w-5xl min-w-0">
            <p className="status-note mb-8">
              Local content editor. Changes stay in this browser and do not
              update other visitors’ content.
            </p>
            <Outlet />
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
