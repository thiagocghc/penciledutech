// components/QuestionModalRepo.tsx
"use client";
import React from "react";
import type { Questao } from "@/types/questao";
import { Button } from "@/components/ui";
import { FaCalendarAlt, FaStar, FaFlagCheckered } from "react-icons/fa";

export default function QuestionModalRepo({
  open,
  onClose,
  questao,
}: {
  open: boolean;
  onClose: () => void;
  questao?: Questao | null;
}) {
  if (!open || !questao) return null;

  // Capitalizar título (tipo "Roland Garros")
  const capitalizeTitle = (t: string) =>
    t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());

  // Parser de alternativas a partir de UMA string (CSV), ex:
  // "(a) 64 - (b) 65 - (c) 127 - (d) 128 - (e) nenhuma das acima"
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

  // Campos do dataset (repositório pode usar chaves diferentes)
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
    const n = (num !== null && String(num).trim() !== "") ? `${num}. ` : "";
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
    // Wrapper com z-index ALTO para sobrepor o navbar
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-2"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop mais escuro */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Painel do modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-4 sm:p-6 shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold">
              {capitalizeTitle(questao.titulo || `Questão ${questao.id}`)}
            </h3>

            {/* Metadados (SEM classe) */}
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
            </div>
          </div>

          <Button variant="ghost" onClick={onClose} aria-label="Fechar">
            ✕
          </Button>
        </div>

        {/* Conteúdo */}
        <div className="mt-4 max-h-[60vh] overflow-auto pr-1 text-sm text-gray-800 space-y-4">
          {/* Enunciado */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Enunciado</h4>
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="whitespace-pre-wrap leading-relaxed">{texto}</p>
            </div>
          </div>

          {/* Pergunta (com número junto) */}
          {(pergunta || numeroQuestao !== null) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Pergunta</h4>
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {formatPergunta(numeroQuestao, pergunta)}
                </p>
              </div>
            </div>
          )}

          {/* Alternativas */}
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
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}
