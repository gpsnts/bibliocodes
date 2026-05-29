import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { TableViewer } from "@/components/TableViewer";

export const Route = createFileRoute("/cutter")({
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <TableViewer kind="cutter" title="Cutter-Sanborn" />
    </div>
  ),
});
