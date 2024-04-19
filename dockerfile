FROM node:16

WORKDIR /app

COPY package* .
RUN npm i

COPY . .
CMD [ "npm", "run", "start" ]