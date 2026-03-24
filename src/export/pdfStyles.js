export const PDF_REPORT_STYLES = `
  #pr * { box-sizing:border-box; margin:0; padding:0; }
  #pr { font-family:DM Sans,sans-serif; color:#111118; line-height:1.5; }
  #pr .rh { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:22px; padding-bottom:14px; border-bottom:3px solid transparent; border-image:linear-gradient(90deg,#4338CA,#7C3AED,#4338CA) 1; }
  #pr .rh-brand { display:flex; align-items:center; gap:10px; }
  #pr .rh-logo { flex-shrink:0; display:flex; align-items:center; }
  #pr .rh-t { font-size:20px; font-weight:800; letter-spacing:-0.5px; }
  #pr .rh-s { font-size:11px; color:#6b6b76; margin-top:2px; }
  #pr .rh-m { text-align:right; font-family:JetBrains Mono,monospace; font-size:9px; color:#9d9da8; line-height:1.8; }
  #pr .sec { margin-bottom:18px; }
  #pr .sl { font-family:JetBrains Mono,monospace; font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:#9d9da8; margin-bottom:10px; padding-bottom:5px; border-bottom:1px solid #e6e6eb; }
  #pr .cw { display:flex; flex-direction:column; gap:0; }
  #pr .chain-row { display:flex; gap:6px; align-items:center; }
  #pr .chain-wrap { width:100%; padding:2px 0; }
  #pr .chain-card { background:#fafafe; border:1px solid #e6e6eb; border-radius:6px; padding:8px 12px; width:160px; flex-shrink:0; position:relative; overflow:hidden; }
  #pr .cd-wm { position:absolute; right:-6px; bottom:-6px; width:52px; height:52px; opacity:0.06; pointer-events:none; }
  #pr .cd-type { font-family:JetBrains Mono,monospace; font-size:8px; font-weight:600; text-transform:uppercase; letter-spacing:0.7px; margin-bottom:1px; }
  #pr .cd-name { font-size:12px; font-weight:700; margin-bottom:2px; }
  #pr .cd-detail { font-family:JetBrains Mono,monospace; font-size:9px; color:#6b6b76; }
  #pr .cd-badge { font-family:JetBrains Mono,monospace; font-size:9px; font-weight:600; color:#6b6b76; margin-top:3px; padding:1px 6px; background:#f0f0f4; border-radius:8px; display:inline-block; }
  #pr .chain-arrow { flex-shrink:0; display:flex; align-items:center; }
  #pr .rg { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
  #pr .rt { padding:10px 12px; border-radius:6px; background:#fafafe; border:1px solid #e6e6eb; }
  #pr .rt.w2 { grid-column:span 2; }
  #pr .rt-l { font-family:JetBrains Mono,monospace; font-size:8px; text-transform:uppercase; letter-spacing:0.6px; color:#6b6b76; margin-bottom:3px; font-weight:500; }
  #pr .rt-v { font-family:JetBrains Mono,monospace; font-size:16px; font-weight:700; letter-spacing:-0.3px; }
  #pr .rt-u { font-size:9px; color:#9d9da8; margin-left:2px; font-weight:500; }
  #pr .rt-h { display:inline-block; padding:1px 7px; border-radius:8px; font-family:JetBrains Mono,monospace; font-size:8px; font-weight:700; margin-top:3px; }
  #pr .rt-h.good { background:rgba(61,153,82,.12); color:#3d9952; }
  #pr .rt-h.warn { background:rgba(200,149,32,.12); color:#c89520; }
  #pr .rt-h.bad { background:rgba(212,64,64,.12); color:#d44040; }
  #pr .c-or { color:#D48A3A; } #pr .c-bl { color:#4888C8; } #pr .c-gr { color:#3d9952; } #pr .c-pu { color:#8E62A8; }
  #pr .ft { width:100%; border-collapse:collapse; font-family:JetBrains Mono,monospace; font-size:9px; }
  #pr .ft tr { border-bottom:1px solid #ececf0; } #pr .ft tr:last-child { border-bottom:none; }
  #pr .ft td { padding:4px 0; vertical-align:baseline; }
  #pr .fl-label { font-weight:600; color:#6b6b76; white-space:nowrap; width:140px; }
  #pr .fl-formula { color:#9d9da8; font-size:8.5px; }
  #pr .fl-value { font-weight:700; color:#3d9952; text-align:right; white-space:nowrap; }
  #pr .kb { margin:0; padding:6px 8px; background:#fafafe; border:1px solid #e6e6eb; border-radius:4px; overflow:hidden; }
  #pr .kb .katex { font-size:0.72em; }
  #pr .eq-sections { display:flex; flex-direction:column; gap:0; }
  #pr .eq-b { border-radius:4px; background:#fafafe; border:1px solid #e6e6eb; padding:6px 10px; overflow:hidden; }
  #pr .eq-t { font-family:DM Sans,sans-serif; font-size:9px; font-weight:700; color:#6b6b76; margin-bottom:3px; }
  #pr .eq-d { border:none; height:1px; background:linear-gradient(90deg,transparent,#e0e0e6 15%,#e0e0e6 85%,transparent); margin:4px 0; }
  #pr .eq-b .katex { font-size:0.72em; }
  #pr .katex .stretchy.colorbox { border-radius:0.35em; }
  #pr .pg-tag { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding:6px 10px; background:#f5f5fa; border:1px solid #e6e6eb; border-radius:5px; font-family:JetBrains Mono,monospace; font-size:8px; font-weight:600; text-transform:uppercase; letter-spacing:0.8px; color:#9d9da8; }
  #pr .rf { margin-top:18px; padding-top:10px; border-top:1px solid #e6e6eb; font-family:JetBrains Mono,monospace; font-size:8px; color:#9d9da8; display:flex; justify-content:space-between; align-items:center; }
  #pr .rf-brand { display:flex; align-items:center; gap:5px; font-weight:700; color:#4338CA; }
  #pr .rf-logo { display:flex; align-items:center; }
  #pr .rf-logo svg { width:14px; height:14px; }
`;
