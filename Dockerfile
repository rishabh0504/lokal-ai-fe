# Use the official Node.js image as the base image
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies using package-lock.json
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use the official Nginx image for serving the application
FROM nginx:alpine AS production

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the built application from the builder stage
COPY --from=builder /app/.next /usr/share/nginx/html/.next
COPY --from=builder /app/public /usr/share/nginx/html/public
COPY --from=builder /app/_next /usr/share/nginx/html/_next

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set the correct ownership for the Nginx directories
RUN chown -R appuser:appgroup /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Switch to the non-root user
USER appuser

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]