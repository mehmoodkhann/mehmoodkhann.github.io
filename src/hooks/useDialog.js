import { useEffect, useRef } from "react";
export function useDialog(open, onClose) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      const first =
        ref.current?.querySelector(
          "input:not([type=checkbox]):not([type=file]),textarea,select",
        ) || ref.current?.querySelector("button");
      first?.focus();
    });
    const keydown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const controls = [
        ...(ref.current?.querySelectorAll(
          'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex="0"]',
        ) || []),
      ].filter((el) => el.getClientRects().length);
      if (!controls.length) {
        e.preventDefault();
        return;
      }
      const first = controls[0],
        last = controls.at(-1);
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          !ref.current?.contains(document.activeElement))
      ) {
        e.preventDefault();
        last.focus();
      } else if (
        !e.shiftKey &&
        (document.activeElement === last ||
          !ref.current?.contains(document.activeElement))
      ) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
      previous?.focus?.();
    };
  }, [open]);
  return ref;
}
