FROM openjdk:8-jdk-alpine
VOLUME /tmp
RUN curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
RUN apt-get update -y && apt-get install -y openssl zip unzip git && apt-get install-y  nodejs
RUN apt install -y apt-utils procps vim gnupg gnupg2 gnupg1 software-properties-common gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
WORKDIR /app
COPY . /app
RUN apt-get install -y openjdk-8-jre
RUN npm install
CMD node index.js
EXPOSE 3000