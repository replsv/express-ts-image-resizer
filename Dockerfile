FROM node:12

ENV APP_DIR /var/www/app/
RUN mkdir -p $APP_DIR
ADD ./src $APP_DIR
ADD ./data /var/www/app/data/
ADD ./package.json $APP_DIR/package.json
ADD ./package-lock.json $APP_DIR/package-lock.json
ADD ./tsconfig.json $APP_DIR/tsconfig.json
WORKDIR $APP_DIR
RUN rm -rf ${APP_DIR}/node_modules
RUN npm install -g ts-node@^8.3.0 typescript@^3.5.3 ts-node-dev
RUN npm install
