"use client";
import React, { useMemo } from "react";
import type { Questao } from "@/types/questao";
import { Input, Select } from "@/components/ui";
import { FaFilter, FaSearch } from "react-icons/fa";
import { FiX } from "react-icons/fi";

type Filters = { ano: string; nivel: string; fase: string; classe: string };

/** Rótulos */
const labelNivel = (n: string) => (n === "0" ? "Nível Júnior" : `Nível ${n}`);
const labelFase = (n: string) => `Fase ${n}`;

export default function FilterBar({
  raw,
  filters,
  setFilters,
  search,
  setSearch,
}: {
  raw: Questao[];
  filters: Filters;
  setFilters: (p: any) => void;
  search: string;
  setSearch: (v: string) => void;
}) {
  // arrays únicos (valores brutos do dataset)
  const anos = useMemo(
    () => Array.from(new Set(raw.map((q) => String(q.ano || "")))).filter(Boolean).sort(),
    [raw]
  );
  const niveisRaw = useMemo(
    () => Array.from(new Set(raw.map((q) => String(q.nivel || "")))).filter(Boolean).sort(),
    [raw]
  );
  const fasesRaw = useMemo(
    () => Array.from(new Set(raw.map((q) => String(q.fase || "")))).filter(Boolean).sort(),
    [raw]
  );
  const classes = useMemo(
    () => Array.from(new Set(raw.map((q) => String(q.classe || "")))).filter(Boolean).sort(),
    [raw]
  );

  // labels para exibição no Select
  const niveisLabels = useMemo(() => niveisRaw.map(labelNivel), [niveisRaw]);
  const fasesLabels = useMemo(() => fasesRaw.map(labelFase), [fasesRaw]);

  // mapas label -> valor bruto
  const nivelLabelToValue = useMemo(() => {
    const m = new Map<string, string>();
    niveisRaw.forEach((n) => m.set(labelNivel(n), n));
    return m;
  }, [niveisRaw]);

  const faseLabelToValue = useMemo(() => {
    const m = new Map<string, string>();
    fasesRaw.forEach((n) => m.set(labelFase(n), n));
    return m;
  }, [fasesRaw]);

  const hasActive = !!(filters.ano || filters.nivel || filters.fase || filters.classe);

  const labelMap: Record<keyof Filters, string> = {
    ano: "Ano",
    fase: "Fase",
    nivel: "Nível",
    classe: "Classe",
  };

  const clearAll = () => setFilters({ ano: "", nivel: "", fase: "", classe: "" });
  const clearOne = (k: keyof Filters) => setFilters((s: Filters) => ({ ...s, [k]: "" }));

  const fieldWrap = "space-y-1";

  // valores DISPLAY atuais (convertem o bruto para o label do select)
  const nivelDisplay = filters.nivel ? labelNivel(filters.nivel) : "";
  const faseDisplay  = filters.fase  ? labelFase(filters.fase)   : "";

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
      {/* header + limpar tudo */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Filtros</h3>
        {hasActive && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
            title="Limpar todos os filtros"
          >
            <FaFilter className="text-blue-600" />
            Limpar tudo
            <FiX className="text-blue-600" />
          </button>
        )}
      </div>

      {/* pills com labels amigáveis para fase/nivel */}
      {hasActive && (
        <div className="mb-3 flex flex-wrap gap-2">
          {(Object.keys(filters) as (keyof Filters)[])
            .filter((k) => filters[k])
            .map((k) => {
              const rawVal = String(filters[k]);
              const shown =
                k === "nivel" ? labelNivel(rawVal)
                : k === "fase" ? labelFase(rawVal)
                : rawVal;

              return (
                <span
                  key={k}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs"
                >
                  <FaFilter className="text-gray-500" />
                  <span className="font-medium">{labelMap[k]}:</span>
                  <span className="text-gray-700">{shown}</span>
                  <button
                    onClick={() => clearOne(k)}
                    className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                    aria-label={`Remover filtro ${labelMap[k]}`}
                    title={`Remover filtro ${labelMap[k]}`}
                  >
                    <FiX />
                  </button>
                </span>
              );
            })}
        </div>
      )}

      {/* Campos */}
      <div className="flex flex-col gap-4">
        {/* Ano (bruto) */}
        <div className={fieldWrap}>
          <div className="text-xs font-medium text-gray-700">Ano</div>
          <div className="w-full">
            <Select
              value={filters.ano}
              onChange={(v) => setFilters((s: Filters) => ({ ...s, ano: v }))}
              options={anos}
              placeholder="Todos"
            />
          </div>
        </div>

        {/* Fase */}
        <div className={fieldWrap}>
          <div className="text-xs font-medium text-gray-700">Fase</div>
          <div className="w-full">
            <Select
              value={faseDisplay}
              onChange={(label) =>
                setFilters((s: Filters) => ({ ...s, fase: faseLabelToValue.get(label) ?? "" }))
              }
              options={fasesLabels}
              placeholder="Todas"
            />
          </div>
        </div>

        {/* Nível */}
        <div className={fieldWrap}>
          <div className="text-xs font-medium text-gray-700">Nível</div>
          <div className="w-full">
            <Select
              value={nivelDisplay}
              onChange={(label) =>
                setFilters((s: Filters) => ({ ...s, nivel: nivelLabelToValue.get(label) ?? "" }))
              }
              options={niveisLabels}
              placeholder="Todos"
            />
          </div>
        </div>

        {/* Classe (bruto) */}
        <div className={fieldWrap}>
          <div className="text-xs font-medium text-gray-700">Classe</div>
          <div className="w-full">
            <Select
              value={filters.classe}
              onChange={(v) => setFilters((s: Filters) => ({ ...s, classe: v }))}
              options={classes}
              placeholder="Todas"
            />
          </div>
        </div>

        {/* Buscar por título */}
        <div className={fieldWrap}>
          <div className="text-xs font-medium text-gray-700">Buscar por título</div>
          <div className="w-full flex items-center gap-2">
            <FaSearch className="text-gray-400 text-sm" />
            <Input value={search} onChange={setSearch} placeholder="Ex.: biblioteca" />
          </div>
        </div>
      </div>
    </section>
  );
}