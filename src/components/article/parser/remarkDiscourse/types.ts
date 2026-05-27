import type {
  PhrasingContent,
  RootContent,
} from 'mdast'

export interface DiscourseSpoiler {
  type: 'discourseSpoiler'
  children: PhrasingContent[]
  data: {
    hName: 'span'
    hProperties: {
      className: string
    }
  }
}

export interface DiscourseDetails {
  type: 'discourseDetails'
  children: RootContent[]
  data: {
    hName: 'details'
    hProperties: {
      className: string
    }
  }
}

export interface DiscourseSummary {
  type: 'discourseSummary'
  children: PhrasingContent[]
  data: {
    hName: 'summary'
    hProperties: {
      className: string
    }
  }
}

export interface PhrasingParent {
  type: string
  children: PhrasingContent[]
}

export interface FlowParent {
  type: string
  children: RootContent[]
}

declare module 'mdast' {
  interface PhrasingContentMap {
    discourseSpoiler: DiscourseSpoiler
    discourseSummary: DiscourseSummary
  }

  interface RootContentMap {
    discourseDetails: DiscourseDetails
  }
}
