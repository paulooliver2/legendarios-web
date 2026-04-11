FROM node:20-alpine

WORKDIR /app

# Instala dependências em camada separada (cache eficiente)
COPY package*.json ./
RUN npm install

# O código-fonte é montado via volume no docker-compose (hot reload)
EXPOSE 5173

# Vite precisa de --host para ser acessível fora do container
CMD ["npm", "run", "dev"]
