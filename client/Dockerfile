# ----------BUILD------------

FROM node:18-alpine AS builder

WORKDIR /client

COPY client/package*.json ./
RUN npm i --legacy-peer-deps

COPY ./client .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

# -------PRODUCTION---------

FROM node:18-alpine
WORKDIR /client

ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./

EXPOSE 3000

CMD ["npm", "start"]
