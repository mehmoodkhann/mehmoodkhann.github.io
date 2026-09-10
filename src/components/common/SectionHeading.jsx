export default function SectionHeading({
  index,
  label,
  title,
  description,
  action,
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow mb-4">
          {index && `${index} / `}
          {label}
        </p>
        <h2>{title}</h2>
        {description && (
          <p className="mt-4 text-muted leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
