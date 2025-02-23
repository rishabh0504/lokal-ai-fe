# --- STAGE 1: Base Image ---
    FROM node:20-alpine AS base

    ARG NODE_ENV=production
    ENV NODE_ENV=${NODE_ENV}
    
    WORKDIR /app
    
    # Install pnpm
    RUN npm install -g pnpm
    
    # Copy package.json and pnpm-lock.yaml
    COPY package*.json pnpm-lock.yaml ./
    
    # Install dependencies needed for both build and runtime
    RUN pnpm install --frozen-lockfile
    
    # --- STAGE 2: Build Stage ---
    FROM base AS builder
    
    # Copy the application source code
    COPY . .
    
    # Build the Next.js application
    RUN pnpm build
    
    # --- STAGE 3: Production Image (Smaller, More Secure) ---
    FROM node:20-alpine AS production
    
    WORKDIR /app
    
    # Create the 'lokalai' user and group
    RUN addgroup -S lokalai && adduser -S lokalai -G lokalai
    
    # Copy package.json and pnpm-lock.yaml
    COPY package*.json pnpm-lock.yaml ./
    
    # Install *only* production dependencies (using npx pnpm)
    RUN npx pnpm install --frozen-lockfile --production --ignore-scripts
    
    # Copy the .next directory (built application) from the builder stage
    COPY --chown=lokalai:lokalai --from=builder /app/.next ./.next
    
    # Copy the public directory (static assets) from the builder stage
    COPY --chown=lokalai:lokalai --from=builder /app/public ./public
    
    # Copy node modules for the production environment
    COPY --chown=lokalai:lokalai --from=builder /app/node_modules ./node_modules
    
    # Set ownership of /app to the 'lokalai' user
    # Removed the separate chown command
    #RUN chown -R lokalai:lokalai /app
    
    # Switch to the 'lokalai' user
    USER lokalai
    
    # Expose the application port
    EXPOSE 3000
    
    # Define the command to start the application
    CMD ["npm", "start"]