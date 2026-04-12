import React, { useEffect, useState, useRef, useCallback } from 'react'
import { usePretextEngine } from '../engine/pretext-loader'
import { layoutBlocks, prepareImageData } from '../engine/layout'
import type { Block, TextSegment, FontOption, InitialCapOption, LayoutData, LayoutImage, LayoutConfig, PolygonPoint } from '../types'
import type { LayoutElement } from '../engine/layout'

// Resolve which breakpoint applies for a given container width
export function resolveBreakpoint(layout: LayoutData, containerWidth: number) {
  if (layout.breakpoints && layout.breakpoints.length > 0) {
    const sorted = [...layout.breakpoints]
      .map((bp, idx) => ({ bp, idx }))
      .sort((a, b) => a.bp.maxWidth - b.bp.maxWidth)
    for (const { bp, idx } of sorted) {
      if (containerWidth <= bp.maxWidth) {
        return {
          images: bp.images, columns: bp.columns, editorWidth: bp.editorWidth,
          fontFamily: bp.fontFamily ?? layout.fontFamily,
          fontSize: bp.fontSize ?? layout.fontSize,
          initialCap: bp.initialCap ?? layout.initialCap,
          initialCapFont: bp.initialCapFont ?? layout.initialCapFont,
          initialCapSize: bp.initialCapSize ?? layout.initialCapSize,
          initialCapOffsetX: bp.initialCapOffsetX ?? layout.initialCapOffsetX,
          initialCapOffsetY: bp.initialCapOffsetY ?? layout.initialCapOffsetY,
          breakpointIndex: idx,
        }
      }
    }
  }
  return {
    images: layout.images, columns: layout.columns, editorWidth: layout.editorWidth,
    fontFamily: layout.fontFamily, fontSize: layout.fontSize,
    initialCap: layout.initialCap, initialCapFont: layout.initialCapFont, initialCapSize: layout.initialCapSize,
    initialCapOffsetX: layout.initialCapOffsetX, initialCapOffsetY: layout.initialCapOffsetY,
    breakpointIndex: -1,
  }
}

export interface EditorMode {
  selectedImageIndex: number | null
  drawingPolygonIndex: number | null
  onImageMouseDown?: (e: React.MouseEvent, index: number) => void
  onResizeMouseDown?: (e: React.MouseEvent, index: number) => void
  onBackgroundMouseDown?: (e: React.MouseEvent) => void
  onBackgroundClick?: (e: React.MouseEvent) => void
  onMouseMove?: (e: React.MouseEvent) => void
  onMouseUp?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

interface LayoutViewProps {
  blocks: Block[]
  layout: LayoutData
  config?: LayoutConfig
  availableFonts?: FontOption[]
  availableInitialFonts?: InitialCapOption[]
  resolveImageUrl?: (url: string, filename: string) => string
  className?: string
  style?: React.CSSProperties
  editorMode?: EditorMode
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export default function LayoutView({
  blocks,
  layout,
  config,
  availableFonts,
  availableInitialFonts,
  resolveImageUrl,
  className,
  style,
  editorMode,
  containerRef: externalContainerRef,
}: LayoutViewProps) {
  const engine = usePretextEngine()
  const internalContainerRef = useRef<HTMLDivElement>(null)
  const containerRef = externalContainerRef || internalContainerRef
  const [result, setResult] = useState<{ elements: LayoutElement[]; totalHeight: number; activeImages: LayoutImage[] } | null>(null)
  const [fontsReady, setFontsReady] = useState(false)

  const [fontGeneration, setFontGeneration] = useState(0)
  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true))
    // Listen for font loading events (for lazily-loaded @font-face fonts)
    const handler = () => setFontGeneration(g => g + 1)
    document.fonts.addEventListener('loadingdone', handler)
    return () => document.fonts.removeEventListener('loadingdone', handler)
  }, [])

  const render = useCallback(() => {
    if (!engine || !containerRef.current || blocks.length === 0) return

    const containerWidth = containerRef.current.offsetWidth
    const bp = resolveBreakpoint(layout, containerWidth)
    const editorWidth = bp.editorWidth || 700
    const scale = containerWidth / editorWidth
    const imgData = prepareImageData(bp.images || [], scale, containerWidth)

    // Resolve font from breakpoint's fontFamily + fontSize
    const bpFontFamily = bp.fontFamily
    const selectedFont = availableFonts?.find(f => f.name === bpFontFamily)
    const DEFAULT_FONT_FAMILY = 'Lato, sans-serif'
    const baseFontFamily = selectedFont
      ? selectedFont.bodyFont.replace(/^\d+px\s*/, '')
      : DEFAULT_FONT_FAMILY
    const baseSize = bp.fontSize || 16
    const fontOverrides: Partial<LayoutConfig> = {
      bodyFont: `${baseSize}px ${baseFontFamily}`,
      headingFont: `bold ${baseSize}px ${baseFontFamily}`,
      h1Font: `bold ${Math.round(baseSize * 2)}px ${baseFontFamily}`,
      h2Font: `bold ${Math.round(baseSize * 1.5)}px ${baseFontFamily}`,
      h3Font: `bold ${Math.round(baseSize * 1.25)}px ${baseFontFamily}`,
      bodyLineHeight: Math.round(baseSize * 1.6),
      h1LineHeight: Math.round(baseSize * 2 * 1.3),
      h2LineHeight: Math.round(baseSize * 1.5 * 1.4),
      h3LineHeight: Math.round(baseSize * 1.25 * 1.4),
      ...(selectedFont?.bodyLineHeight ? { bodyLineHeight: selectedFont.bodyLineHeight } : {}),
      ...(selectedFont?.headingLineHeight ? { headingLineHeight: selectedFont.headingLineHeight } : {}),
    }
    // Resolve initial cap font
    const initialCapEnabled = bp.initialCap || false
    const initialCapFontOption = availableInitialFonts?.find(f => f.name === bp.initialCapFont)
    const initialCapFontFamily = initialCapFontOption?.fontFamily || 'serif'
    const initialCapSize = bp.initialCapSize || 96
    const dropCapFont = `${initialCapSize}px ${initialCapFontFamily}`

    const cfg = {
      ...config,
      ...fontOverrides,
      dropCap: initialCapEnabled,
      dropCapFont,
      dropCapOffsetX: bp.initialCapOffsetX ?? 0,
      dropCapOffsetY: bp.initialCapOffsetY ?? 0,
      columns: bp.columns || config?.columns || 1,
    }

    const measureDropCap = (char: string, font: string) => {
      const el = document.createElement('span')
      el.textContent = char
      el.style.cssText = `position:absolute;font:${font};visibility:hidden;line-height:1;`
      containerRef.current!.appendChild(el)
      const rect = el.getBoundingClientRect()
      containerRef.current!.removeChild(el)
      return { width: rect.width, height: rect.height }
    }

    // Ensure drop cap font is loaded before measuring
    if (initialCapEnabled && dropCapFont && !document.fonts.check(dropCapFont)) {
      document.fonts.load(dropCapFont).then(() => render())
      return
    }

    const layoutResult = layoutBlocks(blocks, imgData, containerWidth, engine, cfg, measureDropCap)
    setResult({ ...layoutResult, activeImages: bp.images || [] })
  }, [engine, blocks, layout, config, availableFonts, availableInitialFonts, fontsReady, fontGeneration])

  useEffect(() => {
    render()
  }, [render])

  // Re-render on resize
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(() => render())
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [render])

  const resolveUrl = (url: string, filename: string) => {
    if (resolveImageUrl) return resolveImageUrl(url, filename)
    return url
  }

  const isEditor = !!editorMode

  // Render text with inline formatting from segments
  const renderTextWithSegments = (lineText: string, segments?: TextSegment[], charOffset?: number): React.ReactNode => {
    if (!segments || segments.length === 0) return lineText
    const offset = charOffset || 0
    const lineEnd = offset + lineText.length

    // Find which segments overlap this line
    let segStart = 0
    const parts: React.ReactNode[] = []
    let partKey = 0

    for (const seg of segments) {
      const segEnd = segStart + seg.text.length
      // Check overlap with [offset, lineEnd)
      const overlapStart = Math.max(segStart, offset)
      const overlapEnd = Math.min(segEnd, lineEnd)

      if (overlapStart < overlapEnd) {
        const text = seg.text.slice(overlapStart - segStart, overlapEnd - segStart)
        const style: React.CSSProperties = {}
        if (seg.bold) style.fontWeight = 'bold'
        if (seg.italic) style.fontStyle = 'italic'
        if (seg.code) {
          style.fontFamily = "'SF Mono', 'Fira Code', Consolas, monospace"
          style.background = 'rgba(80,37,129,0.08)'
          style.padding = '1px 4px'
          style.borderRadius = '3px'
          style.fontSize = '0.9em'
        }
        if (seg.link) { style.color = '#502581'; style.textDecoration = 'underline' }
        if (seg.strikethrough) style.textDecoration = 'line-through'

        if (Object.keys(style).length > 0) {
          parts.push(<span key={partKey++} style={style}>{text}</span>)
        } else {
          parts.push(<React.Fragment key={partKey++}>{text}</React.Fragment>)
        }
      }
      segStart = segEnd
    }

    return parts.length > 0 ? parts : lineText
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', minHeight: '100%', ...style }}
      onMouseDown={editorMode?.onBackgroundMouseDown}
      onClick={editorMode?.onBackgroundClick}
      onMouseMove={editorMode?.onMouseMove}
      onMouseUp={editorMode?.onMouseUp}
      onMouseLeave={editorMode?.onMouseLeave}
    >
      {/* Plain text fallback while loading */}
      {!result && (
        <div>
          {blocks.map((b, i) => (
            b.type === 'heading'
              ? <h2 key={i}>{b.text}</h2>
              : <p key={i}>{b.text}</p>
          ))}
        </div>
      )}

      {/* Rendered layout */}
      {result && (
        <div style={{ position: 'relative', height: result.totalHeight }}>
          {result.elements.map((el, i) => {
            if (el.type === 'dropCap') {
              return (
                <span
                  key={`dropcap-${i}`}
                  style={{
                    position: 'absolute',
                    font: el.font,
                    color: '#502581',
                    left: el.x,
                    top: el.y,
                    lineHeight: 1,
                    pointerEvents: 'none',
                  }}
                >
                  {el.char}
                </span>
              )
            }
            if (el.type === 'text') {
              return (
                <span
                  key={`text-${i}`}
                  style={{
                    position: 'absolute',
                    font: el.font,
                    whiteSpace: 'pre',
                    left: el.x,
                    top: el.y,
                    color: '#333',
                    pointerEvents: 'none',
                  }}
                >
                  {renderTextWithSegments(el.text || '', el.segments, el.charOffset || 0)}
                </span>
              )
            }
            if (el.type === 'listBullet') {
              return (
                <span
                  key={`bullet-${i}`}
                  style={{
                    position: 'absolute',
                    font: el.font,
                    left: el.x,
                    top: el.y,
                    color: '#502581',
                    pointerEvents: 'none',
                    fontWeight: 600,
                  }}
                >
                  {el.text}
                </span>
              )
            }
            if (el.type === 'blockquoteBorder') {
              return (
                <div
                  key={`bqborder-${i}`}
                  style={{
                    position: 'absolute',
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                    background: '#502581',
                    borderRadius: 2,
                    opacity: 0.4,
                    pointerEvents: 'none',
                  }}
                />
              )
            }
            if (el.type === 'codeBlock') {
              return (
                <div
                  key={`code-${i}`}
                  style={{
                    position: 'absolute',
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                    background: '#f5f2f0',
                    border: '1px solid #e0d8d0',
                    borderRadius: 4,
                    pointerEvents: 'none',
                  }}
                />
              )
            }
            if (el.type === 'hr') {
              return (
                <div
                  key={`hr-${i}`}
                  style={{
                    position: 'absolute',
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: 1,
                    background: '#ccc',
                    pointerEvents: 'none',
                  }}
                />
              )
            }
            if (el.type === 'image') {
              const imageIndex = el.imageIndex!
              const imgInfo = result.activeImages[imageIndex]
              const src = imgInfo ? resolveUrl(imgInfo.url, imgInfo.filename) : el.url!
              const isSelected = isEditor && editorMode!.selectedImageIndex === imageIndex
              const isDrawingPoly = isEditor && editorMode!.drawingPolygonIndex === imageIndex

              const hasPolygon = el.polygon && el.polygon.length >= 3
              const clipPath = hasPolygon
                ? `polygon(${el.polygon!.map((p: { x: number; y: number }) => `${p.x * 100}% ${p.y * 100}%`).join(', ')})`
                : undefined

              const cursor = isEditor ? (isDrawingPoly ? 'crosshair' : 'grab') : undefined

              return (
                <React.Fragment key={`img-${i}`}>
                  {/* In editor mode: faded full image for click target + clipped image on top */}
                  {isEditor && hasPolygon && (
                    <img
                      src={src}
                      alt=""
                      data-image-index={imageIndex}
                      onMouseDown={(e) => editorMode!.onImageMouseDown?.(e, imageIndex)}
                      style={{
                        position: 'absolute',
                        left: el.x,
                        top: el.y,
                        width: el.width,
                        borderRadius: 4,
                        opacity: 0.15,
                        cursor,
                      }}
                    />
                  )}
                  <img
                    src={src}
                    alt={el.alt}
                    data-image-index={imageIndex}
                    onMouseDown={isEditor ? (e) => editorMode!.onImageMouseDown?.(e, imageIndex) : undefined}
                    style={{
                      position: 'absolute',
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      border: isEditor ? `2px solid ${isSelected ? '#502581' : 'transparent'}` : 'none',
                      borderRadius: 4,
                      clipPath,
                      cursor,
                      pointerEvents: isEditor && hasPolygon ? 'none' : undefined,
                    }}
                  />
                </React.Fragment>
              )
            }
            return null
          })}

          {/* Editor overlays: polygon SVG, resize handles */}
          {isEditor && result.elements.map((el, i) => {
            if (el.type !== 'image') return null
            const imageIndex = el.imageIndex!
            const poly = el.polygon || []
            const isSelected = editorMode!.selectedImageIndex === imageIndex
            const isDrawing = editorMode!.drawingPolygonIndex === imageIndex
            const imgH = el.width! * ((result.activeImages[imageIndex]?.aspectRatio) || 1.2)

            return (
              <React.Fragment key={`editor-${i}`}>
                {/* Polygon SVG overlay */}
                {(poly.length > 0 || isDrawing) && (
                  <svg
                    style={{
                      position: 'absolute',
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      height: imgH,
                      pointerEvents: 'none',
                    }}
                    viewBox="0 0 1 1"
                    preserveAspectRatio="none"
                  >
                    {poly.length >= 2 && (
                      <path
                        d={poly.map((p: PolygonPoint, j: number) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + (poly.length >= 3 ? ' Z' : '')}
                        fill="rgba(80,37,129,0.1)"
                        stroke="#502581"
                        strokeWidth="0.008"
                        strokeDasharray="0.02 0.015"
                      />
                    )}
                    {poly.map((p: PolygonPoint, pi: number) => (
                      <circle
                        key={pi}
                        cx={p.x}
                        cy={p.y}
                        r={isDrawing ? 0.025 : 0.015}
                        fill={isDrawing ? '#502581' : 'rgba(80,37,129,0.5)'}
                      />
                    ))}
                  </svg>
                )}

                {/* Resize handle (only shown when selected) */}
                {isSelected && (
                  <div
                    data-resize-handle={imageIndex}
                    onMouseDown={(e) => editorMode!.onResizeMouseDown?.(e, imageIndex)}
                    style={{
                      position: 'absolute',
                      left: el.x + el.width! - 4,
                      top: el.y + imgH - 4,
                      width: 8,
                      height: 8,
                      background: '#502581',
                      cursor: 'nwse-resize',
                      borderRadius: 1,
                      opacity: 0.7,
                    }}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}
