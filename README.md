# Flowify

The Flowify project front end - flowify.equinor.com

## Getting started - backend

### Setup Windows

##### Install minikube

https://minikube.sigs.k8s.io/docs/start/

##### Install argo

https://argoproj.github.io/argo-workflows/quick-start/

##### Run flowify in a browser with CORS diabled:

To be able to communicate from the frontend to the backend you need to disable CORS in your browser.
example using chrome
(POWERSHELL):> & 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' --disable-web-security --disable-gpu --user-data-dir=c:\chromeTemp

## Getting started

```
npm run install
npm run start
```

### Connecting to a backend

For full functionality a connection to a running backend is required. The easiest is to connect directly to the dev instance of the [Aurora-hosted service](https://flowify.dev.aurora.equinor.com). To achieve this the locally running frontend must authenticate towards the Aurora service's backend. This can be done from a browser session that is logged in directly to the Aurora frontend. Visit the [dev instance](https://flowify.dev.aurora.equinor.com) and authenticate. Copy the `cookie` header (it's listed in Developer tools, in the Networks tab in Chrome) and _inject_ the header into the requests the frontend sends, for example using [Modheader](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj).

The Aurora service proxy reads the `cookie` header in a request in order to perform authentication, then it appends the corresponding `Authorization` header token used internally for authorization in Flowify.

For a complete local-hosted environment build and deploy the [flowify-server](https://github.com/equinor/flowify-server) locally. This requires some setup and tooling.

## Docker

From the root path you can run Flowify using [docker](https://www.docker.com/)

### Build your image

```
docker build -t flowify:latest .
```

### Run your image

```
docker run --name flowify -d -p 3000:3000 flowify:latest
```
