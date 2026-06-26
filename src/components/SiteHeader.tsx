import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-tight text-primary">
          Bibliocodes<span className="text-accent">.</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <a
            href="https://github.com/gpsnts/bibliocodes"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors flex items-center gap-1.5"
          >
            <Github size={15} /> GitHub
          </a>
          <Link
            to="/cutter"
            className="px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            activeProps={{ className: "px-3 py-2 rounded-md text-primary bg-muted" }}
          >
            Tabela Cutter
          </Link>
          <Link
            to="/pha"
            className="px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            activeProps={{ className: "px-3 py-2 rounded-md text-primary bg-muted" }}
          >
            Tabela PHA
          </Link>
          <Link
            to="/gerar"
            className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Gerar código
          </Link>
        </nav>
      </div>
    </header>
  );
}
