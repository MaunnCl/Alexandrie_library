FROM ubuntu:22.04

WORKDIR /app

RUN apt-get update

RUN apt-get install -y nodejs npm

RUN npm i -g bun

COPY package.json package-lock.json

RUN bun i

COPY . .

CMD ["bun", "bun:dev"]
