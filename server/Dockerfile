# Use official Node.js image as base
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the project files
COPY . .

# Copy .env file into the container
COPY .env .env

# Expose the port from .env (or use default 3000 if not set)
EXPOSE 5000

# Run the Node.js app
CMD ["node", "src/index.js"]
