import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, formatNumber, formatDate } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('deduplicates tailwind classes', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('handles undefined and null inputs', () => {
    expect(cn('base', undefined, null)).toBe('base')
  })

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('')
  })
})

describe('formatCurrency', () => {
  it('formats zero cents', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats whole dollars', () => {
    expect(formatCurrency(4900)).toBe('$49.00')
  })

  it('formats cents correctly', () => {
    expect(formatCurrency(199)).toBe('$1.99')
  })

  it('formats large amounts with commas', () => {
    expect(formatCurrency(1000000)).toBe('$10,000.00')
  })

  it('formats single cent', () => {
    expect(formatCurrency(1)).toBe('$0.01')
  })
})

describe('formatNumber', () => {
  it('formats small numbers', () => {
    expect(formatNumber(42)).toBe('42')
  })

  it('formats thousands with commas', () => {
    expect(formatNumber(1000)).toBe('1,000')
  })

  it('formats large numbers', () => {
    expect(formatNumber(1000000)).toBe('1,000,000')
  })

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2026-03-08')
    expect(result).toMatch(/Mar/)
    expect(result).toMatch(/2026/)
  })

  it('formats a Date object', () => {
    const result = formatDate(new Date(2026, 0, 15))
    expect(result).toMatch(/Jan/)
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2026/)
  })

  it('formats ISO string', () => {
    const result = formatDate('2026-12-25T00:00:00Z')
    expect(result).toMatch(/Dec/)
    expect(result).toMatch(/2026/)
  })
})
