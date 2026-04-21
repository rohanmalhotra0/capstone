import { Suspense } from "react";
import { EpmAtlas } from "@/components/EpmAtlas";

export const metadata = {
  title: "EPM Atlas — Modules & Workflows",
  description:
    "Unified interactive learning tool: the Oracle EPM module map and core workflow flowcharts with a jump-anywhere table of contents.",
};

export default function AtlasPage() {
  return (
    <Suspense fallback={null}>
      <EpmAtlas />
    </Suspense>
  );
}
