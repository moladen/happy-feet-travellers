# Happy Feet Travellers — backend API (Express + Prisma)
# Build:  docker build -t happy-feet-api ./backend
# Run:    docker run -p 5000:5000 --env-file .env happy-feet-api

FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json ./
COPY prisma ./prisma

RUN npm install

COPY src ./src

FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl dumb-init wget su-exec

ENV NODE_ENV=production
ENV PORT=5000

COPY package.json ./
COPY prisma ./prisma

RUN npm install --omit=dev --ignore-scripts \
  && npm install prisma@5.8.0 --no-save \
  && npm cache clean --force

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

COPY prisma ./prisma
COPY src ./src
COPY docker-entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh \
  && mkdir -p uploads/hero uploads/team \
  && chown -R node:node /app

# Entrypoint fixes volume permissions, then drops to node via su-exec
USER root

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/api/health >/dev/null 2>&1 || exit 1

ENTRYPOINT ["dumb-init", "--", "/entrypoint.sh"]
