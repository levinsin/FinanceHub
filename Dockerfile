FROM node:latest
LABEL authors="levindocks"

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# node server
EXPOSE 3000

CMD ["node", "backend/src/app.js"]