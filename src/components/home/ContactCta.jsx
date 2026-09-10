import { FiArrowUpRight } from "react-icons/fi";
import Container from "../common/Container";
import Button from "../common/Button";
export default function ContactCta() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="contact-band flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.14em] mb-5">
              Let's build something useful
            </p>
            <h2 className="font-display text-display-md max-w-xl">
              Have an AI problem
              <br />
              worth building?
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed opacity-90">
              I'm open to internships, junior AI roles, and focused projects in
              RAG and AI application development.
            </p>
          </div>
          <Button to="/contact" variant="secondary" className="shrink-0">
            Start a conversation <FiArrowUpRight />
          </Button>
        </div>
      </Container>
    </section>
  );
}
