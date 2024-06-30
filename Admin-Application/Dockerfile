FROM node
RUN mkdir -p /app/data /app/pdfs /app/covers
COPY . /app
WORKDIR /app
RUN npm install
CMD ["node", "app.js"]
