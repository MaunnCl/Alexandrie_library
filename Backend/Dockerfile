FROM node:20-bookworm

WORKDIR /app

# Copier seulement les fichiers importants d'abord
COPY package.json package-lock.json ./

# Installer les dépendances (PAS besoin de bun !)
RUN npm install

# Copier le reste du code
COPY . .

# Compiler le projet TypeScript
RUN npm run build

# Exposer le port
EXPOSE 8080

# Lancer l'application compilée
CMD ["npm", "run", "start"]
