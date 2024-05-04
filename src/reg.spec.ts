import { describe, expect, it } from 'vitest'
import { repExtOnImport, tsconfigPathsToAlias } from './reg'

describe('should', () => {
  it('exported', () => {
    const result = repExtOnImport(`
    import x from '@/xxx'
    import x from '#/xxx2'
    
    import(".cc1")
    `, {
      '@': 'src',
      '#': 'src2',
    })
    expect(result).toEqual(`
    import x from '@/xxx.js'
    import x from '#/xxx2.js'
    
    import(".cc1.js")
    `)
    const alias = tsconfigPathsToAlias({
      compilerOptions: {
        paths: {
          '@/*': ['src/*'],
          '#/*': ['src2/*'],
        },
      },
    })
    expect(alias).toEqual({
      '@/': 'src',
      '#/': 'src2',
    })
  })
})
