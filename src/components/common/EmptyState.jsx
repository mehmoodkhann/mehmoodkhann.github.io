export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-lg card-border bg-surfacealt px-6 py-14 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
