// turbo api test 2
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ConfigService } from "@nestjs/config";
import type { Env } from "./config/env.schema.js";
import { StandardSchemaValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  const config = app.get<ConfigService<Env, true>>(ConfigService);
  app.enableCors({ origin: config.get("CORS_ORIGIN", { infer: true }) });

  await app.listen(config.get("PORT", { infer: true }));
}
await bootstrap();
