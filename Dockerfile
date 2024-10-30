# syntax=docker/dockerfile:1
FROM --platform=linux/amd64 synthetixio/docker-e2e:20.04-ubuntu as base


COPY package.json ./
COPY pnpm-lock.yaml ./

FROM base as test

RUN pnpm install  --no-frozen-lockfile --prefer-offline

COPY . .