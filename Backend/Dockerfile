FROM node:20-bookworm

RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:$PATH"

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

RUN bun run rebuild || true

CMD ["bun", "run", "bun:dev"]
