FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install

ADD . .

#EXPOSE 5000:9090

CMD ["npm","run","start"]