import "./Connector.css";

export function Connector({ dark }) {
  const c1 = dark ? "#333" : "#d0d0d6";
  const c2 = dark ? "#555" : "#aaa";

  return (
    <div className="cn">
      <svg width="52" height="90" viewBox="0 0 52 90">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="52" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={c1} />
            <stop offset="50%" stopColor={c2} />
            <stop offset="100%" stopColor={c1} />
          </linearGradient>
        </defs>
        <line x1="0" y1="45" x2="44" y2="45" stroke="url(#cg)" strokeWidth="1.5" strokeDasharray="6,4">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.5s" repeatCount="indefinite" />
        </line>
        <polygon points="42,40 52,45 42,50" fill={c2} />
      </svg>
    </div>
  );
}
