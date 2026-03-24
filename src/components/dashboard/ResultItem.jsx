import { OdometerValue, Tooltip } from "../ui";

export function ResultItem({ label, value, unit, color, variant, extraClass = "", shimmer, tip, children }) {
  const card = (
    <div className={`ri ri-${variant} ${extraClass}${shimmer ? " shimmer" : ""}`}>
      <div className="rl">{label}</div>
      <div className="rv" style={color ? { color: `var(--${color})` } : undefined}>
        <OdometerValue value={value} />
        {unit && <span className="ru">{unit}</span>}
      </div>
      {children}
    </div>
  );

  if (tip) {
    return (
      <Tooltip content={tip} position="above">
        {card}
      </Tooltip>
    );
  }

  return card;
}
