export default function PipelineFlow({ steps = [], dense = false }) {
  return (
    <ol className={`pipeline-list ${dense ? "text-sm" : ""}`}>
      {steps.map((step, i) => (
        <li key={`${i}-${step}`}>
          <span className="text-signal font-mono text-xs mr-3">
            {String(i + 1).padStart(2, "0")}
          </span>
          {step}
        </li>
      ))}
    </ol>
  );
}
