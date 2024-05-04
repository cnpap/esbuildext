export function tsconfigPathsToAlias(tsconfig: any) {
  const paths = tsconfig.compilerOptions.paths
  const alias: Record<string, string> = {}
  for (const key in paths) {
    const k = key.replace('/*', '/')
    alias[k] = paths[key][0].replace('/*', '')
  }
  return alias
}

function repReg(match: string, p1: string, alias: Record<string, string>) {
  if (p1.startsWith('.'))
    return match.replace(p1, `${p1}.js`)
  for (const key in alias) {
    if (p1.startsWith(key))
      return match.replace(p1, `${p1}.js`)
  }
  return match
}

export function repExtOnImport(code: string, alias: Record<string, string>) {
  let reg = /import\s+.*\s+from\s+['"](.+)['"]/g
  code = code.replace(reg, (m, p) => repReg(m, p, alias))
  reg = /import\(['"](.+)['"]\)/g
  return code.replace(reg, (m, p) => repReg(m, p, alias))
}
