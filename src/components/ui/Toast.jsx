import { useEffect, useState } from "react";
import "./Toast.css";

export function Toast({ message, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 3500);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [onDismiss]);

  return (
    <div className={`toast ${visible ? "toast-in" : "toast-out"}`}>
      <span className="toast-icon">⚠</span>
      <span className="toast-msg">{message}</span>
    </div>
  );
}
