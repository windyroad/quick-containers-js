function doPull (docker, image, log) {
  return docker.pull(image).then(stream => {
    return new Promise(function (resolve, reject) {
      docker.modem.followProgress(
        stream,
        (err, output) => {
          if (err) {
            reject(err)
          } else {
            resolve(output)
          }
        },
        log
      )
    })
  })
}

function ensurePulled (docker, image, log = console.log) {
  return docker.listImages().then(images => {
    const found = images.find(
      i => i.RepoTags && i.RepoTags.find(t => t === image)
    )
    if (!found) {
      return doPull(docker, image, log)
    } else {
      log(`existing image '${image}' found. Skipping pull`)
    }
    return Promise.resolve()
  })
}

function getContainer (docker, containerOptions) {
  return docker.createContainer(containerOptions).catch(e => {
    if (e.statusCode === 409) {
      return docker.getContainer(containerOptions.name)
    }
    throw e
  })
}

function ensureStarted (docker, containerOptions, wait, log = console.log) {
  return getContainer(docker, containerOptions)
    .then(container => {
      return container.inspect().then(info => {
        return { info, container }
      })
    })
    .then(data => {
      if (!data.info.State.Running) {
        log(
          `starting ${containerOptions.Image} as ${containerOptions.name}...`
        )
        return data.container.start().then(() => {
          return wait().then(result => {
            log('...started!')
            return result
          })
        })
      } else {
        log(
          `checking availability of ${containerOptions.Image} as ${
            containerOptions.name
          }...`
        )
        return wait().then(result => {
          log('...available!')
          return result
        })
      }
    })
}

exports.ensurePulled = ensurePulled
exports.ensureStarted = ensureStarted
