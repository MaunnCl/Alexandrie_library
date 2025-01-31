FROM ubuntu:22.04

WORKDIR /app

COPY . .

RUN apt-get update

RUN apt-get install -y nodejs npm

RUN npm i -g bun

RUN bun i

CMD ["bun", "bun:dev"]
