FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./paper-node-configuration /usr/src/app/paper-node-configuration
COPY ./paper-raffle-be/. /usr/src/app/paper-raffle-be/

WORKDIR /usr/src/app/paper-raffle-be

RUN npm install

CMD ["npm", "run", "start-prod"]
