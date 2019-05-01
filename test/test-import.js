import qc from '../lib/index'
import Docker from 'dockerode'
import waitport from 'wait-port'
const docker = new Docker()

function test () {
  return qc.ensurePulled(docker, 'mysql:8.0.16')
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
