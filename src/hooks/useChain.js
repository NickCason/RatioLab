import { useCallback, useState } from "react";
import { COMPONENT_DEFS, createDefaultChain, generateId } from "../config";

export function useChain() {
  const [chain, setChain] = useState(createDefaultChain);

  const update = useCallback((id, updates) => {
    setChain((prev) => prev.map((component) => (component.id === id ? { ...component, ...updates } : component)));
  }, []);

  const add = useCallback((type, insertIndex) => {
    const definition = COMPONENT_DEFS[type];
    if (!definition) return;

    setChain((prev) => {
      const sameType = prev.filter((component) => component.type === type);
      let basePrev = prev;
      let name;

      if (sameType.length === 0) {
        name = definition.label;
      } else {
        const first = sameType[0];
        if (sameType.length === 1 && first.name === definition.label) {
          basePrev = prev.map((c) => (c.id === first.id ? { ...c, name: `${definition.label} 1` } : c));
        }
        name = `${definition.label} ${sameType.length + 1}`;
      }

      const newItem = { id: generateId(), type, ...definition.defaults, name };

      if (insertIndex != null && insertIndex >= 0 && insertIndex <= basePrev.length) {
        const next = [...basePrev];
        next.splice(insertIndex, 0, newItem);
        return next;
      }
      return [...basePrev, newItem];
    });
  }, []);

  const remove = useCallback((id) => {
    setChain((prev) => prev.filter((component) => component.id !== id));
  }, []);

  const duplicate = useCallback((component) => {
    const copy = { ...component, id: generateId(), name: `${component.name} Copy` };
    setChain((prev) => {
      const index = prev.findIndex((entry) => entry.id === component.id);
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
  }, []);

  return { chain, setChain, add, update, remove, duplicate };
}
