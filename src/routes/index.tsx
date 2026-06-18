import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  component: Home,
});

const cards = [
  {
    to: "/gerar" as const,
    eyebrow: "Ferramenta",
    title: "Gerar código",
    desc: "Digite o sobrenome do autor e obtenha o código Cutter ou PHA correspondente em tempo real.",
    accent: true,
  },
  {
    to: "/cutter" as const,
    eyebrow: "Referência",
    title: "Tabela Cutter-Sanborn",
    desc: "Mais de duas mil entradas alfabéticas com seus respectivos códigos numéricos de três algarismos.",
  },
  {
    to: "/pha" as const,
    eyebrow: "Referência",
    title: "Tabela PHA",
    desc: "Adaptação brasileira otimizada para nomes em português, com granularidade variável.",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <section className="max-w-3xl mb-20">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">
            Notação de autor · catalogação
          </p>
          <h1 className="font-serif text-6xl md:text-7xl leading-[1.05] text-primary mb-6">
            Tabelas de Notação,
            <span className="italic text-accent"> sem fricção.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Bibliocodes consulta as tabelas <strong className="text-foreground">Cutter-Sanborn</strong>{" "}
            e <strong className="text-foreground">PHA</strong> diretamente no seu navegador. De forma totalmente grátis, rápida e sem complicações.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-5">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`group rounded-xl border p-7 transition-all hover:-translate-y-1 hover:shadow-lg ${
                c.accent
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-accent/60"
              }`}
            >
              <p
                className={`text-xs uppercase tracking-[0.2em] mb-4 ${
                  c.accent ? "text-secondary" : "text-accent"
                }`}
              >
                {c.eyebrow}
              </p>
              <h2 className="font-serif text-3xl mb-3">{c.title}</h2>
              <p
                className={`text-sm leading-relaxed ${
                  c.accent ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {c.desc}
              </p>
              <span
                className={`inline-block mt-6 text-sm font-medium transition-transform group-hover:translate-x-1 ${
                  c.accent ? "text-secondary" : "text-accent"
                }`}
              >
                Acessar →
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-24 border-t border-border pt-16">
          <h3 className="font-serif text-4xl text-primary mb-12">Como funciona</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="space-y-6">
                {[
                  { num: "1", label: "Normalização", desc: "Processa acentos, capitalização e partículas do sobrenome." },
                  { num: "2", label: "Análise", desc: "Extrai o prefixo alfabético da palavra para busca." },
                  { num: "3", label: "Consulta", desc: "Busca por intervalo na tabela carregada em memória." },
                  { num: "4", label: "Resultado", desc: "Monta o código: letra + número + complemento." },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {step.num}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">{step.label}</p>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="rounded-lg border border-border/50 bg-card/50 p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4">Exemplo</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Entrada:</p>
                    <p className="font-mono text-lg text-foreground">Silva, João</p>
                  </div>
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Cutter-Sanborn:</p>
                    <p className="font-mono text-2xl font-bold text-primary">S586</p>
                  </div>
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-sm text-muted-foreground mb-2">PHA:</p>
                    <p className="font-mono text-2xl font-bold text-primary">S578</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border mt-20">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-muted-foreground flex justify-between">
          <span>Bibliocodes © {new Date().getFullYear()}</span>
          <span className="font-mono">Cutter-Sanborn · PHA</span>
        </div>
      </footer>
    </div>
  );
}
