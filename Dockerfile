# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with exact versions
RUN npm ci

# Copy project files
COPY . .

# Set production mode
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application with environment check
CMD ["sh", "-c", "node -e \"console.log('Environment check:', process.env.MONGODB_URI ? 'MONGODB_URI exists' : 'MONGODB_URI missing')\" && npm start"]