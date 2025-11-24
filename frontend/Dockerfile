# Stage 1: build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve
FROM nginx:alpine

# CACHE BUSTER — this forces COPY to always run
ARG CACHEBUST=1

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html/Admin-Dashboard

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]