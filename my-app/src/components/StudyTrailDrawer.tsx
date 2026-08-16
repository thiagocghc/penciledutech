"use client";

import React, { useMemo, useState } from "react";
import type { Questao } from "@/types/questao";
import { Button } from "@/components/ui";
import { exportQuestoesToPdf } from "@/lib/pdf";
import { FaListCheck, FaTrash, FaFilePdf, FaXmark } from "react-icons/fa6";

export default function StudyTrailDrawer({
  items,
  onRemove,
  onClear,
}: {
  items: Questao[];
  onRemove: (q: Questao) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);

  const count = items.length;

  const canExport = count > 0;

  const title = useMemo(() => {
    if (count === 0) return "Trilha vazia";
    return `Trilha (${count})`;
  }, [count]);

  return (
    <>
      {/* Botão flutuante */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[950] inline-flex items-center gap-2 rounded-full bg-green-700 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-green-900"
        aria-label="Abrir trilha de estudos"
      >
        <FaListCheck />
        Trilha
        <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">{count}</span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[900] bg-black/30"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[1000] h-full w-[92vw] max-w-md border-l border-gray-200 bg-white shadow-2xl transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Trilha de estudos"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
              <p className="text-xs text-gray-500">Selecione questões na Home e exporte em PDF.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl p-2 hover:bg-gray-100"
              aria-label="Fechar"
            >
              <FaXmark />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {count === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
                Nenhuma questão adicionada ainda.
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((q) => (
                  <li key={String(q.id)} className="rounded-2xl border border-gray-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {q.titulo ? q.titulo : `Questão ${q.id}`}
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                          {q.ano} • {q.nivel} • {q.fase} • {q.classe}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(q)}
                        className="rounded-xl p-2 text-gray-600 hover:bg-gray-100"
                        aria-label="Remover da trilha"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={onClear}
              >
                <span className="inline-flex items-center gap-2"><FaTrash /> Limpar</span>
              </Button>
              <Button
                onClick={async () => {
                  await exportQuestoesToPdf(items);
                }}
                variant={canExport ? "default" : "outline"}
              >
                <span className="inline-flex items-center gap-2"><FaFilePdf /> Exportar PDF</span>
              </Button>
            </div>
            {!canExport && (
              <p className="mt-2 text-xs text-gray-500">Adicione ao menos 1 questão para exportar.</p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
