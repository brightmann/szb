'use client'

import type {
  ComponentPropsWithoutRef,
  FocusEvent,
  MouseEvent,
  ReactNode,
} from 'react'
import { CornerUpLeft } from 'lucide-react'
import { useId, useState } from 'react'

/**
 * Inline tooltip primitives for Markdown-only affordances.
 *
 * Native `title` tooltips are intentionally avoided here because they are
 * delayed, cannot be styled, and do not provide predictable keyboard behavior.
 */

interface MarkdownAbbreviationProps extends ComponentPropsWithoutRef<'abbr'> {
  children?: ReactNode
  node?: unknown
}

interface MarkdownFootnoteReferenceProps extends ComponentPropsWithoutRef<'a'> {
  'children'?: ReactNode
  'data-footnote-ref'?: boolean | string
  'node'?: unknown
}

interface MarkdownFootnoteBackReferenceProps extends ComponentPropsWithoutRef<'a'> {
  'children'?: ReactNode
  'data-footnote-backref'?: boolean | string
  'node'?: unknown
}

const cx = (...classes: Array<string | undefined | false | null>) => {
  return classes.filter(Boolean).join(' ')
}

const getFootnoteText = (hash: string): string => {
  const id = decodeURIComponent(hash.replace(/^#/, ''))

  return document.getElementById(id)?.textContent?.replaceAll('↩', '').replaceAll(/\s+/g, ' ').trim() ?? ''
}

const scrollToHashTarget = (hash: string) => {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const target = document.getElementById(id)

  if (target == null) {
    return
  }

  target.setAttribute('tabindex', '-1')
  target.scrollIntoView({ block: 'start', behavior: 'smooth' })
  target.focus({ preventScroll: true })
  window.history.replaceState(null, '', `#${id}`)
}

export function MarkdownAbbreviation({
  children,
  className,
  node: _node,
  title,
  ...props
}: MarkdownAbbreviationProps) {
  const explanation = typeof title === 'string' ? title : undefined
  const label = children?.toString() ?? ''
  const tooltipId = useId()

  return (
    <span className="group/abbr relative inline-flex items-baseline">
      <abbr
        {...props}
        className={cx(
          'cursor-help rounded px-0.5 font-semibold text-primary underline decoration-primary-300/70 decoration-dotted underline-offset-4',
          'outline-none transition-colors hover:bg-primary-300/10 focus-visible:bg-primary-300/10 focus-visible:ring-2 focus-visible:ring-primary-300',
          'dark:decoration-primary-200/70 dark:hover:bg-primary-200/10 dark:focus-visible:bg-primary-200/10',
          className,
        )}
        aria-label={explanation != null ? `${label}: ${explanation}` : label}
        aria-describedby={explanation != null ? tooltipId : undefined}
        tabIndex={0}
      >
        {children}
      </abbr>
      {explanation != null && (
        <span
          className="ml-0.5 align-super text-[0.6em] font-bold leading-none text-primary-500/80 dark:text-primary-200/80"
          aria-hidden="true"
        >
          ?
        </span>
      )}

      {explanation != null && (
        <span
          id={tooltipId}
          className={cx(
            'pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 w-max max-w-64 -translate-x-1/2 rounded-md border border-primary-300/40',
            'bg-background px-3 py-2 text-xs font-medium leading-relaxed text-gray-800 opacity-0 shadow-lg shadow-primary-950/10 transition-opacity duration-100',
            'group-hover/abbr:opacity-100 group-focus-within/abbr:opacity-100',
            'dark:border-primary-200/40 dark:text-gray-100',
          )}
          role="tooltip"
        >
          {explanation}
        </span>
      )}
    </span>
  )
}

export function MarkdownFootnoteReference({
  children,
  className,
  href = '#',
  node: _node,
  ...props
}: MarkdownFootnoteReferenceProps) {
  const label = children?.toString() ?? ''
  const tooltipId = useId()
  const [preview, setPreview] = useState('')

  const updatePreview = () => {
    setPreview(href.startsWith('#') ? getFootnoteText(href) : '')
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      event.preventDefault()
      scrollToHashTarget(href)
    }
  }

  const handleFocus = (_event: FocusEvent<HTMLAnchorElement>) => {
    updatePreview()
  }

  return (
    <span className="group/footnote relative inline-flex items-center align-super">
      <a
        {...props}
        href={href}
        className={cx(
          'mx-0.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary-300/20 px-1.5 text-xs font-semibold text-primary-500',
          'transition-colors hover:bg-primary-300/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300',
          'dark:bg-primary-200/15 dark:text-primary-200 dark:hover:bg-primary-200/25',
          className,
        )}
        aria-label={`Jump to footnote ${label}`}
        aria-describedby={preview !== '' ? tooltipId : undefined}
        onClick={handleClick}
        onFocus={handleFocus}
        onPointerEnter={updatePreview}
      >
        {children}
      </a>

      {preview !== '' && (
        <span
          id={tooltipId}
          className={cx(
            'pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 w-max max-w-72 -translate-x-1/2 rounded-md border border-primary-300/40',
            'bg-background px-3 py-2 text-left text-xs font-medium leading-relaxed text-gray-800 opacity-0 shadow-lg shadow-primary-950/10 transition-opacity duration-100',
            'group-hover/footnote:opacity-100 group-focus-within/footnote:opacity-100',
            'dark:border-primary-200/40 dark:text-gray-100',
          )}
          role="tooltip"
        >
          {preview}
        </span>
      )}
    </span>
  )
}

export function MarkdownFootnoteBackReference({
  children: _children,
  className,
  href = '#',
  node: _node,
  ...props
}: MarkdownFootnoteBackReferenceProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      event.preventDefault()
      scrollToHashTarget(href)
    }
  }

  return (
    <a
      {...props}
      href={href}
      className={cx(
        'ml-2 inline-flex min-h-7 min-w-7 items-center justify-center rounded-full border border-primary-300/30 bg-primary-300/10 text-primary',
        'transition-colors hover:bg-primary-300/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300',
        'dark:border-primary-200/30 dark:bg-primary-200/10 dark:hover:bg-primary-200/20',
        className,
      )}
      aria-label="Back to footnote reference"
      onClick={handleClick}
    >
      <CornerUpLeft className="h-4 w-4" aria-hidden="true" />
    </a>
  )
}
