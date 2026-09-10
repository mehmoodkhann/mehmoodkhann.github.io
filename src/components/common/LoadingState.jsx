export default function LoadingState({ label = "Loading content" }) {
  return (
    <div
      className="flex items-center gap-3 py-16 text-muted"
      role="status"
      aria-live="polite"
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:300ms]" />
      <span className="font-mono text-sm">{label}&hellip;</span>
    </div>
  );
}
