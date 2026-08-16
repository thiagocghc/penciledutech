"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { Questao } from "@/types/questao";
import { useCsvDataRepo } from "@/hooks/useCsvData";
import FilterBarRepo, { RepoFilters } from "@/components/FilterBarRepo";
import QuestionCardRepo from "@/components/QuestionCardRepo";
import QuestionModalRepo from "@/components/QuestionModalRepo";

export default function RepositorioPage() {
  const { data: raw, loaded, error } = useCsvDataRepo();

  const [filters, setFilters] = useState<RepoFilters>({
    ano: "",
    nivel: "",
    fase: "",
  });
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Questao | null>(null);

  useEffect(() => {
    setFilters({ ano: "", nivel: "", fase: "" });
    setSearch("");
  }, [raw.length]);

  const filtered = useMemo(() => {
    const needle = search.toLowerCase().trim();
    return raw
      .filter((q) => (filters.ano ? q.ano === filters.ano : true))
      .filter((q) => (filters.nivel ? q.nivel === filters.nivel : true))
      .filter((q) => (filters.fase ? q.fase === filters.fase : true))
      .filter((q) => (needle ? String(q.titulo || "").toLowerCase().includes(needle) : true));
  }, [raw, filters, search]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <aside className="lg:col-span-1 lg:sticky lg:top-20 self-start">
          <FilterBarRepo
            raw={raw}
            filters={filters}
            setFilters={setFilters}
            search={search}
            setSearch={setSearch}
          />
        </aside>

        <section className="lg:col-span-3">
          <div className="mb-2 flex items-center justify-between text-xs sm:text-sm text-gray-600">
            <span>
              <b>{filtered.length}</b> resultado(s)
              {!loaded ? " • carregando…" : ""}
              {error ? ` • erro ao carregar: ${error}` : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((q) => (
              <QuestionCardRepo
                key={q.id}
                q={q}
                showClasse={false} // repositório não tem classe
                onOpen={(qq) => {
                  setActive(qq);
                  setOpen(true);
                }}
              />
            ))}

            {loaded && filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
                Nenhuma questão encontrada com os filtros atuais.
              </div>
            )}
          </div>
        </section>
      </div>

      <QuestionModalRepo open={open} onClose={() => setOpen(false)} questao={active} />
    </div>
  );
}
