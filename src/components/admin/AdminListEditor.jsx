import { useEffect, useId, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { fileToCompressedDataUrl } from "../../utils/imageUpload";
import { webUrl, imageUrl } from "../../utils/links";
import LoadingState from "../common/LoadingState";
import EmptyState from "../common/EmptyState";
import { useDialog } from "../../hooks/useDialog";
export default function AdminListEditor({
  title,
  description,
  service,
  fields,
  columns,
  emptyLabel = "No items yet",
  headingLevel = 1,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const uid = useId();
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const close = () => {
    setEditing(null);
    setError("");
  };
  const dialog = useDialog(!!editing, close);
  const load = async () => {
    setLoading(true);
    try {
      setItems(await service.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [service]);
  const draft = (item) =>
    Object.fromEntries(
      Object.entries(item).map(([k, v]) => [
        k,
        fields.some((f) => f.name === k && f.type === "list")
          ? (v || []).join(", ")
          : v,
      ]),
    );
  const openNew = () => {
    setError("");
    setEditing(
      Object.fromEntries(
        fields.map((f) => [f.name, f.type === "checkbox" ? false : ""]),
      ),
    );
  };
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const value = { ...editing };
      for (const f of fields) {
        if (f.type === "list")
          value[f.name] = (editing[f.name] || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        else if (f.type !== "checkbox")
          value[f.name] = String(editing[f.name] || "").trim();
      }
      for (const f of fields) {
        if (f.required && !value[f.name])
          throw new Error(`Please enter ${f.label.toLowerCase()}.`);
        if (f.type === "url" && value[f.name] && !webUrl(value[f.name]))
          throw new Error(
            `Enter a valid http or https URL for ${f.label.toLowerCase()}.`,
          );
      }
      const firstText = fields.find((f) => f.type === "text");
      if (firstText && !value[firstText.name])
        throw new Error(`Please enter ${firstText.label.toLowerCase()}.`);
      if (editing.id) await service.update(editing.id, value);
      else await service.create(value);
      await load();
      close();
    } catch (err) {
      setError(err.message || "Changes could not be saved.");
    } finally {
      setSaving(false);
    }
  };
  const uploadImage = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await fileToCompressedDataUrl(file);
      setEditing((v) => ({ ...v, [field]: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    try {
      await service.remove(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <Heading className="font-display text-2xl">{title}</Heading>
          {description && (
            <p className="text-sm text-muted mt-2 max-w-lg leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <button className="btn btn-primary !px-4 shrink-0" onClick={openNew}>
          <FiPlus size={16} />
          Add
        </button>
      </div>
      {error && !editing && (
        <p className="field-error mb-4" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState title={emptyLabel} />
      ) : (
        <div className="rounded-lg card-border admin-table-wrap">
          <table className="w-full text-sm admin-table">
            <thead>
              <tr className="bg-surfacealt text-left">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className="px-4 py-3 font-mono text-xs text-muted font-normal"
                  >
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-line">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      data-label={c.label}
                      className="px-4 py-3 align-top"
                    >
                      {c.render
                        ? c.render(item)
                        : Array.isArray(item[c.key])
                          ? item[c.key].join(", ")
                          : item[c.key]}
                    </td>
                  ))}
                  <td
                    data-label="Actions"
                    className="px-4 py-3 text-right whitespace-nowrap"
                  >
                    <button
                      onClick={() => {
                        setError("");
                        setEditing(draft(item));
                      }}
                      className="icon-button !border-0"
                      aria-label={`Edit ${item.title || item.name || item.degree || "item"}`}
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="icon-button !border-0 hover:text-red-400"
                      aria-label={`Delete ${item.title || item.name || item.degree || "item"}`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={uid + "-title"}
            onSubmit={save}
            className="w-full max-w-lg rounded-lg bg-base card-border p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 id={uid + "-title"} className="font-display text-xl">
                {editing.id ? "Edit item" : "Add item"}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="icon-button !border-0"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="space-y-5">
              {fields.map((f) => {
                const id = uid + "-" + f.name;
                const common = {
                  id,
                  value: editing[f.name] ?? "",
                  onChange: (e) =>
                    setEditing((v) => ({ ...v, [f.name]: e.target.value })),
                  className: "fld",
                  placeholder: f.placeholder,
                  required: !!f.required,
                };
                return (
                  <div key={f.name}>
                    <label className="field-label" htmlFor={id}>
                      {f.label}
                    </label>
                    {f.type === "textarea" ? (
                      <textarea {...common} rows={4} />
                    ) : f.type === "select" ? (
                      <select {...common}>
                        <option value="" disabled>
                          Select…
                        </option>
                        {[
                          ...new Set([
                            ...f.options,
                            ...(editing[f.name] ? [editing[f.name]] : []),
                          ]),
                        ].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : f.type === "image" ? (
                      <div className="space-y-3">
                        <input
                          {...common}
                          value={
                            editing[f.name]?.startsWith("data:")
                              ? ""
                              : editing[f.name] || ""
                          }
                          placeholder="Image URL or /images/certificate.webp"
                        />
                        <label htmlFor={id + "-upload"} className="field-label">
                          Upload certificate image
                        </label>
                        <input
                          id={id + "-upload"}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          disabled={uploading}
                          onChange={(e) => uploadImage(e, f.name)}
                          className="w-full min-w-0 text-sm"
                        />
                        {uploading && (
                          <p role="status" className="text-sm text-muted">
                            Preparing image…
                          </p>
                        )}
                        {imageUrl(editing[f.name]) && (
                          <>
                            <img
                              src={imageUrl(editing[f.name])}
                              alt="Certificate preview"
                              className="max-h-48 object-contain"
                            />
                            <button
                              type="button"
                              className="text-link"
                              onClick={() =>
                                setEditing((v) => ({ ...v, [f.name]: "" }))
                              }
                            >
                              Remove image
                            </button>
                          </>
                        )}
                      </div>
                    ) : f.type === "checkbox" ? (
                      <input
                        id={id}
                        type="checkbox"
                        checked={!!editing[f.name]}
                        onChange={(e) =>
                          setEditing((v) => ({
                            ...v,
                            [f.name]: e.target.checked,
                          }))
                        }
                        className="h-5 w-5"
                      />
                    ) : (
                      <input
                        {...common}
                        type={
                          ["url", "date"].includes(f.type) ? f.type : "text"
                        }
                        required={
                          f.required ||
                          f.name === fields.find((x) => x.type === "text")?.name
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {error && (
              <p className="field-error mt-5" role="alert">
                {error}
              </p>
            )}
            <div className="mt-7 flex gap-3">
              <button
                type="submit"
                disabled={saving || uploading}
                className="btn btn-primary flex-1"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={close}
                className="btn btn-secondary flex-1"
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
