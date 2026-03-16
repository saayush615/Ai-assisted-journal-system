# Step 1: Start from official Node.js 20 on Alpine Linux (small image ~50MB vs ~900MB full)
FROM node:24-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy ONLY package files first (for layer caching)
COPY package.json package-lock.json ./

# Step 4: Install only production dependencies
RUN npm ci --omit=dev

# Step 5: Copy the rest of your source code
COPY . .

# Step 6: Tell Docker your app listens on port 3000
EXPOSE 3000

# Step 7: The command to start your app
CMD ["node", "index.js"]