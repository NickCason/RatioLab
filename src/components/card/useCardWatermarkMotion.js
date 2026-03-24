import { useCallback, useEffect, useRef } from "react";
import { ComponentType } from "../../config";

const GEAR_MESH_RATIO = 1.5714285714285714;

function createAnimState() {
  return { raf: null, angle: 0, angle2: 0, phase: 0, speed: 0, belt: 0 };
}

/**
 * Matches deploy-69c309f8b4c603802a93ada5: rAF-driven SVG motion on card hover (watermark ref).
 */
export function useCardWatermarkMotion(compType, wmRef) {
  const animRef = useRef(createAnimState());

  useEffect(
    () => () => {
      const { raf } = animRef.current;
      if (raf) cancelAnimationFrame(raf);
    },
    [],
  );

  const onWmEnter = useCallback(() => {
    const root = wmRef.current;
    if (!root) return;

    const st = animRef.current;
    if (st.raf) {
      cancelAnimationFrame(st.raf);
      st.raf = null;
    }
    st.speed = 36;
    let t0 = performance.now();

    if (compType === ComponentType.GEAR_MESH) {
      const paths = root.querySelectorAll("path");
      if (paths.length < 2) return;
      const [p0, p1] = paths;
      const tick = (now) => {
        const dt = (now - t0) / 1000;
        t0 = now;
        st.angle += st.speed * dt;
        st.angle2 -= st.speed * GEAR_MESH_RATIO * dt;
        p0.setAttribute("transform", `rotate(${st.angle} 44 60)`);
        p1.setAttribute("transform", `rotate(${st.angle2} 99 60)`);
        st.raf = requestAnimationFrame(tick);
      };
      st.raf = requestAnimationFrame(tick);
      return;
    }

    if (compType === ComponentType.BELT_PULLEY) {
      const circles = root.querySelectorAll("circle");
      const lines = root.querySelectorAll("line");
      if (circles.length < 6 || lines.length < 2) return;
      const c1 = circles[1];
      const c4 = circles[4];
      const [ln0, ln1] = lines;
      const tick = (now) => {
        const dt = (now - t0) / 1000;
        t0 = now;
        st.angle += st.speed * dt;
        st.angle2 += st.speed * 1.5 * dt;
        st.belt += st.speed * (Math.PI / 180) * 30 * dt;
        c1.setAttribute("transform", `rotate(${st.angle} 35 60)`);
        c4.setAttribute("transform", `rotate(${st.angle2} 108 60)`);
        ln0.setAttribute("stroke-dashoffset", String(-st.belt));
        ln1.setAttribute("stroke-dashoffset", String(st.belt));
        st.raf = requestAnimationFrame(tick);
      };
      st.raf = requestAnimationFrame(tick);
      return;
    }

    if (compType === ComponentType.RACK_PINION) {
      const paths = root.querySelectorAll("path");
      if (paths.length < 2) return;
      const [p0, p1] = paths;
      const tick = (now) => {
        const dt = (now - t0) / 1000;
        t0 = now;
        st.angle += st.speed * dt;
        const rackShift = -((st.angle * 0.3375) % 13.5);
        p0.setAttribute("transform", `translate(-1,11) rotate(${st.angle} 60 34)`);
        p1.setAttribute("transform", `translate(${rackShift} 0)`);
        st.raf = requestAnimationFrame(tick);
      };
      st.raf = requestAnimationFrame(tick);
      return;
    }

    if (compType === ComponentType.LEADSCREW) {
      const lines = root.querySelectorAll("line");
      if (lines.length < 7) return;
      const bases = [12, 30, 48, 66, 84, 102, 120];
      const tick = (now) => {
        const dt = (now - t0) / 1000;
        t0 = now;
        st.belt += st.speed * 0.5 * dt;
        const shift = ((st.belt % 126) + 126) % 126;
        for (let i = 0; i < 7; i += 1) {
          const x = 12 + ((bases[i] - 12 + shift) % 126);
          let fade = 1;
          if (x < 30) fade = Math.max(0, (x - 18) / 12);
          else if (x > 118) fade = Math.max(0, (130 - x) / 12);
          const el = lines[i];
          el.setAttribute("x1", String(x));
          el.setAttribute("y1", String(60 - 18 * fade));
          el.setAttribute("x2", String(x + 8));
          el.setAttribute("y2", String(60 + 18 * fade));
          el.setAttribute("opacity", String(fade));
        }
        st.raf = requestAnimationFrame(tick);
      };
      st.raf = requestAnimationFrame(tick);
      return;
    }

    const svg = root.querySelector("svg");
    if (!svg) return;
    svg.style.transition = "none";
    const isGearbox = compType === ComponentType.GEARBOX;
    const tick = (now) => {
      const dt = (now - t0) / 1000;
      t0 = now;
      if (isGearbox) {
        st.angle += st.speed * dt;
        svg.style.transform = `rotate(${st.angle}deg)`;
      } else {
        st.phase += dt;
        svg.style.transform = `scale(${1 + 0.06 * Math.sin(st.phase * 2.513)})`;
      }
      st.raf = requestAnimationFrame(tick);
    };
    st.raf = requestAnimationFrame(tick);
  }, [compType, wmRef]);

  const onWmLeave = useCallback(() => {
    const root = wmRef.current;
    if (!root) return;

    const st = animRef.current;
    if (st.raf) {
      cancelAnimationFrame(st.raf);
      st.raf = null;
    }

    const isGearbox = compType === ComponentType.GEARBOX;
    const isMesh = compType === ComponentType.GEAR_MESH;
    const isBelt = compType === ComponentType.BELT_PULLEY;

    if (isGearbox || isMesh || isBelt) {
      const svg = root.querySelector("svg");
      if (!svg) return;

      let p0;
      let p1;
      let c1;
      let c4;
      let ln0;
      let ln1;

      if (isMesh) {
        const paths = root.querySelectorAll("path");
        if (paths.length < 2) return;
        [p0, p1] = paths;
      } else if (isBelt) {
        const circles = root.querySelectorAll("circle");
        const lines = root.querySelectorAll("line");
        if (circles.length < 6 || lines.length < 2) return;
        c1 = circles[1];
        c4 = circles[4];
        [ln0, ln1] = lines;
      }

      let t0 = performance.now();
      const tick = (now) => {
        const dt = (now - t0) / 1000;
        t0 = now;
        st.speed *= 0.02 ** dt;
        st.angle += st.speed * dt;

        if (isMesh) {
          st.angle2 -= st.speed * GEAR_MESH_RATIO * dt;
          p0.setAttribute("transform", `rotate(${st.angle} 44 60)`);
          p1.setAttribute("transform", `rotate(${st.angle2} 99 60)`);
        } else if (isBelt) {
          st.angle2 += st.speed * 1.5 * dt;
          st.belt += st.speed * (Math.PI / 180) * 30 * dt;
          c1.setAttribute("transform", `rotate(${st.angle} 35 60)`);
          c4.setAttribute("transform", `rotate(${st.angle2} 108 60)`);
          ln0.setAttribute("stroke-dashoffset", String(-st.belt));
          ln1.setAttribute("stroke-dashoffset", String(st.belt));
        } else {
          svg.style.transform = `rotate(${st.angle}deg)`;
        }

        if (st.speed > 0.3) st.raf = requestAnimationFrame(tick);
        else st.raf = null;
      };
      st.raf = requestAnimationFrame(tick);
      return;
    }

    if (compType === ComponentType.RACK_PINION) {
      const paths = root.querySelectorAll("path");
      if (paths.length < 2) return;
      const [p0, p1] = paths;
      let t0 = performance.now();
      const tick = (now) => {
        const dt = (now - t0) / 1000;
        t0 = now;
        st.speed *= 0.02 ** dt;
        st.angle += st.speed * dt;
        const rackShift = -((st.angle * 0.3375) % 13.5);
        p0.setAttribute("transform", `translate(-1,11) rotate(${st.angle} 60 34)`);
        p1.setAttribute("transform", `translate(${rackShift} 0)`);
        if (st.speed > 0.3) st.raf = requestAnimationFrame(tick);
        else st.raf = null;
      };
      st.raf = requestAnimationFrame(tick);
      return;
    }

    if (compType === ComponentType.LEADSCREW) {
      const lines = root.querySelectorAll("line");
      if (lines.length < 7) return;
      const bases = [12, 30, 48, 66, 84, 102, 120];
      let t0 = performance.now();
      const tick = (now) => {
        const dt = (now - t0) / 1000;
        t0 = now;
        st.speed *= 0.02 ** dt;
        st.belt += st.speed * 0.5 * dt;
        const shift = ((st.belt % 126) + 126) % 126;
        for (let i = 0; i < 7; i += 1) {
          const x = 12 + ((bases[i] - 12 + shift) % 126);
          let fade = 1;
          if (x < 30) fade = Math.max(0, (x - 18) / 12);
          else if (x > 118) fade = Math.max(0, (130 - x) / 12);
          const el = lines[i];
          el.setAttribute("x1", String(x));
          el.setAttribute("y1", String(60 - 18 * fade));
          el.setAttribute("x2", String(x + 8));
          el.setAttribute("y2", String(60 + 18 * fade));
          el.setAttribute("opacity", String(fade));
        }
        if (st.speed > 0.3) st.raf = requestAnimationFrame(tick);
        else st.raf = null;
      };
      st.raf = requestAnimationFrame(tick);
      return;
    }

    const svg = root.querySelector("svg");
    if (!svg) return;
    svg.style.transition = "transform 0.5s ease-out";
    svg.style.transform = "scale(1)";
    st.phase = 0;
  }, [compType, wmRef]);

  return { onWmEnter, onWmLeave };
}
