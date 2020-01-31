FROM node:10
RUN apt-get update -y && apt-get install -y openssl zip unzip git
RUN apt install -y apt-utils procps nano
RUN apt install -y gnupg gnupg2 gnupg1 software-properties-common && apt remove yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN apt-get install -y nodejs
WORKDIR /app
COPY . /app
RUN ls -alh
RUN npm install -y
RUN npm install pm2 -g
RUN pm2 start index.js
EXPOSE 3000