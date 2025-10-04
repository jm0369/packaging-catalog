# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin/package.json apps/admin/
RUN pnpm -w install --frozen-lockfile --filter @app/admin...

COPY apps/admin ./apps/admin

WORKDIR /app/apps/admin
ARG NEXT_PUBLIC_API_BASE
ARG NEXT_PUBLIC_CDN_BASE
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_CDN_BASE=$NEXT_PUBLIC_CDN_BASE
RUN pnpm build

# ---------- runtime ----------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

COPY --from=build /app/apps/admin/.next/standalone ./
COPY --from=build /app/apps/admin/.next/static ./.next/static
COPY --from=build /app/apps/admin/public ./public

EXPOSE 3000
CMD ["node", "server.js"]