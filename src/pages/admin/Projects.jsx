import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from "react-icons/fi";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { projectsService } from "../../services/projectsService";
import { fileToCompressedDataUrl } from "../../utils/imageUpload";
import Field from "../../components/admin/Field";
import { useDialog } from "../../hooks/useDialog";

const blankCaseStudy = {
  overview: "",
  problem: "",
  solution: "",
  architectureSteps: [],
  whyTheseTools: [],
  engineeringDecisions: "",
  challenges: "",
  results: "",
  value: "",
  evidence: "",
  limitations: "",
  implementation: [],
};

const blankProject = {
  title: "",
  role: "",
  category: "",
  coverAlt: "",
  summary: "",
  contribution: "",
  capabilities: [],
  coverImage: "",
  screenshots: [],
  architectureDiagram: "",
  githubUrl: "",
  liveUrl: "",
  videoUrl: "",
  featured: false,
  technologies: [],
  pipeline: [],
  caseStudy: blankCaseStudy,
};

function listField(value) {
  return (value || []).join(", ");
}
function parseList(value) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// architectureSteps / whyTheseTools are arrays of {step,detail} / {tool,reason}
// pairs. Editing them as newline-separated "label :: detail" text keeps the
// form flat instead of needing a nested repeater UI, while still writing out
// the same structured shape components expect.
function pairsToText(items, keyA, keyB) {
  return (items || []).map((i) => `${i[keyA]} :: ${i[keyB]}`).join("\n");
}
function textToPairs(text, keyA, keyB) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [a, ...rest] = line.split("::");
      return { [keyA]: a.trim(), [keyB]: rest.join("::").trim() };
    });
}

export default function Projects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      setItems(await projectsService.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (p) => {
    const next = {
      ...blankProject,
      ...p,
      caseStudy: { ...blankCaseStudy, ...p.caseStudy },
    };
    setEditing(next);
    setDraft({
      technologies: listField(next.technologies),
      pipeline: listField(next.pipeline),
      capabilities: (next.capabilities || []).join("\n"),
      screenshots: listField(
        next.screenshots?.filter((s) => !s.startsWith("data:")),
      ),
      architecture: pairsToText(
        next.caseStudy.architectureSteps,
        "step",
        "detail",
      ),
      tools: pairsToText(next.caseStudy.whyTheseTools, "tool", "reason"),
      implementation: JSON.stringify(
        next.caseStudy.implementation || [],
        null,
        2,
      ),
    });
    setError("");
  };
  const openNew = () => openEdit(blankProject);
  const close = () => {
    setEditing(null);
    setError("");
  };
  const dialog = useDialog(Boolean(editing), close);
  const setDraftField = (field, value) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    try {
      await projectsService.remove(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const implementation = JSON.parse(draft.implementation || "[]");
      if (
        !Array.isArray(implementation) ||
        implementation.some(
          (g) =>
            !g.title ||
            !Array.isArray(g.files) ||
            g.files.some((f) => typeof f !== "string") ||
            typeof g.detail !== "string",
        )
      )
        throw new Error(
          "Implementation must be a JSON array of groups with title, files, and detail.",
        );
      if (!editing.title.trim()) throw new Error("Enter a project title.");
      const normalized = {
        ...editing,
        title: editing.title.trim(),
        technologies: parseList(draft.technologies || ""),
        pipeline: parseList(draft.pipeline || ""),
        capabilities: (draft.capabilities || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        screenshots: [
          ...(editing.screenshots || []).filter((s) => s.startsWith("data:")),
          ...parseList(draft.screenshots || ""),
        ],
        caseStudy: {
          ...editing.caseStudy,
          architectureSteps: textToPairs(
            draft.architecture || "",
            "step",
            "detail",
          ),
          whyTheseTools: textToPairs(draft.tools || "", "tool", "reason"),
          implementation,
        },
      };
      if (editing.id) {
        await projectsService.update(editing.id, normalized);
      } else {
        await projectsService.create(normalized);
      }
      await load();
      close();
    } catch (err) {
      setError(err.message || "The project could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const set = (patch) => setEditing((e) => ({ ...e, ...patch }));
  const setCase = (patch) =>
    setEditing((e) => ({ ...e, caseStudy: { ...e.caseStudy, ...patch } }));

  const [uploading, setUploading] = useState(false);

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      set({ coverImage: dataUrl });
    } catch (err) {
      window.alert(err.message || "Could not upload that image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleScreenshotsUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const dataUrls = await Promise.all(
        files.map((f) => fileToCompressedDataUrl(f)),
      );
      setEditing((prev) => ({
        ...prev,
        screenshots: [...(prev.screenshots || []), ...dataUrls],
      }));
    } catch (err) {
      window.alert(err.message || "Could not upload one of those images.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeScreenshot = (index) => {
    const removed = editing.screenshots[index];
    setEditing((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
    if (!removed.startsWith("data:"))
      setDraftField(
        "screenshots",
        parseList(draft.screenshots || "")
          .filter((url) => url !== removed)
          .join(", "),
      );
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl text-ink">Projects</h1>
          <p className="text-sm text-muted mt-1 max-w-lg">
            Manage featured projects and their full engineering case studies.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-md bg-accent text-white px-4 py-2.5 text-sm font-medium hover:bg-[#4a58e0] transition-colors shrink-0"
        >
          <FiPlus size={16} /> Add project
        </button>
      </div>

      {error && !editing && (
        <p className="field-error mb-4" role="alert">
          {error}
        </p>
      )}
      {loading && <LoadingState label="Loading projects" />}
      {!loading && items.length === 0 && <EmptyState title="No projects yet" />}

      {!loading && items.length > 0 && (
        <div className="rounded-lg card-border admin-table-wrap">
          <table className="w-full text-sm admin-table">
            <thead>
              <tr className="bg-surfacealt text-left">
                <th className="px-4 py-3 font-mono text-xs text-muted font-normal">
                  Title
                </th>
                <th className="px-4 py-3 font-mono text-xs text-muted font-normal">
                  Role
                </th>
                <th className="px-4 py-3 font-mono text-xs text-muted font-normal">
                  Featured
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t card-border">
                  <td data-label="Title" className="px-4 py-3 text-ink">
                    {p.title}
                  </td>
                  <td data-label="Role" className="px-4 py-3 text-muted">
                    {p.role}
                  </td>
                  <td data-label="Featured" className="px-4 py-3 text-muted">
                    {p.featured ? "Yes" : "No"}
                  </td>
                  <td
                    data-label="Actions"
                    className="px-4 py-3 text-right whitespace-nowrap"
                  >
                    <button
                      onClick={() => openEdit(p)}
                      className="icon-button !border-0 text-muted hover:text-ink"
                      aria-label={`Edit ${p.title}`}
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="icon-button !border-0 text-muted hover:text-red-400"
                      aria-label={`Delete ${p.title}`}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-editor-title"
            onSubmit={handleSave}
            className="w-full max-w-2xl rounded-xl bg-base card-border p-6 max-h-[88vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-base pb-2">
              <h2
                id="project-editor-title"
                className="font-display text-lg text-ink"
              >
                {editing.id ? "Edit project" : "Add project"}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="icon-button !border-0 text-muted hover:text-ink"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <Field label="Title">
                <input
                  value={editing.title}
                  onChange={(e) => set({ title: e.target.value })}
                  className="fld"
                  required
                />
              </Field>
              <Field label="Category">
                <input
                  className="fld"
                  value={editing.category || ""}
                  onChange={(e) => set({ category: e.target.value })}
                />
              </Field>
              <Field label="Role">
                <input
                  value={editing.role}
                  onChange={(e) => set({ role: e.target.value })}
                  className="fld"
                  placeholder="e.g. AI/NLP & RAG Developer"
                />
              </Field>
              <Field label="Summary">
                <textarea
                  rows={3}
                  value={editing.summary}
                  onChange={(e) => set({ summary: e.target.value })}
                  className="fld resize-none"
                />
              </Field>
              <Field label="My contribution">
                <textarea
                  rows={2}
                  className="fld"
                  value={editing.contribution || ""}
                  onChange={(e) => set({ contribution: e.target.value })}
                />
              </Field>
              <Field label="Capabilities (one per line)">
                <textarea
                  rows={4}
                  className="fld"
                  value={draft.capabilities || ""}
                  onChange={(e) =>
                    setDraftField("capabilities", e.target.value)
                  }
                />
              </Field>
              <Field label="Architecture diagram URL">
                <input
                  className="fld"
                  value={editing.architectureDiagram || ""}
                  onChange={(e) => set({ architectureDiagram: e.target.value })}
                />
              </Field>
              <Field label="Technologies (comma-separated)">
                <input
                  value={draft.technologies || ""}
                  onChange={(e) =>
                    setDraftField("technologies", e.target.value)
                  }
                  className="fld"
                />
              </Field>
              <Field label="Pipeline steps (comma-separated, shown as a flow diagram)">
                <input
                  value={draft.pipeline || ""}
                  onChange={(e) => setDraftField("pipeline", e.target.value)}
                  className="fld"
                  placeholder="e.g. PDF Upload, Chunking, Embeddings, Qdrant, Gemini"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="GitHub URL">
                  <input
                    value={editing.githubUrl}
                    onChange={(e) => set({ githubUrl: e.target.value })}
                    className="fld"
                    placeholder="https://github.com/…"
                  />
                </Field>
                <Field label="Live demo URL">
                  <input
                    value={editing.liveUrl}
                    onChange={(e) => set({ liveUrl: e.target.value })}
                    className="fld"
                  />
                </Field>
                <Field label="Video demo URL">
                  <input
                    value={editing.videoUrl}
                    onChange={(e) => set({ videoUrl: e.target.value })}
                    className="fld"
                  />
                </Field>
              </div>

              <Field label="Cover image">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {editing.coverImage && (
                    <img
                      src={editing.coverImage}
                      alt="Cover preview"
                      className="h-20 w-32 rounded-md object-cover card-border shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0 w-full space-y-2">
                    <label className="inline-flex items-center gap-2 rounded-md card-border px-3 py-2 text-sm text-ink hover:bg-surfacealt transition-colors cursor-pointer w-fit">
                      <FiUpload size={14} />{" "}
                      {uploading ? "Uploading…" : "Upload image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="sr-only"
                        disabled={uploading}
                      />
                    </label>
                    <input
                      value={
                        editing.coverImage?.startsWith("data:")
                          ? ""
                          : editing.coverImage
                      }
                      onChange={(e) => set({ coverImage: e.target.value })}
                      aria-label="Cover image URL"
                      className="fld"
                      placeholder="…or paste an image URL instead"
                    />
                  </div>
                </div>
              </Field>

              <Field label="Cover description / alt text">
                <input
                  className="fld"
                  value={editing.coverAlt || ""}
                  onChange={(e) => set({ coverAlt: e.target.value })}
                />
              </Field>
              <Field label="Screenshots">
                <label className="inline-flex items-center gap-2 rounded-md card-border px-3 py-2 text-sm text-ink hover:bg-surfacealt transition-colors cursor-pointer w-fit">
                  <FiUpload size={14} />{" "}
                  {uploading ? "Uploading…" : "Add screenshots"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleScreenshotsUpload}
                    className="sr-only"
                    disabled={uploading}
                  />
                </label>
                {editing.screenshots?.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {editing.screenshots.map((src, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={src}
                          alt={`Screenshot ${i + 1}`}
                          className="h-20 w-full rounded-md object-cover card-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeScreenshot(i)}
                          aria-label="Remove screenshot"
                          className="absolute -top-1.5 -right-1.5 rounded-full bg-base card-border p-1 text-muted hover:text-red-400 opacity-100 transition-opacity"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted mt-2">
                  You can also paste URLs directly instead of uploading —
                  comma-separated:
                </p>
                <input
                  value={draft.screenshots || ""}
                  onChange={(e) => setDraftField("screenshots", e.target.value)}
                  aria-label="Screenshot URLs"
                  className="fld mt-1.5"
                />
              </Field>

              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={Boolean(editing.featured)}
                  onChange={(e) => set({ featured: e.target.checked })}
                />
                Show in "Featured projects" on the home page
              </label>

              <div className="pt-4 border-t card-border">
                <p className="font-mono text-xs text-signal mb-4">Case study</p>

                <Field label="Overview">
                  <textarea
                    rows={2}
                    value={editing.caseStudy.overview}
                    onChange={(e) => setCase({ overview: e.target.value })}
                    className="fld resize-none"
                  />
                </Field>
                <Field label="Problem">
                  <textarea
                    rows={2}
                    value={editing.caseStudy.problem}
                    onChange={(e) => setCase({ problem: e.target.value })}
                    className="fld resize-none"
                  />
                </Field>
                <Field label="Solution">
                  <textarea
                    rows={2}
                    value={editing.caseStudy.solution}
                    onChange={(e) => setCase({ solution: e.target.value })}
                    className="fld resize-none"
                  />
                </Field>
                <Field label="Architecture steps — one per line, as: Step name :: Explanation">
                  <textarea
                    rows={4}
                    value={draft.architecture || ""}
                    onChange={(e) =>
                      setDraftField("architecture", e.target.value)
                    }
                    className="fld resize-none font-mono text-xs"
                  />
                </Field>
                <Field label="Why these tools — one per line, as: Tool name :: Reason">
                  <textarea
                    rows={4}
                    value={draft.tools || ""}
                    onChange={(e) => setDraftField("tools", e.target.value)}
                    className="fld resize-none font-mono text-xs"
                  />
                </Field>
                <Field label="Backend implementation (JSON: title, files array, detail)">
                  <textarea
                    rows={6}
                    className="fld font-mono"
                    value={draft.implementation || "[]"}
                    onChange={(e) =>
                      setDraftField("implementation", e.target.value)
                    }
                  />
                </Field>
                <Field label="Practical value">
                  <textarea
                    rows={3}
                    className="fld"
                    value={editing.caseStudy.value || ""}
                    onChange={(e) => setCase({ value: e.target.value })}
                  />
                </Field>
                <Field label="Limitations">
                  <textarea
                    rows={3}
                    className="fld"
                    value={editing.caseStudy.limitations || ""}
                    onChange={(e) => setCase({ limitations: e.target.value })}
                  />
                </Field>
                <Field label="Evidence and source verification">
                  <textarea
                    rows={3}
                    className="fld"
                    value={editing.caseStudy.evidence || ""}
                    onChange={(e) => setCase({ evidence: e.target.value })}
                  />
                </Field>
                <Field label="Engineering decisions / trade-offs">
                  <textarea
                    rows={2}
                    value={editing.caseStudy.engineeringDecisions}
                    onChange={(e) =>
                      setCase({ engineeringDecisions: e.target.value })
                    }
                    className="fld resize-none"
                  />
                </Field>
                <Field label="Challenges">
                  <textarea
                    rows={2}
                    value={editing.caseStudy.challenges}
                    onChange={(e) => setCase({ challenges: e.target.value })}
                    className="fld resize-none"
                  />
                </Field>
                <Field label="Results (leave blank until you have real measured results — don't invent numbers)">
                  <textarea
                    rows={2}
                    value={editing.caseStudy.results || ""}
                    onChange={(e) => setCase({ results: e.target.value })}
                    className="fld resize-none"
                  />
                </Field>
              </div>
            </div>

            {error && (
              <p className="field-error mt-5" role="alert">
                {error}
              </p>
            )}
            <div className="mt-6 flex gap-3 sticky bottom-0 bg-base pt-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 rounded-md bg-accent text-white py-2.5 text-sm font-medium hover:bg-[#4a58e0] transition-colors disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save project"}
              </button>
              <button
                type="button"
                onClick={close}
                className="flex-1 rounded-md card-border py-2.5 text-sm text-ink hover:bg-surfacealt transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
