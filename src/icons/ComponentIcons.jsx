import { ComponentType } from "../config";

export const COMPONENT_ICONS = {
  [ComponentType.SERVO]: (color) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  [ComponentType.GEARBOX]: (color) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      <circle cx="12" cy="12" r="7" strokeDasharray="3 2" />
    </svg>
  ),
  [ComponentType.GEAR_MESH]: (color) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="5" />
      <circle cx="17" cy="12" r="3" />
      <circle cx="9" cy="12" r="1.5" fill={color} opacity=".3" />
      <circle cx="17" cy="12" r="1" fill={color} opacity=".3" />
    </svg>
  ),
  [ComponentType.BELT_PULLEY]: (color) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="4" />
      <circle cx="18" cy="12" r="3" />
      <path d="M6 8h12M6 16h12" strokeDasharray="2 1.5" />
      <circle cx="6" cy="12" r="1.2" fill={color} opacity=".3" />
      <circle cx="18" cy="12" r="1" fill={color} opacity=".3" />
    </svg>
  ),
  [ComponentType.RACK_PINION]: (color) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="4" />
      <circle cx="12" cy="9" r="1.2" fill={color} opacity=".3" />
      <line x1="3" y1="17" x2="21" y2="17" />
      <line x1="5" y1="15" x2="5" y2="17" />
      <line x1="8" y1="15" x2="8" y2="17" />
      <line x1="11" y1="15" x2="11" y2="17" />
      <line x1="14" y1="15" x2="14" y2="17" />
      <line x1="17" y1="15" x2="17" y2="17" />
      <line x1="20" y1="15" x2="20" y2="17" />
    </svg>
  ),
  [ComponentType.LEADSCREW]: (color) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="6" y1="9" x2="8" y2="15" />
      <line x1="9" y1="9" x2="11" y2="15" />
      <line x1="12" y1="9" x2="14" y2="15" />
      <line x1="15" y1="9" x2="17" y2="15" />
      <rect x="1" y="10" width="4" height="4" rx="0.5" fill={color} opacity=".3" />
      <rect x="19" y="10" width="4" height="4" rx="0.5" fill={color} opacity=".3" />
    </svg>
  ),
};
