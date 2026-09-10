import { Link } from "react-router-dom";
import { FiArrowUp } from "react-icons/fi";
import { useObject } from "../../hooks/useCollection";
import { profileService } from "../../services/profileService";
import Container from "../common/Container";
import SocialLinks from "../common/SocialLinks";
export default function Footer() {
  const { data: profile } = useObject(profileService);
  return (
    <footer className="section-rule">
      <Container className="py-12">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] items-start gap-8">
          <div className="min-w-0">
            <Link to="/" className="font-display text-xl">
              {profile?.name || "Mehmood Khan"}
              <span className="text-accent">.</span>
            </Link>
            <p className="mt-2 text-sm text-muted">
              AI engineering, one system at a time.
            </p>
          </div>
          <nav
            className="footer-nav flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted"
            aria-label="Footer"
          >
            <Link to="/projects">Work</Link>
            <Link to="/about">About</Link>
            <Link to="/expertise">Skills</Link>
            <Link to="/journey">Journey</Link>
            <Link to="/certifications">Certifications</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
        <div className="footer-meta mt-8 pt-6 border-t border-line">
          <p className="text-xs font-mono text-muted">
            © {new Date().getFullYear()} {profile?.name || "Mehmood Khan"} ·{" "}
            {profile?.location || "Pakistan"}
          </p>
          <SocialLinks profile={profile} includeEmail />
          <a href="#top" className="text-link text-muted min-h-11 justify-self-start">
            Back to top <FiArrowUp size={14} />
          </a>
        </div>
      </Container>
    </footer>
  );
}
