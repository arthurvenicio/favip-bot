FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 3000

ENTRYPOINT ["node", "src/index.js"]