# Use Node.js alpine as base image instead of plain alpine
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml first to leverage Docker caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Approve build scripts for trusted packages
RUN pnpm approve-builds @tailwindcss/oxide sharp unrs-resolver

# Copy the rest of the application code
COPY . .

# Set build-time arguments for environment configuration
ARG NODE_ENV=production
ARG NEXT_PUBLIC_APP_ENV=production
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_ANALYTICS_ENABLED=false
ARG NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
ARG NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=false

# Set environment variables for build
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_ANALYTICS_ENABLED=$NEXT_PUBLIC_ANALYTICS_ENABLED
ENV NEXT_PUBLIC_ENABLE_DEBUG_MODE=$NEXT_PUBLIC_ENABLE_DEBUG_MODE
ENV NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=$NEXT_PUBLIC_ENABLE_CONSOLE_LOGS

# Build the Next.js app
RUN pnpm build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Install pnpm in the runner stage
RUN npm install -g pnpm

# Copy built artifacts and necessary files from builder stage
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public 
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Run the application
USER node
EXPOSE 3000
CMD ["pnpm", "start"]