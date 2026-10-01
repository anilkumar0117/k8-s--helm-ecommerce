FROM node:20-alpine
WORKDIR /app
COPY ecommerce/package.json .
RUN npm install --omit=dev
COPY ecommerce/server.js .
COPY ecommerce/index.html .
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
