'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Children, useRef } from 'react'

type GalleryMode = 'carousel' | 'grid'

interface MarkdownGalleryProps extends ComponentPropsWithoutRef<'div'> {
  'children'?: ReactNode
  'data-gallery-mode'?: GalleryMode
  'node'?: unknown
}

const cx = (...classes: Array<string | undefined | false | null>) => {
  return classes.filter(Boolean).join(' ')
}

const galleryImageClassName = [
  '[&_[data-markdown-image]]:!my-0',
  '[&_[data-markdown-image]]:!w-full',
  '[&_[data-markdown-image]]:!max-w-full',
  '[&_[data-markdown-image]>button]:!w-full',
  '[&_[data-markdown-image]>button]:!justify-center',
  '[&_[data-markdown-image]_[data-nimg]]:!w-full',
  '[&_[data-markdown-image]_[data-nimg]]:!min-w-0',
  '[&_[data-markdown-image]_[data-nimg]]:!object-cover',
].join(' ')

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
  const viewportRef = useRef<HTMLDivElement>(null)
  const items = Children.toArray(children).filter(Boolean)

  const scrollCarousel = (direction: -1 | 1) => {
    const viewport = viewportRef.current

    if (viewport == null) {
      return
    }

    viewport.scrollBy({
      left: direction * viewport.clientWidth * 0.85,
      behavior: 'smooth',
    })
  }

  if (mode === 'carousel') {
    return (
      <div
        {...props}
        className={cx('clear-both my-8 max-w-full', className)}
        data-gallery-mode={mode}
      >
        <div className="relative">
          <div
            ref={viewportRef}
            className={cx(
              'flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-md scroll-smooth pb-2',
              'focus-within:ring-2 focus-within:ring-primary-300',
              galleryImageClassName,
            )}
            aria-label="Image carousel"
            tabIndex={0}
          >
            {items.map((item, index) => (
              <div
                // Markdown children do not expose stable keys, so the source
                // order is the canonical identity inside a static post.
                key={index}
                className="min-w-[86%] snap-center sm:min-w-[64%] lg:min-w-[48%] [&>p]:!m-0"
              >
                {item}
              </div>
            ))}
          </div>

          {items.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-md transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:inline-flex"
                aria-label="Previous image"
                onClick={() => scrollCarousel(-1)}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-md transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:inline-flex"
                aria-label="Next image"
                onClick={() => scrollCarousel(1)}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      {...props}
      className={cx(
        'clear-both my-8 grid max-w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 [&>p]:!m-0',
        galleryImageClassName,
        className,
      )}
      data-gallery-mode={mode}
    >
      {children}
    </div>
  )
}
