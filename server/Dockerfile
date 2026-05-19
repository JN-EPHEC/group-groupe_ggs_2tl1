FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY ../prisma ./prisma
RUN npm install

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm","run", "start"]