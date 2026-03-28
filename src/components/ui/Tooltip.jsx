import { createPortal } from "react-dom";
import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import "./Tooltip.css";

function getAppRoot() {
  return document.querySelector(".app") || document.body;
}

function MiniKatex({ tex }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    try {
      katex.render(tex, ref.current, {
        displayMode: false,
        throwOnError: false,
        trust: true,
        strict: false,
      });
    } catch {
      ref.current.textContent = tex;
    }
  }, [tex]);
  return <span ref={ref} className="tt-katex" />;
}

export function Tooltip({ content, children, position = "above", disabled = false }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timerRef = useRef(null);
  const hoveringRef = useRef(false);
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), 120);
  }, []);

  const scheduleShow = useCallback(() => {
    if (disabledRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), 180);
  }, []);

  const show = useCallback(() => {
    scheduleShow();
  }, [scheduleShow]);

  useLayoutEffect(() => {
    if (disabled) {
      clearTimeout(timerRef.current);
      setOpen(false);
      return;
    }
    let rafOuter = 0;
    let rafInner = 0;
    const tryResumeIfPointerOverTrigger = () => {
      if (disabledRef.current) return;
      const tr = triggerRef.current;
      if (!tr) return;
      const hoverCss = typeof tr.matches === "function" && tr.matches(":hover");
      const focusInside =
        tr === document.activeElement || (typeof tr.contains === "function" && tr.contains(document.activeElement));
      if (hoverCss || hoveringRef.current || focusInside) {
        if (hoverCss) hoveringRef.current = true;
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setOpen(true), 180);
      }
    };
    tryResumeIfPointerOverTrigger();
    rafOuter = requestAnimationFrame(() => {
      rafInner = requestAnimationFrame(tryResumeIfPointerOverTrigger);
    });
    return () => {
      cancelAnimationFrame(rafOuter);
      cancelAnimationFrame(rafInner);
    };
  }, [disabled]);

  const handleMouseEnter = useCallback(() => {
    hoveringRef.current = true;
    scheduleShow();
  }, [scheduleShow]);

  const handleMouseLeave = useCallback(() => {
    hoveringRef.current = false;
    hide();
  }, [hide]);

  const keepOpen = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useLayoutEffect(() => {
    if (!open || !tooltipRef.current || !triggerRef.current) return;
    const tt = tooltipRef.current;
    const tr = triggerRef.current.getBoundingClientRect();
    const ttRect = tt.getBoundingClientRect();
    const pad = 8;

    let top;
    if (position === "above") {
      top = tr.top - ttRect.height - pad;
      if (top < pad) top = tr.bottom + pad;
    } else {
      top = tr.bottom + pad;
      if (top + ttRect.height > window.innerHeight - pad)
        top = tr.top - ttRect.height - pad;
    }

    let left = tr.left + tr.width / 2 - ttRect.width / 2;
    left = Math.max(pad, Math.min(left, window.innerWidth - ttRect.width - pad));
    top = Math.max(pad, top);

    tt.style.top = `${top}px`;
    tt.style.left = `${left}px`;
    tt.style.visibility = "visible";
  }, [open, position]);

  if (!content) return children;

  const panel = open && !disabled && createPortal(
    <div
      ref={tooltipRef}
      className="tt-panel"
      onMouseEnter={keepOpen}
      onMouseLeave={hide}
    >
      {content.title && <div className="tt-title">{content.title}</div>}
      {content.description && (
        <div className="tt-desc">{content.description}</div>
      )}
      {content.math && content.math.length > 0 && (
        <div className="tt-math">
          {content.math.map((tex, i) => (
            <div key={i} className="tt-math-row">
              <MiniKatex tex={tex} />
            </div>
          ))}
        </div>
      )}
      {typeof content === "string" && (
        <div className="tt-desc">{content}</div>
      )}
    </div>,
    getAppRoot(),
  );

  return (
    <>
      <span
        ref={triggerRef}
        className="tt-trigger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={show}
        onBlur={() => {
          hide();
        }}
      >
        {children}
      </span>
      {panel}
    </>
  );
}
