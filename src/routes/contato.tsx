import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Github, Instagram } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/contato")({
  component: Contact,
});

const links = [
  {
    href: "https://github.com/gpsnts/bibliocodes",
    label: "GitHub",
    description: "Código-fonte, dados e histórico do projeto.",
    icon: Github,
  },
  {
    href: "https://www.instagram.com/bibliocodes",
    label: "Instagram",
    description: "Acompanhe as novidades do Bibliocodes.",
    icon: Instagram,
  },
];

function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-10">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-accent">Contato</p>
          <h1 className="mb-3 font-serif text-5xl text-primary">Fale com o Bibliocodes</h1>
          <p className="text-muted-foreground">
            Encontre o projeto, acompanhe seu desenvolvimento e envie suas sugestões.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {links.map(({ href, label, description, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="mb-8 flex items-center justify-between text-primary">
                <Icon aria-hidden="true" size={26} strokeWidth={1.8} />
                <ArrowUpRight
                  aria-hidden="true"
                  className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  size={18}
                />
              </div>
              <h2 className="mb-2 font-serif text-3xl text-primary">{label}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
