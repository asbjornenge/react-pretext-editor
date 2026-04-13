import type { Block, TextSegment, LayoutImage, LayoutConfig, PolygonPoint } from '../types'

const DEFAULT_CONFIG: Required<LayoutConfig> = {
  bodyFont: '16px Lato, sans-serif',
  headingFont: 'bold 24px Lato, sans-serif',
  h1Font: 'bold 32px Lato, sans-serif',
  h2Font: 'bold 24px Lato, sans-serif',
  h3Font: 'bold 20px Lato, sans-serif',
  dropCapFont: '96px FloralCapitals, serif',
  bodyLineHeight: 26,
  headingLineHeight: 36,
  h1LineHeight: 42,
  h2LineHeight: 34,
  h3LineHeight: 28,
  blockGap: 16,
  imgPadding: 10,
  dropCap: false,
  dropCapOffsetX: 0,
  dropCapOffsetY: 0,
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
  type: 'text' | 'image' | 'dropCap' | 'hr' | 'listBullet' | 'blockquoteBorder' | 'codeBlock'
  text?: string
  char?: string
  x: number
  y: number
  font?: string
  width?: number
  height?: number
  imageIndex?: number
  url?: string
  alt?: string
  polygon?: PolygonPoint[]
  blockIndex?: number
  wordIndex?: number
  segments?: TextSegment[]   // Rich text segments for inline formatting
  charOffset?: number        // Character offset into block's text where this line starts
  language?: string          // For code blocks
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
    // Less padding on the left (text ragged-right edge makes it look gapier)
    return { left: minX - imgPadding * 0.4, right: maxX + imgPadding }
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
    if (block.type === 'hr') { y += 20 + cfg.blockGap; continue }
    if (block.type === 'code') {
      y += (block.text.split('\n').length * 20) + 20 + cfg.blockGap
      continue
    }
    if (block.type === 'list') {
      for (const item of block.items || []) {
        const prepared = engine.prepareWithSegments(item.text, cfg.bodyFont)
        let cursor = { segmentIndex: 0, graphemeIndex: 0 }
        while (true) {
          const line = engine.layoutNextLine(prepared, cursor, containerWidth - 24)
          if (!line) break
          y += cfg.bodyLineHeight
          cursor = line.end
        }
        y += 4
      }
      y += cfg.blockGap
      continue
    }
    const isHeading = block.type === 'heading'
    const font = isHeading
      ? (block.tag === 'h1' ? cfg.h1Font : block.tag === 'h3' ? cfg.h3Font : cfg.h2Font)
      : cfg.bodyFont
    const lineHeight = isHeading
      ? (block.tag === 'h1' ? cfg.h1LineHeight : block.tag === 'h3' ? cfg.h3LineHeight : cfg.h2LineHeight)
      : cfg.bodyLineHeight
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

  // Collect per-column images
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

  const LIST_INDENT = 24
  const BLOCKQUOTE_INDENT = 20
  const BLOCKQUOTE_BORDER = 3

  // Column layout function
  const renderColumns = (colHeight: number, emit: boolean) => {
    const elements: LayoutElement[] = []

    // Render a text block into elements, returns final y
    // indent: left indent in px. indentUntilY: indent only applies while y < this value (Infinity = always)
    const renderTextBlock = (
      text: string, font: string, lineHeight: number, indent: number,
      colImgs: ImageData[], colX: number, startY: number,
      colIdx: number, blockIdx: number, segments?: TextSegment[],
      indentUntilY: number = Infinity,
    ): { y: number; cursor: any; done: boolean; overflow: boolean; charOffset: number } => {
      const prepared = engine.prepareWithSegments(text, font)
      let cursor = { segmentIndex: 0, graphemeIndex: 0 }
      let y = startY
      let charOffset = 0

      while (true) {
        if (numColumns > 1 && y >= colHeight && colIdx < numColumns - 1) {
          return { y, cursor, done: false, overflow: true, charOffset }
        }
        const currentIndent = y < indentUntilY ? indent : 0
        const slots = getSlots(colImgs, y, columnWidth, cfg.imgPadding)
        if (slots.length === 0) { y += lineHeight; continue }
        const usableSlots = slots.filter(slot => {
          const w = Math.min(slot.right, columnWidth) - Math.max(slot.left, currentIndent)
          return w >= 30
        })
        if (usableSlots.length === 0) { y += lineHeight; continue }
        let renderedOnLine = false
        for (const slot of usableSlots) {
          const slotWidth = Math.min(slot.right, columnWidth) - Math.max(slot.left, currentIndent)
          const adjustedLeft = Math.max(slot.left, currentIndent)
          const line = engine.layoutNextLine(prepared, cursor, slotWidth)
          if (!line) {
            if (renderedOnLine) y += lineHeight
            return { y, cursor, done: true, overflow: false, charOffset }
          }
          if (emit) {
            elements.push({
              type: 'text',
              text: line.text,
              x: adjustedLeft + colX,
              y,
              font,
              blockIndex: blockIdx,
              segments,
              charOffset,
            })
          }
          charOffset += line.text.length
          cursor = line.end
          renderedOnLine = true
        }
        if (renderedOnLine) y += lineHeight
      }
    }
    let currentBlockIdx = 0
    let currentCursor: any = null
    let maxColumnY = 0
    let isFirstParagraph = true

    columnLoop:
    for (let c = 0; c < numColumns; c++) {
      const colX = c * (columnWidth + columnGap)
      const colImgs = columnImageData[c]
      let y = 0

      while (currentBlockIdx < blocks.length) {
        const block = blocks[currentBlockIdx]

        // Column overflow check
        if (numColumns > 1 && y >= colHeight && c < numColumns - 1) {
          maxColumnY = Math.max(maxColumnY, y)
          continue columnLoop
        }

        switch (block.type) {
          case 'heading': {
            if (currentCursor === null) y += cfg.blockGap
            const font = block.tag === 'h1' ? cfg.h1Font : block.tag === 'h3' ? cfg.h3Font : cfg.h2Font
            const lineHeight = block.tag === 'h1' ? cfg.h1LineHeight : block.tag === 'h3' ? cfg.h3LineHeight : cfg.h2LineHeight
            const result = renderTextBlock(
              block.text, font, lineHeight, 0, colImgs, colX, y, c, currentBlockIdx, block.segments
            )
            y = result.y
            if (result.overflow) { currentCursor = result.cursor; maxColumnY = Math.max(maxColumnY, y); continue columnLoop }
            break
          }
          case 'paragraph': {
            // Drop cap for first paragraph
            if (cfg.dropCap && isFirstParagraph && block.text.length > 0 && _measureDropCap) {
              isFirstParagraph = false
              const dcChar = block.text[0]
              const dc = _measureDropCap(dcChar, cfg.dropCapFont)
              const dcWidth = dc.width + 8
              const dcHeight = dc.height * 0.78
              const dcOffsetX = cfg.dropCapOffsetX
              const dcOffsetY = cfg.dropCapOffsetY
              if (emit) {
                elements.push({
                  type: 'dropCap',
                  char: dcChar,
                  x: colX + dcOffsetX,
                  y: y + dcOffsetY,
                  font: cfg.dropCapFont,
                  blockIndex: currentBlockIdx,
                })
              }
              // Render remaining text with indent only within drop cap height
              const restText = block.text.slice(1)
              const restSegments = block.segments ? (() => {
                const segs = [...block.segments]
                if (segs.length > 0 && segs[0].text.length > 0) {
                  segs[0] = { ...segs[0], text: segs[0].text.slice(1) }
                }
                return segs
              })() : undefined
              const dcBottom = y + dcHeight
              const result = renderTextBlock(
                restText, cfg.bodyFont, cfg.bodyLineHeight, dcWidth, colImgs, colX, y, c, currentBlockIdx, restSegments, dcBottom
              )
              y = result.y
              if (result.overflow) { currentCursor = result.cursor; maxColumnY = Math.max(maxColumnY, y); continue columnLoop }
            } else {
              if (block.type === 'paragraph') isFirstParagraph = false
              const result = renderTextBlock(
                block.text, cfg.bodyFont, cfg.bodyLineHeight, 0, colImgs, colX, y, c, currentBlockIdx, block.segments
              )
              y = result.y
              if (result.overflow) { currentCursor = result.cursor; maxColumnY = Math.max(maxColumnY, y); continue columnLoop }
            }
            break
          }
          case 'list': {
            const items = block.items || []
            for (let li = 0; li < items.length; li++) {
              const item = items[li]
              const bullet = block.tag === 'ol' ? `${li + 1}.` : '•'
              if (emit) {
                elements.push({
                  type: 'listBullet',
                  text: bullet,
                  x: colX + 4,
                  y,
                  font: cfg.bodyFont,
                  blockIndex: currentBlockIdx,
                })
              }
              const result = renderTextBlock(
                item.text, cfg.bodyFont, cfg.bodyLineHeight, LIST_INDENT, colImgs, colX, y, c, currentBlockIdx, item.segments
              )
              y = result.y + 4 // small gap between items
            }
            break
          }
          case 'blockquote': {
            const startY = y
            if (emit) {
              // Border will be positioned after we know the height
              elements.push({
                type: 'blockquoteBorder',
                x: colX + 4,
                y: startY,
                width: BLOCKQUOTE_BORDER,
                height: 0, // placeholder, updated below
                blockIndex: currentBlockIdx,
              })
            }
            const result = renderTextBlock(
              block.text, cfg.bodyFont, cfg.bodyLineHeight, BLOCKQUOTE_INDENT, colImgs, colX, y, c, currentBlockIdx, block.segments
            )
            y = result.y
            // Update border height
            if (emit && elements.length > 0) {
              const borderEl = elements[elements.length - 1 - (result.charOffset > 0 ? Math.ceil(result.charOffset / 40) : 0)]
              // Find the border element we just pushed
              for (let i = elements.length - 1; i >= 0; i--) {
                if (elements[i].type === 'blockquoteBorder' && elements[i].blockIndex === currentBlockIdx) {
                  elements[i].height = y - startY
                  break
                }
              }
            }
            break
          }
          case 'code': {
            const codeFont = "14px 'SF Mono', 'Fira Code', Consolas, monospace"
            const codeLineHeight = 20
            const lines = block.text.split('\n')
            const codeStartY = y
            if (emit) {
              elements.push({
                type: 'codeBlock',
                x: colX,
                y: codeStartY,
                width: columnWidth,
                height: lines.length * codeLineHeight + 20,
                language: block.language,
                blockIndex: currentBlockIdx,
              })
            }
            y += 10 // top padding
            for (const line of lines) {
              if (emit) {
                elements.push({
                  type: 'text',
                  text: line,
                  x: colX + 12,
                  y,
                  font: codeFont,
                  blockIndex: currentBlockIdx,
                })
              }
              y += codeLineHeight
            }
            y += 10 // bottom padding
            break
          }
          case 'hr': {
            y += 10
            if (emit) {
              elements.push({
                type: 'hr',
                x: colX,
                y,
                width: columnWidth,
                blockIndex: currentBlockIdx,
              })
            }
            y += 10
            break
          }
          default: {
            // Fallback: treat as paragraph
            const result = renderTextBlock(
              block.text, cfg.bodyFont, cfg.bodyLineHeight, 0, colImgs, colX, y, c, currentBlockIdx, block.segments
            )
            y = result.y
            break
          }
        }

        currentBlockIdx++
        currentCursor = null
        y += cfg.blockGap
      }
      maxColumnY = Math.max(maxColumnY, y)
      break
    }
    return { elements, maxColumnY }
  }

  // Estimate column height: text height + image text displacement
  const textHeight = probeTextHeight(blocks, columnWidth, engine, cfg)
  let columnHeight: number
  if (numColumns > 1) {
    // Estimate how much vertical space images displace from text
    // An image blocking X% of column width displaces ~X% of each text line it covers
    let totalDisplacement = 0
    for (const img of imgData) {
      const imgH = img.width * (img.aspectRatio || 1.2)
      const blockFraction = Math.min(1, img.width / columnWidth)
      totalDisplacement += imgH * blockFraction
    }
    columnHeight = Math.ceil((textHeight + totalDisplacement) / numColumns)
  } else {
    columnHeight = textHeight
  }

  // Final pass: render with adjusted columnHeight
  const { elements, maxColumnY } = renderColumns(columnHeight, true)

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
