FROM node:12-alpine

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Set working directory
WORKDIR /usr/app

RUN apk --update --no-cache add git openssh pkgconfig
RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev

# Install PM2 globally
RUN yarn global add pm2 env-cmd

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package.json ./
COPY ./yarn.lock ./

# Install dependencies
RUN yarn install

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