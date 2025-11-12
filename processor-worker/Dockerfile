# Use an official Node.js runtime as a parent image
FROM node:20-alpine

WORKDIR /app

# Cache-busting line
ENV CACHE_BUSTER=3

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
