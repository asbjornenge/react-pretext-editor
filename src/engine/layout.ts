import type { Block, LayoutImage, LayoutConfig, PolygonPoint } from '../types'

const DEFAULT_CONFIG: Required<LayoutConfig> = {
  bodyFont: '16px Lato, sans-serif',
  headingFont: 'bold 24px Lato, sans-serif',
  dropCapFont: '96px FloralCapitals, serif',
  bodyLineHeight: 26,
  headingLineHeight: 36,
  blockGap: 16,
  imgPadding: 10,
  dropCap: false,
  columns: 1,
  minColumnWidth: 300,
}

export interface ImageData {
  index: number
  x: number
  y: number
  width: number
  aspectRatio: number
  polygon?: PolygonPoint[]
  // Original image info for rendering
  url: string
  alt: string
  filename: string
}

export interface LayoutElement {
  type: 'text' | 'image' | 'dropCap'
  text?: string
  char?: string
  x: number
  y: number
  font?: string
  width?: number
  imageIndex?: number
  url?: string
  alt?: string
  polygon?: PolygonPoint[]
  blockIndex?: number
  wordIndex?: number
}

export interface LayoutResult {
  elements: LayoutElement[]
  totalHeight: number
}

export function extractBlocks(node: any): Block[] {
  if (!node || !node.children) return []
  return node.children
    .map((child: any) => {
      const text = (child.children || []).map((c: any) => c.text || '').join('')
      return {
        type: child.type === 'heading' ? 'heading' : 'paragraph',
        text,
        tag: child.tag || 'p',
      }
    })
    .filter((b: any) => b.text.length > 0)
}

export function countWordsInText(str: string, upTo: number): number {
  let count = 0
  let inWord = false
  for (let i = 0; i < Math.min(upTo, str.length); i++) {
    const c = str.charCodeAt(i)
    if (c === 32 || c === 9 || c === 10 || c === 13) {
      if (inWord) { count++; inWord = false }
    } else {
      inWord = true
    }
  }
  if (inWord) count++
  return count
}

export function getBlockedInterval(
  img: ImageData,
  currentY: number,
  imgPadding: number,
  imgX?: number,  // Override x (for column-local rendering)
): { left: number; right: number } | null {
  const imgH = img.width * (img.aspectRatio || 1.2)
  if (currentY < img.y || currentY >= img.y + imgH + imgPadding) return null

  const x = imgX !== undefined ? imgX : img.x
  const rectFallback = { left: x - imgPadding, right: x + img.width + imgPadding }

  if (img.polygon && img.polygon.length >= 3) {
    const relY = (currentY - img.y) / imgH
    if (relY < 0 || relY > 1) return rectFallback

    let minX = Infinity
    let maxX = -Infinity
    const poly = img.polygon
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i]
      const b = poly[(i + 1) % poly.length]
      if ((a.y <= relY && b.y > relY) || (b.y <= relY && a.y > relY)) {
        const t = (relY - a.y) / (b.y - a.y)
        const ix = a.x + t * (b.x - a.x)
        const absX = x + ix * img.width
        minX = Math.min(minX, absX)
        maxX = Math.max(maxX, absX)
      }
    }
    if (minX === Infinity) return rectFallback
    return { left: minX - imgPadding, right: maxX + imgPadding }
  }

  return rectFallback
}

export function getSlots(
  imgData: ImageData[],
  currentY: number,
  containerWidth: number,
  imgPadding: number,
  imgXOverrides?: number[],
): { left: number; right: number }[] {
  const blocked: { left: number; right: number }[] = []
  for (let i = 0; i < imgData.length; i++) {
    const interval = getBlockedInterval(imgData[i], currentY, imgPadding, imgXOverrides?.[i])
    if (interval) blocked.push(interval)
  }
  if (blocked.length === 0) return [{ left: 0, right: containerWidth }]
  blocked.sort((a, b) => a.left - b.left)
  const slots: { left: number; right: number }[] = []
  let cur = 0
  for (const b of blocked) {
    if (b.left > cur) slots.push({ left: cur, right: Math.min(b.left, containerWidth) })
    cur = Math.max(cur, b.right)
  }
  if (cur < containerWidth) slots.push({ left: cur, right: containerWidth })
  return slots.filter(s => (s.right - s.left) > 30)
}

export function prepareImageData(images: LayoutImage[], scale: number, _containerWidth?: number): ImageData[] {
  // Use sqrt scaling for image width — images shrink slower than text
  const imgScale = scale < 1 ? Math.sqrt(scale) : scale
  return images.map((img, i) => ({
    index: i,
    x: img.x * scale,
    y: img.y * scale,
    width: img.width * imgScale,
    aspectRatio: img.aspectRatio,
    polygon: img.polygon,
    url: img.url,
    alt: img.alt,
    filename: img.filename,
  }))
}

interface PretextEngine {
  prepareWithSegments: (text: string, font: string) => any
  layoutNextLine: (prepared: any, cursor: any, maxWidth: number) => any
}

// Text-only probe to estimate total height (ignores images)
function probeTextHeight(
  blocks: Block[],
  containerWidth: number,
  engine: PretextEngine,
  cfg: Required<LayoutConfig>,
): number {
  let y = 0
  for (const block of blocks) {
    const isHeading = block.type === 'heading'
    const font = isHeading ? cfg.headingFont : cfg.bodyFont
    const lineHeight = isHeading ? cfg.headingLineHeight : cfg.bodyLineHeight
    if (isHeading) y += cfg.blockGap
    const prepared = engine.prepareWithSegments(block.text, font)
    let cursor = { segmentIndex: 0, graphemeIndex: 0 }
    while (true) {
      const line = engine.layoutNextLine(prepared, cursor, containerWidth)
      if (!line) break
      y += lineHeight
      cursor = line.end
    }
    y += cfg.blockGap
  }
  return y
}

export function layoutBlocks(
  blocks: Block[],
  imgData: ImageData[],
  containerWidth: number,
  engine: PretextEngine,
  config: LayoutConfig = {},
  _measureDropCap?: (char: string, font: string) => { width: number; height: number },
): LayoutResult {
  const cfg = { ...DEFAULT_CONFIG, ...config }

  // Determine effective column count
  const columnGap = 20
  let numColumns = cfg.columns
  if (numColumns > 1 && containerWidth / numColumns < cfg.minColumnWidth) {
    numColumns = Math.max(1, Math.floor(containerWidth / cfg.minColumnWidth))
  }

  const columnWidth = numColumns > 1
    ? (containerWidth - (numColumns - 1) * columnGap) / numColumns
    : containerWidth

  // Estimate column height from text-only probe
  const textHeight = probeTextHeight(blocks, columnWidth, engine, cfg)
  const columnHeight = numColumns > 1 ? Math.ceil(textHeight / numColumns) : textHeight

  // For each column, collect images that overlap with the column's x range
  // An image can be in multiple columns if it spans them
  const columnImageData: ImageData[][] = Array.from({ length: numColumns }, () => [])
  for (const img of imgData) {
    for (let col = 0; col < numColumns; col++) {
      const colStart = col * (columnWidth + columnGap)
      const colEnd = colStart + columnWidth
      if (img.x + img.width > colStart && img.x < colEnd) {
        columnImageData[col].push({ ...img, x: img.x - colStart })
      }
    }
  }

  // Render text column by column with per-column images
  const elements: LayoutElement[] = []
  let currentBlockIdx = 0
  let currentCursor: any = null
  let blockWordCount = 0
  let maxColumnY = 0

  columnLoop:
  for (let c = 0; c < numColumns; c++) {
    const colX = c * (columnWidth + columnGap)
    const colImgs = columnImageData[c]
    let y = 0

    while (currentBlockIdx < blocks.length) {
      const block = blocks[currentBlockIdx]
      const isHeading = block.type === 'heading'
      const font = isHeading ? cfg.headingFont : cfg.bodyFont
      const lineHeight = isHeading ? cfg.headingLineHeight : cfg.bodyLineHeight

      if (isHeading && currentCursor === null) y += cfg.blockGap

      const prepared = engine.prepareWithSegments(block.text, font)
      let cursor = currentCursor || { segmentIndex: 0, graphemeIndex: 0 }
      let blockDone = false

      while (!blockDone) {
        if (numColumns > 1 && y >= columnHeight && c < numColumns - 1) {
          currentCursor = cursor
          maxColumnY = Math.max(maxColumnY, y)
          continue columnLoop
        }
        const slots = getSlots(colImgs, y, columnWidth, cfg.imgPadding)
        if (slots.length === 0) { y += lineHeight; continue }
        let renderedOnLine = false
        for (const slot of slots) {
          const line = engine.layoutNextLine(prepared, cursor, slot.right - slot.left)
          if (!line) { blockDone = true; break }
          const words = line.text.trim().split(/\s+/).filter((w: string) => w.length > 0)
          elements.push({
            type: 'text',
            text: line.text,
            x: slot.left + colX,
            y,
            font,
            blockIndex: currentBlockIdx,
            wordIndex: blockWordCount,
          })
          blockWordCount += words.length
          cursor = line.end
          renderedOnLine = true
        }
        if (renderedOnLine) y += lineHeight
      }

      currentBlockIdx++
      currentCursor = null
      blockWordCount = 0
      y += cfg.blockGap
    }
    maxColumnY = Math.max(maxColumnY, y)
    break
  }

  // Add image elements at their absolute positions
  let actualHeight = maxColumnY
  for (const img of imgData) {
    const imgH = img.width * (img.aspectRatio || 1.2)
    actualHeight = Math.max(actualHeight, img.y + imgH)
    elements.push({
      type: 'image',
      x: img.x,
      y: img.y,
      width: img.width,
      imageIndex: img.index,
      url: img.url,
      alt: img.alt,
      polygon: img.polygon,
    })
  }

  return { elements, totalHeight: actualHeight }
}
