import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "solid";
  color?: string;
}

export const Badge = ({
  className,
  variant = "default",
  color,
  style,
  ...props
}: BadgeProps) => {
  const base =
    "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-mono tracking-tight";
  if (variant === "solid" && color) {
    return (
      <span
        className={cn(base, className)}
        style={{
          background: color,
          color: "#0b0f1a",
          ...style,
        }}
        {...props}
      />
    );
  }
  if (variant === "outline" && color) {
    return (
      <span
        className={cn(base, className)}
        style={{
          border: `1px solid ${color}`,
          color: color,
          background: "transparent",
          ...style,
        }}
        {...props}
      />
    );
  }
  return (
    <span
      className={cn(
        base,
        "bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]",
        className,
      )}
      style={style}
      {...props}
    />
  );
};
