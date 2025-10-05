# syntax=docker/dockerfile:1.5

FROM oven/bun:1 AS base
WORKDIR /app

# Keep dependency installation cacheable
COPY bun.lock package.json tsconfig.json ./
RUN bun install --frozen-lockfile --production

# Copy application source
COPY . .

# Expose the HTTP port used by Elysia
EXPOSE 3000

# Start the API; Coolify can override this command if needed
CMD ["bun", "run", "src/index.ts"]
