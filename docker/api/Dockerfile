FROM node:20

WORKDIR /app

COPY ./backend/api/package.json ./backend/api/package-lock.json* ./
RUN npm install

RUN npm install -g mongosh

COPY ./backend/api .

EXPOSE 3000

CMD ["npm", "start"]
