import chalk from 'chalk'
import fileSize from 'filesize'
import { relative } from 'path'
import prettyMs from 'pretty-ms'
import readPkg from 'read-pkg'
import { RollupError } from 'rollup'
import slash from 'slash'
import { BundlibPkgJson } from '../api'
import bundlib from './bundlib'
import { log, logError } from './console'
import { BuildCallbackObject, BundlibOptions } from './types'

const { bold } = chalk
const green = bold.green
const yellow = bold.yellow
const magenta = bold.magenta

function prjInfo(name: string, ver: string) {
  const projName = green(name)
  const projVer = yellow(`v${ver}`)
  return `${projName} ${projVer}`
}

// ENABLE COLORS ON GIT BASH FOR WINDOWS
if (!chalk.level && 'MINGW_CHOST' in process.env) {
  chalk.level = 1
}

export async function action(displayName: string, version: string, silent: boolean, options: BundlibOptions) {

  const cwd = process.cwd()

  let pkg: BundlibPkgJson | undefined

  if (!silent) {

    const appInfo = prjInfo(displayName, version)
    log(`${appInfo}
`)

    const filename = yellow('package.json')
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

  const error = options.watch ? logError : (err: RollupError) => {
    logError(err)
    process.exit(1)
  }

  const callbacks: BuildCallbackObject = { error }

  if (!silent) {

    Object.assign(callbacks, {

      buildEnd(filename, size, duration) {
        const tag = green.bgBlack.inverse(' built ')
        const path = yellow(slash(relative(cwd, filename)))
        const colorSize = magenta(fileSize(size))
        const colorTime = magenta(prettyMs(duration, { secondsDecimalDigits: 2 }))
        log(`${tag} ${path} ( ${colorSize} in ${colorTime} )`)
      },

      warn(warning) {

        let message = warning

        if (typeof message === 'object') {

          const { plugin, message: msg } = message

          message = msg

          if (plugin) {
            message = `(plugin ${magenta(plugin)}) ${message}`
          }

        }

        const tag = magenta('warning:')

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
    process.exit(1)
  }

}
