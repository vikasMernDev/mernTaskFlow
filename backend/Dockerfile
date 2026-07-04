FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp
COPY --from=dependencies /app/node_modules ./node_modules
COPY --chown=nodeapp:nodeapp package*.json ./
COPY --chown=nodeapp:nodeapp src ./src
USER nodeapp
EXPOSE 4000
CMD ["node", "src/server.js"]
