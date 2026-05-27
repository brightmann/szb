import type { CSSProperties } from 'react'
import { CustomImage } from '@/components/ui'

type ImageLayout = 'center' | 'full' | 'left' | 'right' | 'thumbnail' | 'wide'

interface ImageMeta {
  alt: string
  height: number
  layout: ImageLayout
  width: number
  widthPercent?: number
}

interface MarkdownImageProps {
  alt?: string
  src?: string | Blob
}

const DEFAULT_IMAGE_META: ImageMeta = {
  alt: 'Image',
  height: 700,
  layout: 'center',
  width: 500,
}

const IMAGE_LAYOUTS = new Set<ImageLayout>([
  'center',
  'full',
  'left',
  'right',
  'thumbnail',
  'wide',
])

const parseImageMeta = (rawAlt: string): ImageMeta => {
  const [label = '', rawMeta = ''] = rawAlt.split('|', 2)
  const meta: ImageMeta = {
    ...DEFAULT_IMAGE_META,
    alt: label.trim() || DEFAULT_IMAGE_META.alt,
  }

  if (rawMeta.trim() === '') {
    return meta
  }

  for (const token of rawMeta.split(',')) {
    const value = token.trim().toLowerCase()
    const dimensionMatch = /^(\d{1,5})x(\d{1,5})$/.exec(value)
    const percentMatch = /^(\d{1,3})%$/.exec(value)

    if (dimensionMatch != null) {
      meta.width = Number(dimensionMatch[1])
      meta.height = Number(dimensionMatch[2])
      continue
    }

    if (percentMatch != null) {
      meta.widthPercent = Math.min(Number(percentMatch[1]), 100)
      continue
    }

    if (IMAGE_LAYOUTS.has(value as ImageLayout)) {
      meta.layout = value as ImageLayout
    }
  }

  return meta
}

const getWrapperClassName = (layout: ImageLayout): string => {
  const baseClassName = 'my-6 block max-w-full break-words'

  switch (layout) {
    case 'full':
      return `${baseClassName} relative left-1/2 -ml-[50vw] w-screen px-4 sm:px-6`
    case 'left':
      return `${baseClassName} float-left mb-4 mr-4 max-w-full sm:max-w-[50%]`
    case 'right':
      return `${baseClassName} float-right mb-4 ml-4 max-w-full sm:max-w-[50%]`
    case 'thumbnail':
      return `${baseClassName} inline-block max-w-48 align-middle`
    case 'wide':
      return `${baseClassName} mx-auto w-full max-w-5xl`
    case 'center':
    default:
      return `${baseClassName} mx-auto text-center`
  }
}

const getImageClassName = (layout: ImageLayout): string => {
  const baseClassName
    = 'relative h-auto max-h-[500px] max-w-full rounded-xs object-contain shadow-md lg:max-h-[700px] xl:max-h-[800px]'

  if (layout === 'thumbnail') {
    return `${baseClassName} w-full min-w-0`
  }

  if (layout === 'full' || layout === 'wide') {
    return `${baseClassName} mx-auto w-full`
  }

  return `${baseClassName} mx-auto w-auto min-w-[200px] lg:min-w-[300px] xl:min-w-[400px]`
}

const getWrapperStyle = (meta: ImageMeta): CSSProperties | undefined => {
  if (meta.widthPercent == null) {
    return undefined
  }

  return {
    width: `${meta.widthPercent}%`,
  }
}

export function MarkdownImage({
  alt = 'Image',
  src = '',
}: MarkdownImageProps) {
  const meta = parseImageMeta(alt)

  return (
    <span
      className={getWrapperClassName(meta.layout)}
      style={getWrapperStyle(meta)}
    >
      <CustomImage
        src={typeof src === 'string' ? src : ''}
        alt={meta.alt}
        width={meta.width}
        height={meta.height}
        priority={false}
        className={getImageClassName(meta.layout)}
      />
    </span>
  )
}
