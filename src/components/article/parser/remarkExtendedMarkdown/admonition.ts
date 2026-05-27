import type { RootContent } from 'mdast'
import type {
  ExtendedMarkdownAdmonition,
  ExtendedMarkdownAdmonitionKind,
} from './types'
import { getParagraphText } from './utils'

/**
 * Converts fenced admonition blocks into semantic `<aside>` nodes.
 *
 * Supported syntax:
 *
 * ```md
 * ::: warning Optional title
 * Markdown content
 * :::
 * ```
 */

const ADMONITION_CLOSE_RE = /^\s*:::\s*$/

const ADMONITION_KIND_ALIASES: Record<string, ExtendedMarkdownAdmonitionKind> = {
  caution: 'caution',
  danger: 'danger',
  error: 'danger',
  info: 'info',
  note: 'note',
  success: 'success',
  tip: 'tip',
  warning: 'warning',
}

const DEFAULT_TITLES: Record<ExtendedMarkdownAdmonitionKind, string> = {
  caution: 'Caution',
  danger: 'Danger',
  info: 'Info',
  note: 'Note',
  success: 'Success',
  tip: 'Tip',
  warning: 'Warning',
}

interface AdmonitionOpen {
  kind: ExtendedMarkdownAdmonitionKind
  title: string
}

const normalizeTitle = (
  rawTitle: string,
  fallback: string,
): string => {
  const trimmed = rawTitle.trim()
  const quotedTitle
    = (trimmed.startsWith('"') && trimmed.endsWith('"'))
      || (trimmed.startsWith('\'') && trimmed.endsWith('\''))
      ? trimmed.slice(1, -1).trim()
      : trimmed

  return quotedTitle === '' ? fallback : quotedTitle
}

const parseAdmonitionOpen = (node: RootContent): AdmonitionOpen | null => {
  const text = getParagraphText(node)

  if (text == null) {
    return null
  }

  const markerText = text.trimStart()

  if (!markerText.startsWith(':::')) {
    return null
  }

  const markerBody = markerText.slice(3).trimStart()
  const kindMatch = /^[A-Z]+/i.exec(markerBody)

  if (kindMatch == null) {
    return null
  }

  const kind = ADMONITION_KIND_ALIASES[kindMatch[0].toLowerCase()]

  if (kind == null) {
    return null
  }

  const title = normalizeTitle(
    markerBody.slice(kindMatch[0].length),
    DEFAULT_TITLES[kind],
  )

  return {
    kind,
    title: title === '' ? DEFAULT_TITLES[kind] : title,
  }
}

const isAdmonitionClose = (node: RootContent): boolean => {
  const text = getParagraphText(node)

  return text != null && ADMONITION_CLOSE_RE.test(text)
}

const createAdmonitionNode = (
  open: AdmonitionOpen,
  children: RootContent[],
): ExtendedMarkdownAdmonition => ({
  type: 'extendedMarkdownAdmonition',
  data: {
    hName: 'aside',
    hProperties: {
      'className': `extended-admonition extended-admonition-${open.kind}`,
      'data-admonition-kind': open.kind,
      'data-admonition-title': open.title,
    },
  },
  children,
})

/** Transform complete admonition fences and leave malformed fences untouched. */
export const transformExtendedAdmonitions = (
  children: RootContent[],
): RootContent[] => {
  const nextChildren: RootContent[] = []
  let index = 0

  while (index < children.length) {
    const child = children[index]
    const open = parseAdmonitionOpen(child)

    if (open == null) {
      nextChildren.push(child)
      index += 1
      continue
    }

    const admonitionChildren: RootContent[] = []
    let depth = 1
    let closeIndex = -1

    for (let cursor = index + 1; cursor < children.length; cursor += 1) {
      const current = children[cursor]

      if (parseAdmonitionOpen(current) != null) {
        depth += 1
        admonitionChildren.push(current)
        continue
      }

      if (isAdmonitionClose(current)) {
        depth -= 1

        if (depth === 0) {
          closeIndex = cursor
          break
        }

        admonitionChildren.push(current)
        continue
      }

      admonitionChildren.push(current)
    }

    if (closeIndex === -1) {
      nextChildren.push(child)
      index += 1
      continue
    }

    nextChildren.push(
      createAdmonitionNode(
        open,
        transformExtendedAdmonitions(admonitionChildren),
      ),
    )

    index = closeIndex + 1
  }

  return nextChildren
}
