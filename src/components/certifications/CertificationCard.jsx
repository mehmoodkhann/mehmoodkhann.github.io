import { FiAward, FiArrowUpRight } from "react-icons/fi";
import { imageUrl, webUrl } from "../../utils/links";

export default function CertificationCard({ certification: c }) {
  const image = imageUrl(c.image);
  const credential = webUrl(c.credentialUrl);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(c.issueDate || "")
    ? new Date(`${c.issueDate}T00:00:00Z`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : c.issueDate;
  return (
    <article className="certification-card">
      {image && (
        <a
          href={image}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${c.name} certificate image`}
        >
          <img
            src={image}
            alt={`${c.name} certificate${c.issuer ? ` issued by ${c.issuer}` : ""}`}
            width="800"
            height="560"
            loading="lazy"
            decoding="async"
            className="certificate-image"
          />
        </a>
      )}
      <div className="p-6 sm:p-8">
        <FiAward size={25} className="text-accent mb-5" />
        {c.issuer && <p className="text-sm text-muted mb-3">{c.issuer}</p>}
        <h2 className="font-display text-2xl">{c.name}</h2>
        {date && (
          <p className="text-sm text-muted mt-3">
            Issued <time dateTime={c.issueDate}>{date}</time>
          </p>
        )}
        {c.credentialId && (
          <p className="text-sm text-muted mt-2 break-words">
            Credential ID: {c.credentialId}
          </p>
        )}
        {c.skills?.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-5" aria-label="Skills learned">
            {c.skills.map((s) => (
              <li className="tech-tag" key={s}>
                {s}
              </li>
            ))}
          </ul>
        )}
        {credential && (
          <a
            href={credential}
            className="text-link mt-6 text-signal"
            target="_blank"
            rel="noreferrer"
          >
            View credential <FiArrowUpRight />
          </a>
        )}
      </div>
    </article>
  );
}
