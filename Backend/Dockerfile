FROM node:20-bookworm

WORKDIR /app

ENV NODE_ENV=

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["node", "dist/server.js"]
