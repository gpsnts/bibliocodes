import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/BrandMark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-primary/80 bg-primary/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link to="/" aria-label="Bibliocodes — início" className="w-fit shrink-0">
          <BrandMark className="h-11 w-auto object-contain sm:h-12" />
        </Link>
        <nav aria-label="Navegação principal" className="flex w-full items-center gap-1 overflow-x-auto text-sm sm:w-auto">
          <Link
            to="/contato"
            className="whitespace-nowrap rounded-md px-3 py-2 text-primary-foreground/75 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            activeProps={{ className: "whitespace-nowrap rounded-md bg-primary-foreground/10 px-3 py-2 text-primary-foreground" }}
          >
            Contato
          </Link>
          <Link
            to="/cutter"
            className="whitespace-nowrap rounded-md px-3 py-2 text-primary-foreground/75 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            activeProps={{ className: "whitespace-nowrap rounded-md bg-primary-foreground/10 px-3 py-2 text-primary-foreground" }}
          >
            Tabela Cutter
          </Link>
          <Link
            to="/pha"
            className="whitespace-nowrap rounded-md px-3 py-2 text-primary-foreground/75 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            activeProps={{ className: "whitespace-nowrap rounded-md bg-primary-foreground/10 px-3 py-2 text-primary-foreground" }}
          >
            Tabela PHA
          </Link>
          <Link
            to="/gerar"
            className="ml-auto whitespace-nowrap rounded-md bg-accent px-3 py-2 text-accent-foreground transition-colors hover:bg-accent/90 sm:ml-0"
          >
            Gerar código
          </Link>
        </nav>
      </div>
    </header>
  );
}
