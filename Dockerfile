FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install && npm run build

EXPOSE 2000

CMD [ "npm", "run", "start:dev" ]