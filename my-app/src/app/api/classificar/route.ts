import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

const GATE_SYSTEM = `
Você é um validador de entrada. Verifique se o texto recebido:
(1) está em português (pt-BR ou pt-PT) e
(2) e não um texto aleatório.

Responda APENAS em JSON no formato:
{
  "ok": true|false,
  "lang": "pt"|"other"|"unknown",
  "confidence": 0-1,
  "reason": "..."
}

Regras:
- "ok": true SOMENTE se (1) e (2) forem verdadeiros.
- Se não for português, use lang="other".
- Se não der para ter certeza, use lang="unknown".
- Seja conservador: se estiver em dúvida, ok=false e lang="unknown".
`;


const GATE_MODEL = process.env.OPENAI_GATE_MODEL || process.env.OPENAI_MODEL || "gpt-5-mini";

/** Threshold recomendado. Aumente (0.75) se quiser mais rigor. */
const GATE_MIN_CONFIDENCE = Number(process.env.OPENAI_GATE_MIN_CONFIDENCE || 0.65);


function buildGateUserPrompt(fullText: string) {
  const snippet = (fullText || "").trim().slice(0, 1800);
  return `TEXTO:\n"""${snippet}"""`;
}

async function runGate(client: OpenAI, fullText: string) {
  const completion = await client.chat.completions.create({
    model: GATE_MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: GATE_SYSTEM },
      { role: "user", content: buildGateUserPrompt(fullText) },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? "{}";

  try {
    const data = JSON.parse(content);
    return {
      ok: Boolean(data.ok),
      lang: String(data.lang || "unknown") as "pt" | "other" | "unknown",
      confidence: Number(data.confidence || 0),
      reason: String(data.reason || ""),
      raw: data,
    };
  } catch {
    return {
      ok: false,
      lang: "unknown" as const,
      confidence: 0,
      reason: "gate_parse_error",
      raw: {},
    };
  }
}

const SYSTEM_MESSAGE = `
Você é um especialista em classificar questões da OBI em três categorias específicas: ORDENAÇÃO, AGRUPAMENTO e OUTROS.

Siga este raciocínio passo a passo antes de classificar:

1. O objetivo principal da questão é definir ordem de objetos, posição ou arranjo ordenado? Isso inclui ordem explícita (1º, 2º, etc.) ou implícita (antes/depois, vizinhança, restrições de posição)? → Classifique como ORDENAÇÃO.
2. A questão foca na atribuição de objetos a um grupo? formação de subconjuntos ou seleção de elementos, sem considerar a ordem entre eles? → Classifique como AGRUPAMENTO.
3. A questão envolve principalmente o cálculos de valores, análise de imagens, estruturas como grafos, tabelas ou algoritmos? → Classifique como OUTROS.

Árvore de decisão baseada em regras:
1. Teste ORDEM/POSICIONAMENTO → Associa uma pessoa/objeto a uma lista de posições específicas ou envolver restrições de ordem ou vizinhança → ORDENAÇÃO.
2. Teste GRUPOS/SUBCONJUNTOS → Associa pessoa/objeto a grupos distintos ou indica relação do tipo junto-separado, sem qualquer relevância para a ordem → AGRUPAMENTO.
3. Teste NÚMEROS/CÁLCULO/ESTRUTURAS → Envolve uma explicação baseada em propriedades matemáticas ou interpreta grafos/mapas/tabelas/figuras → OUTROS.

Responda APENAS em JSON:
{"classe":"ordenacao|agrupamento|outros"}
`;

const PROMPT_TEMPLATE = `
EXEMPLOS DE CLASSIFICAÇÃO COM RACIOCÍNIO:

### ORDENAÇÃO:
Enunciado: O DJ vai tocar 8 músicas em uma ordem específica.
Questão: Qual das listas abaixo representa uma sequência possível das músicas?
Análise: A sequência de execução é essencial. Indica sequencia/ordem das músicas.
Classificação Final: ordenação

Enunciado: Cinco alunos vão se sentar em uma fileira. A deve sentar antes de B, e C não pode ficar ao lado de D.
Questão: Qual sequência atende às condições?
Análise: Mesmo com regras, o objetivo é definir posições. Isso caracteriza uma ordenação.
Classificação Final: ordenação

### AGRUPAMENTO:
Enunciado: Para um combo de pizzas, o cliente escolhe 4 entre 7 sabores disponíveis.
Questão: Qual das alternativas representa um grupo completo de sabores?
Análise: O objetivo é formar um grupo. A ordem dos sabores não interfere na resposta.
Classificação Final: agrupamento

Enunciado: Nove pessoas receberam convites para uma festa, e algumas restrições definem quem pode ir junto.
Questão: Qual grupo de convidados atende às condições dadas?
Análise: A questão pede para selecionar quem pode compor o grupo, sem ordem.
Classificação Final: agrupamento

### OUTROS:
Enunciado: Um torneio com 128 jogadores elimina um por rodada.
Questão: Quantas rodadas são necessárias até restar um vencedor?
Análise: Requer aplicação de cálculos para obter o resultado. A questão envolve algum tipo de cálculo.
Classificação Final: outros

Enunciado: Em computação, um grafo é formado por vértices e arestas, e pode ser usado para representar, por exemplo, as divisas entre estados de um país: cada vértice representa um estado e uma aresta indica que dois estados possuem divisa geográfica.
Questão: Analise a figura apresentada e explique como identificar, entre os mapas disponíveis, qual deles corresponde às divisas entre estados representadas pelo grafo à esquerda.
Análise: Interpretação de estruturas gráficas. Não envolve ordem ou grupos.
Classificação Final: outros

---

Agora, classifique a seguinte questão, responda **apenas** em JSON:
{"classe":"ordenacao|agrupamento|outros"}
`;

export async function POST(req: Request) {
  try {
    const client = getOpenAIClient();
    if (!client) {
      return new Response(JSON.stringify({ error: "Faltou OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      });
    }
const { enunciado = "", questao = "" } = await req.json();

    // LOG de entrada (servidor)
    console.log("[classificar] ENUNCIADO length:", enunciado.length);
    console.log("[classificar] QUESTAO length:", questao.length);

    const fullText = `${enunciado}\n\n${questao || ""}`.trim();

    // ✅ 1) GATE primeiro (sem heurística determinística)
    const gate = await runGate(client, fullText);

    console.log("[classificar] gate:", {
      ok: gate.ok,
      lang: gate.lang,
      confidence: gate.confidence,
      reason: gate.reason,
    });

    // Se não passar, não chamamos o classificador.
    // Você pediu: se retornar unknown/desconhecida, tratar no frontend depois.
    if (!gate.ok || gate.lang !== "pt" || gate.confidence < GATE_MIN_CONFIDENCE) {
      return new Response(
        JSON.stringify({
          classe: "desconhecida",
          error: "Texto não reconhecido como uma questão válida em português.",
          gate: {
            ok: gate.ok,
            lang: gate.lang,
            confidence: gate.confidence,
            reason: gate.reason,
          },
        }),
        {
          status: 200, // mantém 200 para o frontend exibir card (como você comentou). Se preferir, pode ser 400.
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
            "CDN-Cache-Control": "no-store",
            "Vercel-CDN-Cache-Control": "no-store",
          },
        }
      );
    }

    // ✅ 2) Classificador (prompt original) somente se passar no gate
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_MESSAGE },
      { role: "user", content: PROMPT_TEMPLATE },
      {
        role: "user",
        content: `Enunciado:\n${enunciado}\n\nQuestão:\n${questao || "(sem pergunta)"}`,
      },
    ];

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      response_format: { type: "json_object" },
      messages,
    });

    const content = completion.choices[0]?.message?.content ?? "{}";

    // LOG
    console.log("[classificar] feedback API:", content);

    let data: any = {};
    try {
      data = JSON.parse(content);
    } catch {
      data = {};
    }

    let classeRaw = String(data.classe ?? data.classificacao ?? "outros").toLowerCase();
    if (classeRaw === "ordenacao" || classeRaw === "ordenação") classeRaw = "ordenação";
    else if (classeRaw === "agrupamento") classeRaw = "agrupamento";
    else if (classeRaw === "outros") classeRaw = "outros";
    else classeRaw = "outros"; // fallback seguro

    // LOG
    console.log("[classificar] classe normalizada:", classeRaw);

    return new Response(JSON.stringify({ classe: classeRaw }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[classificar] erro:", err);
    return new Response(JSON.stringify({ error: "Erro ao classificar" }), {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}