# Use official Node.js LTS base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source
COPY generate-offers.js ./

# Expose application port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
