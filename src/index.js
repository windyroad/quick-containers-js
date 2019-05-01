function doPull (docker, image, log) {
  return docker.pull(image).then(stream => {
    return new Promise(function (resolve, reject) {
      docker.modem.followProgress(stream, (err, output) => {
        if (err) {
          reject(err)
        } else {
          resolve(output)
        }
      }, log)
    })
  })
}

function ensurePulled (docker, image, log) {
  return docker.listImages().then(images => {
    const found = images.find(i => i.RepoTags && i.RepoTags.find(t => t === image))
    if (!found) {
      return doPull(docker, image, log)
    } else {
      log(`existing image '${image}' found. Skipping pull`)
    }
    return Promise.resolve()
  })
}

exports.ensurePulled = ensurePulled
