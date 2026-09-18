# ==========================================
# Dependencies
# ==========================================

FROM node:24-bookworm-slim AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci


# ==========================================
# Build
# ==========================================

FROM node:24-bookworm-slim AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# ==========================================
# Production
# ==========================================

FROM node:24-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js standalone runtime
COPY --from=build /app/.next/standalone ./

# Static files
COPY --from=build /app/.next/static ./.next/static

# Public files
COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]