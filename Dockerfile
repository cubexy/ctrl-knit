FROM node:24-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:24-slim
WORKDIR /app
COPY --from=builder /app/build ./build
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
USER node

CMD ["npm", "run", "start"]
