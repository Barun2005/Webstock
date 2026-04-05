# Stage 1: Build the React Application
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with lightweight Nginx server
FROM nginx:alpine
# Copy our built production React distribution files from Stage 1 -> Nginx server folder
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80
# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
