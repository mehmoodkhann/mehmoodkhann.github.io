import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from "react-icons/fi";
import { webUrl, emailAddress } from "../../utils/links";
export default function SocialLinks({
  profile,
  includeEmail = false,
  className = "",
}) {
  const links = [
    { label: "GitHub", url: webUrl(profile?.github), Icon: FiGithub },
    { label: "LinkedIn", url: webUrl(profile?.linkedin), Icon: FiLinkedin },
    ...(includeEmail && emailAddress(profile?.email)
      ? [{ label: profile.email, url: `mailto:${profile.email}`, Icon: FiMail }]
      : []),
  ].filter((link) => link.url);
  if (!links.length) return null;
  return (
    <div className={`social-links flex min-w-0 flex-wrap gap-x-6 gap-y-2 ${className}`}>
      {links.map(({ label, url, Icon }) => (
        <a
          key={label}
          href={url}
          target={url.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="text-link text-muted min-w-0 max-w-full min-h-11"
        >
          <Icon size={16} />
          <span className="min-w-0 [overflow-wrap:anywhere]">{label}</span>
          <FiArrowUpRight size={14} />
        </a>
      ))}
    </div>
  );
}
