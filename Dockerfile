FROM node:17

##workdir
WORKDIR /usr/src/app

## Copy Package Json Files
COPY package*.json ./

RUN npm install
RUN npm install -g nodemon
COPY . .
RUN npm run build
EXPOSE 3000

CMD ["node", "app.js"]