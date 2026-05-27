import type { PhrasingContent, Root, Text } from 'mdast'
import { visit } from 'unist-util-visit'

interface DiscourseSpoiler {
  type: 'discourseSpoiler'
  children: PhrasingContent[]
  data: {
    hName: 'span'
    hProperties: {
      className: string
    }
  }
}

declare module 'mdast' {
  interface PhrasingContentMap {
    discourseSpoiler: DiscourseSpoiler
  }
}

interface PhrasingParent {
  type: string
  children: PhrasingContent[]
}

const SPOILER_MARKER_RE = /(\[spoiler\]|\[\/spoiler\])/gi

const PHRASING_PARENT_TYPES = new Set([
  'paragraph',
  'heading',
  'emphasis',
  'strong',
  'delete',
  'link',
  'tableCell',
])

const createTextNode = (value: string): Text => ({
  type: 'text',
  value,
})

const createSpoilerNode = (
  children: PhrasingContent[],
): DiscourseSpoiler => ({
  type: 'discourseSpoiler',
  data: {
    hName: 'span',
    hProperties: {
      className: 'discourse-spoiler',
    },
  },
  children,
})

const transformInlineSpoilers = (parent: PhrasingParent) => {
  const nextChildren: PhrasingContent[] = []
  let spoilerChildren: PhrasingContent[] | null = null
  let changed = false

  const pushNode = (node: PhrasingContent) => {
    if (spoilerChildren !== null) {
      spoilerChildren.push(node)
    }
    else {
      nextChildren.push(node)
    }
  }

  for (const child of parent.children) {
    if (child.type !== 'text') {
      pushNode(child)
      continue
    }

    const parts = child.value.split(SPOILER_MARKER_RE)

    if (parts.length === 1) {
      pushNode(child)
      continue
    }

    changed = true

    for (const part of parts) {
      if (part === '') {
        continue
      }

      const normalized = part.toLowerCase()

      if (normalized === '[spoiler]') {
        if (spoilerChildren === null) {
          spoilerChildren = []
        }
        else {
          spoilerChildren.push(createTextNode(part))
        }

        continue
      }

      if (normalized === '[/spoiler]') {
        if (spoilerChildren !== null) {
          nextChildren.push(createSpoilerNode(spoilerChildren))
          spoilerChildren = null
        }
        else {
          nextChildren.push(createTextNode(part))
        }

        continue
      }

      pushNode(createTextNode(part))
    }
  }

  // Preserve unmatched opening tag instead of eating content.
  if (spoilerChildren !== null) {
    nextChildren.push(createTextNode('[spoiler]'))
    nextChildren.push(...spoilerChildren)
  }

  if (changed) {
    parent.children = nextChildren
  }
}

const remarkDiscourseSpoiler = () => {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        PHRASING_PARENT_TYPES.has(node.type)
        && 'children' in node
        && Array.isArray(node.children)
      ) {
        transformInlineSpoilers(node as PhrasingParent)
      }
    })
  }
}

export default remarkDiscourseSpoiler
