export interface PolygonPoint {
  x: number // relative to image (0-1)
  y: number // relative to image (0-1)
}

export interface LayoutImage {
  mediaId?: number | string
  filename: string
  alt: string
  url: string
  aspectRatio: number
  anchorBlockIndex: number
  anchorWordIndex: number
  anchorWord: string
  x: number
  width: number
  float: 'left' | 'right'
  polygon?: PolygonPoint[]
}

export interface LayoutData {
  images: LayoutImage[]
  editorWidth?: number
}

export interface Block {
  type: 'heading' | 'paragraph'
  text: string
  tag?: string
}

export interface LayoutConfig {
  bodyFont?: string
  headingFont?: string
  dropCapFont?: string
  bodyLineHeight?: number
  headingLineHeight?: number
  blockGap?: number
  imgPadding?: number
  dropCap?: boolean
}

export interface MediaItem {
  id: number | string
  filename: string
  url: string
  alt?: string
  width?: number
  height?: number
}
