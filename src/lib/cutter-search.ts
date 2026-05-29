// Cutter-Sanborn / PHA code generator. Pure client-side; tables loaded from /data/*.json.

export type CutterTable = Record<string, Record<string, string>>;

const cache: Record<string, Promise<CutterTable>> = {};

export function loadTable(kind: "cutter" | "pha"): Promise<CutterTable> {
  if (!cache[kind]) {
    cache[kind] = fetch(`${import.meta.env.BASE_URL}data/${kind}.json`).then((r) => {
      if (!r.ok) throw new Error(`Não foi possível carregar a tabela ${kind}`);
      return r.json();
    });
  }
  return cache[kind];
}

function normalizeChar(str: string): string {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const map: Record<string, string> = {
    ß: "s", æ: "ae", œ: "oe", ø: "o", ð: "d", þ: "th",
    ñ: "n", ç: "c", å: "a", ä: "a", ö: "o", ü: "u",
  };
  return str.replace(/[ßæœøðþñçåäöü]/g, (c) => map[c] ?? c);
}

function formatAuthor(input: string): string {
  return input
    .trim()
    .split(/[\s,]+/)
    .map((w, i) =>
      i === 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()
    )
    .join("");
}

function resolveMultiple(
  results: Array<[string, string]>,
  currentSubstring: string
): string {
  const lastChar = currentSubstring.slice(-1);
  const beforeLast = currentSubstring.slice(0, -1);
  const beforeLastMatches = results.filter(([k]) => k.startsWith(beforeLast));
  let matches: Array<[string, string]> = [];

  if (lastChar.charCodeAt(0) !== 97) {
    let i = 1;
    let prev = String.fromCharCode(lastChar.charCodeAt(0) - i);
    let sub = beforeLast + prev;
    while (prev.charCodeAt(0) !== 97) {
      const f = results.filter(([k]) => k.startsWith(sub));
      if (f.length > 0) {
        matches = f;
        break;
      }
      i += 1;
      prev = String.fromCharCode(lastChar.charCodeAt(0) - i);
      sub = beforeLast + prev;
    }
  }

  if (matches.length === 0 || matches.length === beforeLastMatches.length) {
    return beforeLastMatches[0]?.[1] ?? "";
  }
  return matches[matches.length - 1][1];
}

export function generateCode(name: string, table: CutterTable): string {
  if (!name.trim()) return "";
  const sanitized = normalizeChar(formatAuthor(name));
  const firstLetter = sanitized[0]?.toUpperCase();
  if (!firstLetter || !table[firstLetter]) return "—";

  const entries = Object.entries(table[firstLetter]);

  const exact = entries.filter(
    ([k]) => k === name[0].toUpperCase() + name.slice(1).toLowerCase()
  );
  if (exact.length === 1) return firstLetter + exact[0][1];

  let results: Array<[string, string]> = [];
  let current = sanitized[0];

  for (let i = 0; i < sanitized.length - 1; i++) {
    const next = entries.filter(([k]) => k.startsWith(current));
    if (next.length === 0) break;
    results = next;
    current += sanitized[i + 1];
  }

  if (results.length === 1) return firstLetter + results[0][1];
  return firstLetter + resolveMultiple(results, current);
}
