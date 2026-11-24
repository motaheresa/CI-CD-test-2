# syntax=docker/dockerfile:1
# Build context must be the repo root:  docker build -f apps/api/Dockerfile -t monorepo-api .

# ---- build stage: install everything, build the api and the packages it uses ----
FROM ghcr.io/pnpm/pnpm:12 AS build
RUN pnpm runtime set node 22 -g
WORKDIR /repo
COPY . .
RUN --mount=type=cache,id=pnpm,target=/var/cache/pnpm \
    pnpm install --store-dir /var/cache/pnpm --frozen-lockfile
RUN pnpm --filter @repo/api... run build
# Isolated folder with only the api's production dependencies and its "files" (dist)
RUN pnpm --filter @repo/api --prod deploy /out

# ---- runtime stage: plain Node, no pnpm, no source, no dev dependencies ----
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /out .
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
