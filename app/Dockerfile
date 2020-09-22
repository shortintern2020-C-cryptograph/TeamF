FROM node:12-alpine

# Set working directory
WORKDIR /usr/app

RUN apk --update --no-cache add git openssh

# Install PM2 globally
RUN yarn global add pm2 env-cmd

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package.json ./
COPY ./yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy all files
COPY ./ ./

# Build app
RUN yarn run build:prod

# Expose the listening port
# EXPOSE 3000
# USER node

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
CMD /bin/sh -c "pm2-runtime 'yarn run deploy:prod'"