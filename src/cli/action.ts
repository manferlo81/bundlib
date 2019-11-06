import { bgBlack, bold, green, inverse, magenta, yellow } from 'colorette'
import fileSize from 'filesize'
import { relative } from 'path'
import prettyMs from 'pretty-ms'
import readPkg from 'read-pkg'
import slash from 'slash'

import { BundlibPkgJson } from '../api'

import bundlib from './bundlib'
import { log, logError } from './console'
import { BuildCallbackObject, BundlibOptions } from './types'

function prjInfo(name: string, ver: string) {

  const projName = bold(green(name))
  const projVer = bold(yellow(`v${ver}`))

  return `${projName} ${projVer}`

}

export async function action(displayName: string, version: string, silent: boolean, options: BundlibOptions) {

  const cwd = process.cwd()

  let pkg: BundlibPkgJson | undefined

  if (!silent) {

    const appInfo = prjInfo(displayName, version)
    log(`${appInfo}
`)

    const filename = bold(yellow('package.json'))
    log(`reading: ${filename}`)

    pkg = await readPkg({
      cwd,
      normalize: false,
    })

    const { name: prjName, displayName: prjDispName, version: prjVer } = pkg
    const prjInfoName = prjDispName as (string | undefined) || prjName

    if (prjInfoName && prjVer) {

      const info = prjInfo(prjInfoName, prjVer)
      log(`building: ${info}
`)

    }

  }

  let buildIndex = 0

  const callbacks: BuildCallbackObject = {

    error(err) {
      logError(err)
    },

  }

  if (!silent) {

    Object.assign(callbacks, {

      buildEnd(filename, size, duration) {
        const tag = bold(bgBlack(green(inverse(' built '))))
        const path = bold(yellow(slash(relative(cwd, filename))))
        const colorSize = bold(magenta(fileSize(size)))
        const colorTime = bold(magenta(prettyMs(duration, { secondsDecimalDigits: 2 })))
        log(`${tag} ${path} ( ${colorSize} in ${colorTime} )`)
      },

      error(err) {
        logError(err)
      },

      warn(warning) {

        let message = warning

        if (typeof message === 'object') {

          const { plugin, message: msg } = message

          message = msg

          if (plugin) {
            message = `(plugin ${bold(magenta(plugin))}) ${message}`
          }

        }

        const tag = bold(magenta('warning:'))

        log(`${tag} ${message}`)

      },

    } as BuildCallbackObject)

    if (options.watch) {

      Object.assign(callbacks, {

        start() {
          if (buildIndex) {
            log(`rebuilding...
`)
          }
          buildIndex++
        },

        end() {
          log(`
waiting for changes...`)
        },

      } as BuildCallbackObject)

    }

  }

  try {
    await bundlib(cwd, options, callbacks, pkg)
  } catch (err) {
    logError(err)
  }

}
