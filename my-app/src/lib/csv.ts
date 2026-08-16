

export const PATH_CSV = "/dataset/questoes_v2.csv"; 
export const PATH_CSV_REPOSITORIO = "/dataset/questoes_repositorio_v2.csv";

const CSV_SPLIT_RE = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;

export function csvToJson<T = any>(csvText: string): T[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];
  const headers = lines[0].split(CSV_SPLIT_RE).map((h) => stripQuotes(h.trim()));
  return lines.slice(1).map((line, idx) => {
    const cols = line.split(CSV_SPLIT_RE).map((c) => stripQuotes(c.trim()));
    const obj: any = {};
    headers.forEach((h, i) => (obj[h] = cols[i] ?? ""));
    obj.id = obj.id || idx + 1;
    return obj as T;
  });
}

function stripQuotes(s: string) {
  if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1);
  if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1);
  return s;
}
