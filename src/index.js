import { execFile } from "node:child_process"
import { promises as fs } from "node:fs"
import path from "node:path"
import temporaryDirectory from "temp-dir"

/** @returns {string} path to the Cheerp toolchain directory */
function getCheerpPath() {
  // TODO: make portable
  return "/Applications/cheerp"
}

const cExtensions = [".cpp", ".cxx"]

/**
 * @arg {string} path
 * @returns {boolean} true if the path is a C/C++ source file
 */
function isCPath(path) {
  const pathLower = path.toLowerCase()
  return cExtensions.some((ext) => pathLower.endsWith(ext))
}

/**
 * @arg {string} path
 * @returns {boolean}
 */
function isCJsPath(path) {
  const pathLower = path.toLowerCase()
  return cExtensions.some((ext) => pathLower.endsWith(ext + ".js"))
}

/**
 * @arg {string} cPath
 * @arg {string} outDir
 */
function compileC(cPath, outDir) {
  const compiler = getCheerpPath() + "/bin/clang++"
  const basename = path.basename(cPath) // TODO: include directory (i.e. src/ for examples/roolup)
  const jsPath = path.join(outDir, basename + ".js")

  return new Promise((resolve, reject) => {
    execFile(
      compiler,
      [
        "-target",
        "cheerp-wasm",
        "-o",
        jsPath,
        cPath,
        "-cheerp-make-module=es6",
        // TODO: -O3 if production
      ],
      (error, stdout, stderr) => {
        if (error) {
          // TODO: make nice
          reject(error)
        } else {
          console.log(stdout, stderr)
          resolve({
            js: jsPath,
            wasm: jsPath.replace(/\.js$/, ".wasm"),
          })
        }
      },
    )
  })
}

/**
 * @arg {object} options
 * @returns {import("rollup").Plugin}
 */
export default function cheerp(options = {}) {
  // TODO: include/exclude options - https://rollupjs.org/plugin-development/#transformers
  return {
    name: "cheerp",

    /*
    // Resolve C files => JS files
    // e.g. src/hello.cpp => src/hello.cpp.js
    resolveId(source, importer, options) {
      // If it's a C/C++ source file, return the path to the to-be-compiled JS file
      if (isCPath(source)) {
        return {
          id: source + ".js",
        }
      }
      return null
    },

    // Compile c.js files
    load(id) {
      if (isCJsPath(id)) {
        // TODO
        return `export default ${JSON.stringify(id)}`
      }
      return null
    },
    */

    /*
    resolveId(source, importer) {
      if (isCPath(source)) {
        return path.resolve(path.dirname(importer), source)
      }
      return null
    },
    */

    async transform(code, id) {
      if (isCPath(id)) {
        const out = await compileC(id, temporaryDirectory) // TODO: cache or something
        const wasmFileName = path.basename(out.wasm)

        this.emitFile({
          type: "asset",
          source: await fs.readFile(out.wasm),
          fileName: wasmFileName,
        })

        return {
          code: await fs.readFile(out.js, "utf-8"),
          map: { mappings: "" },
        }
      }
      return null
    },
  }
}
