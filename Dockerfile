# ============================================
# Stage 1: Install dependencies
# ============================================
FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps

# ============================================
# Stage 2: Build the application
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects anonymous telemetry data — disable it
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================================
# Stage 3: Production runner
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy the standalone output (includes server.js and minimal node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static files (CSS, JS chunks, images, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Scripts de manutenção (ex.: seed) e deps para rodá-los via docker compose exec
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
