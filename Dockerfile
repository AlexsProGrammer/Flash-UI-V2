FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies with pnpm using corepack.
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Build the static app with the Gemini key available at build time.
COPY . .
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
RUN pnpm build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

# Use a writable app directory instead of removing protected default files.
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000 || exit 1

CMD ["nginx", "-g", "daemon off;"]
