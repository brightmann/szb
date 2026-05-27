import type { Root } from 'mdast'
import type { FlowParent, PhrasingParent } from './types'
import { visit } from 'unist-util-visit'
import {
  FLOW_PARENT_TYPES,
  transformDiscourseDetails,
} from './details'
import {
  transformInlineFormats,
} from './inlineFormat'
import {
  PHRASING_PARENT_TYPES,
  transformInlineSpoilers,
} from './spoiler'

const remarkDiscourse = () => {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        FLOW_PARENT_TYPES.has(node.type)
        && 'children' in node
        && Array.isArray(node.children)
      ) {
        const parent = node as FlowParent
        parent.children = transformDiscourseDetails(parent.children)
      }
    })

    visit(tree, (node) => {
      if (
        PHRASING_PARENT_TYPES.has(node.type)
        && 'children' in node
        && Array.isArray(node.children)
      ) {
        const parent = node as PhrasingParent

        transformInlineSpoilers(parent)
        transformInlineFormats(parent)
      }
    })
  }
}

export {
  transformDiscourseDetails,
  transformInlineFormats,
  transformInlineSpoilers,
}

export default remarkDiscourse
