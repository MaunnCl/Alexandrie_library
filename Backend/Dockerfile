FROM node:20-bookworm

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/server.js"]
