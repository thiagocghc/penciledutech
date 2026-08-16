"use client";
import React from "react";
import type { Questao } from "@/types/questao";
import { Button } from "@/components/ui";
import { FaCalendarAlt, FaStar, FaFlagCheckered, FaCheck } from "react-icons/fa";

export default function QuestionModal({
  open,
  onClose,
  questao,
  onAdd,
  onRemove,
  inTrail = false,
}: {
  open: boolean;
  onClose: () => void;
  questao?: Questao | null;
  onAdd?: (q: Questao) => void;
  onRemove?: (q: Questao) => void;
  inTrail?: boolean;
}) {
  if (!open || !questao) return null;

  const getClasseColor = (classe?: string) => {
    switch ((classe || "").toLowerCase()) {
      case "ordenação":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "agrupamento":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const normalizeClasse = (c?: string) => {
    const v = (c || "Outros").toString().trim();
    return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
  };

  const capitalizeTitle = (t: string) =>
    t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());

  const parseAlternativasFromSingleString = (raw: string): { label: string; text: string }[] => {
    if (!raw) return [];
    const re = /\(([a-eA-E])\)\s*([\s\S]*?)(?=\s*\([a-eA-E]\)|$)/g;
    const found: Record<string, string> = {};
    let m: RegExpExecArray | null;
    while ((m = re.exec(raw)) !== null) {
      const k = m[1].toUpperCase();
      const val = (m[2] || "").replace(/^\s*[-–—]\s*/, "").trim();
      found[k] = val;
    }
    return ["A", "B", "C", "D", "E"]
      .map((k) => (found[k] ? { label: k, text: found[k] } : null))
      .filter(Boolean) as { label: string; text: string }[];
  };

  // campos do dataset (podem existir além do tipo Questao)
  const numeroQuestao =
    (questao as any)?.numero_questao ??
    (questao as any)?.numero ??
    (questao as any)?.n_questao ??
    null;

  const pergunta =
    (questao as any)?.questao ??
    (questao as any)?.pergunta ??
    (questao as any)?.question ??
    "";

  const formatPergunta = (num: number | string | null, txt: string) => {
    const n = num !== null && String(num).trim() !== "" ? `${num}. ` : "";
    return `${n}${txt}`.trim();
  };

  const rawAlternativas =
    (questao as any)?.alternativas || (questao as any)?.options || (questao as any)?.alts || "";
  const alternativas =
    typeof rawAlternativas === "string"
      ? parseAlternativasFromSingleString(rawAlternativas)
      : Array.isArray(rawAlternativas)
      ? rawAlternativas.map((t: string, i: number) => ({ label: String.fromCharCode(65 + i), text: t }))
      : [];

  const texto = questao.textoCompleto || questao.enunciado || "(Sem texto completo)";

  return (
    <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-2" role="dialog" aria-modal="true">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* painel */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-4 sm:p-6 shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold">
              {capitalizeTitle(questao.titulo || `Questão ${questao.id}`)}
            </h3>

            <div className="mt-2 grid grid-cols-1 sm:flex gap-2 text-xs text-gray-700">
              <div className="inline-flex items-center gap-2">
                <span className="font-semibold">Ano:</span>
                <span className="inline-flex items-center gap-1">
                  <FaCalendarAlt /> {questao.ano ?? "—"}
                </span>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="font-semibold">Fase:</span>
                <span className="inline-flex items-center gap-1">
                  <FaFlagCheckered /> {questao.fase ?? "—"}
                </span>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="font-semibold">Nível:</span>
                <span className="inline-flex items-center gap-1">
                  <FaStar /> {questao.nivel ?? "—"}
                </span>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="font-semibold">Classe:</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border ${getClasseColor(
                    questao.classe
                  )}`}
                >
                  {normalizeClasse(questao.classe)}
                </span>
              </div>

              {inTrail && (
                <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  <FaCheck /> Na trilha
                </div>
              )}
            </div>
          </div>

          <Button variant="ghost" onClick={onClose} aria-label="Fechar">
            ✕
          </Button>
        </div>

        {/* Conteúdo */}
        <div className="mt-4 max-h-[60vh] overflow-auto pr-1 text-sm text-gray-800 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Enunciado</h4>
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="whitespace-pre-wrap leading-relaxed">{texto}</p>
            </div>
          </div>

          {(pergunta || numeroQuestao !== null) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Pergunta</h4>
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <p className="whitespace-pre-wrap leading-relaxed">{formatPergunta(numeroQuestao, pergunta)}</p>
              </div>
            </div>
          )}

          {alternativas.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Alternativas</h4>
              <ul className="space-y-1 text-gray-800">
                {alternativas.map((opt) => (
                  <li key={opt.label} className="flex gap-2">
                    <span className="font-bold">({opt.label})</span>
                    <span>{opt.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            {onAdd && !inTrail && (
              <Button onClick={() => onAdd(questao)}>Adicionar à trilha</Button>
            )}
            {onRemove && inTrail && (
              <Button variant="outline" onClick={() => onRemove(questao)}>Remover da trilha</Button>
            )}
          </div>
          <Button variant="ghost" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}
