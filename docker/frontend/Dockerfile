# Use uma imagem leve do Node
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências para o container e instala-os
COPY ../frontend/package.json ../frontend/package-lock.json* ./
RUN npm install

# Copia o restante do código para o container
COPY ../frontend/ .

# Expõe a porta utilizada pelo Vite (padrão é 3000, mas verifique seu package.json se for diferente)
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento com hot reload
CMD ["npm", "run", "dev", "--host"]
