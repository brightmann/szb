import type { Paragraph, RootContent, Text } from 'mdast'

export const createTextNode = (value: string): Text => ({
  type: 'text',
  value,
})

export const isTextOnlyParagraph = (
  node: RootContent,
): node is Paragraph & { children: Text[] } => {
  return node.type === 'paragraph'
    && node.children.every(child => child.type === 'text')
}

export const getParagraphText = (
  node: RootContent,
): string | null => {
  if (!isTextOnlyParagraph(node)) {
    return null
  }

  const textChildren = node.children as Text[]

  return textChildren.map(child => child.value).join('')
}
