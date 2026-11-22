import type { ComponentProps } from "react";

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return (
    <input
      className={`rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white ${className}`}
      {...props}
    />
  );
}
