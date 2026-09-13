import { useEffect, useState } from "react";
import { settingsService } from "../../services/settingsService";
import { exportContent, resetAll } from "../../services/storage";
import LoadingState from "../../components/common/LoadingState";
import Field from "../../components/admin/Field";
export default function Settings() {
  const [form, setForm] = useState(null),
    [saving, setSaving] = useState(false),
    [saved, setSaved] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    settingsService
      .get()
      .then(setForm)
      .catch((err) => setError(err.message));
  }, []);
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await settingsService.update(form);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const reset = async () => {
    if (
      !window.confirm(
        "Reset all local content to the defaults? Export a backup first if you want to keep your edits.",
      )
    )
      return;
    try {
      await resetAll();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };
  const backup = async () => {
    try {
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(await exportContent(), null, 2)], {
          type: "application/json",
        }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "portfolio-content-backup.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError(err.message);
    }
  };
  if (!form)
    return (
      <>
        {error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : (
          <LoadingState />
        )}
      </>
    );
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl">Settings</h1>
      <p className="text-sm text-muted mt-2 mb-8">
        Home-page metadata and local draft management.
      </p>
      <form onSubmit={save} className="space-y-5">
        <Field label="Site title">
          <input
            className="fld"
            required
            value={form.siteTitle}
            onChange={(e) => set("siteTitle", e.target.value)}
          />
        </Field>
        <Field label="Site description">
          <textarea
            className="fld"
            rows={3}
            value={form.siteDescription}
            onChange={(e) => set("siteDescription", e.target.value)}
          />
        </Field>
        <Field label="API base URL (unused)">
          <input
            className="fld"
            value={form.apiBaseUrl}
            onChange={(e) => set("apiBaseUrl", e.target.value)}
          />
        </Field>
        <p className="text-xs text-muted leading-relaxed">
          The API setting is reserved for a future integration. The public site
          uses committed repository content and static search metadata is
          generated from source when you build the site.
        </p>
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
        {saved && (
          <p role="status" className="text-sm text-signal">
            Draft saved in this browser.
          </p>
        )}
      </form>
      {error && (
        <p className="field-error mt-5" role="alert">
          {error}
        </p>
      )}
      <div className="mt-10 card-border rounded-md p-6">
        <h2 className="font-display text-xl">Export draft content</h2>
        <p className="text-muted text-sm mt-3 mb-5 leading-relaxed">
          Download a JSON handoff for transferring reviewed edits into the
          committed source files. Exporting does not publish the edits.
        </p>
        <button onClick={backup} className="btn btn-secondary">
          Export content as JSON
        </button>
      </div>
      <div className="mt-8 border border-red-500/30 p-6 rounded-md">
        <h2 className="text-red-400 font-medium">Reset local drafts</h2>
        <p className="text-sm text-muted mt-3 mb-5">
          Restores this browser's draft collections to the supplied repository
          defaults. It does not change committed content.
        </p>
        <button onClick={reset} className="btn btn-secondary text-red-400">
          Reset all content to defaults
        </button>
      </div>
    </div>
  );
}
