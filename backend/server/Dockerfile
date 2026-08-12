FROM node:24

ENV PORT=2567

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci
# run this for production
# npm ci --only=production

COPY . .

EXPOSE 2567

CMD [ "npm", "start" ]
