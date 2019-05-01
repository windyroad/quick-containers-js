const { ensurePulled } = require('../lib/index')
const Docker = require('dockerode')

async function test () {
  const docker = new Docker()
  return ensurePulled(docker, 'ubuntu:latest', console.log)
}

test().then(() => { console.log('passed') })
