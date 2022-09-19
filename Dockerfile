FROM node:lts as base
LABEL org.opencontainers.image.source = "https://github.com/equinor/flowify-workflows-UI"
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig*.json ./


FROM base as builder
RUN yarn install
COPY public public
COPY src src
RUN yarn run build




FROM bitnami/nginx:latest
WORKDIR /opt/bitnami/nginx/html
COPY --from=builder /app/build .
COPY nginx.conf /opt/bitnami/nginx/conf/nginx.conf
USER 1001
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

