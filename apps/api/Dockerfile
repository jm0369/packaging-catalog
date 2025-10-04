# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app

# pnpm
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Root manifests (workspace)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Only the API package.json first for a fast, filtered install
COPY apps/api/package.json apps/api/

# Install only what's needed for @app/api (resolves workspace deps too)
RUN pnpm -w install --frozen-lockfile --filter @app/api...

# Copy sources
COPY apps/api ./apps/api

# Build & generate prisma client
WORKDIR /app/apps/api
RUN pnpm build && pnpm prisma generate

# ---------- runtime ----------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
# keep pnpm so release_command can run prisma migrate deploy
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Copy built app + production node_modules from build image
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./package.json
COPY --from=build /app/apps/api/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/main.js"]