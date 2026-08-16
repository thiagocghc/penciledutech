import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type QuestaoDataset = {
  ano: string;
  fase: string;
  nivel: string;
  numero_questao: string;
  titulo: string;
  enunciado: string;
  alternativas: string;
  questao: string;
  classe: string;
};

type Payload = {
  nivel?: string;
  fase?: string;
  classe?: string;
};

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result.map((value) => value.trim());
}

function readDataset(): QuestaoDataset[] {
  const csvPath = path.join(process.cwd(), "public", "dataset", "questoes_v2.csv");
  const csvText = fs.readFileSync(csvPath, "utf-8");
  const lines = csvText.split(/\r?\n/).filter(Boolean);

  return lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    return {
      ano: cols[0] ?? "",
      fase: cols[1] ?? "",
      nivel: cols[2] ?? "",
      numero_questao: cols[3] ?? "",
      titulo: cols[4] ?? "",
      enunciado: cols[5] ?? "",
      alternativas: cols[6] ?? "",
      questao: cols[7] ?? "",
      classe: cols[8] ?? "",
    };
  });
}

function normalizeClasse(classe = "") {
  const value = classe.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  if (value === "ordenacao") return "ordenação";
  if (value === "agrupamento") return "agrupamento";
  if (value === "calculo" || value === "cálculo" || value === "outros") return "outros";
  return value;
}

function normalizeNivel(nivel = "") {
  const digits = nivel.replace(/\D/g, "");
  return digits || nivel.trim();
}

function normalizeFase(fase = "") {
  const value = fase.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const map: Record<string, string> = {
    local: "0",
    estadual: "1",
    nacional: "2",
    "fase local": "0",
    "fase estadual": "1",
    "fase nacional": "2",
    "0": "0",
    "1": "1",
    "2": "2",
  };
  return map[value] ?? value;
}

function classeDescricao(classe: string) {
  const normalized = normalizeClasse(classe);
  if (normalized === "ordenação") return "questão de ordenação, com foco em posições, sequência ou vizinhança";
  if (normalized === "agrupamento") return "questão de agrupamento, com foco em seleção de elementos ou formação de grupos";
  return "questão de cálculo, lógica quantitativa ou análise de estruturas e representações";
}

function sampleExamples(dataset: QuestaoDataset[], payload: Payload) {
  const nivel = normalizeNivel(payload.nivel ?? "");
  const fase = normalizeFase(payload.fase ?? "");
  const classe = normalizeClasse(payload.classe ?? "");

  const exact = dataset.filter((item) => {
    const matchesClasse = !classe || normalizeClasse(item.classe) === classe;
    const matchesNivel = !nivel || item.nivel === nivel;
    const matchesFase = !fase || item.fase === fase;
    return matchesClasse && matchesNivel && matchesFase;
  });

  const relaxed = dataset.filter((item) => {
    const matchesClasse = !classe || normalizeClasse(item.classe) === classe;
    const matchesNivel = !nivel || item.nivel === nivel;
    return matchesClasse && matchesNivel;
  });

  const fallback = dataset.filter((item) => !classe || normalizeClasse(item.classe) === classe);

  return (exact.length ? exact : relaxed.length ? relaxed : fallback).slice(0, 6);
}

function buildPrompt(payload: Payload, examples: QuestaoDataset[]) {
  const nivel = payload.nivel ?? "Nível não informado";
  const fase = payload.fase ?? "Fase não informada";
  const classe = payload.classe ?? "Classe não informada";

  const examplesText = examples.length
    ? examples
        .map(
          (item, index) =>
            `Exemplo ${index + 1}\nTítulo: ${item.titulo}\nEnunciado: ${item.enunciado}\nPergunta: ${item.questao}\nAlternativas: ${item.alternativas}\nClasse: ${item.classe}\nNível: ${item.nivel}\nFase: ${item.fase}`
        )
        .join("\n\n")
    : "Sem exemplos exatos no dataset. Ainda assim, siga o padrão textual e pedagógico da OBI.";

  return `Você é um elaborador de questões da Olimpíada Brasileira de Informática (OBI).

Tarefa:
Gere UMA nova questão inédita em português, no estilo da OBI, usando raciocínio interno passo a passo para imitar o padrão do dataset, mas sem expor esse raciocínio na resposta.

Parâmetros escolhidos pelo usuário:
- Classe: ${classe}
- Descrição pedagógica: ${classeDescricao(classe)}
- Nível: ${nivel}
- Fase: ${fase}

Exemplos de referência do dataset rotulado:
${examplesText}

Regras obrigatórias:
1. Produza uma questão original, sem copiar os exemplos.
2. A dificuldade e a linguagem devem ser compatíveis com o nível e a fase informados.
3. A questão deve conter contexto, enunciado claro, pergunta objetiva e 5 alternativas.
4. Apenas uma alternativa deve estar correta.
5. Evite temas excessivamente técnicos fora do padrão da OBI iniciação.
6. Não revele o raciocínio passo a passo.
7. Use a classe escolhida como alvo principal:
   - Ordenação: foco em sequência, posição, antes/depois, vizinhança.
   - Agrupamento: foco em seleção, grupos, combinação sem ordem.
   - Cálculo: foco em contagem, lógica quantitativa, interpretação, padrões, estruturas ou operações.

Responda APENAS em JSON válido, sem markdown:
{
  "titulo": "Título curto",
  "enunciado": "Contexto completo da questão",
  "pergunta": "Pergunta final da questão",
  "alternativas": {
    "A": "...",
    "B": "...",
    "C": "...",
    "D": "...",
    "E": "..."
  },
  "gabarito": "A"
}`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ erro: "OPENAI_API_KEY não configurada." }, { status: 500 });
    }

    const payload = (await req.json()) as Payload;
    const dataset = readDataset();
    const examples = sampleExamples(dataset, payload);
    const prompt = buildPrompt(payload, examples);

    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      response_format: { type: "json_object" },
      temperature: 0.9,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    return NextResponse.json({
      titulo: parsed.titulo ?? "Questão gerada",
      enunciado: parsed.enunciado ?? "",
      pergunta: parsed.pergunta ?? "",
      alternativas: parsed.alternativas ?? {},
      gabarito: parsed.gabarito ?? "",
      metadata: {
        filtros: {
          nivel: payload.nivel ?? "",
          fase: payload.fase ?? "",
          classe: payload.classe ?? "",
        },
        exemplosUtilizados: examples.length,
      },
    });
  } catch (error) {
    console.error("[gerar] erro:", error);
    return NextResponse.json({ erro: "Falha ao gerar questão." }, { status: 500 });
  }
}
