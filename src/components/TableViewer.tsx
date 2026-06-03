import { useEffect, useMemo, useState } from "react";
import { loadTableRead, type CutterTable } from "@/lib/cutter-search";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function TableViewer({ kind, title }: { kind: "cutter" | "pha"; title: string }) {
  const [table, setTable] = useState<CutterTable | null>(null);
  const [letter, setLetter] = useState("A");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTableRead(kind)
      .then(setTable)
      .catch((e) => setError(e.message));
  }, [kind]);

  const entries = useMemo(() => {
    if (!table || !table[letter]) return [] as Array<[string, string]>;
    const all = Object.entries(table[letter]);
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(([k]) => k.toLowerCase().includes(q));
  }, [table, letter, query]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">Tabela</p>
        <h1 className="font-serif text-5xl text-primary mb-3">{title}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar prefixos..."
          className="flex-1 rounded-md border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-wrap gap-1 mb-6">
        {LETTERS.map((l) => (
          <button
            key={l}
            onClick={() => setLetter(l)}
            disabled={!table?.[l]}
            className={`w-9 h-9 rounded-md text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              letter === l
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border hover:bg-muted text-foreground"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {error && <p className="text-destructive">{error}</p>}
      {!table && !error && <p className="text-muted-foreground">Carregando tabela…</p>}

      {table && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/40 flex justify-between text-xs uppercase tracking-wider text-muted-foreground">
            <span>Prefixo</span>
            <span>{entries.length} entradas</span>
            <span>Código</span>
          </div>
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-border/60">
            {entries.map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between items-center px-5 py-2.5 hover:bg-muted/40 transition-colors"
              >
                <span className="font-mono text-sm text-foreground">{k}</span>
                <span className="font-mono text-sm text-accent font-semibold">
                  {letter}
                  {v}
                </span>
              </div>
            ))}
            {entries.length === 0 && (
              <p className="px-5 py-8 text-center text-muted-foreground text-sm">
                Nenhum prefixo encontrado.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
