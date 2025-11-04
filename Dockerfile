# ---- dependencies stage ----
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---- runtime stage ----
FROM node:18-alpine AS runtime
ENV NODE_ENV=production \
    PORT=8080
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --from=deps /app/node_modules ./node_modules
COPY ./src ./src
COPY package*.json ./

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

USER app
EXPOSE 8080
CMD ["node", "src/index.js"]
