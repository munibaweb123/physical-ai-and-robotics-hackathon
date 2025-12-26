# Use Node 20 (Required by your packages)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better for caching)
COPY package*.json ./

# Install dependencies
# Using --production flag for smaller image (only install production deps)
RUN npm ci --only=production

# Copy the rest of your source code
COPY . .

# Expose port (Render will use PORT env var, this is just documentation)
# The actual port is set via environment variable PORT
EXPOSE 10000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
