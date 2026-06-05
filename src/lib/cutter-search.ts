// Gerador de códigos Cutter-Sanborn / PHA. Inteiramente no cliente; tabelas carregadas de /data/*.json.

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

export function loadTableRead(kind: "cutter" | "pha"): Promise<CutterTable> {
  if (!cache[kind]) {
    cache[kind] = fetch(`${import.meta.env.BASE_URL}data/${kind}_read.json`).then((r) => {
      if (!r.ok) throw new Error(`Não foi possível carregar a tabela ${kind}`);
      return r.json();
    });
  }
  return cache[kind];
}

// ---------------------------------------------------------------------------
// Partículas nobiliárquicas e preposicionais usadas como primeiro elemento
// de sobrenomes compostos (ex.: "De Carvalho", "Van der Berg").
// Quando a primeira palavra do sobrenome for uma partícula, ela é usada
// diretamente como chave de busca, sem acrescentar a inicial da segunda palavra.
// ---------------------------------------------------------------------------
const PARTICLES = new Set([
  "de","da","di","do","das","dos","des",
  "von","van","le","la","d","al","el",
  "bin","bint","abu",
]);

// ---------------------------------------------------------------------------
// normalizeKey
//
// Normaliza uma string para comparação com a tabela, respeitando o formato
// de chaves da tabela recebida:
//
//   • Tabelas com espaços nas chaves (Cutter): converte hífens em espaços e
//     preserva os espaços resultantes. Isso distingue "Saint E" (=137) de
//     "Sainte" (=156), evitando colisões de chave.
//
//   • Tabelas sem espaços nas chaves (PHA): remove todos os caracteres
//     não-alfabéticos, incluindo espaços e hífens.
//
// Em ambos os casos remove diacríticos e converte para minúsculas.
// ---------------------------------------------------------------------------
function normalizeKey(str: string, tableHasSpaces: boolean): string {
  let s = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const map: Record<string, string> = {
    ß: "s", æ: "ae", œ: "oe", ø: "o", ð: "d", þ: "th",
    ñ: "n", ç: "c", å: "a", ä: "a", ö: "o", ü: "u",
  };
  s = s.replace(/[ßæœøðþñçåäöü]/gi, (c) => map[c.toLowerCase()] ?? c);

  if (tableHasSpaces) {
    // Converte hífen em espaço para corresponder a chaves como "Saint E"
    s = s.replace(/-/g, " ");
    return s
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z]/g, "").toLowerCase())
      .filter(Boolean)
      .join(" ");
  } else {
    // Remove tudo que não é letra (incluindo hífens e espaços)
    return s.replace(/[^a-zA-Z]/g, "").toLowerCase();
  }
}

// ---------------------------------------------------------------------------
// expandMcPrefix
//
// Expande o prefixo "Mc" para "Mac" para que McFadden seja consultado sob
// "Macf", compatível com a convenção Cutter/PHA de arquivar nomes Mc como Mac.
// ---------------------------------------------------------------------------
function expandMcPrefix(name: string): string {
  return name.replace(/\bMc([A-Za-z])/g, (_, next) => "Mac" + next.toUpperCase());
}

// ---------------------------------------------------------------------------
// extractLookupString
//
// Extrai a string de consulta bruta (antes da normalização) a partir do
// nome fornecido pelo usuário:
//
//   "Sobrenome"                 → "Sobrenome"
//   "Sobrenome, Nome"           → "SobrenomeN"  (sobrenome + inicial do nome)
//   "Sobrenome Nome"            → "SobrenomeN"  (idem, separado por espaço)
//
// Para sobrenomes compostos separados por vírgula ("De Carvalho, Olavo"):
//   • Se a primeira palavra do sobrenome for uma PARTÍCULA (De, Von, Da…),
//     usa apenas essa palavra, sem acrescentar a inicial da palavra seguinte.
//   • Caso contrário ("Zimmermann Nantos, Carlos"), acrescenta a inicial do
//     segundo elemento do sobrenome como desambiguador ("Zimmermannn").
//
// Para entradas sem vírgula mas com espaço ("Sobrenome Nome"), a inicial
// da segunda palavra é sempre acrescentada (comportamento anterior mantido).
// ---------------------------------------------------------------------------
function extractLookupString(name: string): string {
  if (name.includes(",")) {
    const commaIdx = name.indexOf(",");
    const surnamePart = name.slice(0, commaIdx).trim();
    const surnameWords = surnamePart.split(/\s+/);
    const primary = surnameWords[0];

    if (PARTICLES.has(primary.toLowerCase())) {
      // Partícula: usa apenas a primeira palavra
      return primary;
    }
    // Sobrenome real com segundo elemento: usa inicial do segundo elemento
    const disambig = surnameWords[1] ? surnameWords[1][0].toLowerCase() : "";
    return primary + disambig;
  }

  if (name.includes(" ")) {
    const words = name.trim().split(/\s+/);
    const primary = words[0];
    const disambig = words[1] ? words[1][0].toLowerCase() : "";
    return primary + disambig;
  }

  return name.trim();
}

// ---------------------------------------------------------------------------
// tableHasSpacedKeys
//
// Verifica se a tabela contém alguma chave com espaço. Isso distingue a
// Cutter-Sanborn (que usa "Saint E", "Saint An" etc.) da PHA (sem espaços).
// O resultado é computado uma vez por tabela e reutilizado via closure.
// ---------------------------------------------------------------------------
const spaceKeyCache = new WeakMap<CutterTable, boolean>();

function tableHasSpacedKeys(table: CutterTable): boolean {
  if (spaceKeyCache.has(table)) return spaceKeyCache.get(table)!;
  const result = Object.values(table).some((section) =>
    Object.keys(section).some((k) => k.includes(" "))
  );
  spaceKeyCache.set(table, result);
  return result;
}

// ---------------------------------------------------------------------------
// generateCode
//
// Gera um código Cutter-Sanborn ou PHA para o nome fornecido.
//
// Algoritmo:
//   1. Pré-processamento: expande Mc→Mac, extrai a string de consulta
//      (sobrenome ± desambiguador) e normaliza de acordo com o formato da tabela.
//   2. Busca pela chave mais alta: entre todas as entradas cuja chave
//      normalizada é ≤ ao nome normalizado (ordem lexicográfica),
//      seleciona aquela com o maior valor lexicográfico — equivalente a
//      "a última entrada da tabela que não ultrapassa o nome buscado".
//
// Essa estratégia (LTE + max-lex) corrige os erros anteriores:
//   • Christe → C554 (Chri), não C555 (Christi): "chri" ≤ "christe" e
//     "christi" > "christe", portanto Christi não é candidato.
//   • Porto, Gabriel → P853 (Portm): "portm" ≤ "portog" e é a maior
//     chave antes de "porto" (que não existe na tabela).
//   • Ziqing, Zhu → Z79 (Zinz): "zinz" ≤ "ziqingz" (n < q) e é a
//     maior chave disponível dentro do bloco Zi*.
//   • Zimmermann Nantos → Z75 (Zimmermannm): desambiguador "n" →
//     "zimmermannn"; "zimmermannm" ≤ "zimmermannn" e "zimmermanns" > "zimmermannn".
//   • De Carvalho, Olavo → D278 (De): partícula detectada; usa só "De".
//   • Saint-Exupéry [Cutter] → S137 (Saint E): hífen vira espaço;
//     "saint e" ≤ "saint exupery" e "sainte" > "saint exupery" (e > espaço).
//   • Saint-Exupéry [PHA] → S144 (Sainte): sem espaços na tabela;
//     hífen removido; "sainte" ≤ "saintexupery".
// ---------------------------------------------------------------------------
export function generateCode(name: string, table: CutterTable): string {
  if (!name.trim()) return "";

  // Passo 1: pré-processamento
  const expanded = expandMcPrefix(name.trim());
  const lookupRaw = extractLookupString(expanded);
  const hasSpaces = tableHasSpacedKeys(table);
  const norm = normalizeKey(lookupRaw, hasSpaces);

  if (!norm) return "—";

  const firstLetter = norm[0].toUpperCase();
  if (!table[firstLetter]) return "—";

  const entries = Object.entries(table[firstLetter]);

  // Passo 2: todas as entradas cuja chave normalizada ≤ nome normalizado
  const candidates = entries.filter(
    ([k]) => normalizeKey(k, hasSpaces) <= norm
  );

  if (candidates.length === 0) return "—";

  // Passo 3: maior chave lexicográfica entre os candidatos
  const best = candidates.reduce((a, b) =>
    normalizeKey(a[0], hasSpaces) >= normalizeKey(b[0], hasSpaces) ? a : b
  );

  return firstLetter + best[1];
}

// ---------------------------------------------------------------------------
// hasMcPrefix
//
// Retorna true quando o nome começa com "Mc" seguido de letra (qualquer caixa),
// indicando que a convenção Mc→Mac se aplica. Pode ser usado pela UI para
// exibir um aviso ao usuário.
// ---------------------------------------------------------------------------
export function hasMcPrefix(name: string): boolean {
  return /\bMc[A-Za-z]/i.test(name.trim());
}
