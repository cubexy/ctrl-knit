FROM node:22-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/build ./build
COPY package.json ./
RUN npm install --omit=dev

CMD ["npm", "run", "start"]
