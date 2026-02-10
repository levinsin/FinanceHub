FROM node:20
#LABEL authors="levindocks"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# node server
EXPOSE 3000

CMD ["node", "backend/src/index.js"]