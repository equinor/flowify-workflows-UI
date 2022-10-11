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

FROM nginx
ARG API_SERVER_PORT=8842
ARG API_SERVER_HOST=flowify_server
ENV FLOWIFY_SERVER_PORT=$API_SERVER_PORT
ENV FLOWIFY_SERVER_HOST=$API_SERVER_HOST
RUN mkdir -p /var/tmp/nginx
COPY --from=builder /app/build /usr/share/nginx/html
RUN useradd -ms /bin/bash user
WORKDIR /home/user
COPY nginx.conf .
COPY setup_nginx_conf.sh .
RUN chmod +x ./setup_nginx_conf.sh
RUN chown user:user ./setup_nginx_conf.sh
EXPOSE 8080
ENTRYPOINT ["/bin/bash", "-c", "/home/user/setup_nginx_conf.sh && nginx -g 'daemon off;'"]
