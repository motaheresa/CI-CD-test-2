import { useActionState } from "react";
import { createUserSchema } from "@repo/shared";
import { ApiError, createUser } from "../lib/api.ts";
import { Field } from "@repo/ui/field";
import { Button } from "@repo/ui/button";

type FormState = { errors: string[]; email: string; name: string };

const initialState: FormState = { errors: [], email: "", name: "" };

export default function UserForm({ onCreated }: { onCreated: () => void }) {
  const [state, action, pending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const email = String(formData.get("email") ?? "");
      const name = String(formData.get("name") ?? "");

      const parsed = createUserSchema.safeParse({ email, name: name || undefined });
      if (!parsed.success) {
        return {
          errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
          email,
          name,
        };
      }

      try {
        await createUser(parsed.data);
        onCreated();
        return initialState;
      } catch (error) {
        const errors = error instanceof ApiError ? error.messages : ["Something went wrong"];
        return { errors, email, name };
      }
    },
    initialState,
  );

  return (
    <form action={action} noValidate className="flex flex-col gap-3">
      <Field
        label="Email"
        name="email"
        type="email"
        defaultValue={state.email}
        disabled={pending}
      />

      <Field label="Name" name="name" type="text" defaultValue={state.name} disabled={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Create user"}
      </Button>
      {state.errors.map((message) => (
        <p key={message} role="alert" className="text-sm text-red-400">
          {message}
        </p>
      ))}
    </form>
  );
}
