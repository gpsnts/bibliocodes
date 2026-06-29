import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { TableViewer } from "@/components/TableViewer";

export const Route = createFileRoute("/pha")({
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 pt-12">
        <div className="rounded-xl border border-border bg-card/70 p-5 shadow-sm">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-accent">Referência</p>
          <p className="text-sm leading-7 text-muted-foreground">
            Os dados da Tabela PHA foram digitalizados e estruturados em formato JSON para uso computacional,
            com base na obra de PRADO, Heloisa de Almeida. Tabela PHA. 3. ed. São Paulo: T. A. Queiroz, 1984.
            Uso educativo e sem fins lucrativos.
          </p>
        </div>
      </div>
      <TableViewer kind="pha" title="PHA" />
    </div>
  ),
});
