# Étape 1 : Utilise une image officielle Node
FROM node:18

# Étape 2 : Crée un répertoire de travail
WORKDIR /app

# Étape 3 : Copie les fichiers package.json
COPY package*.json ./

# Étape 4 : Installe les dépendances
RUN npm install

# Étape 5 : Copie le reste de l’application
COPY . .

# Étape 6 : Spécifie la commande de démarrage
CMD ["node", "src/app.js"]
