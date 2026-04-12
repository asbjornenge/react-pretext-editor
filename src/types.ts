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
  x: number
  y: number
  width: number
  polygon?: PolygonPoint[]
}

export interface LayoutBreakpoint {
  maxWidth: number  // Apply when container width <= maxWidth
  name?: string
  images: LayoutImage[]
  columns?: number
  editorWidth?: number
}

export interface LayoutData {
  // Default (largest) layout
  images: LayoutImage[]
  editorWidth?: number
  columns?: number
  fontFamily?: string   // Reference to selected FontOption.name
  fontSize?: number     // Base body font size in px (default 16)
  // Optional smaller breakpoint overrides
  breakpoints?: LayoutBreakpoint[]
}

export interface TextSegment {
  text: string
  bold?: boolean
  italic?: boolean
  code?: boolean
  link?: string
  strikethrough?: boolean
}

export interface Block {
  type: 'heading' | 'paragraph' | 'list' | 'blockquote' | 'code' | 'hr'
  text: string              // Plain text (used by layout engine for line breaking)
  segments?: TextSegment[]  // Rich text segments for rendering
  tag?: string              // h1/h2/h3 for headings, ul/ol for lists
  items?: Block[]           // For lists: each item is a block
  language?: string         // For code blocks
  depth?: number            // Nesting depth for blockquotes/lists
}

export interface FontOption {
  name: string
  bodyFont: string
  headingFont?: string   // Override for headings (defaults to bold version of bodyFont)
  bodyLineHeight?: number
  headingLineHeight?: number
}

export interface LayoutConfig {
  bodyFont?: string
  headingFont?: string
  h1Font?: string
  h2Font?: string
  h3Font?: string
  dropCapFont?: string
  bodyLineHeight?: number
  headingLineHeight?: number
  h1LineHeight?: number
  h2LineHeight?: number
  h3LineHeight?: number
  blockGap?: number
  imgPadding?: number
  dropCap?: boolean
  columns?: number
  minColumnWidth?: number
}

export interface MediaItem {
  id: number | string
  filename: string
  url: string
  alt?: string
  width?: number
  height?: number
}
