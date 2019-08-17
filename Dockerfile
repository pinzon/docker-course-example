FROM node:10.16
COPY . /app
WORKDIR "/app"
RUN npm install
CMD  node /app/index.js