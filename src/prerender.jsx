import { renderToString } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Expertise from "./pages/Expertise";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Journey from "./pages/Journey";
import Certifications from "./pages/Certifications";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import { defaultProjects, defaultSettings } from "./data/defaultData";
export const pages = [
  {
    path: "/",
    title: defaultSettings.siteTitle,
    description: defaultSettings.siteDescription,
  },
  {
    path: "/about",
    title: "About Mehmood Khan | AI Engineer",
    description:
      "Computer Science student at QUEST, Nawabshah, building RAG applications and learning the engineering behind intelligent systems.",
  },
  {
    path: "/expertise",
    title: "Technical Skills | Mehmood Khan",
    description:
      "Applied skills in RAG, NLP, Python, FastAPI, LangChain, Hugging Face embeddings, Qdrant, and React.",
  },
  {
    path: "/services",
    title: "AI Development Services | Mehmood Khan",
    description:
      "Focused RAG prototypes, document-processing workflows, and AI application development with Python, FastAPI, and React.",
  },
  {
    path: "/projects",
    title: "AI Engineering Projects | Mehmood Khan",
    description:
      "Explore the Intelligent Research Paper Assistant, a RAG knowledge assistant, and Python application work.",
  },
  ...defaultProjects.map((p) => ({
    path: `/projects/${p.id}`,
    title: `${p.title} | Mehmood Khan`,
    description: p.summary,
    image: p.coverImage,
  })),
  {
    path: "/journey",
    title: "AI Engineering Journey | Mehmood Khan",
    description:
      "A learning path through programming, Python, NLP, RAG, vector databases, and agentic workflows.",
  },
  {
    path: "/certifications",
    title: "Certifications | Mehmood Khan",
    description:
      "Verified credentials and learning milestones from Mehmood Khan. Certifications will appear here when added.",
  },
  {
    path: "/contact",
    title: "Contact Mehmood Khan | AI Projects & Opportunities",
    description:
      "Start a conversation about RAG applications, document intelligence, internships, and junior AI engineering opportunities.",
  },
  {
    path: "/admin/login",
    title: "Local admin login | Mehmood Khan",
    description: "Local portfolio content editor. Demo authentication only.",
    noindex: true,
  },
  {
    path: "/404",
    title: "Page not found | Mehmood Khan",
    description: "This page is unavailable.",
    noindex: true,
  },
];
export function render(path) {
  return renderToString(
    <ThemeProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/expertise" element={<Expertise />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </ThemeProvider>,
  );
}
