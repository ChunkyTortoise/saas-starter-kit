import { describe, it, expect } from 'vitest'
import { PRICE_IDS } from '@/lib/stripe'

describe('PRICE_IDS', () => {
  it('has a free tier with default value', () => {
    expect(PRICE_IDS.free).toBe('price_free')
  })

  it('has a pro tier key', () => {
    expect('pro' in PRICE_IDS).toBe(true)
  })

  it('has an enterprise tier key', () => {
    expect('enterprise' in PRICE_IDS).toBe(true)
  })

  it('all tier keys are strings', () => {
    for (const val of Object.values(PRICE_IDS)) {
      expect(typeof val).toBe('string')
    }
  })
})
