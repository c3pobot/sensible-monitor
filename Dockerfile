FROM node:22-alpine AS builder
COPY package*.json ./
RUN npm install --omit=dev

FROM node:22-alpine AS app
LABEL org.opencontainers.image.source=https://github.com/c3pobot/sensible-monitor
WORKDIR /app
RUN mkdir -p /opt/data
COPY --from=builder node_modules node_modules/
COPY . .
USER node
CMD [ "node", "index.js" ]
