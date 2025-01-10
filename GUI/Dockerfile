# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache gettext

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/personalized-diet-planner/browser /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf.template

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '${API_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]