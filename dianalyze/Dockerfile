# NODE AND NPM LTS
FROM node:8

# CREATE APP DIR
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# INSTALL DEPENDENCIES
COPY package.json /usr/src/app
RUN npm install

# BUNDLE SOURCE
COPY . /usr/src/app
RUN npm run build

# START AND EXPOSE TO HOST-DAEMON
EXPOSE 80
ENTRYPOINT ["/usr/local/bin/npm", "run"]

# OR:
# CMD [ "npm", "start" ]
