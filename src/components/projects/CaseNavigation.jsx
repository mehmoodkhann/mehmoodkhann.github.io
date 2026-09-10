import { useRef } from "react";
import { FiChevronDown } from "react-icons/fi";

function SectionLinks({ anchors, onNavigate }) {
  return (
    <nav aria-label="Case study sections">
      <ol>
        {anchors.map(([id, label], index) => (
          <li key={id}>
            <a href={`#${id}`} onClick={(event) => onNavigate?.(event, id)}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function CaseNavigation({ anchors }) {
  const disclosure = useRef(null);
  const navigate = (event, id) => {
    if (
      event.button !== 0 || event.metaKey || event.ctrlKey ||
      event.shiftKey || event.altKey
    ) return;
    if (disclosure.current) disclosure.current.open = false;
    // Move keyboard focus out of the newly collapsed menu. The native link
    // still updates the URL and scrolls to the section after the menu closes.
    document.getElementById(id)?.focus({ preventScroll: true });
  };
  return (
    <aside className="case-navigation">
      <div className="case-navigation-desktop">
        <p className="eyebrow !text-muted mb-4">In this project</p>
        <SectionLinks anchors={anchors} />
      </div>
      <details ref={disclosure} className="case-navigation-mobile">
        <summary>
          In this project <FiChevronDown aria-hidden="true" />
        </summary>
        <SectionLinks anchors={anchors} onNavigate={navigate} />
      </details>
    </aside>
  );
}
