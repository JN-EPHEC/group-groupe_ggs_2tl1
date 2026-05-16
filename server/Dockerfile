FROM node:18-alpine

WORKDIR /usr/src/app/server

COPY server/package*.json ./
RUN npm ci

COPY prisma ../prisma
RUN npx prisma generate --schema=../prisma/schema.prisma

COPY server/tsconfig.json ./
COPY server/jest.config.js ./
COPY server/users.htdigest ./
COPY server/src ./src
COPY server/public ./public

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
