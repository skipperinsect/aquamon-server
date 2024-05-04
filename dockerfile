FROM node:16

WORKDIR /app

COPY package* ./
RUN npm install

COPY . /app/

CMD [ "npm", "run", "start" ]
