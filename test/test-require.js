const qc = require('../lib/index')
const Docker = require('dockerode')
const waitport = require('wait-port')

const docker = new Docker()

async function test () {
  console.log(qc)
  return qc.ensurePulled(docker, 'ubuntu:latest')
}

test().then(() => {
  console.log('pulled')
  return qc.ensureStarted(docker, {
    Image: 'mysql:8.0.16',
    Tty: false,
    ExposedPorts: {
      '3306/tcp': {}
    },
    HostConfig: {
      PortBindings: { '3306/tcp': [{ HostPort: '3306' }] }
    },
    Env: [
      'MYSQL_ROOT_PASSWORD=my-secret-pw'
    ],
    name: 'qc-mysql-test'
  }, () => waitport({
    port: 3306,
    timeout: 60000
  }))
}).then(() => {
  console.log('started')
})
