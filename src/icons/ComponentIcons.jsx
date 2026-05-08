import { ComponentType } from "../config";

export const COMPONENT_ICONS = {
  [ComponentType.SERVO]: (color) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  [ComponentType.GEARBOX]: (color) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.32 10.48L21.38 10.51A9.5 9.5 0 0 1 21.38 13.49L18.32 13.52A6.5 6.5 0 0 1 17.54 15.4L19.69 17.58A9.5 9.5 0 0 1 17.58 19.69L15.4 17.54A6.5 6.5 0 0 1 13.52 18.32L13.49 21.38A9.5 9.5 0 0 1 10.51 21.38L10.48 18.32A6.5 6.5 0 0 1 8.6 17.54L6.42 19.69A9.5 9.5 0 0 1 4.31 17.58L6.46 15.4A6.5 6.5 0 0 1 5.68 13.52L2.62 13.49A9.5 9.5 0 0 1 2.62 10.51L5.68 10.48A6.5 6.5 0 0 1 6.46 8.6L4.31 6.42A9.5 9.5 0 0 1 6.42 4.31L8.6 6.46A6.5 6.5 0 0 1 10.48 5.68L10.51 2.62A9.5 9.5 0 0 1 13.49 2.62L13.52 5.68A6.5 6.5 0 0 1 15.4 6.46L17.58 4.31A9.5 9.5 0 0 1 19.69 6.42L17.54 8.6A6.5 6.5 0 0 1 18.32 10.48Z" />
      <circle cx="12" cy="12" r="1.5" fill={color} opacity=".3" />
    </svg>
  ),
  [ComponentType.GEAR_MESH]: (color) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.36 10.94L14.21 10.96A5.8 5.8 0 0 1 14.21 13.04L12.36 13.06A4 4 0 0 1 11.74 14.35L12.87 15.82A5.8 5.8 0 0 1 11.25 17.11L10.07 15.68A4 4 0 0 1 8.68 16L8.24 17.79A5.8 5.8 0 0 1 6.22 17.33L6.6 15.52A4 4 0 0 1 5.49 14.63L3.81 15.41A5.8 5.8 0 0 1 2.91 13.54L4.56 12.71A4 4 0 0 1 4.56 11.29L2.91 10.46A5.8 5.8 0 0 1 3.81 8.59L5.49 9.37A4 4 0 0 1 6.6 8.48L6.22 6.67A5.8 5.8 0 0 1 8.24 6.21L8.68 8A4 4 0 0 1 10.07 8.32L11.25 6.89A5.8 5.8 0 0 1 12.87 8.18L11.74 9.65A4 4 0 0 1 12.36 10.94Z" />
      <path d="M19.6 10.97L20.87 11.01A4 4 0 0 1 20.87 12.99L19.6 13.03A2.8 2.8 0 0 1 18.78 14.16L19.14 15.38A4 4 0 0 1 17.25 15.99L16.82 14.79A2.8 2.8 0 0 1 15.5 14.36L14.45 15.08A4 4 0 0 1 13.28 13.47L14.29 12.7A2.8 2.8 0 0 1 14.29 11.3L13.28 10.53A4 4 0 0 1 14.45 8.92L15.5 9.64A2.8 2.8 0 0 1 16.82 9.21L17.25 8.01A4 4 0 0 1 19.14 8.62L18.78 9.84A2.8 2.8 0 0 1 19.6 10.97Z" strokeWidth="1.2" />
      <circle cx="8.5" cy="12" r="1.3" fill={color} opacity=".3" />
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
      <path d="M14.85 6.57L16.4 6.56A4.5 4.5 0 0 1 16.4 8.44L14.85 8.43A3 3 0 0 1 14.23 9.51L15.01 10.84A4.5 4.5 0 0 1 13.39 11.78L12.62 10.43A3 3 0 0 1 11.38 10.43L10.61 11.78A4.5 4.5 0 0 1 8.99 10.84L9.77 9.51A3 3 0 0 1 9.15 8.43L7.6 8.44A4.5 4.5 0 0 1 7.6 6.56L9.15 6.57A3 3 0 0 1 9.77 5.49L8.99 4.16A4.5 4.5 0 0 1 10.61 3.22L11.38 4.57A3 3 0 0 1 12.62 4.57L13.39 3.22A4.5 4.5 0 0 1 15.01 4.16L14.23 5.49A3 3 0 0 1 14.85 6.57Z" strokeWidth="1.4" />
      <circle cx="12" cy="7.5" r="1.2" fill={color} opacity=".3" />
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
