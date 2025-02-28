FROM ubuntu:22.04

WORKDIR /app

RUN apt-get update

RUN apt-get install -y nodejs npm

RUN npm i -g bun

COPY package.json ./

RUN npm rebuild bcrypt --build-from-source

RUN bun i

COPY . .

CMD ["bun", "bun:dev"]
