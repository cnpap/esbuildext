import * as process from 'node:process'
import type { Plugin } from 'esbuild'
import fs from 'fs-extra'
import { repExtOnImport, tsconfigPathsToAlias } from './reg'

const cwdPathname = process.cwd()

// noinspection JSUnusedGlobalSymbols
export function makeExtbuild(): Plugin {
  /**
   * 读取 cwdPathname 下的 tsconfig.json 文件
   */
  const tsconfigJson = fs.readFileSync(`${cwdPathname}/tsconfig.json`, 'utf8')
  const tsconfig = JSON.parse(tsconfigJson)
  const alias = tsconfigPathsToAlias(tsconfig)
  return {
    name: 'esbuildext',
    setup(build) {
      build.onLoad({ filter: /\.ts$/ }, async (args) => {
        let contents = fs.readFileSync(args.path, 'utf8')
        contents = repExtOnImport(contents, alias)
        return {
          contents,
          loader: 'ts',
        }
      })
    },
  }
}
