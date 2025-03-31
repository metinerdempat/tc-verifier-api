FROM node:22.14.0

WORKDIR /app

COPY package.json yarn.lock /app

RUN yarn install

COPY . /app

RUN yarn build

CMD ["yarn", "start"]
