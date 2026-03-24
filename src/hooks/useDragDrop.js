import { useState } from "react";
import { ComponentType } from "../config";

function isTerminalType(type) {
  return type === ComponentType.RACK_PINION || type === ComponentType.LEADSCREW;
}

export function useDragDrop(setChain, chain) {
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [dropOn, setDropOn] = useState(false);
  const [paletteType, setPaletteType] = useState(null);
  const [paletteInsertIdx, setPaletteInsertIdx] = useState(null);

  const termLinIdx = chain.findIndex((c) => isTerminalType(c.type));

  const onDragStart = (event, index) => {
    if (index === 0) {
      event.preventDefault();
      return;
    }
    setDragIdx(index);
    event.dataTransfer.setData("text/card-reorder", "1");
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const onDragOver = (event, index) => {
    if (!event.dataTransfer.types.includes("text/card-reorder")) return;
    if (index === 0 || dragIdx == null || dragIdx === 0) return;

    if (termLinIdx !== -1) {
      const next = [...chain];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(index, 0, moved);
      const newTermIdx = next.findIndex((c) => isTerminalType(c.type));
      if (newTermIdx !== -1 && next.slice(newTermIdx + 1).some((c) => !isTerminalType(c.type))) {
        setDragOverIdx(-1);
        return;
      }
    }

    event.preventDefault();
    setDragOverIdx(index);
  };

  const onDrop = (event, index) => {
    event.preventDefault();
    if (dragIdx == null || index === 0 || dragIdx === 0) return;
    setChain((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(index, 0, moved);

      const newTermIdx = next.findIndex((c) => isTerminalType(c.type));
      if (newTermIdx !== -1 && next.slice(newTermIdx + 1).some((c) => !isTerminalType(c.type))) {
        return prev;
      }

      return next;
    });
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const paletteDragStart = (event, type) => {
    event.dataTransfer.setData("text/palette-type", type);
    event.dataTransfer.effectAllowed = "copy";
    setPaletteType(type);
  };

  const paletteDragEnd = () => {
    setPaletteType(null);
    setPaletteInsertIdx(null);
  };

  return {
    dragIdx,
    dragOverIdx,
    dropOn,
    setDropOn,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    paletteDragStart,
    paletteDragEnd,
    paletteType,
    paletteInsertIdx,
    setPaletteInsertIdx,
    termLinIdx,
  };
}
