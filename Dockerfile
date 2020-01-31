FROM node:10
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install pm2 -g
COPY . /app
CMD pm2 start index.js
EXPOSE 3000