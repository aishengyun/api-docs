# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```shell
$ npm ci
```

### Local Development

```shell
$ npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```shell
$ npm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using Docker:

```shell
docker build --target serve  -t docs .
docker run -d --name docs-aishengyun -p 3000:3000  docs
```
