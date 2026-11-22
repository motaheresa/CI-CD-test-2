import { useEffect, useState } from "react";
import type { UserResponse } from "@repo/shared";
import UserForm from "./components/UserForm.tsx";
import { listUsers } from "./lib/api.ts";

export default function App() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    listUsers()
      .then((data) => {
        if (!ignore) {
          setUsers(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!ignore) setError("Could not load users");
      });
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 bg-slate-900 p-6 text-white">
      <h1 className="text-2xl font-bold">Users</h1>
      <UserForm onCreated={() => setReloadKey((key) => key + 1)} />
      {error && <p className="text-red-400">{error}</p>}
      <ul className="flex flex-col gap-2">
        {users.map((user) => (
          <li key={user.id} className="rounded bg-slate-800 px-3 py-2">
            <span className="font-semibold">{user.name ?? "—"}</span>{" "}
            <span className="text-slate-400">{user.email}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
