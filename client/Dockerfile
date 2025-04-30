# Etap budowania
FROM node:20-alpine AS builder

WORKDIR /client

RUN corepack enable && corepack prepare pnpm@9.5.0 --activate
RUN apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Etap uruchamiania
FROM node:20-alpine AS runner

WORKDIR /client

RUN corepack enable && corepack prepare pnpm@9.5.0 --activate

ENV NODE_ENV=production

COPY --from=builder /client/public ./public
COPY --from=builder /client/.next ./.next
COPY --from=builder /client/node_modules ./node_modules
COPY --from=builder /client/package.json ./package.json
COPY --from=builder /client/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["pnpm", "start"]
