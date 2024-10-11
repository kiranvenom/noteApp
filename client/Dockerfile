# Use official Node.js image as base
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json before other files to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
