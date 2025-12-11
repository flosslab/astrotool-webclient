# Builder
FROM node:22 AS builder
COPY . /app
WORKDIR /app
RUN npm install && \
      npm run build

# Nginx
FROM nginx:latest AS service
COPY --from=builder /app/www/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
