# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy and build server
COPY server/package*.json ./server/
COPY ./server ./server
RUN cd server && npm install

# Copy and build client
COPY ./client ./client
RUN cd client && npm install && npm run build

# Expose the port used by the server
EXPOSE 8080

# Start the server
CMD [ "node", "./server/index.js" ]
