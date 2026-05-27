import type { RootContent } from 'mdast'
import type {
  DiscourseDetails,
  DiscourseSummary,
} from './types'
import { getParagraphText } from './utils'

const DETAILS_OPEN_RE
  = /^\s*\[details(?:=(?:"([^"]*)"|'([^']*)'|([^\]]*)))?\]\s*$/i

const DETAILS_CLOSE_RE = /^\s*\[\/details\]\s*$/i

export const FLOW_PARENT_TYPES = new Set([
  'root',
  'blockquote',
  'listItem',
])

const createSummaryNode = (title: string): DiscourseSummary => ({
  type: 'discourseSummary',
  data: {
    hName: 'summary',
    hProperties: {
      className: 'discourse-details-summary',
    },
  },
  children: [
    {
      type: 'text',
      value: title,
    },
  ],
})

const createDetailsNode = (
  title: string,
  children: RootContent[],
): DiscourseDetails => ({
  type: 'discourseDetails',
  data: {
    hName: 'details',
    hProperties: {
      className: 'discourse-details',
    },
  },
  children: [
    createSummaryNode(title) as unknown as RootContent,
    ...children,
  ],
})

const parseDetailsOpenTitle = (
  node: RootContent,
): string | null => {
  const text = getParagraphText(node)

  if (text == null) {
    return null
  }

  const match = DETAILS_OPEN_RE.exec(text)

  if (match == null) {
    return null
  }

  const title = match[1] ?? match[2] ?? match[3] ?? 'Details'

  return title.trim() === '' ? 'Details' : title.trim()
}

const isDetailsClose = (node: RootContent): boolean => {
  const text = getParagraphText(node)

  return text != null && DETAILS_CLOSE_RE.test(text)
}

export const transformDiscourseDetails = (
  children: RootContent[],
): RootContent[] => {
  const nextChildren: RootContent[] = []
  let index = 0

  while (index < children.length) {
    const child = children[index]
    const title = parseDetailsOpenTitle(child)

    if (title == null) {
      nextChildren.push(child)
      index += 1
      continue
    }

    const detailsChildren: RootContent[] = []
    let depth = 1
    let closeIndex = -1

    for (let cursor = index + 1; cursor < children.length; cursor += 1) {
      const current = children[cursor]

      if (parseDetailsOpenTitle(current) != null) {
        depth += 1
        detailsChildren.push(current)
        continue
      }

      if (isDetailsClose(current)) {
        depth -= 1

        if (depth === 0) {
          closeIndex = cursor
          break
        }

        detailsChildren.push(current)
        continue
      }

      detailsChildren.push(current)
    }

    if (closeIndex === -1) {
      nextChildren.push(child)
      index += 1
      continue
    }

    nextChildren.push(
      createDetailsNode(
        title,
        transformDiscourseDetails(detailsChildren),
      ),
    )

    index = closeIndex + 1
  }

  return nextChildren
}
