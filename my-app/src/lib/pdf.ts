"use client";

import type { Questao } from "@/types/questao";

/**
 * Carrega o pdfmake de forma compatível com Next.js (App Router) e ESM/CJS.
 * Usamos import dinâmico para evitar diferenças de export e problemas de SSR.
 */
async function loadPdfMake() {
  const pdfMakeMod: any = await import("pdfmake/build/pdfmake");
  const pdfFontsMod: any = await import("pdfmake/build/vfs_fonts");

  const pdfMake: any = pdfMakeMod?.default ?? pdfMakeMod;

  // vfs_fonts pode vir em diferentes formatos dependendo do bundler
  const vfs =
    pdfFontsMod?.pdfMake?.vfs ??
    pdfFontsMod?.default?.pdfMake?.vfs ??
    pdfFontsMod?.default?.vfs ??
    pdfFontsMod?.vfs;

  if (vfs) pdfMake.vfs = vfs;

  return pdfMake;
}

/**
 * Extrai campos que podem existir no dataset além do tipo Questao.
 */
function extractPerguntaEAlternativas(q: any) {
  const numeroQuestao = q?.numero_questao ?? q?.numero ?? q?.n_questao ?? null;

  const pergunta = q?.questao ?? q?.pergunta ?? q?.question ?? "";

  const rawAlternativas = q?.alternativas ?? q?.options ?? q?.alts ?? "";

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

  const alternativas =
    typeof rawAlternativas === "string"
      ? parseAlternativasFromSingleString(rawAlternativas)
      : Array.isArray(rawAlternativas)
      ? rawAlternativas.map((t: string, i: number) => ({ label: String.fromCharCode(65 + i), text: String(t) }))
      : [];

  const formatPergunta = (num: number | string | null, txt: string) => {
    const n = num !== null && String(num).trim() !== "" ? `${num}. ` : "";
    return `${n}${txt}`.trim();
  };

  return {
    perguntaFormatada: pergunta || numeroQuestao !== null ? formatPergunta(numeroQuestao, String(pergunta || "")) : "",
    alternativas,
  };
}

export async function exportQuestoesToPdf(questoes: Questao[]) {
  const pdfMake = await loadPdfMake();
  const now = new Date().toLocaleString("pt-BR");

  const content: any[] = [
    { text: "Trilha de Estudos – Questões Selecionadas", style: "title" },
    { text: `Gerado em: ${now}`, style: "subtitle" },
    { text: " ", margin: [0, 6, 0, 0] },
  ];

  questoes.forEach((q, idx) => {
    const qq: any = q as any;

    const titulo = q.titulo ? String(q.titulo) : `Questão ${q.id}`;
    const enunciado = (qq.textoCompleto || qq.enunciado || "(Sem enunciado disponível)").toString().trim();

    const { perguntaFormatada, alternativas } = extractPerguntaEAlternativas(qq);

    // Bloco por questão
    content.push(
      { text: `${idx + 1}. ${titulo}`, style: "qTitle", margin: [0, 10, 0, 6] },
      {
        columns: [
          { text: `Ano: ${q.ano ?? "—"}`, style: "meta" },
          { text: `Fase: ${q.fase ?? "—"}`, style: "meta" },
          { text: `Nível: ${q.nivel ?? "—"}`, style: "meta" },
          { text: `Classe: ${q.classe ?? "—"}`, style: "meta" },
        ],
        columnGap: 10,
        margin: [0, 0, 0, 8],
      },

      { text: "Enunciado", style: "h" },
      { text: enunciado, style: "p" },

      perguntaFormatada
        ? [{ text: "Pergunta", style: "h", margin: [0, 10, 0, 0] }, { text: perguntaFormatada, style: "p" }]
        : [],

      alternativas && alternativas.length
        ? [
            { text: "Alternativas", style: "h", margin: [0, 10, 0, 0] },
            {
              ul: alternativas.map((a: any) => `(${a.label}) ${a.text}`),
              style: "list",
            },
          ]
        : [],

      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: "#DDDDDD" }] },
    );
  });

  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [40, 50, 40, 50],
    defaultStyle: {
      font: "Roboto",
      fontSize: 11,
    },
    styles: {
      title: { fontSize: 16, bold: true },
      subtitle: { fontSize: 10, color: "#555555" },
      qTitle: { fontSize: 13, bold: true },
      meta: { fontSize: 9, color: "#555555" },
      h: { fontSize: 11, bold: true, margin: [0, 8, 0, 4] },
      p: { alignment: "justify", lineHeight: 1.25 },
      list: { margin: [0, 4, 0, 0] },
    },
    content,
  };

  pdfMake.createPdf(docDefinition).download("trilha-questoes.pdf");
}
