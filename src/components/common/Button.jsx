import { Link } from "react-router-dom";
export default function Button({
  to,
  href,
  onClick,
  type = "button",
  variant = "primary",
  children,
  className = "",
  ...rest
}) {
  const cls = `btn btn-${variant} ${className}`;
  if (to)
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  if (href)
    return (
      <a
        href={href}
        className={cls}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  return (
    <button type={type} onClick={onClick} className={cls} {...rest}>
      {children}
    </button>
  );
}
