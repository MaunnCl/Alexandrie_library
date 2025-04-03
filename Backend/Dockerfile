FROM node:20-bookworm

RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

WORKDIR /app

COPY bun.lockb package.json ./
RUN bun install

COPY . .

EXPOSE 5863

CMD ["bun", "run", "bun:prod"]
