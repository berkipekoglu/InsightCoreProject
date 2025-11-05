FROM node:20-alpine

# Install wait-for-it dependencies
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copy wait-for-it script and make it executable
COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
