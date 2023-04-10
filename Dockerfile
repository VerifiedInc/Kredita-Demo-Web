# syntax=docker/dockerfile:1.0.0-experimental
# Stage 0, "build-stage" to build and compile the frontend
FROM node:18.15.0-alpine as build-stage

# ref: https://medium.com/@nodepractices/docker-best-practices-with-node-js-e044b78d8f67

RUN apk update && \
  apk upgrade && \
  apk add git && \
  apk add openssh-client

COPY package.json /app/
COPY package-lock.json /app/

WORKDIR /app

RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# using "ci" to install dependencies strictly from the package-lock file
RUN --mount=type=ssh,id=github npm ci

COPY ./ /app/

RUN npm run build

# remove local npm cache with "clean cache --force" because of the image's ummutable nature, no need for local cache (that lives in the image). Makes the overall image size smaller.
RUN npm cache clean --force

# bootstrapping using "node" (not using the npm start script) so that the running node process gets OS signals (e.g. SIGTERM) and can gracefully shut down
# CMD syntax ref: https://www.baeldung.com/linux/docker-cmd-multiple-commands#2-run-multiple-commands-with-the-exec-form
CMD ["/bin/bash", "-c", "cross-env NODE_ENV=production node ./server.js/"]
