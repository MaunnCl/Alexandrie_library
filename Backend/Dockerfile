FROM oven/bun:1.0.25

WORKDIR /app

COPY bun.lockb package.json ./
RUN bun install

COPY . .

EXPOSE 5863

CMD ["bun", "run", "server.ts"]
