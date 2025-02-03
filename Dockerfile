# Use the official Node.js 18 image as a base
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy all project files to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Create a non-root user to run the app
RUN addgroup -g 1001 appuser && \
    adduser -u 1001 -G appuser -h /app -s /bin/sh -D appuser

# Copy the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set the correct permissions
RUN chown -R appuser:appuser /app
USER appuser

# Expose the port your app will run on
EXPOSE 3000

# Command to start your Next.js app
CMD ["npm", "start"]