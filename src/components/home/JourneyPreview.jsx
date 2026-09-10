import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "../common/Container";
import { useObject, useCollection } from "../../hooks/useCollection";
import { profileService } from "../../services/profileService";
import { journeyService } from "../../services/journeyService";
export default function JourneyPreview() {
  const { data: profile } = useObject(profileService);
  const { data: journey } = useCollection(journeyService);
  const preferred = new Set(["j1", "j6", "j8"]);
  const selected = new Set(journey.filter((j) => preferred.has(j.id)).map((j) => j.id));
  // Keep the established highlights, filling any gaps from edited content.
  for (const index of [0, journey.length - 1, Math.floor(journey.length / 2)]) {
    if (selected.size < 3 && journey[index]) selected.add(journey[index].id);
  }
  const shown = journey.filter((j) => selected.has(j.id));
  return (
    <section className="section section-rule">
      <Container className={`grid ${shown.length ? "md:grid-cols-2" : ""} gap-12 lg:gap-24`}>
        <div>
          <p className="eyebrow mb-5">03 / The engineer behind the work</p>
          <h2 className="font-display text-display-md">
            Learning the foundations.
            <br />
            <span className="text-muted">Building what comes next.</span>
          </h2>
          <p className="text-muted leading-relaxed mt-6">
            {profile?.aboutShort}
          </p>
          <Link to="/about" className="text-link mt-7 text-signal">
            More about me <FiArrowUpRight />
          </Link>
        </div>
        {shown.length > 0 && <div className="pt-1">
          <ol className="ml-1">
            {shown.map((j) => (
              <li
                key={j.id}
                className={`journey-step ${/explor|goal/i.test(j.period) ? "current" : ""}`}
              >
                {j.period && <p className="font-mono text-xs text-muted mb-2">{j.period}</p>}
                <h3 className="font-display text-xl">{j.title}</h3>
                <p className="text-muted leading-relaxed mt-2">
                  {j.description}
                </p>
              </li>
            ))}
          </ol>
          <Link to="/journey" className="text-link mt-8 ml-9">
            My engineering journey <FiArrowUpRight />
          </Link>
        </div>}
      </Container>
    </section>
  );
}
