import { describe, it, expect } from 'vitest'
import { fmtCLP } from '@/lib/format'

describe('fmtCLP', () => {
  it('formatea sin decimales', () => {
    expect(fmtCLP(1234567)).toMatch(/\$\s?1\.?234\.?567/)
  })
})