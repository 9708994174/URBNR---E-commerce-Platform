# -----------------------
# Dependencies stage
# -----------------------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json pnpm-lock.yaml* yarn.lock* .npmrc* ./

RUN if [ -f pnpm-lock.yaml ]; then \
      npm install -g pnpm && pnpm install --no-frozen-lockfile; \
    elif [ -f yarn.lock ]; then \
      yarn install; \
    else \
      npm install; \
    fi

# -----------------------
# Build stage
# -----------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN if [ -f pnpm-lock.yaml ]; then \
      npm install -g pnpm && pnpm run build; \
    elif [ -f yarn.lock ]; then \
      yarn build; \
    else \
      npm run build; \
    fi

# -----------------------
# Production runner
# -----------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]

