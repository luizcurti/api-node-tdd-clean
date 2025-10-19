FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5858

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5858/api/health || exit 1

CMD ["npm", "start"]