import React, { useEffect, useState, useRef, useCallback } from 'react'
import { usePretextEngine } from '../engine/pretext-loader'
import { layoutBlocks, prepareImageData } from '../engine/layout'
import type { Block, LayoutData, LayoutConfig, PolygonPoint } from '../types'
import type { LayoutElement } from '../engine/layout'

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
  resolveImageUrl,
  className,
  style,
  editorMode,
  containerRef: externalContainerRef,
}: LayoutViewProps) {
  const engine = usePretextEngine()
  const internalContainerRef = useRef<HTMLDivElement>(null)
  const containerRef = externalContainerRef || internalContainerRef
  const [result, setResult] = useState<{ elements: LayoutElement[]; totalHeight: number } | null>(null)
  const [fontsReady, setFontsReady] = useState(false)

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true))
  }, [])

  const render = useCallback(() => {
    if (!engine || !containerRef.current || blocks.length === 0) return

    const containerWidth = containerRef.current.offsetWidth
    const editorWidth = layout.editorWidth || 700
    const scale = containerWidth / editorWidth
    const imgData = prepareImageData(layout.images || [], scale, containerWidth)

    const cfg = { dropCap: false, ...config, columns: layout.columns || config?.columns || 1 }

    const layoutResult = layoutBlocks(blocks, imgData, containerWidth, engine, cfg)
    setResult(layoutResult)
  }, [engine, blocks, layout, config, fontsReady])

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

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', ...style }}
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
                  {el.text}
                </span>
              )
            }
            if (el.type === 'image') {
              const imageIndex = el.imageIndex!
              const imgInfo = layout.images[imageIndex]
              const src = imgInfo ? resolveUrl(imgInfo.url, imgInfo.filename) : el.url!
              const isSelected = isEditor && editorMode!.selectedImageIndex === imageIndex
              const isDrawingPoly = isEditor && editorMode!.drawingPolygonIndex === imageIndex

              // In editor mode, don't apply clip-path (so user can click anywhere on image)
              const clipPath = !isEditor && el.polygon && el.polygon.length >= 3
                ? `polygon(${el.polygon.map((p: { x: number; y: number }) => `${p.x * 100}% ${p.y * 100}%`).join(', ')})`
                : undefined

              const cursor = isEditor ? (isDrawingPoly ? 'crosshair' : 'grab') : undefined

              return (
                <img
                  key={`img-${i}`}
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
                  }}
                />
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
            const imgH = el.width! * ((layout.images[imageIndex]?.aspectRatio) || 1.2)

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
