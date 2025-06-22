FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/build ./build
COPY package.json ./
RUN npm install --omit=dev

CMD ["npm", "run", "start"]
