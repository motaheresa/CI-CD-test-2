import { readFileSync } from "node:fs";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient, createPrismaAdapter, type DatabaseTlsOptions } from "@repo/database";
import type { Env } from "../config/env.schema.js";

function readTlsOptions(config: ConfigService<Env, true>): DatabaseTlsOptions | undefined {
  const caPath = config.get("DATABASE_SSL_CA_PATH", { infer: true });
  if (!caPath) return undefined;
  return {
    ca: readFileSync(caPath, "utf8"),
    verifyHostname: config.get("DATABASE_SSL_VERIFY_HOSTNAME", { infer: true }) === "true",
  };
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: ConfigService<Env, true>) {
    super({
      adapter: createPrismaAdapter(
        config.get("DATABASE_URL", { infer: true }),
        readTlsOptions(config),
      ),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
