FROM node
RUN mkdir /app
COPY . /app
WORKDIR /app
RUN rm -rf node_modules
RUN npm install
CMD ["node", "app.js"]
