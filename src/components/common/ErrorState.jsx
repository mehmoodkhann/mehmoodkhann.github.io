export default function ErrorState({
  message = "Something went wrong loading this content.",
}) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-6 py-8 text-center">
      <p className="text-sm text-red-400">{message}</p>
    </div>
  );
}
