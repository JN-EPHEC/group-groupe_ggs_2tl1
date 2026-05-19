FROM node:18-alpine

WORKDIR /usr/src/app/server

COPY server/package*.json ./
RUN npm ci

COPY prisma ../prisma
RUN npx prisma generate --schema=../prisma/schema.prisma

COPY server/ .


ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]