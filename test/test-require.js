const qc = require('../lib/index')
const Docker = require('dockerode')

async function test () {
  const docker = new Docker()
  console.log(qc)
  return qc.ensurePulled(docker, 'ubuntu:latest', console.log)
}

test().then(() => { console.log('passed') })
