import type { ComponentProps } from "react";
import { Input } from "#input.tsx";

type FieldProps = ComponentProps<typeof Input> & { label: string };

export function Field({ label, ...props }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-300">
      {label}
      <Input {...props} />
    </label>
  );
}
