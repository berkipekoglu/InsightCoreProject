FROM node:20-alpine

WORKDIR /app

# Install build tools required for native addons like bcrypt
RUN apk add --no-cache python3 make g++

# Cache-busting line
ENV CACHE_BUSTER=4

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
