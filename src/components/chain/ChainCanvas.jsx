import { Fragment, useEffect, useRef, useState } from "react";
import { ComponentType, COMPONENT_DEFS } from "../../config";
import { Card } from "../card";
import { Connector } from "../ui";
import "./ChainCanvas.css";

function DropSlot({ index, valid, hovered, onHover, onLeave, onSlotDrop }) {
  return (
    <div
      className={`dz ${valid ? "dz-ok" : "dz-no"} ${hovered ? "dz-hover" : ""}`}
      onDragOver={(e) => {
        e.stopPropagation();
        if (valid) e.preventDefault();
        onHover(index);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        onLeave();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (valid) onSlotDrop(e, index);
      }}
    >
      <div className="dz-line" />
      {valid && hovered && <div className="dz-plus">+</div>}
      {!valid && <div className="dz-blocked">✕</div>}
    </div>
  );
}

export function ChainCanvas({
  chain,
  dark,
  lastIdx,
  effectiveMode,
  lin,
  setLin,
  update,
  remove,
  duplicate,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  dragIdx,
  dragOverIdx,
  dropOn,
  setDropOn,
  add,
  addAt,
  collapsed,
  toggleCol,
  paletteType,
  paletteInsertIdx,
  setPaletteInsertIdx,
  termLinIdx,
  hasTermLinear,
}) {
  const outerRef = useRef(null);
  const measureRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(230);
  const [needsScroll, setNeedsScroll] = useState(false);

  const paletteActive = paletteType != null;

  const signature = JSON.stringify({
    chain,
    collapsed,
    effectiveMode,
    linDevice: lin.device,
    linUnit: lin.unit,
    lastIdx,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!outerRef.current || !measureRef.current) return;
      const outerWidth = outerRef.current.clientWidth - 48;
      const contentWidth = measureRef.current.scrollWidth;
      const contentHeight = measureRef.current.scrollHeight;
      let nextScale = 1;
      if (contentWidth > outerWidth && contentWidth > 0) {
        nextScale = Math.max(0.7, outerWidth / contentWidth);
      }
      const willScroll = contentWidth * nextScale > outerWidth;
      setScale(nextScale);
      setNeedsScroll(willScroll);
      setHeight(Math.max(180, contentHeight * nextScale + (willScroll ? 72 : 56)));
    }, 80);
    return () => clearTimeout(timer);
  }, [signature]);

  const handleSlotHover = (index) => setPaletteInsertIdx(index);
  const handleSlotLeave = () => setPaletteInsertIdx(null);
  const handleSlotDrop = (event, index) => {
    const type = event.dataTransfer.getData("text/palette-type");
    if (type && COMPONENT_DEFS[type]) addAt(type, index);
    setPaletteInsertIdx(null);
  };

  const isSlotValid = (index) => {
    if (termLinIdx === -1) return true;
    return index <= termLinIdx;
  };

  return (
    <div
      ref={outerRef}
      className={`co ${dropOn ? "drop" : ""}`}
      style={{ height, transition: "height .3s ease", overflowX: needsScroll ? "auto" : "hidden", overflowY: "hidden" }}
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes("text/palette-type")) {
          if (!hasTermLinear) {
            event.preventDefault();
            setDropOn(true);
          }
        }
      }}
      onDragLeave={() => setDropOn(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDropOn(false);
        if (hasTermLinear) return;
        const type = event.dataTransfer.getData("text/palette-type");
        if (type && COMPONENT_DEFS[type]) add(type);
      }}
    >
      <div
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          display: "flex",
          alignItems: "flex-start",
          padding: "28px 24px",
          left: 0,
          top: 0,
          whiteSpace: "nowrap",
        }}
      >
        {chain.map((component, index) => (
          <div key={component.id} className="cw">
            {index > 0 && <Connector dark={dark} />}
            <Card
              comp={component}
              index={index}
              isLast={index === lastIdx}
              outputMode={effectiveMode}
              lin={lin}
              onLin={setLin}
              onUp={update}
              onDel={() => {}}
              onDup={() => {}}
              onDS={() => {}}
              onDE={() => {}}
              onDO={() => {}}
              onDr={() => {}}
              isDg={false}
              isDov={false}
              dark={dark}
              collapsed={Boolean(collapsed[component.id])}
              onToggle={() => {}}
              hideTermDup={false}
            />
          </div>
        ))}
        {chain.length <= 2 && (
          <div className="chain-hint">
            Drag stages from the palette above or click + to extend your motion chain
          </div>
        )}
      </div>

      <div className="ci" style={{ transform: `scale(${scale})`, transformOrigin: "top left", transition: "transform .3s ease", width: needsScroll ? `${100 / scale}%` : "auto" }}>
        {chain.map((component, index) => (
          <Fragment key={component.id}>
            {index > 0 && paletteActive && hasTermLinear && (
              <DropSlot
                index={index}
                valid={isSlotValid(index)}
                hovered={paletteInsertIdx === index}
                onHover={handleSlotHover}
                onLeave={handleSlotLeave}
                onSlotDrop={handleSlotDrop}
              />
            )}
            <div className="cw">
              {index > 0 && <Connector dark={dark} />}
              <Card
                comp={component}
                index={index}
                isLast={index === lastIdx}
                outputMode={effectiveMode}
                lin={lin}
                onLin={setLin}
                onUp={update}
                onDel={remove}
                onDup={duplicate}
                onDS={onDragStart}
                onDE={onDragEnd}
                onDO={onDragOver}
                onDr={onDrop}
                isDg={dragIdx === index}
                isDov={dragOverIdx === index && dragOverIdx !== -1}
                dark={dark}
                collapsed={Boolean(collapsed[component.id])}
                onToggle={() => toggleCol(component.id)}
                hideTermDup={hasTermLinear}
              />
            </div>
          </Fragment>
        ))}

        {paletteActive && hasTermLinear && (
          <DropSlot
            index={chain.length}
            valid={isSlotValid(chain.length)}
            hovered={paletteInsertIdx === chain.length}
            onHover={handleSlotHover}
            onLeave={handleSlotLeave}
            onSlotDrop={handleSlotDrop}
          />
        )}

        {chain.length <= 2 && !paletteActive && (
          <div className="chain-hint">
            Drag stages from the palette above or click + to extend your motion chain
          </div>
        )}
      </div>
    </div>
  );
}
