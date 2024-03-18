# Simple server proxy

A simple proxy that adds preflight and CORS support to any server

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run start:dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### .env File

Put the following in a .env file at the root directory of the project:

```env
SERVER_URL="http://127.0.0.1"
PORT="1337" // or any port you want to use.
SERVER_API_VERSION="v1"
TARGET_SERVER_API_URL="<URL of the server you want this proxy to mirror>"
```

### Usage

1. [Setup](#project-setup) and [run](#compile-and-hot-reload-for-development) this project.
1. Use [this](http://127.0.0.1:1337/v1/passthrough/) as your Server (This application requires an [.env file](#env-file)).
