/** @format */

const vm = require('vm')
const fs = require('fs')
const path = require('path')
const tmpDir = path.join(__dirname, './tmp')

function compileTypescript(filePath: string): any {
  let exitCode = 0
  const tscPath = path.join(path.dirname(require.resolve('typescript')), 'tsc.js')
  const tscScript = vm.createScript(fs.readFileSync(tscPath, 'utf8'), tscPath)
  const relativeFolder = path.dirname(path.relative(process.cwd(), filePath))
  const compileResultFilePath = path.join(
    tmpDir,
    relativeFolder,
    path.basename(filePath, '.ts') + '.js',
  )
  const argv = [
    'node',
    'tsc.js',
    '--noEmitOnError',
    '--rootDir',
    process.cwd(),
    '--target',
    'ES5',
    '--module',
    'commonjs',
    '--outDir',
    tmpDir,
    filePath,
  ]

  const proc = {
    ...process,
    argv: [...argv],
    exit: function (code: number) {
      exitCode = code
    },
  }

  const sandbox = {
    process: proc,
    require: require,
    module: module,
    Buffer: Buffer,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    __filename: tscPath,
  }

  tscScript.runInNewContext(sandbox)
  if (exitCode !== 0) {
    throw new Error('Unable to compile TypeScript file.')
  }

  return compileResultFilePath
}

function runJavascriptFile(jsPath: string) {
  const content = fs.readFileSync(jsPath, 'utf8')
  const sandbox: any = {
    ...global,
  }
  sandbox.exports = module.exports
  const rimraf = require('rimraf')
  rimraf(tmpDir, function() {})

  return vm.runInNewContext(content, sandbox, { filename: jsPath })
}

export function requireTypescript<T extends any>(path: string): T {
  const compileResultFilePath = compileTypescript(path)
  return runJavascriptFile(compileResultFilePath)
}
