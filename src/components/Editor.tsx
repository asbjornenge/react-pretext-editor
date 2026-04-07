import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Pen, LayoutGrid, Eye, Smartphone, Columns2 } from 'lucide-react'
import { usePretextEngine } from '../engine/pretext-loader'
import { countWordsInText } from '../engine/layout'
import Renderer from './Renderer'
import type { Block, LayoutData, LayoutImage, LayoutConfig, PolygonPoint } from '../types'

type EditorMode = 'write' | 'layout' | 'preview' | 'mobile'

interface EditorProps {
  blocks: Block[]
  layout: LayoutData
  onLayoutChange: (layout: LayoutData) => void
  onBlocksChange?: (blocks: Block[]) => void
  resolveImageUrl?: (url: string, filename: string) => string
  config?: LayoutConfig
  height?: number | string
  expandable?: boolean
  width?: number | string
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
  height,
  expandable,
  width,
}: EditorProps) {
  const engine = usePretextEngine()
  const stageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const layoutPanelRef = useRef<HTMLDivElement>(null)
  const [markdownText, setMarkdownText] = useState(() => blocksToMarkdown(blocks))

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [drawingPolygonIndex, setDrawingPolygonIndex] = useState<number | null>(null)
  const [activeModes, setActiveModes] = useState<Set<EditorMode>>(new Set(['layout']))
  const [mobileWidth, setMobileWidth] = useState(375)
  const mobileResizeRef = useRef<{ startX: number; startWidth: number } | null>(null)

  const toggleMode = (m: EditorMode, shift: boolean) => {
    if (shift) {
      setActiveModes(prev => {
        const next = new Set(prev)
        if (next.has(m)) {
          if (next.size > 1) next.delete(m)
        } else {
          next.add(m)
        }
        return next
      })
    } else {
      // For mobile, toggle it alongside current modes
      if (m === 'mobile') {
        setActiveModes(prev => {
          const next = new Set(prev)
          if (next.has('mobile')) {
            next.delete('mobile')
          } else {
            next.add('mobile')
          }
          return next
        })
      } else {
        setActiveModes(new Set([m]))
      }
    }
  }

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

  const polyDragRef = useRef<{
    imageIndex: number
    pointIndex: number
    imgRect: DOMRect
    startX: number
    startY: number
    active: boolean
  } | null>(null)
  const polyDragUsedRef = useRef(false)

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
    const containerWidth = (layoutPanelRef.current?.offsetWidth || 700) - 40
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
    const rawWidth = layoutPanelRef.current?.offsetWidth || 700
    const pad = 20
    const fullContainerWidth = rawWidth - pad * 2
    const { bodyFont, headingFont, bodyLineHeight, headingLineHeight, blockGap, imgPadding } = cfg
    const images = layoutData.images || []

    // Column setup
    const columnGap = 20
    const numColumns = Math.max(1, Math.min(layoutData.columns || 1, Math.floor(fullContainerWidth / 300)))
    const containerWidth = numColumns > 1
      ? (fullContainerWidth - (numColumns - 1) * columnGap) / numColumns
      : fullContainerWidth

    stage.innerHTML = ''

    const imgData = images.map((img) => ({
      ...img,
      resolvedY: (img.y !== undefined ? img.y : null) as number | null,
    }))

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
          if (img.anchorBlockIndex === bi && img.anchorWordIndex !== undefined && img.anchorWordIndex >= pw && img.anchorWordIndex < cw)
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
      const imgCursor = drawingPolygonIndex === i ? 'crosshair' : 'grab'
      imgEl.style.cssText = `position:absolute;left:${img.x + pad}px;top:${img.resolvedY + pad}px;width:${img.width}px;border:2px solid ${selectedImageIndex === i ? '#502581' : 'transparent'};border-radius:4px;cursor:${imgCursor};`

      // Resize handle
      const handle = document.createElement('div')
      handle.dataset.resizeHandle = String(i)
      handle.style.cssText = `position:absolute;width:8px;height:8px;background:#502581;cursor:nwse-resize;border-radius:1px;opacity:0.7;display:none;`
      const posHandle = () => {
        handle.style.left = `${img.x + img.width - 4 + pad}px`
        handle.style.top = `${img.resolvedY! + imgEl.offsetHeight - 4 + pad}px`
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

      // Polygon SVG overlay — always show if polygon exists
      const poly = img.polygon || []
      const drawing = drawingPolygonIndex === i
      if (poly.length > 0 || drawing) {
        const drawPoly = () => {
          const h = imgEl.offsetHeight || img.width * (img.aspectRatio || 1.2)
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          svg.style.cssText = `position:absolute;left:${img.x + pad}px;top:${img.resolvedY! + pad}px;width:${img.width}px;height:${h}px;pointer-events:none;`
          svg.setAttribute('viewBox', '0 0 1 1')
          svg.setAttribute('preserveAspectRatio', 'none')
          // Draw polygon path
          if (poly.length >= 2) {
            const d = poly.map((p: PolygonPoint, j: number) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + (poly.length >= 3 ? ' Z' : '')
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            path.setAttribute('d', d)
            path.setAttribute('fill', 'rgba(80,37,129,0.1)')
            path.setAttribute('stroke', '#502581')
            path.setAttribute('stroke-width', '0.008')
            path.setAttribute('stroke-dasharray', '0.02 0.015')
            svg.appendChild(path)
          }
          // Vertex handles — purely visual, interaction handled by React event handlers
          poly.forEach((p: PolygonPoint, pi: number) => {
            const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
            c.setAttribute('cx', String(p.x)); c.setAttribute('cy', String(p.y))
            c.setAttribute('r', drawing ? '0.025' : '0.015')
            c.setAttribute('fill', drawing ? '#502581' : 'rgba(80,37,129,0.5)')
            svg.appendChild(c)
          })
          stage.appendChild(svg)
        }
        if (imgEl.complete && imgEl.offsetHeight > 0) drawPoly()
        else { const orig = imgEl.onload; imgEl.onload = (ev) => { if (orig) (orig as any).call(imgEl, ev); drawPoly() } }
      }
    })

    // Redistribute elements into columns
    if (numColumns > 1) {
      const columnHeight = Math.ceil(y / numColumns)
      const children = Array.from(stage.children) as HTMLElement[]
      for (const child of children) {
        const elY = parseFloat(child.style.top) - pad
        const col = Math.min(Math.floor(elY / columnHeight), numColumns - 1)
        if (col > 0) {
          const colOffset = col * (containerWidth + columnGap)
          const newY = elY - col * columnHeight
          child.style.left = (parseFloat(child.style.left) - pad + colOffset + pad) + 'px'
          child.style.top = (newY + pad) + 'px'
        }
      }
      stage.style.height = (columnHeight + pad * 2) + 'px'
    } else {
      stage.style.height = (y + pad * 2) + 'px'
    }
  }, [engine, blocks, layoutData.images, layoutData.columns, selectedImageIndex, drawingPolygonIndex, cfg])

  useEffect(() => {
    document.fonts.ready.then(() => renderPretext())
  }, [renderPretext])

  // Re-render layout when the layout panel resizes (e.g. after mode toggle transition)
  useEffect(() => {
    const el = layoutPanelRef.current
    if (!el) return
    const ro = new ResizeObserver(() => renderPretext())
    ro.observe(el)
    return () => ro.disconnect()
  }, [renderPretext])

  // Sync markdown text when entering write mode
  useEffect(() => {
    if (activeModes.has('write')) {
      setMarkdownText(blocksToMarkdown(blocks))
    }
  }, [activeModes])

  // Mobile preview resize handlers
  const handleMobileResizeDown = useCallback((e: React.MouseEvent) => {
    mobileResizeRef.current = { startX: e.clientX, startWidth: mobileWidth }
    e.preventDefault()

    const handleMove = (ev: MouseEvent) => {
      if (!mobileResizeRef.current) return
      const dx = ev.clientX - mobileResizeRef.current.startX
      setMobileWidth(Math.max(200, Math.min(800, mobileResizeRef.current.startWidth + dx)))
    }
    const handleUp = () => {
      mobileResizeRef.current = null
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
  }, [mobileWidth])

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
    const target = e.target as any

    // Polygon vertex drag — check proximity to existing vertices
    if (drawingPolygonIndex !== null) {
      const imgEl = stageRef.current?.querySelector(`img[data-image-index="${drawingPolygonIndex}"]`) as HTMLImageElement
      if (imgEl) {
        const rect = imgEl.getBoundingClientRect()
        const rx = (e.clientX - rect.left) / rect.width
        const ry = (e.clientY - rect.top) / rect.height
        const poly = layoutData.images[drawingPolygonIndex].polygon || []
        const threshold = 0.04 // ~4% of image dimension
        let closestIdx = -1
        let closestDist = Infinity
        for (let pi = 0; pi < poly.length; pi++) {
          const dx = rx - poly[pi].x
          const dy = ry - poly[pi].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < threshold && dist < closestDist) {
            closestDist = dist
            closestIdx = pi
          }
        }
        if (closestIdx >= 0) {
          polyDragRef.current = { imageIndex: drawingPolygonIndex, pointIndex: closestIdx, imgRect: rect, startX: e.clientX, startY: e.clientY, active: false }
          polyDragUsedRef.current = true
          e.preventDefault()
          return
        }
      }
    }

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
      const layoutWidth = (layoutPanelRef.current?.offsetWidth || 700) - 40
      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY

      // Only start drag if moved more than 3px (prevent accidental drags)
      if (!drag.active && Math.abs(dx) + Math.abs(dy) < 3) return
      drag.active = true

      // Free positioning — allow dragging outside bounds (to an extent)
      const newX = drag.origX + dx
      const newY = Math.max(0, drag.origImgY + dy - 20) // subtract pad for layout coords

      const newImages = [...layoutData.images]
      // Drop anchor when dragging freely, use absolute y
      const { anchorBlockIndex: _a, anchorWordIndex: _b, anchorWord: _c, ...rest } = newImages[drag.imageIndex]
      newImages[drag.imageIndex] = {
        ...rest,
        x: newX,
        y: newY,
      }
      onLayoutChange({ ...layoutData, images: newImages, editorWidth: layoutWidth })
    }

    if (resizeRef.current) {
      const r = resizeRef.current
      const dx = e.clientX - r.startX
      const layoutWidth = (layoutPanelRef.current?.offsetWidth || 700) - 40
      const newImages = [...layoutData.images]
      newImages[r.imageIndex] = { ...newImages[r.imageIndex], width: Math.max(50, r.origWidth + dx) }
      onLayoutChange({ ...layoutData, images: newImages, editorWidth: layoutWidth })
    }

    if (polyDragRef.current) {
      const pd = polyDragRef.current
      const dx = e.clientX - pd.startX
      const dy = e.clientY - pd.startY
      // Require 5px movement before starting drag (prevent accidental moves on click)
      if (!pd.active && Math.abs(dx) + Math.abs(dy) < 5) return
      pd.active = true
      const rx = Math.max(0, Math.min(1, (e.clientX - pd.imgRect.left) / pd.imgRect.width))
      const ry = Math.max(0, Math.min(1, (e.clientY - pd.imgRect.top) / pd.imgRect.height))
      const newImages = [...layoutData.images]
      const poly = [...(newImages[pd.imageIndex].polygon || [])]
      poly[pd.pointIndex] = { x: rx, y: ry }
      newImages[pd.imageIndex] = { ...newImages[pd.imageIndex], polygon: poly }
      onLayoutChange({ ...layoutData, images: newImages })
    }
  }, [layoutData, onLayoutChange, findAnchorAtY])

  const handleMouseUp = useCallback(() => {
    if (dragRef.current) dragRef.current = null
    if (resizeRef.current) resizeRef.current = null
    if (polyDragRef.current) polyDragRef.current = null
  }, [])

  // Click handler for polygon drawing and image selection
  const handleStageClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement

    if (drawingPolygonIndex !== null) {
      // Don't add point if we just dragged a vertex
      if (polyDragUsedRef.current) {
        polyDragUsedRef.current = false
        return
      }
      // Calculate click position relative to the image being edited
      const imgEl = stageRef.current?.querySelector(`img[data-image-index="${drawingPolygonIndex}"]`) as HTMLImageElement
      if (!imgEl) return
      const rect = imgEl.getBoundingClientRect()
      const rx = (e.clientX - rect.left) / rect.width
      const ry = (e.clientY - rect.top) / rect.height
      // Only add point if click is near the image
      if (rx >= -0.1 && rx <= 1.1 && ry >= -0.1 && ry <= 1.1) {
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
    const layoutWidth = (layoutPanelRef.current?.offsetWidth || 700) - 40
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
    { key: 'mobile', label: activeModes.has('mobile') ? `${mobileWidth}px` : '', icon: <Smartphone size={14} /> },
  ]

  return (
    <div style={{
      marginBottom: 20,
      width: expandable
        ? `calc(${typeof width === 'number' ? width + 'px' : width || '100%'} * ${activeModes.has('mobile') ? activeModes.size - 1 : activeModes.size}${activeModes.has('mobile') ? ` + ${mobileWidth + 42}px` : ''})`
        : width,
      transition: 'width 0.2s ease',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: '#ede7f6', borderRadius: '6px 6px 0 0',
        padding: '4px 6px', gap: 2,
        borderBottom: '2px solid #502581',
      }}>
        {modes.map(m => (
          <button key={m.key} type="button" onClick={(e) => toggleMode(m.key, e.shiftKey)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 14px', fontSize: 13, cursor: 'pointer',
              background: activeModes.has(m.key) ? '#502581' : 'transparent',
              color: activeModes.has(m.key) ? 'white' : '#6a4c93',
              border: 'none', borderRadius: 4,
              fontWeight: activeModes.has(m.key) ? 600 : 400,
              transition: 'background 0.15s, color 0.15s',
            }}>
            {m.icon}
            {m.label}
          </button>
        ))}
        {/* Column controls */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Columns2 size={14} color="#6a4c93" />
          {[1, 2, 3].map(n => (
            <button key={n} type="button" onClick={() => onLayoutChange({ ...layoutData, columns: n })}
              style={{
                padding: '3px 8px', fontSize: 12, cursor: 'pointer',
                background: (layoutData.columns || 1) === n ? '#502581' : 'transparent',
                color: (layoutData.columns || 1) === n ? 'white' : '#6a4c93',
                border: 'none', borderRadius: 3,
                fontWeight: (layoutData.columns || 1) === n ? 600 : 400,
              }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Editor container */}
      <div ref={containerRef}
        style={{
          display: 'flex', background: 'white', border: '1px solid #ddd', borderRadius: '0 0 6px 6px',
          borderTop: 'none', minHeight: height || 300, height: height, overflow: 'hidden',
        }}>

        {/* Write panel */}
        {activeModes.has('write') && (
          <div style={{ flex: 1, overflow: 'auto', borderRight: activeModes.size > 1 ? '1px solid #ddd' : 'none' }}>
            <textarea
              autoFocus
              value={markdownText}
              onChange={handleTextChange}
              placeholder="Write your content here...&#10;&#10;Use ## for headings&#10;&#10;Separate paragraphs with blank lines"
              style={{
                width: '100%',
                height: '100%',
                minHeight: height || 400,
                padding: 20,
                border: 'none',
                outline: 'none',
                fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                fontSize: 14,
                lineHeight: '1.7',
                color: '#333',
                resize: 'none',
                caretColor: '#502581',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* Layout panel */}
        {activeModes.has('layout') && (
          <div ref={layoutPanelRef} style={{ flex: 1, overflow: 'auto', position: 'relative', borderRight: activeModes.has('preview') ? '1px solid #ddd' : 'none' }}
            onMouseDown={handleMouseDown}
            onClick={handleStageClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}>
            <div
              ref={stageRef}
              style={{ position: 'relative' }}
            />

            {/* Floating image menu */}
            {selectedImageIndex !== null && menuPos && selImg && (
          <div style={{
            position: 'absolute', top: menuPos.top, left: menuPos.left,
            display: 'flex', gap: 2, padding: '4px 6px',
            background: '#333', borderRadius: 4, zIndex: 150,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            {[
              { label: selImg.float === 'right' ? '→' : '←', title: 'Toggle float', fn: () => handleToggleFloat(selectedImageIndex) },
              { label: selImg.polygon?.length ? `◇${selImg.polygon.length}` : '◇', title: 'Polygon', active: drawingPolygonIndex === selectedImageIndex, fn: () => {
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
            ].map((btn: any, i) => (
              <button key={i} type="button" title={btn.title}
                onClick={(e) => { e.stopPropagation(); btn.fn() }}
                style={{
                  padding: '3px 8px', border: 'none', cursor: 'pointer', fontSize: 13, borderRadius: 2,
                  background: btn.active ? '#e67e22' : 'transparent',
                  color: 'white',
                  fontWeight: btn.active ? 600 : 400,
                  boxShadow: btn.active ? '0 0 6px rgba(230,126,34,0.5)' : 'none',
                }}
                onMouseEnter={(e) => { if (!btn.active) (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={(e) => { if (!btn.active) (e.target as HTMLElement).style.background = 'transparent' }}>
                {btn.label}
              </button>
            ))}
          </div>
        )}

          </div>
        )}

        {/* Preview panel */}
        {activeModes.has('preview') && (
          <div style={{ flex: 1, overflow: 'auto', padding: 20, borderRight: activeModes.has('mobile') ? '1px solid #ddd' : 'none' }}>
            <Renderer blocks={blocks} layout={layoutData} config={config} resolveImageUrl={resolveImageUrl} />
          </div>
        )}

        {/* Mobile preview panel */}
        {activeModes.has('mobile') && (
          <div style={{
            width: mobileWidth + 42,
            minWidth: 242,
            maxWidth: 842,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 20px 0 20px',
            background: '#f5f5f5',
            position: 'relative',
            flexShrink: 0,
          }}>
            <div style={{
              width: mobileWidth,
              background: 'white',
              borderRadius: 8,
              border: '1px solid #ddd',
              overflow: 'auto',
              flex: 1,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}>
              <div style={{ padding: 12 }}>
                <Renderer blocks={blocks} layout={layoutData} config={config} resolveImageUrl={resolveImageUrl} />
              </div>
            </div>
            {/* Resize handle */}
            <div
              onMouseDown={handleMobileResizeDown}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 20,
                height: 20,
                cursor: 'nwse-resize',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#aaa',
                fontSize: 10,
                userSelect: 'none',
              }}
            >
              ◢
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
