export default function RouteError() {
  return (
    <main className="container-shell py-24">
      <p className="eyebrow mb-5">Something went wrong</p>
      <h1 className="page-title mb-5">This page could not load.</h1>
      <p className="text-muted mb-8">
        Try reloading the page. Your saved content will stay in this browser.
      </p>
      <button
        className="btn btn-primary"
        onClick={() => window.location.reload()}
      >
        Reload page
      </button>
      <a href="/" className="btn btn-secondary ml-3">
        Go home
      </a>
    </main>
  );
}
