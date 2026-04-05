# Use efficient Node.js Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies before bringing in the code (caching layers)
COPY package*.json ./
RUN npm install --production

# Bring over the backend code
COPY . .

# Expose the API Port
EXPOSE 5000

# Start the application natively
CMD [ "npm", "start" ]
