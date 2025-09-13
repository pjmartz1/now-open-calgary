import { cn, formatDate, capitalize, slugify } from '@/lib/utils'

describe('utils', () => {
  describe('cn (className utility)', () => {
    it('combines classes correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
    })

    it('handles undefined and null', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2')
    })
  })

  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const date = '2024-01-15'
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Jan 15, 2024|January 15, 2024/)
    })

    it('handles invalid dates gracefully', () => {
      expect(() => formatDate('invalid-date')).not.toThrow()
    })
  })

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('handles empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('handles single character', () => {
      expect(capitalize('h')).toBe('H')
    })

    it('does not change already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })
  })

  describe('slugify', () => {
    it('creates proper slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('handles special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world')
    })

    it('handles multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world')
    })

    it('handles empty string', () => {
      expect(slugify('')).toBe('')
    })
  })
})