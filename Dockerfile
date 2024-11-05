# Base image
FROM node:18-alpine

# Define variables
ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Clear any existing build output and run the build command
RUN rm -rf dist && npm run build -- ${APP_NAME}

# Start the server using the production build
CMD ["sh", "-c", "node dist/apps/${APP_NAME}/main.js"]