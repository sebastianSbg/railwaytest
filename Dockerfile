# Stage 1 - Build React TypeScript application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

RUN npm run build

# Expose a port to communicate with the React app
EXPOSE 80

# Start your React app
CMD ["npm", "run", "dev"]

# # Build the application (assuming your build command creates a 'dist' directory)
# RUN npm run build

# # Stage 2 - Use nginx image to serve the build output
# FROM nginx:alpine

# # Copy the build output from the previous stage to Nginx's default public directory
# COPY --from=build /app/dist /usr/share/nginx/html

# # Copy nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf



# Command to run nginx
# CMD ["npm", "start"]