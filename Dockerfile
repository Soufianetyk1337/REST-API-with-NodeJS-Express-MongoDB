# syntax=docker/dockerfile:1
FROM node:14-slim 
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./yarn.lock ./ 
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then yarn install; \
    else yarn install --only=production; \
    fi
COPY . .
ENV PORT 8080
EXPOSE ${PORT}
CMD if [ "$NODE_ENV" = "development" ]; \ 
