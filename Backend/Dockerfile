FROM node:20-bookworm

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --include=dev

RUN npm install -g tsx

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
