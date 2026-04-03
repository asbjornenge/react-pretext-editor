import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Pen, LayoutGrid, Eye } from 'lucide-react'
import { usePretextEngine } from '../engine/pretext-loader'
import { countWordsInText } from '../engine/layout'
import Renderer from './Renderer'
import type { Block, LayoutData, LayoutImage, LayoutConfig, PolygonPoint } from '../types'

type EditorMode = 'write' | 'layout' | 'preview'

interface EditorProps {
  blocks: Block[]
  layout: LayoutData
  onLayoutChange: (layout: LayoutData) => void
  onBlocksChange?: (blocks: Block[]) => void
  resolveImageUrl?: (url: string, filename: string) => string
  config?: LayoutConfig
}

const DEFAULT_CONFIG = {
  bodyFont: '16px Lato, sans-serif',
  headingFont: 'bold 24px Lato, sans-serif',
  bodyLineHeight: 26,
  headingLineHeight: 36,
  blockGap: 16,
  imgPadding: 10,
}

function blocksToMarkdown(blocks: Block[]): string {
  return blocks.map(b => {
    if (b.type === 'heading') {
      const level = b.tag === 'h3' ? '###' : b.tag === 'h1' ? '#' : '##'
      return `${level} ${b.text}`
    }
    return b.text
  }).join('\n\n')
}

function markdownToBlocks(md: string): Block[] {
  return md.split(/\n\n+/).map(chunk => {
    const trimmed = chunk.trim()
    if (!trimmed) return null
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const tag = level === 1 ? 'h1' : level === 3 ? 'h3' : 'h2'
      return { type: 'heading' as const, text: headingMatch[2], tag }
    }
    return { type: 'paragraph' as const, text: trimmed, tag: 'p' }
  }).filter(Boolean) as Block[]
}

export default function Editor({
  blocks,
  layout,
  onLayoutChange,
  onBlocksChange,
  resolveImageUrl,
  config,
}: EditorProps) {
  const engine = usePretextEngine()
  const stageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [markdownText, setMarkdownText] = useState(() => blocksToMarkdown(blocks))

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [drawingPolygonIndex, setDrawingPolygonIndex] = useState<number | null>(null)
  const [mode, setMode] = useState<EditorMode>('layout')

  // Drag state stored in ref for performance (avoid re-renders during drag)
  const dragRef = useRef<{
    imageIndex: number
    startX: number
    startY: number
    origX: number
    origImgY: number
    active: boolean
  } | null>(null)

  const resizeRef = useRef<{
    imageIndex: number
    startX: number
    origWidth: number
  } | null>(null)

  const cfg = { ...DEFAULT_CONFIG, ...config }
  const layoutData: LayoutData = layout || { images: [] }

  const resolveUrl = (url: string, filename: string) => {
    if (resolveImageUrl) return resolveImageUrl(url, filename)
    return url
  }

  // Find anchor at a Y position in the text flow
  const findAnchorAtY = useCallback((targetY: number) => {
    if (!engine || blocks.length === 0) return null
    const { prepareWithSegments, layoutNextLine } = engine
    const containerWidth = (containerRef.current?.offsetWidth || 700) - 40
    let y = 0
    for (let bi = 0; bi < blocks.length; bi++) {
      const block = blocks[bi]
      const isHeading = block.type === 'heading'
      const font = isHeading ? cfg.headingFont : cfg.bodyFont
      const lineHeight = isHeading ? cfg.headingLineHeight : cfg.bodyLineHeight
      if (isHeading) y += cfg.blockGap
      const prepared = prepareWithSegments(block.text, font)
      let cursor = { segmentIndex: 0, graphemeIndex: 0 }, chars = 0
      while (true) {
        const line = layoutNextLine(prepared, cursor, containerWidth)
        if (!line) break
        const prevWords = countWordsInText(block.text, chars)
        chars += line.text.length
        if (y + lineHeight >= targetY) {
          const allText = block.text.slice(0, chars).trim().split(/\s+/)
          return { blockIndex: bi, wordIndex: prevWords, word: allText[prevWords] || allText[allText.length - 1] || '' }
        }
        cursor = line.end
        y += lineHeight
      }
      y += cfg.blockGap
    }
    const last = blocks[blocks.length - 1]
    return { blockIndex: blocks.length - 1, wordIndex: 0, word: last.text.trim().split(/\s+/)[0] || '' }
  }, [engine, blocks, cfg])

  // Core pretext rendering
  const renderPretext = useCallback(() => {
    if (!engine || !stageRef.current || blocks.length === 0) return

    const { prepareWithSegments, layoutNextLine } = engine
    const stage = stageRef.current
    const rawWidth = containerRef.current?.offsetWidth || 700
    const pad = 20
    const containerWidth = rawWidth - pad * 2
    const { bodyFont, headingFont, bodyLineHeight, headingLineHeight, blockGap, imgPadding } = cfg
    const images = layoutData.images || []

    stage.innerHTML = ''

    const imgData = images.map((img) => ({ ...img, resolvedY: null as number | null }))

    function getBlockedInterval(img: typeof imgData[0], currentY: number) {
      if (img.resolvedY === null) return null
      const imgH = img.width * (img.aspectRatio || 1.2)
      if (currentY < img.resolvedY || currentY >= img.resolvedY + imgH + imgPadding) return null
      const rect = { left: img.x - imgPadding, right: img.x + img.width + imgPadding }
      if (img.polygon && img.polygon.length >= 3) {
        const relY = (currentY - img.resolvedY) / imgH
        if (relY < 0 || relY > 1) return rect
        let minX = Infinity, maxX = -Infinity
        for (let i = 0; i < img.polygon.length; i++) {
          const a = img.polygon[i], b = img.polygon[(i + 1) % img.polygon.length]
          if ((a.y <= relY && b.y > relY) || (b.y <= relY && a.y > relY)) {
            const t = (relY - a.y) / (b.y - a.y)
            const absX = img.x + (a.x + t * (b.x - a.x)) * img.width
            minX = Math.min(minX, absX); maxX = Math.max(maxX, absX)
          }
        }
        return minX === Infinity ? rect : { left: minX - imgPadding, right: maxX + imgPadding }
      }
      return rect
    }

    function getSlots(currentY: number) {
      const blocked: { left: number; right: number }[] = []
      for (const img of imgData) {
        const interval = getBlockedInterval(img, currentY)
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

    let y = 0
    for (let bi = 0; bi < blocks.length; bi++) {
      const block = blocks[bi]
      const isHeading = block.type === 'heading'
      const font = isHeading ? headingFont : bodyFont
      const lineHeight = isHeading ? headingLineHeight : bodyLineHeight
      if (isHeading) y += blockGap

      // Pre-scan for anchors
      const pre = prepareWithSegments(block.text, font)
      let pc = { segmentIndex: 0, graphemeIndex: 0 }, pChars = 0, pY = y
      while (true) {
        const pl = layoutNextLine(pre, pc, containerWidth)
        if (!pl) break
        const pw = countWordsInText(block.text, pChars)
        pChars += pl.text.length
        const cw = countWordsInText(block.text, pChars)
        for (const img of imgData) {
          if (img.resolvedY !== null) continue
          if (img.anchorBlockIndex === bi && img.anchorWordIndex >= pw && img.anchorWordIndex < cw)
            img.resolvedY = pY + lineHeight
        }
        pc = pl.end; pY += lineHeight
      }

      // Render text
      const prepared = prepareWithSegments(block.text, font)
      let cursor = { segmentIndex: 0, graphemeIndex: 0 }, done = false
      while (!done) {
        const slots = getSlots(y)
        if (slots.length === 0) { y += lineHeight; continue }
        let rendered = false
        for (const slot of slots) {
          const line = layoutNextLine(prepared, cursor, slot.right - slot.left)
          if (!line) { done = true; break }
          const el = document.createElement('span')
          el.textContent = line.text
          el.style.cssText = `position:absolute;font:${font};white-space:pre;left:${slot.left + pad}px;top:${y + pad}px;color:#333;`
          stage.appendChild(el)
          cursor = line.end; rendered = true
        }
        if (rendered) y += lineHeight
      }
      y += blockGap
    }

    // Render images
    imgData.forEach((img, i) => {
      if (img.resolvedY === null) return
      const imgEl = document.createElement('img')
      imgEl.src = resolveUrl(img.url, img.filename)
      imgEl.alt = img.alt
      imgEl.dataset.imageIndex = String(i)
      const clipPath = img.polygon && img.polygon.length >= 3
        ? `clip-path:polygon(${img.polygon.map((p: PolygonPoint) => `${p.x * 100}% ${p.y * 100}%`).join(', ')});`
        : ''
      imgEl.style.cssText = `position:absolute;left:${img.x + pad}px;top:${img.resolvedY + pad}px;width:${img.width}px;border:2px solid ${selectedImageIndex === i ? '#502581' : 'transparent'};border-radius:4px;cursor:grab;${clipPath}`

      // Resize handle
      const handle = document.createElement('div')
      handle.dataset.resizeHandle = String(i)
      handle.style.cssText = `position:absolute;width:16px;height:16px;background:#502581;cursor:nwse-resize;border-radius:2px;opacity:0.7;display:none;`
      const posHandle = () => {
        handle.style.left = `${img.x + img.width - 8 + pad}px`
        handle.style.top = `${img.resolvedY! + imgEl.offsetHeight - 8 + pad}px`
        handle.style.display = 'block'
      }
      imgEl.onload = posHandle
      if (imgEl.complete && imgEl.offsetHeight > 0) posHandle()

      stage.appendChild(imgEl)
      stage.appendChild(handle)

      // Anchor label
      const label = document.createElement('div')
      label.style.cssText = `position:absolute;left:${img.x + pad}px;top:${img.resolvedY! - 16 + pad}px;font-size:10px;color:#502581;font-weight:bold;pointer-events:none;`
      label.textContent = `⚓ "${img.anchorWord || '?'}"`
      stage.appendChild(label)

      // Polygon SVG overlay
      const poly = img.polygon || []
      const drawing = drawingPolygonIndex === i
      if (poly.length > 0 || drawing) {
        const drawPoly = () => {
          const h = imgEl.offsetHeight || img.width * (img.aspectRatio || 1.2)
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          svg.style.cssText = `position:absolute;left:${img.x + pad}px;top:${img.resolvedY! + pad}px;width:${img.width}px;height:${h}px;pointer-events:none;`
          svg.setAttribute('viewBox', '0 0 1 1')
          svg.setAttribute('preserveAspectRatio', 'none')
          if (poly.length >= 2) {
            const d = poly.map((p: PolygonPoint, j: number) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + (poly.length >= 3 && !drawing ? ' Z' : '')
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            path.setAttribute('d', d)
            path.setAttribute('fill', drawing ? 'rgba(80,37,129,0.1)' : 'rgba(80,37,129,0.15)')
            path.setAttribute('stroke', '#502581')
            path.setAttribute('stroke-width', '0.01')
            svg.appendChild(path)
          }
          poly.forEach((p: PolygonPoint) => {
            const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
            c.setAttribute('cx', String(p.x)); c.setAttribute('cy', String(p.y))
            c.setAttribute('r', '0.02'); c.setAttribute('fill', '#502581')
            svg.appendChild(c)
          })
          stage.appendChild(svg)
        }
        if (imgEl.complete && imgEl.offsetHeight > 0) drawPoly()
        else { const orig = imgEl.onload; imgEl.onload = (ev) => { if (orig) (orig as any).call(imgEl, ev); drawPoly() } }
      }
    })

    stage.style.height = (y + pad * 2) + 'px'
  }, [engine, blocks, layoutData.images, selectedImageIndex, drawingPolygonIndex, cfg])

  useEffect(() => {
    document.fonts.ready.then(() => renderPretext())
  }, [renderPretext])

  // Sync markdown text when entering write mode
  useEffect(() => {
    if (mode === 'write') {
      setMarkdownText(blocksToMarkdown(blocks))
    }
  }, [mode])

  // Handle markdown text changes
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setMarkdownText(text)
    if (onBlocksChange) {
      onBlocksChange(markdownToBlocks(text))
    }
  }, [onBlocksChange])

  // Mouse handlers for drag and resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement

    // Resize handle
    if (target.dataset.resizeHandle !== undefined) {
      const idx = parseInt(target.dataset.resizeHandle)
      resizeRef.current = { imageIndex: idx, startX: e.clientX, origWidth: layoutData.images[idx].width }
      e.preventDefault()
      return
    }

    // Image drag
    if (target.dataset.imageIndex !== undefined && drawingPolygonIndex === null) {
      const idx = parseInt(target.dataset.imageIndex)
      const imgEl = target as HTMLImageElement
      dragRef.current = {
        imageIndex: idx,
        startX: e.clientX,
        startY: e.clientY,
        origX: layoutData.images[idx].x,
        origImgY: parseFloat(imgEl.style.top) || 0,
        active: false,
      }
      setSelectedImageIndex(idx)
      e.preventDefault()
      return
    }
  }, [layoutData, drawingPolygonIndex])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragRef.current) {
      const drag = dragRef.current
      const layoutWidth = (containerRef.current?.offsetWidth || 700) - 40
      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY

      // Only start drag if moved more than 3px (prevent accidental drags)
      if (!drag.active && Math.abs(dx) + Math.abs(dy) < 3) return
      drag.active = true

      const newX = Math.max(0, Math.min(layoutWidth - 50, drag.origX + dx))
      const dropY = Math.max(0, drag.origImgY + dy - 20) // subtract pad for layout coords

      // Calculate anchor at current drop position
      const anchor = findAnchorAtY(dropY)
      const newImages = [...layoutData.images]
      newImages[drag.imageIndex] = {
        ...newImages[drag.imageIndex],
        x: newX,
        ...(anchor ? { anchorBlockIndex: anchor.blockIndex, anchorWordIndex: anchor.wordIndex, anchorWord: anchor.word } : {}),
      }
      onLayoutChange({ ...layoutData, images: newImages, editorWidth: layoutWidth })
    }

    if (resizeRef.current) {
      const r = resizeRef.current
      const dx = e.clientX - r.startX
      const layoutWidth = (containerRef.current?.offsetWidth || 700) - 40
      const newImages = [...layoutData.images]
      newImages[r.imageIndex] = { ...newImages[r.imageIndex], width: Math.max(50, r.origWidth + dx) }
      onLayoutChange({ ...layoutData, images: newImages, editorWidth: layoutWidth })
    }
  }, [layoutData, onLayoutChange, findAnchorAtY])

  const handleMouseUp = useCallback(() => {
    if (dragRef.current) {
      dragRef.current = null
    }
    if (resizeRef.current) {
      resizeRef.current = null
    }
  }, [])

  // Click handler for polygon drawing and image selection
  const handleStageClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement

    if (drawingPolygonIndex !== null) {
      const imgEl = stageRef.current?.querySelector(`img[data-image-index="${drawingPolygonIndex}"]`) as HTMLImageElement
      if (!imgEl) return
      const rect = imgEl.getBoundingClientRect()
      const rx = (e.clientX - rect.left) / rect.width
      const ry = (e.clientY - rect.top) / rect.height
      if (rx >= -0.15 && rx <= 1.15 && ry >= -0.15 && ry <= 1.15) {
        const newImages = [...layoutData.images]
        const poly = newImages[drawingPolygonIndex].polygon || []
        newImages[drawingPolygonIndex] = {
          ...newImages[drawingPolygonIndex],
          polygon: [...poly, { x: Math.max(0, Math.min(1, rx)), y: Math.max(0, Math.min(1, ry)) }],
        }
        onLayoutChange({ ...layoutData, images: newImages })
      }
      return
    }

    if (target.dataset.imageIndex !== undefined) {
      setSelectedImageIndex(parseInt(target.dataset.imageIndex))
    } else {
      setSelectedImageIndex(null)
    }
  }, [drawingPolygonIndex, layoutData, onLayoutChange])

  // Image actions
  const handleRemoveImage = (index: number) => {
    const newImages = layoutData.images.filter((_, i) => i !== index)
    onLayoutChange({ ...layoutData, images: newImages })
    setSelectedImageIndex(null)
  }

  const handleToggleFloat = (index: number) => {
    const layoutWidth = (containerRef.current?.offsetWidth || 700) - 40
    const newImages = [...layoutData.images]
    const img = newImages[index]
    const newFloat = img.float === 'right' ? 'left' : 'right'
    newImages[index] = { ...img, float: newFloat, x: newFloat === 'right' ? layoutWidth - img.width : 0 }
    onLayoutChange({ ...layoutData, images: newImages, editorWidth: layoutWidth })
  }

  // Floating menu position
  const getMenuPos = () => {
    if (selectedImageIndex === null || !stageRef.current) return null
    const imgEl = stageRef.current.querySelector(`img[data-image-index="${selectedImageIndex}"]`) as HTMLImageElement
    if (!imgEl) return null
    return {
      top: parseFloat(imgEl.style.top) - 32,
      left: parseFloat(imgEl.style.left) + parseFloat(imgEl.style.width) / 2 - 60,
    }
  }

  const menuPos = getMenuPos()
  const selImg = selectedImageIndex !== null ? layoutData.images[selectedImageIndex] : null

  const modes: { key: EditorMode; label: string; icon: React.ReactNode }[] = [
    { key: 'write', label: 'Write', icon: <Pen size={14} /> },
    { key: 'layout', label: 'Layout', icon: <LayoutGrid size={14} /> },
    { key: 'preview', label: 'Preview', icon: <Eye size={14} /> },
  ]

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: '#ede7f6', borderRadius: '6px 6px 0 0',
        padding: '4px 6px', gap: 2,
        borderBottom: '2px solid #502581',
      }}>
        {modes.map(m => (
          <button key={m.key} type="button" onClick={() => setMode(m.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 14px', fontSize: 13, cursor: 'pointer',
              background: mode === m.key ? '#502581' : 'transparent',
              color: mode === m.key ? 'white' : '#6a4c93',
              border: 'none', borderRadius: 4,
              fontWeight: mode === m.key ? 600 : 400,
              transition: 'background 0.15s, color 0.15s',
            }}>
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {drawingPolygonIndex !== null && (
        <div style={{ padding: '8px 12px', background: '#e67e22', color: 'white', fontSize: 14 }}>
          Click around the subject to draw polygon.{' '}
          <button type="button" onClick={() => setDrawingPolygonIndex(null)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '2px 8px', borderRadius: 3, cursor: 'pointer' }}>
            Done
          </button>
        </div>
      )}

      {/* Editor container */}
      <div ref={containerRef}
        style={{
          position: 'relative', background: 'white', border: '1px solid #ddd', borderRadius: '0 0 6px 6px',
          borderTop: 'none', overflow: 'hidden', minHeight: 300,
        }}
        onMouseDown={mode === 'layout' ? handleMouseDown : undefined}
        onClick={mode === 'layout' ? handleStageClick : undefined}
        onMouseMove={mode === 'layout' ? handleMouseMove : undefined}
        onMouseUp={mode === 'layout' ? handleMouseUp : undefined}
        onMouseLeave={mode === 'layout' ? handleMouseUp : undefined}>

        {/* Write mode: markdown textarea */}
        {mode === 'write' && (
          <textarea
            autoFocus
            value={markdownText}
            onChange={handleTextChange}
            placeholder="Write your content here...&#10;&#10;Use ## for headings&#10;&#10;Separate paragraphs with blank lines"
            style={{
              width: '100%',
              minHeight: 400,
              padding: 20,
              border: 'none',
              outline: 'none',
              fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
              fontSize: 14,
              lineHeight: '1.7',
              color: '#333',
              resize: 'vertical',
              caretColor: '#502581',
              boxSizing: 'border-box',
            }}
          />
        )}

        {/* Layout mode: pretext rendering + images */}
        {mode === 'layout' && (
          <div
            ref={stageRef}
            style={{ position: 'relative' }}
          />
        )}

        {/* Preview mode: read-only renderer */}
        {mode === 'preview' && (
          <div style={{ padding: 20 }}>
            <Renderer blocks={blocks} layout={layoutData} config={config} resolveImageUrl={resolveImageUrl} />
          </div>
        )}

        {/* Floating image menu */}
        {mode === 'layout' && selectedImageIndex !== null && menuPos && selImg && (
          <div style={{
            position: 'absolute', top: menuPos.top, left: menuPos.left,
            display: 'flex', gap: 2, padding: '4px 6px',
            background: '#333', borderRadius: 4, zIndex: 150,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            {[
              { label: selImg.float === 'right' ? '→' : '←', title: 'Toggle float', fn: () => handleToggleFloat(selectedImageIndex) },
              { label: selImg.polygon?.length ? `◇${selImg.polygon.length}` : '◇', title: 'Polygon', fn: () => {
                if (drawingPolygonIndex === selectedImageIndex) setDrawingPolygonIndex(null)
                else setDrawingPolygonIndex(selectedImageIndex)
              }},
              ...(drawingPolygonIndex === selectedImageIndex && selImg.polygon?.length ? [{
                label: 'Reset', title: 'Reset polygon', fn: () => {
                  const ni = [...layoutData.images]; ni[selectedImageIndex] = { ...ni[selectedImageIndex], polygon: [] }
                  onLayoutChange({ ...layoutData, images: ni })
                }
              }] : []),
              { label: '×', title: 'Remove', fn: () => handleRemoveImage(selectedImageIndex) },
            ].map((btn, i) => (
              <button key={i} type="button" title={btn.title}
                onClick={(e) => { e.stopPropagation(); btn.fn() }}
                style={{ padding: '3px 8px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: 13, borderRadius: 2 }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent' }}>
                {btn.label}
              </button>
            ))}
          </div>
        )}

        {blocks.length === 0 && mode !== 'write' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', pointerEvents: 'none' }}>
            Click to start typing
          </div>
        )}
      </div>
    </div>
  )
}
