// Local type shim for lucide-react@1.8.0 (ships JS without bundled .d.ts).
// Per Next.js error guidance: declare the module so TS stops complaining.
declare module "lucide-react" {
  import * as React from "react";

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  // Named icons used across the app.
  export const ArrowRight: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const BookOpen: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Compass: LucideIcon;
  export const Expand: LucideIcon;
  export const GitBranch: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Loader2: LucideIcon;
  export const Maximize2: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Moon: LucideIcon;
  export const Network: LucideIcon;
  export const Plus: LucideIcon;
  export const Send: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Square: LucideIcon;
  export const Sun: LucideIcon;
  export const Workflow: LucideIcon;
  export const X: LucideIcon;
}
