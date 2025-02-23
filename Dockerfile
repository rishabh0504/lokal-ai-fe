# Use the official Node.js 20 image as a base
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json, yarn.lock, and next.config.ts
COPY package.json yarn.lock next.config.ts ./

# Install dependencies using yarn
RUN yarn install

# Copy source code
COPY . .

# Build the Next.js application using yarn
RUN yarn build

# Use a smaller base image for the production environment
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Create the 'lokal-ai-fe' user and group
RUN addgroup -S lokal-ai-fe && adduser -S lokal-ai-fe -G lokal-ai-fe

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install only production dependencies using yarn
RUN yarn install --production

# Copy node_modules from the base image
COPY --from=base /app/node_modules ./node_modules

# Copy the .next folder and other static assets from the builder stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

# COPYing next.config.js is no longer necessary

COPY --from=base /app/package.json ./package.json

# Set ownership of /app to the 'lokal-ai-fe' user
RUN chown -R lokal-ai-fe:lokal-ai-fe /app

# Expose port
EXPOSE 3000

# Switch to the 'lokal-ai-fe' user
USER lokal-ai-fe

# Set environment variables (important for production!)
ENV NODE_ENV production

# Command to run the application using npm
CMD ["npm", "start"]