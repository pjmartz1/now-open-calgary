import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatPhone(phone: string) {
  // Format Canadian phone numbers
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    // Replace special characters and accents
    .replace(/[àáäâèéëêìíïîòóöôùúüûñç]/g, char => {
      const map: Record<string, string> = {
        'à': 'a', 'á': 'a', 'ä': 'a', 'â': 'a',
        'è': 'e', 'é': 'e', 'ë': 'e', 'ê': 'e',
        'ì': 'i', 'í': 'i', 'ï': 'i', 'î': 'i',
        'ò': 'o', 'ó': 'o', 'ö': 'o', 'ô': 'o',
        'ù': 'u', 'ú': 'u', 'ü': 'u', 'û': 'u',
        'ñ': 'n', 'ç': 'c'
      }
      return map[char] || char
    })
    // Replace & with 'and'
    .replace(/&/g, 'and')
    // Replace multiple spaces/special chars with single dash
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, '')
    // Limit length to 60 characters for SEO
    .slice(0, 60)
    // Remove trailing dash if trimmed
    .replace(/-$/g, '')
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}
