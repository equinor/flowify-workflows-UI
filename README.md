# Flowify

The Flowify project front end - flowify.equinor.com

## Getting started

To get things started, make sure you have any version of node above `16.14.0` installed on your computer and then run

```
yarn install
```

### Run frontend using Node (recommended for frontend development)

To run the frontend using Node, simply run

```
yarn start
```

### Build frontend using Docker

From the root path you can build Flowify using [docker](https://www.docker.com/). This is more recommended for when you are developing the flowify-server backend and need a frontend to test the changes.

##### Build your image

```
docker build -t flowify:latest .
```

##### Run your image

```
docker run -d --rm --name flowify -p 8080:8080 --network kind -e FLOWIFY_AUTH_TOKEN="Bearer <token>" dev_frontend

// Example bearer token
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzYW5kYm94IiwiYXVkIjoiZmxvd2lmeSIsImlhdCI6MTY2MzY3NDU0NywibmJmIjoxNjYzNjc0NTQ3LCJleHAiOjI2MTA0NDU3NDcsIm9pZCI6IjgwNDgiLCJuYW1lIjoiRi4gTG93ZSIsImVtYWlsIjoiZmxvd0BzYW5kLmJveCIsInJvbGVzIjpbInNhbmRib3gtZGV2ZWxvcGVyIl19.Hc4gXrL6hsE91S6qlJpFfsONq7L-jTN9WsHxtC1fhGk
```

## Connecting to a locally run flowify-server

For a complete local-hosted environment build, deploy the [flowify-workflows-server](https://github.com/equinor/flowify-workflows-server) locally using Docker.

Make sure that the whatever port the flowify-server runs on matches the port set in `proxy` field in `package.json`.
