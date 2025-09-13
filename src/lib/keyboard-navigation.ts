// Keyboard navigation utilities for better accessibility

export type FocusableElement = HTMLElement & {
  focus(): void
  blur(): void
}

// Get all focusable elements within a container
export function getFocusableElements(container: HTMLElement): FocusableElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'details',
    'summary'
  ].join(', ')

  return Array.from(container.querySelectorAll(selector)) as FocusableElement[]
}

// Trap focus within a container (useful for modals, menus)
export function trapFocus(
  container: HTMLElement,
  firstElementSelector?: string,
  lastElementSelector?: string
) {
  const focusableElements = getFocusableElements(container)
  
  if (focusableElements.length === 0) return

  const firstElement = firstElementSelector 
    ? (container.querySelector(firstElementSelector) as FocusableElement) || focusableElements[0]
    : focusableElements[0]
  
  const lastElement = lastElementSelector
    ? (container.querySelector(lastElementSelector) as FocusableElement) || focusableElements[focusableElements.length - 1]
    : focusableElements[focusableElements.length - 1]

  // Focus first element initially
  firstElement?.focus()

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown)
  
  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

// Navigate through a list of items with arrow keys
export function useArrowKeyNavigation(
  containerId: string,
  itemSelector: string,
  options: {
    wrap?: boolean
    orientation?: 'vertical' | 'horizontal' | 'both'
    onEnter?: (element: HTMLElement, index: number) => void
    onEscape?: () => void
  } = {}
) {
  const { wrap = true, orientation = 'vertical', onEnter, onEscape } = options

  const handleKeyDown = (e: KeyboardEvent) => {
    const container = document.getElementById(containerId)
    if (!container) return

    const items = Array.from(container.querySelectorAll(itemSelector)) as HTMLElement[]
    if (items.length === 0) return

    const currentIndex = items.findIndex(item => item === document.activeElement)
    if (currentIndex === -1) return

    let nextIndex: number | null = null

    switch (e.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault()
          nextIndex = currentIndex + 1
          if (nextIndex >= items.length && wrap) nextIndex = 0
          else if (nextIndex >= items.length) nextIndex = currentIndex
        }
        break
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault()
          nextIndex = currentIndex - 1
          if (nextIndex < 0 && wrap) nextIndex = items.length - 1
          else if (nextIndex < 0) nextIndex = currentIndex
        }
        break
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault()
          nextIndex = currentIndex + 1
          if (nextIndex >= items.length && wrap) nextIndex = 0
          else if (nextIndex >= items.length) nextIndex = currentIndex
        }
        break
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault()
          nextIndex = currentIndex - 1
          if (nextIndex < 0 && wrap) nextIndex = items.length - 1
          else if (nextIndex < 0) nextIndex = currentIndex
        }
        break
      case 'Enter':
        if (onEnter) {
          e.preventDefault()
          onEnter(items[currentIndex], currentIndex)
        }
        break
      case 'Escape':
        if (onEscape) {
          e.preventDefault()
          onEscape()
        }
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = items.length - 1
        break
    }

    if (nextIndex !== null && items[nextIndex]) {
      items[nextIndex].focus()
    }
  }

  const container = document.getElementById(containerId)
  if (container) {
    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }

  return () => {}
}

// Skip links for accessibility
export function createSkipLink(target: string, text: string): HTMLElement {
  const skipLink = document.createElement('a')
  skipLink.href = `#${target}`
  skipLink.textContent = text
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none'
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault()
    const targetElement = document.getElementById(target)
    if (targetElement) {
      targetElement.focus()
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })

  return skipLink
}

// Focus management for route changes
export function manageFocusOnRouteChange(mainContentId: string = 'main-content') {
  // Focus main content area after route change
  const mainContent = document.getElementById(mainContentId)
  if (mainContent) {
    // Add tabindex if not focusable
    if (!mainContent.hasAttribute('tabindex')) {
      mainContent.setAttribute('tabindex', '-1')
    }
    mainContent.focus()
    
    // Remove tabindex after focus to prevent tab cycling
    setTimeout(() => {
      mainContent.removeAttribute('tabindex')
    }, 0)
  }
}

// Restore focus after modal/overlay closes
export function createFocusManager() {
  let previouslyFocusedElement: HTMLElement | null = null

  return {
    save: () => {
      previouslyFocusedElement = document.activeElement as HTMLElement
    },
    restore: () => {
      if (previouslyFocusedElement && document.body.contains(previouslyFocusedElement)) {
        previouslyFocusedElement.focus()
      }
      previouslyFocusedElement = null
    }
  }
}

// Enhanced keyboard event utilities
export const KeyboardEvents = {
  isEnter: (e: KeyboardEvent) => e.key === 'Enter',
  isSpace: (e: KeyboardEvent) => e.key === ' ',
  isEscape: (e: KeyboardEvent) => e.key === 'Escape',
  isTab: (e: KeyboardEvent) => e.key === 'Tab',
  isArrowKey: (e: KeyboardEvent) => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key),
  isActivation: (e: KeyboardEvent) => e.key === 'Enter' || e.key === ' '
} as const

// Announce screen reader messages
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}