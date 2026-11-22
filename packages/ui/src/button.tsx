import type { ComponentProps } from "react";

export function Button({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      className={`rounded bg-green-600 px-3 py-2 font-semibold text-white disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
