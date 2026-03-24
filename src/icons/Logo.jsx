export function LogoIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rl-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#rl-bg)" />
      <circle cx="13" cy="12.5" r="5.8" fill="none" stroke="#fff" strokeWidth="2.2" />
      <circle cx="21" cy="21" r="3.8" fill="none" stroke="#fff" strokeWidth="2" strokeOpacity="0.75" />
      <circle cx="17.5" cy="16.2" r="1.1" fill="#fff" fillOpacity="0.5" />
    </svg>
  );
}

export const LOGO_SVG_MARKUP = `<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="rl-pdf" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#6366F1"/><stop offset="1" stop-color="#4338CA"/></linearGradient></defs>
  <rect width="32" height="32" rx="7" fill="url(#rl-pdf)"/>
  <circle cx="13" cy="12.5" r="5.8" fill="none" stroke="#fff" stroke-width="2.2"/>
  <circle cx="21" cy="21" r="3.8" fill="none" stroke="#fff" stroke-width="2" stroke-opacity="0.75"/>
  <circle cx="17.5" cy="16.2" r="1.1" fill="#fff" fill-opacity="0.5"/>
</svg>`;

export function Logotype({ size = 28 }) {
  return (
    <div className="logotype">
      <LogoIcon size={size} />
      <span className="logotype-text">
        <span className="logotype-ratio">Ratio</span>
        <span className="logotype-lab">Lab</span>
      </span>
    </div>
  );
}
