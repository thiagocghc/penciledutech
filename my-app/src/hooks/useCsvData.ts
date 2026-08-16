"use client";

import { useEffect, useState } from "react";
import { csvToJson, PATH_CSV, PATH_CSV_REPOSITORIO } from "@/lib/csv";
import type { Questao } from "@/types/questao";

type HookResult = { data: Questao[]; loaded: boolean; error: string | null };

/** Hook base parametrizado por caminho */
function useCsvDataPath(path: string): HookResult {
  const [data, setData] = useState<Questao[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoaded(false);
      setError(null);
      try {
        // cache-busting + sem cache
        const res = await fetch(`${path}?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const txt = await res.text();
        const json = csvToJson<Questao>(txt);
        if (alive) setData(json);
      } catch (e: any) {
        if (alive) {
          setError(String(e?.message || e));
          setData([]);
        }
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [path]);

  return { data, loaded, error };
}

/** Dataset de questões já classificadas */
export function useCsvData(): HookResult {
  return useCsvDataPath(PATH_CSV);
}

/** Dataset do repositório */
export function useCsvDataRepo(): HookResult {
  return useCsvDataPath(PATH_CSV_REPOSITORIO);
}
