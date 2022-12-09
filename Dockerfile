FROM node:16-alpine3.15

WORKDIR /server

# install nodemon
RUN npm install -g nodemon

COPY package*.json ./

RUN echo 

ENV DB_HOST=${DB_HOST} \
    DB_PORT=${DB_PORT} \
    DB_USER=${DB_USER} \
    DB_PASS=${DB_PASS} \
    DB_NAME=${DB_NAME}

RUN yarn

# Bundle app source
COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]