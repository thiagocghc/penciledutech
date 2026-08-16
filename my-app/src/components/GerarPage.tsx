"use client";

import { useMemo, useState } from "react";
import { Button, Select } from "@/components/ui";
import { LuBrainCircuit, LuSparkles, LuTarget, LuScrollText } from "react-icons/lu";

type Questao = {
  titulo: string;
  enunciado: string;
  pergunta?: string;
  alternativas: Record<string, string>;
  gabarito: string;
  metadata?: {
    filtros?: {
      nivel?: string;
      fase?: string;
      classe?: string;
    };
    exemplosUtilizados?: number;
  };
};

const classes = [
  { value: "ordenacao", label: "Ordenação" },
  { value: "agrupamento", label: "Agrupamento" },
  { value: "calculo", label: "Cálculo" },
];

const niveis = ["Nível 1", "Nível 2", "Nível 3"];
const fases = ["Local", "Estadual", "Nacional"];

function formatClasseLabel(classe: string) {
  return classes.find((item) => item.value === classe)?.label ?? classe;
}

export default function GerarPage() {
  const [nivel, setNivel] = useState("Nível 1");
  const [fase, setFase] = useState("Local");
  const [classe, setClasse] = useState("ordenacao");
  const [loading, setLoading] = useState(false);
  const [questao, setQuestao] = useState<Questao | null>(null);
  const [erro, setErro] = useState("");
  const [gabaritoVisible, setGabaritoVisible] = useState(false);

  const classeAtual = useMemo(() => formatClasseLabel(classe), [classe]);

  async function handleGerar() {
    setLoading(true);
    setQuestao(null);
    setErro("");
    setGabaritoVisible(false);

    try {
      const res = await fetch("/api/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nivel, fase, classe }),
      });

      const data = await res.json();

      if (!res.ok || data.erro) {
        setErro(data.erro || "Não foi possível gerar a questão.");
        return;
      }

      setQuestao(data);
    } catch {
      setErro("Erro de conexão com a API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <LuBrainCircuit className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerar Questões no padrão OBI</h1>
              <p className="mt-1 text-sm text-gray-600">
                Selecione a classe, o nível e a fase. A IA gera uma questão inédita com base em exemplos do dataset rotulado, mantendo o estilo do projeto hospedado no Vercel.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Classe</label>
              <Select value={classe} onChange={(e) => setClasse(e.target.value)}>
                {classes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Nível</label>
              <Select value={nivel} onChange={(e) => setNivel(e.target.value)}>
                {niveis.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Fase</label>
              <Select value={fase} onChange={(e) => setFase(e.target.value)}>
                {fases.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={handleGerar} disabled={loading} className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">
              <LuSparkles className="text-base" />
              {loading ? "Gerando questão..." : "Gerar questão"}
            </Button>
            <span className="text-sm text-gray-500">
              Configuração atual: <strong>{classeAtual}</strong> · <strong>{nivel}</strong> · <strong>{fase}</strong>
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 inline-flex rounded-full bg-white p-2 text-emerald-700 shadow-sm">
                <LuTarget />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Classe controlada</h3>
              <p className="mt-1 text-sm text-gray-600">A questão segue o tipo escolhido pelo usuário: ordenação, agrupamento ou cálculo.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 inline-flex rounded-full bg-white p-2 text-emerald-700 shadow-sm">
                <LuScrollText />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Estrutura completa</h3>
              <p className="mt-1 text-sm text-gray-600">A saída já vem com enunciado, pergunta, alternativas e gabarito em formato pronto para uso.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 inline-flex rounded-full bg-white p-2 text-emerald-700 shadow-sm">
                <LuBrainCircuit />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Prompt guiado</h3>
              <p className="mt-1 text-sm text-gray-600">A API usa exemplos do dataset rotulado como referência para manter consistência com os padrões da OBI.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-gradient-to-b from-emerald-50 to-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Resultado da geração</h2>
          <p className="mt-1 text-sm text-gray-600">A nova questão aparecerá aqui com visual padronizado ao restante do site.</p>

          {erro && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{erro}</div>}

          {!erro && !questao && (
            <div className="mt-6 rounded-2xl border border-dashed border-emerald-200 bg-white/70 p-6 text-sm text-gray-500">
              Escolha os filtros e clique em <strong>Gerar questão</strong> para produzir um novo item alinhado aos padrões da Olimpíada Brasileira de Informática.
            </div>
          )}

          {questao && (
            <article className="mt-5 space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{classeAtual}</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{nivel}</span>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">{fase}</span>
                <span className="ml-auto text-xs text-gray-400">Exemplos usados: {questao.metadata?.exemplosUtilizados ?? 0}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900">{questao.titulo}</h3>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Enunciado</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">{questao.enunciado}</p>
              </div>

              {questao.pergunta && (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Pergunta</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">{questao.pergunta}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Alternativas</p>
                <div className="mt-3 space-y-2">
                  {Object.entries(questao.alternativas).map(([letra, texto]) => {
                    const correta = gabaritoVisible && letra === questao.gabarito;
                    return (
                      <div
                        key={letra}
                        className={`flex gap-3 rounded-xl border p-3 text-sm ${
                          correta ? "border-emerald-300 bg-emerald-50" : "border-gray-200 bg-white"
                        }`}
                      >
                        <span className="min-w-[1.5rem] font-bold text-gray-700">{letra})</span>
                        <span className="text-gray-700">{texto}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button variant="outline" onClick={() => setGabaritoVisible((value) => !value)}>
                  {gabaritoVisible ? "Ocultar gabarito" : "Ver gabarito"}
                </Button>
                <Button variant="ghost" onClick={handleGerar} disabled={loading} className="ml-auto">
                  Gerar outra questão
                </Button>
              </div>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
