import { lazy, Suspense } from "react";
import LoadingState from "../components/common/LoadingState";
import RouteError from "../components/common/RouteError";
import Services from "../pages/Services";
import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
import RequireAuth from "../components/admin/RequireAuth";

import Home from "../pages/Home";
import About from "../pages/About";
import Expertise from "../pages/Expertise";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import Journey from "../pages/Journey";
import Certifications from "../pages/Certifications";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";

const AdminLogin = lazy(() => import("../pages/admin/Login"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminProfile = lazy(() => import("../pages/admin/Profile"));
const AdminProjects = lazy(() => import("../pages/admin/Projects"));
const AdminSkills = lazy(() => import("../pages/admin/Skills"));
const AdminJourney = lazy(() => import("../pages/admin/Journey"));
const AdminEducation = lazy(() => import("../pages/admin/Education"));
const AdminServices = lazy(() => import("../pages/admin/Services"));
const AdminCertifications = lazy(() => import("../pages/admin/Certifications"));
const AdminMessages = lazy(() => import("../pages/admin/Messages"));
const AdminSettings = lazy(() => import("../pages/admin/Settings"));

export const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/services", element: <Services /> },
      { path: "/expertise", element: <Expertise /> },
      { path: "/projects", element: <Projects /> },
      { path: "/projects/:id", element: <ProjectDetail /> },
      { path: "/journey", element: <Journey /> },
      { path: "/certifications", element: <Certifications /> },
      { path: "/contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  // Admin routes are registered here only — never linked from public
  // navigation — so they exist but aren't discoverable through browsing.
  {
    path: "/admin/login",
    element: (
      <Suspense fallback={<LoadingState />}>
        <AdminLogin />
      </Suspense>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/admin",
    errorElement: <RouteError />,
    element: (
      <RequireAuth>
        <Suspense fallback={<LoadingState />}>
          <AdminLayout />
        </Suspense>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "profile", element: <AdminProfile /> },
      { path: "projects", element: <AdminProjects /> },
      { path: "skills", element: <AdminSkills /> },
      { path: "journey", element: <AdminJourney /> },
      { path: "education", element: <AdminEducation /> },
      { path: "services", element: <AdminServices /> },
      { path: "certifications", element: <AdminCertifications /> },
      { path: "messages", element: <AdminMessages /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
]);
