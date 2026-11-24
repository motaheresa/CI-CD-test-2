# syntax=docker/dockerfile:1
# Build context must be the repo root:  docker build -f apps/web/Dockerfile -t monorepo-web .

# ---- build stage: compile the React app into plain static files ----
FROM ghcr.io/pnpm/pnpm:12 AS build
RUN pnpm runtime set node 22 -g
WORKDIR /repo
COPY . .
RUN --mount=type=cache,id=pnpm,target=/var/cache/pnpm \
    pnpm install --store-dir /var/cache/pnpm --frozen-lockfile

# Vite copies VITE_* values INTO the JavaScript at build time, so the API address
# is chosen here (as a build argument), not when the container starts.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm --filter @repo/web... run build

# ---- runtime stage: nginx serves the files; no Node, no source ----
FROM nginx:stable-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80
