/** @format */

const vm = require('vm')
const fs = require('fs')
const path = require('path')

const tscPath = path.join(path.dirname(require.resolve('typescript')), 'tsc.js')
const tscScript = vm.createScript(fs.readFileSync(tscPath, 'utf8'), tscPath)

const tmpDir = path.join(__dirname, './tmp')

function complieTypescript(filePath: string): any {
  var exitCode = 0
  var relativeFolder = path.dirname(path.relative(process.cwd(), module.filename))
  var jsname = path.join(tmpDir, relativeFolder, path.basename(module.filename, '.ts') + '.js')
  var argv = [
    'node',
    'tsc.js',
   '--noEmitOnError',
    '--rootDir',
    process.cwd(),
    '--target ES5',
    '--module',
    '--outDir',
    tmpDir,
    filePath,
  ]

  var proc = merge(merge({}, process), {
    argv: compact(argv),
    exit: function (code) {
      if (code !== 0 && options.exitOnError) {
        console.error('Fatal Error. Unable to compile TypeScript file. Exiting.')
        process.exit(code)
      }
      exitCode = code
    },
  })

  var sandbox = {
    process: proc,
    require: require,
    module: module,
    Buffer: Buffer,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    __filename: tsc,
  }

  tscScript.runInNewContext(sandbox)
  if (exitCode !== 0) {
    throw new Error('Unable to compile TypeScript file.')
  }

  return jsname
}

export function requireTypescript<T extends any>(path: string): T {}
