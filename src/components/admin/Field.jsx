import { Children, cloneElement, isValidElement, useId } from "react";
export default function Field({ label, children }) {
  const generatedId = useId();
  const controls = Children.toArray(children).filter(
    (c) =>
      isValidElement(c) && ["input", "select", "textarea"].includes(c.type),
  );
  if (controls.length === 1) {
    const id = controls[0].props.id || generatedId;
    return (
      <div>
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        {Children.map(children, (c) =>
          isValidElement(c) && ["input", "select", "textarea"].includes(c.type)
            ? cloneElement(c, { id })
            : c,
        )}
      </div>
    );
  }
  return (
    <fieldset className="min-w-0">
      <legend className="field-label">{label}</legend>
      {children}
    </fieldset>
  );
}
