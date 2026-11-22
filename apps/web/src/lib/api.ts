import { userSchema, type CreateUserInput, type UserResponse } from "@repo/shared";

const baseUrl = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;
  messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages.join(", "));
    this.status = status;
    this.messages = messages;
  }
}

async function toApiError(res: Response): Promise<ApiError> {
  const body = await res.json().catch(() => null);
  const message = body?.message;
  const messages = Array.isArray(message)
    ? message
    : [typeof message === "string" ? message : `Request failed (${res.status})`];
  return new ApiError(res.status, messages);
}

export async function listUsers(): Promise<UserResponse[]> {
  const res = await fetch(`${baseUrl}/users`);
  if (!res.ok) throw await toApiError(res);
  return userSchema.array().parse(await res.json());
}

export async function createUser(input: CreateUserInput): Promise<UserResponse> {
  const res = await fetch(`${baseUrl}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw await toApiError(res);
  return userSchema.parse(await res.json());
}
