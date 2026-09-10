import { useEffect } from "react";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { setPageMeta } from "../utils/seo";

export default function NotFound() {
  useEffect(() => {
    setPageMeta({
      title: "Page not found | Mehmood Khan",
      description: "This page is unavailable.",
      noindex: true,
    });
  }, []);

  return (
    <Container className="py-32 text-center">
      <p className="font-mono text-sm text-signal">404</p>
      <h1 className="mt-4 font-display text-display-md text-ink">
        This page doesn't exist.
      </h1>
      <p className="mt-4 text-muted">
        The page you're looking for was moved or never existed.
      </p>
      <div className="mt-8 flex justify-center">
        <Button to="/">Back to home</Button>
      </div>
    </Container>
  );
}
