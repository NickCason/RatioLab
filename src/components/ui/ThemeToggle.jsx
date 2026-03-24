import "./ThemeToggle.css";

export function ThemeToggle({ dark, onToggle }) {
  return (
    <div className="tt" onClick={onToggle}>
      <span className="tt-l">{dark ? "Dark" : "Light"}</span>
      <div className={`tt-s ${dark ? "on" : ""}`} />
    </div>
  );
}
