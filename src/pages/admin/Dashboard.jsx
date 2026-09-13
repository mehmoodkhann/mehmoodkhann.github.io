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
        Overview of your local draft content. The public portfolio reads the
        committed repository data and changes publish only after those files
        are updated and deployed.
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
        <h2 className="font-display text-lg text-ink">Draft workflow</h2>
        <p className="text-sm text-muted mt-2 leading-relaxed max-w-xl">
          Admin edits are local drafts for review and export. They do not change
          what visitors see. Update the committed data in
          <span className="font-mono text-ink"> src/data/defaultData.js</span>
          and committed assets, then push to GitHub Pages to publish globally.
        </p>
      </div>
    </div>
  );
}
