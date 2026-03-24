import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export function KatexBlock({ tex }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      katex.render(`\\begin{gathered}${tex}\\end{gathered}`, ref.current, {
        displayMode: true,
        throwOnError: false,
        trust: true,
        strict: false,
      });
    } catch {
      ref.current.textContent = tex;
    }
  }, [tex]);

  return <div ref={ref} className="katex-wrap" />;
}
