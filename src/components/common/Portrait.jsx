import { useState } from "react";
import { imageUrl } from "../../utils/links";

export default function Portrait({
  profile,
  priority = false,
  fallback = null,
}) {
  const src = imageUrl(profile?.photoUrl);
  const [failed, setFailed] = useState("");
  if (!src || failed === src) return fallback;
  return (
    <figure className="portrait-frame">
      <img
        src={src}
        alt={`Portrait of ${profile.name || "Mehmood Khan"}`}
        width="800"
        height="1000"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onError={() => setFailed(src)}
      />
      <figcaption>
        <span className="font-display text-xl">{profile.name}</span>
        <span className="text-sm opacity-80">{profile.status}</span>
      </figcaption>
    </figure>
  );
}
