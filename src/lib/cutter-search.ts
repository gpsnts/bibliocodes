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

const readCache: Record<string, Promise<CutterTable>> = {};

export function loadTableRead(kind: "cutter" | "pha"): Promise<CutterTable> {
  if (!readCache[kind]) {
    readCache[kind] = fetch(`${import.meta.env.BASE_URL}data/${kind}_read.json`).then((r) => {
      if (!r.ok) throw new Error(`Não foi possível carregar a tabela ${kind}`);
      return r.json();
    });
  }
  return readCache[kind];
}

// ---------------------------------------------------------------------------
// getContext
//
// Retorna as N entradas anteriores e N entradas posteriores ao código gerado
// na tabela de leitura (_read.json), formando um "contexto" da posição do
// nome na tabela impressa.
//
// A entrada encontrada é identificada pelo código numérico retornado por
// generateCode (ex: "P882" → número "882"). Retorna um array plano de
// { key, code, isCurrent } ordenado pela posição na tabela.
// ---------------------------------------------------------------------------
export interface ContextEntry {
  key: string;
  code: string;
  isCurrent: boolean;
}

export function getContext(
  generatedCode: string,
  readTable: CutterTable,
  around = 2
): ContextEntry[] {
  if (!generatedCode || generatedCode === "—") return [];

  // O código gerado tem formato "L<número>", ex: "P882", "Z73"
  const letter = generatedCode[0].toUpperCase();
  const codeNumber = generatedCode.slice(1);

  const section = readTable[letter];
  if (!section) return [];

  // Achata a seção em array ordenado por valor numérico (string→number)
  const entries = Object.entries(section).sort(
    ([, a], [, b]) => Number(a) - Number(b)
  );

  // Encontra o índice da entrada cujo código corresponde ao gerado
  const idx = entries.findIndex(([, v]) => v === codeNumber);
  if (idx === -1) return [];

  const start = Math.max(0, idx - around);
  const end = Math.min(entries.length - 1, idx + around);

  return entries.slice(start, end + 1).map(([key, code], i) => ({
    key,
    code: letter + code,
    isCurrent: start + i === idx,
  }));
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
    const givenPart = name.slice(commaIdx + 1).trim();
    const surnameWords = surnamePart.split(/\s+/);
    const primary = surnameWords[0];

    if (PARTICLES.has(primary.toLowerCase())) {
      // Partícula: usa apenas a primeira palavra
      return primary;
    }

    if (surnameWords.length === 1) {
      // Sobrenome simples com vírgula ("Porto, Leonardo"):
      // usa a inicial do prenome (após a vírgula) como desambiguador,
      // pois a tabela indexa esse autor como "Porto, L."
      const disambig = givenPart ? givenPart[0].toLowerCase() : "";
      return primary + disambig;
    }

    // Sobrenome composto ("Zimmermann Soares, Gabriel"):
    // usa apenas o primeiro elemento — o segundo elemento do sobrenome
    // não é desambiguador na tabela Cutter/PHA.
    return primary;
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
//   3. Verificação de colisão exata: quando o nome contém vírgula e o match
//      é exato (não LTE floor), verifica na tabela de leitura se existe uma
//      entrada "Sobrenome, Inicial." correspondente. Se não existe, refaz a
//      busca usando apenas o sobrenome, evitando colisões como "Portog"
//      (Portugal) ao buscar "Porto, Gabriel".
// ---------------------------------------------------------------------------
export function generateCode(name: string, table: CutterTable, readTable?: CutterTable): string {
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

  const result = firstLetter + best[1];

  // Passo 4: quando a entrada tem vírgula e sobrenome simples, verificar se
  // houve colisão EXATA com uma entrada que representa outra palavra.
  // Ex: "Porto, Gabriel" → "Portog" bate exatamente com "Portog" (Portugal).
  // Não se aplica a matches LTE normais como "Zimmermannm" ≤ "Zimmermannn".
  if (readTable && name.includes(",")) {
    const commaIdx = name.indexOf(",");
    const surnamePart = name.slice(0, commaIdx).trim();
    const givenPart = name.slice(commaIdx + 1).trim();
    const surnameWords = surnamePart.split(/\s+/);

    if (
      surnameWords.length === 1 &&
      givenPart &&
      !PARTICLES.has(surnameWords[0].toLowerCase())
    ) {
      const bestNorm = normalizeKey(best[0], hasSpaces);

      // Só verifica quando o match é EXATO (possível colisão com outra palavra)
      if (bestNorm === norm) {
        const initial = givenPart[0].toUpperCase();
        const readSection = readTable[firstLetter];

        if (readSection) {
          const disambigPrefix = surnamePart + ", " + initial;
          const hasDisambigEntry = Object.keys(readSection).some((k) =>
            k.startsWith(disambigPrefix)
          );

          if (!hasDisambigEntry) {
            // Colisão confirmada — refaz busca só com o sobrenome
            const surnameNorm = normalizeKey(
              expandMcPrefix(surnamePart),
              hasSpaces
            );
            const surnameCandidates = entries.filter(
              ([k]) => normalizeKey(k, hasSpaces) <= surnameNorm
            );
            if (surnameCandidates.length > 0) {
              const surnameBest = surnameCandidates.reduce((a, b) =>
                normalizeKey(a[0], hasSpaces) >= normalizeKey(b[0], hasSpaces)
                  ? a
                  : b
              );
              return firstLetter + surnameBest[1];
            }
          }
        }
      }
    }
  }

  return result;
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
