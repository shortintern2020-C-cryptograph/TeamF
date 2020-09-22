FROM node:12-alpine

# Set working directory
WORKDIR /usr/app

RUN apk --update --no-cache add git openssh

# Install PM2 globally
RUN yarn global add pm2

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN yarn install --production

# Copy all files
COPY ./ ./

# Build app
# RUN yarn run build

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node