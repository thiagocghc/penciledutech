"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui";
import {
  FaSortAmountDown,
  FaObjectGroup,
  FaCheckCircle,
  FaPuzzlePiece,
  FaExclamationTriangle,
} from "react-icons/fa";

type Classe = "ordenação" | "agrupamento" | "outros" | "desconhecida" | string;
type Resultado = { classe: Classe };

const normalizaClasse = (c: string) => {
  const v = (c || "").toLowerCase().trim();
  if (v === "desconhecida" || v === "unknown" || v === "invalida" || v === "inválida") return "desconhecida";
  if (v === "ordenacao" || v === "ordenação") return "ordenação";
  if (v === "agrupamento") return "agrupamento";
  if (v === "outros") return "outros";
  // fallback conservador: se vier qualquer coisa estranha, trate como desconhecida (evita virar "outros")
  return "desconhecida";
};

const estiloDaClasse = (c: string) => {
  const classe = normalizaClasse(c);

  if (classe === "desconhecida")
    return {
      key: "desconhecida" as const,
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      iconBg: "bg-red-500/10",
      iconRing: "ring-red-400/30",
      icon: <FaExclamationTriangle />,
      label: "Texto inválido",
      desc: "Não reconheci esse texto como uma questão da OBI.",
    };

  if (classe === "ordenação")
    return {
      key: "ordenação" as const,
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-200",
      iconBg: "bg-purple-500/10",
      iconRing: "ring-purple-400/40",
      icon: <FaSortAmountDown />,
      label: "Ordenação",
      desc: "Problemas envolvendo a ordem de objetos.",
    };

  if (classe === "agrupamento")
    return {
      key: "agrupamento" as const,
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
      iconBg: "bg-blue-500/10",
      iconRing: "ring-blue-400/40",
      icon: <FaObjectGroup />,
      label: "Agrupamento",
      desc: "Problemas envolvendo a pertinência de objetos a grupos.",
    };

  return {
    key: "outros" as const,
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
    iconBg: "bg-yellow-500/10",
    iconRing: "ring-yellow-400/40",
    icon: <FaPuzzlePiece />,
    label: "Outros",
    desc: "Problemas que envolvem números, cálculos ou estruturas.",
  };
};

const featuresDaClasse = (c: string): string[] => {
  const classe = normalizaClasse(c);

  if (classe === "desconhecida") {
    return [
      "Cole um texto com o enunciado completo da questão.",
      "Evite textos aleatórios ou fora do padrão OBI.",
    ];
  }

  if (classe === "ordenação") {
    return [
      "Associa um objeto a uma lista de posições específicas",
      "Envolve restrições de ordem ou vizinhança",
    ];
  }

  if (classe === "agrupamento") {
    return [
      "Associa uma pessoa/objeto a grupos distintos",
      "Indica relação do tipo junto-separado",
    ];
  }

  return [
    "Analisar definições ou realizar cálculos",
    "Interpretar figuras, tabelas ou algoritmos",
  ];
};

export default function ClassificarPage() {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const MIN_CHARS = 150;
  const enunciadoPreview = texto.trim();
  const chars = enunciadoPreview.length;
  const textoValido = chars >= MIN_CHARS;

  const classificarQuestao = async () => {
    setErro(null);
    setResultado(null);

    const enunciado = texto.trim();

    if (!enunciado) {
      setErro("Cole o enunciado da questão antes de classificar.");
      return;
    }

    if (enunciado.length < MIN_CHARS) {
      setErro(
        `Digite pelo menos ${MIN_CHARS} caracteres para classificar (atual: ${enunciado.length}).`
      );
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/classificar?t=${Date.now()}`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({ enunciado, questao: "" }),
      });

      const data: any = await res.json();

      if (!res.ok) throw new Error(data?.error || "Falha ao classificar");

      const classeNormalizada = normalizaClasse(data?.classe);

      setResultado({ classe: classeNormalizada });
    } catch (e: any) {
      setErro(e.message || "Erro ao classificar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-4/5 pt-10 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna ESQUERDA: Formulário */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Classificar uma Nova Questão</h2>
          <p className="mt-1 text-sm text-gray-600">
            Cole o texto abaixo e clique em <b>Classificar</b>.
          </p>

          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={8}
            placeholder="Cole aqui o texto da questão..."
            className="mt-3 w-full resize-y rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* contador / validação */}
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className={textoValido ? "text-gray-500" : "text-amber-600"}>
              {chars}/{MIN_CHARS} caracteres mínimos
            </span>

            {!textoValido && chars > 0 && (
              <span className="text-amber-600">
                Faltam {MIN_CHARS - chars} caracteres
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
              <Button
                onClick={() => {
                  if (loading || !textoValido) return;
                  void classificarQuestao();
                }}
              >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Classificando...
                </span>
              ) : (
                "Classificar"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setTexto("");
                setResultado(null);
                setErro(null);
              }}
            >
              Limpar
            </Button>
          </div>

          {erro && <p className="mt-2 text-sm text-red-600">{erro}</p>}
        </section>

        {/* Coluna DIREITA: Resultado */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Resposta</h3>

          {loading && (
            <div className="flex items-center gap-3 text-gray-700">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
              <span>Classificando…</span>
            </div>
          )}

          {!loading && resultado && (() => {
            const classe = normalizaClasse(resultado.classe);
            const s = estiloDaClasse(classe);
            const feats = featuresDaClasse(classe);

            // ✅ Card de “texto inválido”
            if (classe === "desconhecida") {
              return (
                <div className={`rounded-3xl ${s.bg} border ${s.border} p-6`}>
                  <div className="mx-auto mb-4 grid place-items-center">
                    <div
                      className={`h-20 w-20 rounded-2xl ${s.iconBg} ring-8 ${s.iconRing} grid place-items-center text-3xl ${s.text}`}
                    >
                      {s.icon}
                    </div>
                  </div>

                  <h4 className={`text-2xl font-extrabold text-center mb-1 ${s.text}`}>
                    {s.label}
                  </h4>
                  <p className="text-center text-gray-700 mb-5">
                    Não parece ser uma questão da OBI.
                  </p>

                  <div className="space-y-3">
                    {feats.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm"
                      >
                        <FaCheckCircle className={`${s.text} mt-0.5`} />
                        <p className="text-sm text-gray-800">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // ✅ Cards normais (ordenação/agrupamento/outros)
            return (
              <div className="rounded-3xl bg-gray-50/60 p-6">
                <div className="mx-auto mb-4 grid place-items-center">
                  <div
                    className={`h-20 w-20 rounded-2xl ${s.iconBg} ring-8 ${s.iconRing} grid place-items-center text-3xl ${s.text}`}
                  >
                    {s.icon}
                  </div>
                </div>

                <h4 className="text-2xl font-extrabold text-center mb-1">{s.label}</h4>
                <p className="text-center text-gray-600 mb-5">{s.desc}</p>

                <div className="space-y-3">
                  {feats.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
                    >
                      <FaCheckCircle className={`${s.text} mt-0.5`} />
                      <p className="text-sm text-gray-800">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {!loading && !resultado && !erro && (
            <p className="text-sm text-gray-500">
              Aguardando classificação… cole o texto e clique em <b>Classificar</b>.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}