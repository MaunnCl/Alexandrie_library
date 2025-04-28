# Utiliser Node.js 20
FROM node:20-bookworm

# Créer le dossier de travail
WORKDIR /app

# Copier seulement les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer toutes les dépendances
RUN npm install --include=dev

# Copier le reste du code
COPY . .

# Exposer le port (même si Docker Compose le mappe après)
EXPOSE 8080

# Commande de démarrage
CMD ["npm", "run", "start"]
