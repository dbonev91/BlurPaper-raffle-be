# Downgrade NodeJS 21 as a workaround for the ExperimentalWarning
# Upgrade it when there is a fix version deployed
FROM node:21

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./paper-node-configuration /usr/src/app/paper-node-configuration
COPY ./paper-raffle-be/. /usr/src/app/paper-raffle-be/

WORKDIR /usr/src/app/paper-raffle-be

RUN npm install

CMD ["npm", "run", "start-prod"]
