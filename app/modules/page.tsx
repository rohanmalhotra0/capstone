import { Suspense } from "react";
import { ModuleMap } from "@/components/ModuleMap";

export const metadata = {
  title: "Module Map — Oracle EPM Planning Modules",
  description:
    "Interactive React Flow canvas of the five Oracle EPM Planning Modules and their seven integrations.",
};

export default function ModulesPage() {
  return (
    <Suspense fallback={null}>
      <ModuleMap />
    </Suspense>
  );
}
