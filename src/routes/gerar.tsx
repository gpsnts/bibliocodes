import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { generateCode, loadTable, type CutterTable } from "@/lib/cutter-search";

export const Route = createFileRoute("/gerar")({
  component: Generator,
});

function Generator() {
  const [kind, setKind] = useState<"cutter" | "pha">("cutter");
  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [table, setTable] = useState<CutterTable | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setTable(null);
    loadTable(kind)
      .then(setTable)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [kind]);

  const base = table && surname ? generateCode(surname, table) : "";
  const complement = givenName.trim().charAt(0).toLowerCase();
  const finalCode = base ? base + complement : "";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-2">Ferramenta</p>
          <h1 className="font-serif text-5xl text-primary mb-3">Gerar código</h1>
          <p className="text-muted-foreground">
            Digite o sobrenome do autor e, opcionalmente, o prenome para compor a notação
            completa.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 space-y-5">
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg">
            {(["cutter", "pha"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`py-2 rounded-md text-sm font-medium transition-colors ${
                  kind === k
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {k === "cutter" ? "Cutter-Sanborn" : "PHA"}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Sobrenome / título
              </span>
              <input
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Ex: Silveira"
                className="w-full rounded-md border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Prenome <span className="text-muted-foreground/60">(opcional)</span>
              </span>
              <input
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
                placeholder="Ex: Guimarães"
                className="w-full rounded-md border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Código gerado
            </p>
            {loading && <p className="text-muted-foreground">Carregando tabela…</p>}
            {error && <p className="text-destructive">{error}</p>}
            {!loading && !error && (
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-5xl text-accent font-bold tracking-tight">
                  {finalCode || "—"}
                </span>
                {finalCode && (
                  <button
                    onClick={() => navigator.clipboard.writeText(finalCode)}
                    className="text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                  >
                    copiar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-sm text-muted-foreground space-y-2">
          <p>
            <strong className="text-foreground">Cutter-Sanborn:</strong> sistema original de
            três algarismos, cobertura universal.
          </p>
          <p>
            <strong className="text-foreground">PHA:</strong> adaptação brasileira, otimizada
            para nomes em português.
          </p>
        </div>
      </main>
    </div>
  );
}
