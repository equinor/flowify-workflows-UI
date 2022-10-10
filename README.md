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
docker run --rm --name flowify -p 3000:3000 -p 8080:8080 -p 8443:8443
```

## Connecting to a locally run flowify-server

For a complete local-hosted environment build, deploy the [flowify-workflows-server](https://github.com/equinor/flowify-workflows-server) locally using Docker.

Make sure that the whatever port the flowify-server runs on matches the port set in `proxy` field in `package.json`.
