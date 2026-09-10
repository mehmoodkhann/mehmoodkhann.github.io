import { useEffect, useState } from "react";
import { profileService } from "../../services/profileService";
import { fileToCompressedDataUrl } from "../../utils/imageUpload";
import Field from "../../components/admin/Field";
import LoadingState from "../../components/common/LoadingState";

export default function Profile() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [aboutDraft, setAboutDraft] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const profile = await profileService.get();
        setForm(profile);
        setAboutDraft((profile.aboutLong || []).join("\n\n"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setSaved(false);
  };

  const setLongAbout = (value) => {
    setAboutDraft(value);
    setSaved(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file, {
        maxDimension: 1000,
      });
      set("photoUrl", dataUrl);
    } catch (err) {
      setError(err.message || "Could not upload that image.");
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  const handleFileToDataUrl = (name) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" || file.size > 2000000) {
      setError("Choose a PDF smaller than 2 MB for browser storage.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onerror = () => {
      setError("The file could not be read.");
      setUploading(false);
    };
    reader.onload = () => {
      set(name, reader.result);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await profileService.update({
        ...form,
        aboutLong: aboutDraft
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean),
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return error ? (
      <p className="field-error" role="alert">
        {error}
      </p>
    ) : (
      <LoadingState label="Loading profile" />
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-xl space-y-5">
      <h1 className="font-display text-2xl text-ink mb-1">Profile</h1>
      <p className="text-sm text-muted mb-6">
        Powers the Hero and About sections on the public site.
      </p>

      <Field label="Name">
        <input
          className="fld"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </Field>
      <Field label="Role / positioning">
        <input
          className="fld"
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
        />
      </Field>
      <Field label="Hero headline">
        <textarea
          className="fld"
          rows={2}
          value={form.heroHeadline || ""}
          onChange={(e) => set("heroHeadline", e.target.value)}
        />
      </Field>
      <Field label="Specializations">
        <input
          className="fld"
          value={form.specializations || ""}
          onChange={(e) => set("specializations", e.target.value)}
        />
      </Field>
      <Field label="Tagline">
        <input
          className="fld"
          value={form.tagline}
          onChange={(e) => set("tagline", e.target.value)}
        />
      </Field>
      <Field label="Location">
        <input
          className="fld"
          value={form.location || ""}
          onChange={(e) => set("location", e.target.value)}
        />
      </Field>
      <Field label="Current status">
        <input
          className="fld"
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
        />
      </Field>
      <Field label="Email">
        <input
          className="fld"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </Field>
      <Field label="GitHub URL">
        <input
          className="fld"
          value={form.github}
          onChange={(e) => set("github", e.target.value)}
        />
      </Field>
      <Field label="LinkedIn URL">
        <input
          className="fld"
          value={form.linkedin}
          onChange={(e) => set("linkedin", e.target.value)}
        />
      </Field>

      <Field label="Profile photo">
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="text-sm text-muted"
        />
        {form.photoUrl && (
          <img
            src={form.photoUrl}
            alt="Preview"
            className="mt-3 h-32 w-32 rounded-lg object-cover card-border"
          />
        )}
        {form.photoUrl && (
          <button
            type="button"
            className="text-link mt-3"
            onClick={() => set("photoUrl", "")}
          >
            Remove photo
          </button>
        )}
      </Field>
      <Field label="Photo URL or public file path">
        <input
          className="fld"
          value={form.photoUrl?.startsWith("data:") ? "" : form.photoUrl || ""}
          onChange={(e) => set("photoUrl", e.target.value)}
          placeholder="/images/mehmood-khan.webp"
        />
      </Field>
      <p className="text-sm text-muted">
        Use your real photo. Uploads are resized for browser storage; no face or
        identity changes are applied.
      </p>
      <Field label="Resume (PDF)">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileToDataUrl("resumeUrl")}
          className="text-sm text-muted"
        />
        {form.resumeUrl && (
          <p className="text-xs text-signal mt-1">Resume uploaded.</p>
        )}
      </Field>

      <Field label="Resume URL or public file path">
        <input
          className="fld"
          value={
            form.resumeUrl?.startsWith("data:") ? "" : form.resumeUrl || ""
          }
          onChange={(e) => set("resumeUrl", e.target.value)}
          placeholder="/mehmood-khan-resume.pdf"
        />
      </Field>
      {form.resumeUrl && (
        <button
          type="button"
          className="text-link"
          onClick={() => set("resumeUrl", "")}
        >
          Remove resume
        </button>
      )}
      <Field label="Short about (used on Home and About)">
        <textarea
          rows={3}
          className="fld resize-none"
          value={form.aboutShort}
          onChange={(e) => set("aboutShort", e.target.value)}
        />
      </Field>

      <Field label="Full about (paragraphs, separated by a blank line)">
        <textarea
          rows={8}
          className="fld resize-none"
          value={aboutDraft}
          onChange={(e) => setLongAbout(e.target.value)}
        />
      </Field>

      <button
        type="submit"
        disabled={saving || uploading}
        className="rounded-md bg-accent text-white px-5 py-2.5 text-sm font-medium hover:bg-[#4a58e0] transition-colors disabled:opacity-60"
      >
        {uploading ? "Preparing file…" : saving ? "Saving…" : "Save profile"}
      </button>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <span className="ml-3 text-sm text-signal" role="status">
          Saved.
        </span>
      )}
    </form>
  );
}
