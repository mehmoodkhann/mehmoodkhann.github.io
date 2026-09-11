import { useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Button from "../common/Button";
import { sendContactEmail } from "../../services/emailService";
import { validateContact } from "../../utils/contact";
const blank = { name: "", email: "", message: "" };
export default function ContactForm() {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [detail, setDetail] = useState("");
  const busy = useRef(false);
  const element = useRef(null);
  const change = (e) => {
    const { name, value } = e.target;
    const stateName = e.target.dataset.field || name;
    setForm((f) => ({ ...f, [stateName]: value }));
    setErrors((err) => ({ ...err, [stateName]: "" }));
    setStatus("idle");
  };
  const submit = async (e) => {
    e.preventDefault();
    if (busy.current) return;
    const { errors: next } = validateContact(form);
    setErrors(next);
    if (Object.keys(next).length) {
      element.current
      ?.querySelector(`[data-field="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }
    busy.current = true;
    setStatus("sending");
    setDetail("");
    try {
      await sendContactEmail(element.current);
      setForm(blank);
      element.current.reset();
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setDetail(err.message || "Your message could not be delivered. Please try again.");
    } finally {
      busy.current = false;
    }
  };
  return (
    <form
      ref={element}
      onSubmit={submit}
      noValidate
      className="p-6 md:p-8 card-border rounded-lg bg-surface"
    >
      <h2 className="font-display text-2xl mb-2">
        Tell me what you're working on.
      </h2>
      <p className="text-muted text-sm leading-relaxed mb-7">
        A project, an opportunity, or a technical conversation.
      </p>
      <div className="space-y-5">
        {[
          ["name", "from_name", "Your name", "text", "How should I address you?"],
          ["email", "from_email", "Your email", "email", "you@company.com"],
        ].map(([name, fieldName, label, type, placeholder]) => (
          <div key={name}>
            <label className="field-label" htmlFor={name}>
              {label}
            </label>
            <input
              id={name}
              name={fieldName}
              data-field={name}
              type={type}
              autoComplete={name}
              className="fld"
              placeholder={placeholder}
              required
              maxLength={name === "name" ? 100 : 254}
              value={form[name]}
              onChange={change}
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
            />
            {errors[name] && (
              <p id={`${name}-error`} className="field-error">
                {errors[name]}
              </p>
            )}
          </div>
        ))}
        <div>
          <label className="field-label" htmlFor="message">
            What do you have in mind?
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            className="fld"
            required
            maxLength={5000}
            placeholder="The problem, the opportunity, and what you hope to build…"
            value={form.message}
            onChange={change}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" className="field-error">
              {errors.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={status === "sending"}
          className="w-full"
        >
          {status === "sending"
            ? "Sending…"
            : "Send message"}
          <FiArrowUpRight />
        </Button>
      </div>
      <div aria-live="polite">
        {status === "sent" && (
          <p className="status-note mt-5">
            Your message was sent successfully. Thank you for reaching out.
          </p>
        )}
      </div>
      {status === "error" && (
        <p className="field-error mt-5" role="alert">
          {detail}
        </p>
      )}
    </form>
  );
}
