import { useState } from "react";
import "./NumberInput.css";

export function NumberInput({ value, onChange, width = 80, step, min, max, theme }) {
  const [localValue, setLocalValue] = useState(String(value ?? ""));
  const [focused, setFocused] = useState(false);

  return (
    <input
      className="fi"
      type="number"
      value={focused ? localValue : value ?? ""}
      step={step}
      min={min}
      max={max}
      style={{ width, background: theme.inBg, borderColor: theme.inBrd, color: theme.inTxt }}
      onFocus={() => {
        setLocalValue(String(value ?? ""));
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
        setLocalValue(String(value ?? ""));
      }}
      onChange={(event) => {
        const raw = event.target.value;
        setLocalValue(raw);
        if (raw !== "" && raw !== "-" && raw !== ".") {
          const parsed = parseFloat(raw);
          if (!Number.isNaN(parsed)) onChange(parsed);
        } else {
          onChange("");
        }
      }}
    />
  );
}
