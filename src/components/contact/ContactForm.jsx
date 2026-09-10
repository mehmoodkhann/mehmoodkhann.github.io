import { useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Button from "../common/Button";
import { messagesService } from "../../services/messagesService";
import {
  sendContactEmail,
  isEmailConfigured,
} from "../../services/emailService";
import { validateContact } from "../../utils/contact";
import { emailAddress } from "../../utils/links";
const blank = { name: "", email: "", message: "" };
export default function ContactForm({ profile }) {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [detail, setDetail] = useState("");
  const busy = useRef(false);
  const element = useRef(null);
  const ownerEmail = emailAddress(profile?.email);
  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: "" }));
    setStatus("idle");
  };
  const submit = async (e) => {
    e.preventDefault();
    if (busy.current) return;
    const { clean, errors: next } = validateContact(form);
    setErrors(next);
    if (Object.keys(next).length) {
      element.current
        ?.querySelector(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }
    busy.current = true;
    setStatus("sending");
    setDetail("");
    let saved = false;
    try {
      if (isEmailConfigured) {
        const result = await sendContactEmail(clean);
        if (!result.sent) throw new Error("Email delivery is unavailable.");
        try {
          await messagesService.submit({ ...clean, delivery: "sent" });
        } catch {}
        setForm(blank);
        setStatus("sent");
      } else {
        await messagesService.submit({ ...clean, delivery: "local-only" });
        saved = true;
        setStatus("local-only");
        setDetail(
          "Your message is saved in this browser only. It has not been delivered to Mehmood.",
        );
      }
    } catch (err) {
      if (isEmailConfigured) {
        try {
          await messagesService.submit({ ...clean, delivery: "failed" });
        } catch {}
      }
      setStatus("error");
      setDetail(
        isEmailConfigured
          ? "Your message could not be delivered. Your text is still here; please try again or use a direct contact link."
          : err.message || "The draft could not be saved.",
      );
    } finally {
      busy.current = false;
      if (saved) setStatus("local-only");
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
      {!isEmailConfigured && (
        <p className="status-note mb-6">
          Message delivery is not connected yet. You can save a draft here
          {ownerEmail ? " and send it by email." : "."}
        </p>
      )}
      <div className="space-y-5">
        {[
          ["name", "Your name", "text", "How should I address you?"],
          ["email", "Your email", "email", "you@company.com"],
        ].map(([name, label, type, placeholder]) => (
          <div key={name}>
            <label className="field-label" htmlFor={name}>
              {label}
            </label>
            <input
              id={name}
              name={name}
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
            : isEmailConfigured
              ? "Send message"
              : "Save draft on this device"}
          <FiArrowUpRight />
        </Button>
      </div>
      <div aria-live="polite">
        {status === "sent" && (
          <p className="status-note mt-5">
            Your message was sent successfully. Thank you for reaching out.
          </p>
        )}
        {status === "local-only" && (
          <p className="status-note mt-5">{detail}</p>
        )}
      </div>
      {status === "error" && (
        <p className="field-error mt-5" role="alert">
          {detail}
        </p>
      )}
      {ownerEmail && ["local-only", "error"].includes(status) && (
        <a
          className="text-link mt-4"
          href={`mailto:${ownerEmail}?subject=${encodeURIComponent("Portfolio enquiry from " + form.name)}&body=${encodeURIComponent(form.message + "\n\nFrom: " + form.name + "\nEmail: " + form.email)}`}
        >
          Send using your email app <FiArrowUpRight />
        </a>
      )}
    </form>
  );
}
