# Base image (node version LTS)
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
