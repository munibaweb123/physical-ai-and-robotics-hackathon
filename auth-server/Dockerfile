# 1. Use Node 20 (Required by your packages)
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install build tools required for better-sqlite3
# (Python, Make, and G++ are needed to compile the database driver)
RUN apk add --no-cache python3 make g++

# 4. Copy package files first (better for caching)
COPY package*.json ./

# 5. Install dependencies
RUN npm install

# 6. Copy the rest of your source code
COPY . .

# 7. Expose the port for Hugging Face Spaces
EXPOSE 7860

# 8. Start the application
CMD ["npm", "start"]
