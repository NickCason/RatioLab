import { useEffect, useRef, useState } from "react";
import "./OdometerValue.css";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function OdometerValue({ value }) {
  const chars = String(value).split("");
  const [ready, setReady] = useState(false);
  const rafRef = useRef();

  useEffect(() => {
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => setReady(true));
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <span className="odo">
      {chars.map((char, i) => {
        if (/\d/.test(char)) {
          const digit = parseInt(char, 10);
          const offset = ready ? -digit : 0;
          return (
            <span key={i} className="odo-slot">
              <span
                className="odo-drum"
                style={{
                  transform: `translateY(${offset}em)`,
                  transitionDelay: `${i * 25}ms`,
                }}
              >
                {DIGITS.map((n) => (
                  <span key={n} className="odo-num">{n}</span>
                ))}
              </span>
            </span>
          );
        }
        return (
          <span key={i} className="odo-sep">{char}</span>
        );
      })}
    </span>
  );
}
