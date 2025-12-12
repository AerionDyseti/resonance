# Build stage for frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci --workspace=@resonance/frontend --workspace=@resonance/shared
COPY packages/shared ./packages/shared
COPY packages/frontend ./packages/frontend
COPY tsconfig.json ./
RUN npm run build --workspace=@resonance/shared
RUN npm run build --workspace=@resonance/frontend

# Build stage for backend
FROM node:20-alpine AS backend-build
WORKDIR /app
COPY package*.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci --workspace=@resonance/backend --workspace=@resonance/shared
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend
COPY tsconfig.json ./
RUN npm run build --workspace=@resonance/shared
RUN npm run build --workspace=@resonance/backend

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci --workspace=@resonance/backend --workspace=@resonance/shared --omit=dev

# Copy built artifacts
COPY --from=backend-build /app/packages/backend/dist ./packages/backend/dist
COPY --from=backend-build /app/packages/shared/dist ./packages/shared/dist
COPY --from=frontend-build /app/packages/frontend/dist ./packages/frontend/dist

# Create data directory
RUN mkdir -p /app/data

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=file:/app/data/resonance.db

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start server
CMD ["node", "packages/backend/dist/index.js"]
