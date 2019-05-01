import { ensurePulled } from '../lib/index'
import Docker from 'dockerode'

function test () {
  const docker = new Docker()
  return ensurePulled(docker, 'ubuntu:latest', console.log)
}

test().then(() => { console.log('passed') })
