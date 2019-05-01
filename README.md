# quick-containers-js

Utility methods for quickly starting up containers. Useful for when you're testing code that depends on databases, Kafka, elastic-search or similar.

[`quick-containers-js`](https://github.com/windyroad/quick-containers-js) uses [`dockerode`](https://github.com/apocas/dockerode) and you need to install [`dockerode`](https://github.com/apocas/dockerode)] as a peer depdendency

# Why

Sometimes I need a database or similar for the code I'm testing to connect to. The easiest way to make sure one is available is to pull the relevant Docker image and start up a container. This code tries to make that quick and easy.

# Installation

```
npm install @windyroad/quick-containers-js dockerode --save-dev
```

# Usage

## ensurePulled(docker, image, log)

ensurePulled will pull the specified image. To make it as fast as possible, it will check if the image exists locally and if it's not found, only then will it pull from Docker Hub.

This means that if you are pulling an image with a `latest` tag or similar, then ensurePulled won't automatically pull the new images as they are released. 🤷‍♂️ It's a speed trade-off. If I'm rerunning my tests on every save, then I don't want it checking for a new image to pull every single time.

If you need new image, run `docker pull image:tag` from the command line.

```js
import qc from '@windyroad/quick-containers-js'
import Docker from 'dockerode'

...

const docker = new Docker();
qc.ensurePulled(docker, 'ubuntu:latest', console.log).then(...).catch(...)
```

If you need to pass special options to the pull command, please let us know.

## ensureStarted()

Coming soon...
