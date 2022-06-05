FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./paper-raffle-be/package.json /usr/src/app/

RUN npm install

COPY ./paper-node-configuration /usr/src/app/paper-node-configuration
COPY ./paper-raffle-be/. /usr/src/app/

CMD ["npm", "run", "start-prod"]

