FROM node:20-alpine AS builder

WORKDIR /client

RUN corepack enable && corepack prepare pnpm@9.5.0 --activate
RUN apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . ./

RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /client

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

RUN npm install -g pnpm@9.5.0

COPY --from=builder /client ./
USER nextjs
EXPOSE 3000
CMD ["pnpm", "start"]
