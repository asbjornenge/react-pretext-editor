import React, { useEffect, useState, useRef, useCallback } from 'react'
import { usePretextEngine } from '../engine/pretext-loader'
import { layoutBlocks, prepareImageData } from '../engine/layout'
import type { Block, LayoutData, LayoutConfig } from '../types'
import type { LayoutElement } from '../engine/layout'

interface RendererProps {
  blocks: Block[]
  layout: LayoutData
  config?: LayoutConfig
  resolveImageUrl?: (url: string, filename: string) => string
  className?: string
  style?: React.CSSProperties
}

export default function Renderer({
  blocks,
  layout,
  config,
  resolveImageUrl,
  className,
  style,
}: RendererProps) {
  const engine = usePretextEngine()
  const containerRef = useRef<HTMLDivElement>(null)
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

    // Measure drop cap using a temporary element
    const measureDropCap = (char: string, font: string) => {
      const el = document.createElement('span')
      el.textContent = char
      el.style.cssText = `position:absolute;font:${font};visibility:hidden;line-height:1;`
      containerRef.current!.appendChild(el)
      const rect = el.getBoundingClientRect()
      containerRef.current!.removeChild(el)
      return { width: rect.width, height: rect.height }
    }

    const layoutResult = layoutBlocks(blocks, imgData, containerWidth, engine, cfg, measureDropCap)
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

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', ...style }}
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
                  key={i}
                  style={{
                    position: 'absolute',
                    font: el.font,
                    color: '#502581',
                    left: el.x,
                    top: el.y,
                    lineHeight: 1,
                  }}
                >
                  {el.char}
                </span>
              )
            }
            if (el.type === 'text') {
              return (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    font: el.font,
                    whiteSpace: 'pre',
                    left: el.x,
                    top: el.y,
                  }}
                >
                  {el.text}
                </span>
              )
            }
            if (el.type === 'image') {
              const clipPath = el.polygon && el.polygon.length >= 3
                ? `polygon(${el.polygon.map((p: { x: number; y: number }) => `${p.x * 100}% ${p.y * 100}%`).join(', ')})`
                : undefined
              // Find the original image data for the URL
              const imgInfo = layout.images[el.imageIndex!]
              const src = imgInfo ? resolveUrl(imgInfo.url, imgInfo.filename) : el.url!
              return (
                <img
                  key={i}
                  src={src}
                  alt={el.alt}
                  style={{
                    position: 'absolute',
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    borderRadius: 4,
                    clipPath,
                  }}
                />
              )
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}
