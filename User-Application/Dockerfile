FROM node
RUN mkdir -p /app/pdfs /app/covers
COPY . /app
WORKDIR /app
RUN rm -rf node_modules
RUN npm install
CMD ["node", "app.js"]
