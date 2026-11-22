import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import type { ConnectionOptions } from "node:tls";

export * from "./generated/prisma/client.js";

export interface DatabaseTlsOptions {
  /** PEM text of the CA that signed the server certificate. */
  ca: string;
  /** Set to false only when the server certificate does not list the host name (local dev). */
  verifyHostname: boolean;
}

export function createPrismaAdapter(databaseUrl: string, tls?: DatabaseTlsOptions) {
  if (!tls) return new PrismaMariaDb(databaseUrl);

  // The CA can't be expressed in a URL, so we split the URL into a config object.
  const url = new URL(databaseUrl);
  const ssl: ConnectionOptions = { ca: tls.ca };
  if (!tls.verifyHostname) ssl.checkServerIdentity = () => undefined;

  return new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    ssl,
  });
}
