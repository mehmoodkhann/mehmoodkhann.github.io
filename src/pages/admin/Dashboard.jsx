import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { projectsService } from "../../services/projectsService";
import { skillsService } from "../../services/skillsService";
import { certificationsService } from "../../services/certificationsService";
import { messagesService } from "../../services/messagesService";

const CARDS = [
  {
    key: "projects",
    label: "Projects",
    to: "/admin/projects",
    service: projectsService,
  },
  {
    key: "skills",
    label: "Skills",
    to: "/admin/skills",
    service: skillsService,
  },
  {
    key: "certifications",
    label: "Certifications",
    to: "/admin/certifications",
    service: certificationsService,
  },
  {
    key: "messages",
    label: "Messages",
    to: "/admin/messages",
    service: messagesService,
  },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const entries = await Promise.all(
          CARDS.map(async (c) => [c.key, (await c.service.list()).length]),
        );
        setCounts(Object.fromEntries(entries));
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Dashboard</h1>
      <p className="text-sm text-muted mt-1">
        Overview of your portfolio content. Changes apply to this browser only.
        Publishing shared content requires updating the source or connecting a
        backend.
      </p>

      {error && (
        <p role="alert" className="field-error mt-4">
          {error}
        </p>
      )}
      <div className="mt-8 grid grid-cols-2 xl:grid-cols-4 gap-4">
        {CARDS.map((c) => (
          <Link
            key={c.key}
            to={c.to}
            className="rounded-xl card-border p-5 hover:border-accent/50 transition-colors"
          >
            <p className="font-display text-3xl text-ink">
              {counts[c.key] ?? "–"}
            </p>
            <p className="text-sm text-muted mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl card-border p-6">
        <h2 className="font-display text-lg text-ink">About this data layer</h2>
        <p className="text-sm text-muted mt-2 leading-relaxed max-w-xl">
          All content is currently stored in your browser's localStorage — it's
          a temporary, frontend-only store meant to make this admin panel usable
          before a real backend exists. It persists across reloads on this
          device and browser, but won't sync to other devices. See the README
          for how to connect a FastAPI backend later.
        </p>
      </div>
    </div>
  );
}
