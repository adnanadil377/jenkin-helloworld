FROM node-alpine:22

COPY package.json

RUN npm install

COPY . .

EXPOSE 5174

CMD ["npm","run","dev"]