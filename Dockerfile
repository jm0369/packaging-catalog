# Argument to specify which app to build
ARG APP_NAME

# ---------- build ----------
FROM node:22-alpine AS build
ARG APP_NAME
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/${APP_NAME}/package.json ./apps/${APP_NAME}/

# Install dependencies for the specific app
RUN pnpm install --frozen-lockfile --filter @app/${APP_NAME}...

# Copy app source
COPY apps/${APP_NAME} ./apps/${APP_NAME}

# Build based on app type
WORKDIR /app/apps/${APP_NAME}
RUN if [ "${APP_NAME}" = "api" ]; then \
      pnpm prisma generate && pnpm build; \
    else \
      pnpm build; \
    fi

# ---------- runtime (API - NestJS) ----------
FROM node:22-alpine AS runtime-api
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --filter @app/api... --prod --ignore-scripts

COPY apps/api/prisma ./apps/api/prisma
WORKDIR /app/apps/api
RUN npx prisma generate

COPY --from=build /app/apps/api/dist ./dist

EXPOSE 3001
CMD ["node", "dist/main.js"]

# ---------- runtime (Web/Admin - Next.js) ----------
FROM node:22-alpine AS runtime-nextjs
ARG APP_NAME
WORKDIR /app
ENV NODE_ENV=production
ENV APP_NAME=${APP_NAME}

COPY --from=build /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=build /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=build /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

EXPOSE 3000
CMD /bin/sh -c "node apps/${APP_NAME}/server.js"