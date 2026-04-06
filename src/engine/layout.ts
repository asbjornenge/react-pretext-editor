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
}

export interface ImageData {
  index: number
  x: number
  width: number
  aspectRatio: number
  anchorBlockIndex: number
  anchorWordIndex: number
  anchorWord: string
  polygon?: PolygonPoint[]
  resolvedY: number | null
  // Original image info for rendering
  url: string
  alt: string
  filename: string
  float: 'left' | 'right'
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
): { left: number; right: number } | null {
  if (img.resolvedY === null) return null
  const imgH = img.width * (img.aspectRatio || 1.2)
  if (currentY < img.resolvedY || currentY >= img.resolvedY + imgH + imgPadding) return null

  const rectFallback = { left: img.x - imgPadding, right: img.x + img.width + imgPadding }

  if (img.polygon && img.polygon.length >= 3) {
    const relY = (currentY - img.resolvedY) / imgH
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
        const absX = img.x + ix * img.width
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
): { left: number; right: number }[] {
  const blocked: { left: number; right: number }[] = []
  for (const img of imgData) {
    const interval = getBlockedInterval(img, currentY, imgPadding)
    if (interval) blocked.push(interval)
  }
  if (blocked.length === 0) return [{ left: 0, right: containerWidth }]
  blocked.sort((a, b) => a.left - b.left)
  const slots: { left: number; right: number }[] = []
  let cur = 0
  for (const b of blocked) {
    if (b.left > cur) slots.push({ left: cur, right: b.left })
    cur = Math.max(cur, b.right)
  }
  if (cur < containerWidth) slots.push({ left: cur, right: containerWidth })
  return slots.filter(s => (s.right - s.left) > 30)
}

export function prepareImageData(images: LayoutImage[], scale: number, containerWidth?: number): ImageData[] {
  // Use sqrt scaling for image width — images shrink slower than text
  const imgScale = scale < 1 ? Math.sqrt(scale) : scale
  return images.map((img, i) => {
    const scaledWidth = img.width * imgScale
    let scaledX = img.x * scale
    // Ensure image doesn't overflow container
    if (containerWidth && scaledX + scaledWidth > containerWidth) {
      scaledX = Math.max(0, containerWidth - scaledWidth)
    }
    return {
      index: i,
      x: scaledX,
      width: scaledWidth,
      aspectRatio: img.aspectRatio,
      anchorBlockIndex: img.anchorBlockIndex,
      anchorWordIndex: img.anchorWordIndex,
      anchorWord: img.anchorWord,
      polygon: img.polygon,
      resolvedY: null,
      url: img.url,
      alt: img.alt,
      filename: img.filename,
      float: img.float,
    }
  })
}

interface PretextEngine {
  prepareWithSegments: (text: string, font: string) => any
  layoutNextLine: (prepared: any, cursor: any, maxWidth: number) => any
}

export function layoutBlocks(
  blocks: Block[],
  imgData: ImageData[],
  containerWidth: number,
  engine: PretextEngine,
  config: LayoutConfig = {},
  measureDropCap?: (char: string, font: string) => { width: number; height: number },
): LayoutResult {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  const elements: LayoutElement[] = []
  let y = 0
  let isFirstParagraph = true

  // Interleaved per-block: pre-scan to resolve anchors, then render
  for (let bi = 0; bi < blocks.length; bi++) {
    const block = blocks[bi]
    const isHeading = block.type === 'heading'
    const font = isHeading ? cfg.headingFont : cfg.bodyFont
    const lineHeight = isHeading ? cfg.headingLineHeight : cfg.bodyLineHeight
    const text = block.text

    if (isHeading) y += cfg.blockGap

    // Pre-scan this block to find anchor positions (using full width)
    const prePrepared = engine.prepareWithSegments(text, font)
    let preCursor = { segmentIndex: 0, graphemeIndex: 0 }
    let preChars = 0
    let preY = y

    while (true) {
      const preLine = engine.layoutNextLine(prePrepared, preCursor, containerWidth)
      if (!preLine) break
      const prevWords = countWordsInText(text, preChars)
      preChars += preLine.text.length
      const currWords = countWordsInText(text, preChars)

      for (const img of imgData) {
        if (img.resolvedY !== null) continue
        if (img.anchorBlockIndex === bi && img.anchorWordIndex >= prevWords && img.anchorWordIndex < currWords) {
          img.resolvedY = preY + lineHeight
        }
      }
      preCursor = preLine.end
      preY += lineHeight
    }

    // Render this block with slot-based wrapping
    // Drop cap for first paragraph
    let dropCapWidth = 0
    let dropCapHeight = 0
    let dcTop = 0
    if (cfg.dropCap && isFirstParagraph && !isHeading && text.length > 0 && measureDropCap) {
      const dc = measureDropCap(text[0], cfg.dropCapFont)
      dropCapWidth = dc.width + 5
      dropCapHeight = dc.height * 0.75
      dcTop = y - 2
      isFirstParagraph = false

      elements.push({
        type: 'dropCap',
        char: text[0],
        x: 0,
        y: y - 2,
        font: cfg.dropCapFont,
      })

      const prepared = engine.prepareWithSegments(text.slice(1), font)
      let cursor = { segmentIndex: 0, graphemeIndex: 0 }
      let textDone = false
      while (!textDone) {
        let slots = getSlots(imgData, y, containerWidth, cfg.imgPadding)
        if (y < dcTop + dropCapHeight && slots.length > 0 && slots[0].left < dropCapWidth) {
          slots[0] = { left: dropCapWidth, right: slots[0].right }
          if (slots[0].right - slots[0].left < 30) slots.shift()
        }
        if (slots.length === 0) { y += lineHeight; continue }
        let renderedOnLine = false
        for (const slot of slots) {
          const line = engine.layoutNextLine(prepared, cursor, slot.right - slot.left)
          if (!line) { textDone = true; break }
          elements.push({ type: 'text', text: line.text, x: slot.left, y, font, blockIndex: bi })
          cursor = line.end
          renderedOnLine = true
        }
        if (renderedOnLine) y += lineHeight
      }
    } else {
      if (!isHeading) isFirstParagraph = false
      const prepared = engine.prepareWithSegments(text, font)
      let cursor = { segmentIndex: 0, graphemeIndex: 0 }
      let blockWordCount = 0
      let textDone = false

      while (!textDone) {
        const slots = getSlots(imgData, y, containerWidth, cfg.imgPadding)
        if (slots.length === 0) { y += lineHeight; continue }
        let renderedOnLine = false
        for (const slot of slots) {
          const line = engine.layoutNextLine(prepared, cursor, slot.right - slot.left)
          if (!line) { textDone = true; break }
          const words = line.text.trim().split(/\s+/).filter((w: string) => w.length > 0)
          elements.push({
            type: 'text',
            text: line.text,
            x: slot.left,
            y,
            font,
            blockIndex: bi,
            wordIndex: blockWordCount,
          })
          blockWordCount += words.length
          cursor = line.end
          renderedOnLine = true
        }
        if (renderedOnLine) y += lineHeight
      }
    }
    y += cfg.blockGap
  }

  // Add image elements
  for (const img of imgData) {
    if (img.resolvedY === null) continue
    elements.push({
      type: 'image',
      x: img.x,
      y: img.resolvedY,
      width: img.width,
      imageIndex: img.index,
      url: img.url,
      alt: img.alt,
      polygon: img.polygon,
    })
  }

  return { elements, totalHeight: y }
}
