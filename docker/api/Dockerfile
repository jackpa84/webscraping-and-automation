FROM node:20-alpine

WORKDIR /app

COPY ./backend/api/package.json ./backend/api/package-lock.json* ./
RUN npm install

COPY ./backend/api .

EXPOSE 3000

CMD ["npm", "start"]
