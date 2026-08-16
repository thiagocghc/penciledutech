"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Questao } from "@/types/questao";

type TrailItem = Questao;

const STORAGE_KEY = "well_study_trail_v1";

function safeParse(json: string | null): TrailItem[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function useStudyTrail() {
  const [items, setItems] = useState<TrailItem[]>([]);

  // carregar do localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    setItems(safeParse(window.localStorage.getItem(STORAGE_KEY)));
  }, []);

  // persistir
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const has = useCallback(
    (q: Questao) => items.some((it) => String(it.id) === String(q.id)),
    [items]
  );

  const add = useCallback((q: Questao) => {
    setItems((prev) => {
      if (prev.some((it) => String(it.id) === String(q.id))) return prev;
      // manter o objeto completo (inclui Pergunta/Alternativas quando existirem no CSV)
      const item: any = { ...q };
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((q: Questao) => {
    setItems((prev) => prev.filter((it) => String(it.id) !== String(q.id)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.length;

  return useMemo(
    () => ({ items, count, add, remove, clear, has }),
    [items, count, add, remove, clear, has]
  );
}
