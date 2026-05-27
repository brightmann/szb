'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Children, useId, useState } from 'react'

type GalleryMode = 'carousel' | 'grid'

interface MarkdownGalleryProps extends ComponentPropsWithoutRef<'div'> {
  'children'?: ReactNode
  'data-gallery-mode'?: GalleryMode
  'node'?: unknown
}

const cx = (...classes: Array<string | undefined | false | null>) => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Renders Discourse-style image grids and carousel galleries.
 *
 * The parser keeps gallery syntax Markdown-native; this component only handles
 * responsive layout and accessible controls for the generated image children.
 */
export function MarkdownGallery({
  children,
  className,
  node: _node,
  'data-gallery-mode': mode = 'grid',
  ...props
}: MarkdownGalleryProps) {
  const items = Children.toArray(children).filter(Boolean)
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselLabelId = useId()

  const selectCarouselItem = (nextIndex: number) => {
    if (items.length === 0) {
      return
    }

    setActiveIndex((nextIndex + items.length) % items.length)
  }

  if (mode === 'carousel') {
    return (
      <div
        {...props}
        className={cx(
          'markdown-gallery-carousel clear-both my-8 max-w-full rounded-md bg-gray-950/95 text-white shadow-inner dark:bg-black/35',
          className,
        )}
        data-gallery-mode={mode}
        role="region"
        aria-labelledby={carouselLabelId}
      >
        <span id={carouselLabelId} className="sr-only">
          Image carousel
        </span>

        <div className="markdown-gallery-carousel-track">
          {items.map((item, index) => (
            <div
              // Markdown children do not expose stable keys, so the source
              // order is the canonical identity inside a static post.
              key={index}
              className="markdown-gallery-carousel-item [&>p]:!m-0"
              data-active={index === activeIndex}
              aria-hidden={index === activeIndex ? undefined : true}
            >
              {item}
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <div className="markdown-gallery-carousel-controls">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Previous image"
              onClick={() => selectCarouselItem(activeIndex - 1)}
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="markdown-gallery-carousel-dots" role="tablist" aria-label="Choose image">
              {items.map((_item, index) => (
                <button
                  key={index}
                  type="button"
                  className={cx(
                    'h-3 w-3 rounded-full bg-white/55 transition-all duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                    index === activeIndex && 'w-10 bg-white/80',
                  )}
                  role="tab"
                  aria-label={`Show image ${index + 1}`}
                  aria-selected={index === activeIndex}
                  onClick={() => selectCarouselItem(index)}
                />
              ))}
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Next image"
              onClick={() => selectCarouselItem(activeIndex + 1)}
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      {...props}
      className={cx(
        'markdown-gallery-grid clear-both my-8 max-w-full',
        className,
      )}
      data-gallery-mode={mode}
    >
      {items.map((item, index) => (
        <div key={index} className="markdown-gallery-item [&>p]:!m-0">
          {item}
        </div>
      ))}
    </div>
  )
}
