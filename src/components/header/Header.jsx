import { ThemeToggle } from "../ui";
import { Logotype } from "../../icons/Logo";
import "./Header.css";

export function Header({ results, exporting, onExport, dark, onToggleTheme }) {
  return (
    <div className="hdr">
      <div className="hdr-l">
        <Logotype size={30} />
        <p>Servo Scaling Calculator</p>
      </div>
      <div className="hdr-r">
        {results && (
          <button className="export-btn" disabled={exporting} onClick={onExport}>
            {exporting ? (
              <>
                <svg className="spin" viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="10" cy="10" r="7" strokeDasharray="30 14" strokeLinecap="round" />
                </svg>
                Generating…
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 14l4 4 4-4M10 18V8M3 4h14" />
                </svg>
                Export PDF
                <kbd className="export-kbd">Ctrl+S</kbd>
              </>
            )}
          </button>
        )}
        <ThemeToggle dark={dark} onToggle={onToggleTheme} />
      </div>
    </div>
  );
}
