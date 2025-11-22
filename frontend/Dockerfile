# Stage 1: build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build      # → creates /app/dist

# Stage 2: serve
FROM nginx:alpine

# Copy main index.html
COPY --from=build /app/dist/index.html /usr/share/nginx/html/index.html

# Copy Admin-Dashboard folder (assets)
COPY --from=build /app/dist/Admin-Dashboard /usr/share/nginx/html/Admin-Dashboard

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]