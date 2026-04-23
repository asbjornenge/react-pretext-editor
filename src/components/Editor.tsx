import '@fontsource/jetbrains-mono'
import React, { useEffect, useState, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import { Pen, LayoutGrid, Eye, Columns2, Plus, X, ALargeSmall } from 'lucide-react'
import LayoutView from './LayoutView'
import { parseMarkdown, blocksToMarkdown } from '../engine/markdown'
import type { Block, FontOption, InitialCapOption, LayoutData, LayoutImage, LayoutBreakpoint, LayoutConfig } from '../types'

type EditorMode = 'write' | 'layout'

interface EditorProps {
  blocks: Block[]
  layout: LayoutData
  onLayoutChange: (layout: LayoutData) => void
  onBlocksChange?: (blocks: Block[]) => void
  resolveImageUrl?: (url: string, filename: string) => string
  config?: LayoutConfig
  availableFonts?: FontOption[]
  availableInitialFonts?: InitialCapOption[]
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

export interface EditorRef {
  addImage: (image: LayoutImage) => void
}

export default forwardRef<EditorRef, EditorProps>(function Editor({
  blocks,
  layout,
  onLayoutChange,
  onBlocksChange,
  resolveImageUrl,
  config,
  availableFonts,
  availableInitialFonts,
  height,
  expandable,
  width,
}: EditorProps, ref: React.Ref<EditorRef>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const layoutPanelRef = useRef<HTMLDivElement>(null)
  const layoutViewRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [markdownText, setMarkdownText] = useState(() => blocksToMarkdown(blocks))

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [drawingPolygonIndex, setDrawingPolygonIndex] = useState<number | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [editingBreakpoint, setEditingBreakpoint] = useState<number>(-1) // -1 = default, else index into breakpoints
  const [activeModes, setActiveModes] = useState<Set<EditorMode>>(new Set([config?.defaultMode as EditorMode || 'layout']))

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
      setActiveModes(new Set([m]))
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

  const layoutData: LayoutData = layout || { images: [] }

  // Wrap onLayoutChange to inject resolved CSS font strings
  const emitLayoutChange = useCallback((newLayout: LayoutData) => {
    // Resolve body font CSS
    const font = availableFonts?.find(f => f.name === newLayout.fontFamily)
    const family = font
      ? font.bodyFont.replace(/^\d+px\s*/, '')
      : DEFAULT_CONFIG.bodyFont.replace(/^\d+px\s*/, '')
    const size = newLayout.fontSize || 16
    const bodyFontCSS = `${size}px ${family}`

    // Resolve initial cap font CSS
    const icFont = availableInitialFonts?.find(f => f.name === newLayout.initialCapFont)
    const icFamily = icFont?.fontFamily || 'serif'
    const icSize = newLayout.initialCapSize || 96
    const initialCapFontCSS = newLayout.initialCap ? `${icSize}px ${icFamily}` : undefined

    onLayoutChange({ ...newLayout, bodyFontCSS, initialCapFontCSS })
  }, [onLayoutChange, availableFonts, availableInitialFonts])

  // Resolve font from active breakpoint's fontFamily + fontSize → availableFonts → config → defaults
  // (activeFontFamily/activeFontSize are defined below, but we need cfg first — use layoutData directly here,
  // then override per-breakpoint in the LayoutView via its own resolution)
  const selectedFont = availableFonts?.find(f => f.name === layoutData.fontFamily)
  const baseFontFamily = selectedFont
    ? selectedFont.bodyFont.replace(/^\d+px\s*/, '')
    : DEFAULT_CONFIG.bodyFont.replace(/^\d+px\s*/, '')
  const baseSize = layoutData.fontSize || 16
  const fontConfig: Partial<LayoutConfig> = {
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
  const cfg = { ...DEFAULT_CONFIG, ...config, ...fontConfig }

  // Helpers to read/write the currently editing breakpoint's data
  const activeBp = editingBreakpoint === -1 ? null : layoutData.breakpoints?.[editingBreakpoint]
  const activeImages: LayoutImage[] = activeBp?.images || layoutData.images
  const activeColumns = activeBp?.columns ?? layoutData.columns
  const activeFontFamily = activeBp?.fontFamily ?? layoutData.fontFamily
  const activeFontSize = activeBp?.fontSize ?? layoutData.fontSize
  const activeInitialCap = activeBp?.initialCap ?? layoutData.initialCap ?? false
  const activeInitialCapFont = activeBp?.initialCapFont ?? layoutData.initialCapFont
  const activeInitialCapSize = activeBp?.initialCapSize ?? layoutData.initialCapSize
  const activeInitialCapOffsetX = activeBp?.initialCapOffsetX ?? layoutData.initialCapOffsetX ?? 0
  const activeInitialCapOffsetY = activeBp?.initialCapOffsetY ?? layoutData.initialCapOffsetY ?? 0

  // Update images for the active breakpoint
  const updateActiveImages = (newImages: LayoutImage[], extraLayout?: Partial<LayoutData>) => {
    if (editingBreakpoint === -1) {
      emitLayoutChange({ ...layoutData, images: newImages, ...extraLayout })
    } else {
      const newBps = [...(layoutData.breakpoints || [])]
      newBps[editingBreakpoint] = { ...newBps[editingBreakpoint], images: newImages }
      emitLayoutChange({ ...layoutData, breakpoints: newBps })
    }
  }

  const updateActiveColumns = (n: number) => {
    if (editingBreakpoint === -1) {
      emitLayoutChange({ ...layoutData, columns: n })
    } else {
      const newBps = [...(layoutData.breakpoints || [])]
      newBps[editingBreakpoint] = { ...newBps[editingBreakpoint], columns: n }
      emitLayoutChange({ ...layoutData, breakpoints: newBps })
    }
  }

  // Imperative API for external callers
  useImperativeHandle(ref, () => ({
    addImage: (image: LayoutImage) => {
      // Read current state directly to avoid stale closures
      const bp = editingBreakpoint === -1 ? null : layoutData.breakpoints?.[editingBreakpoint]
      const imgs = bp?.images || layoutData.images
      if (editingBreakpoint === -1) {
        emitLayoutChange({ ...layoutData, images: [...imgs, image] })
      } else {
        const newBps = [...(layoutData.breakpoints || [])]
        newBps[editingBreakpoint] = { ...newBps[editingBreakpoint], images: [...imgs, image] }
        emitLayoutChange({ ...layoutData, breakpoints: newBps })
      }
    },
  }), [layoutData, editingBreakpoint, emitLayoutChange])

  // Add a new breakpoint (clones current default)
  const addBreakpoint = (maxWidth: number, name: string) => {
    const newBp: LayoutBreakpoint = {
      maxWidth,
      name,
      images: activeImages.map(img => ({ ...img })),
      columns: activeColumns,
      editorWidth: maxWidth,
      fontFamily: activeFontFamily,
      fontSize: activeFontSize,
      initialCap: activeInitialCap,
      initialCapFont: activeInitialCapFont,
      initialCapSize: activeInitialCapSize,
      initialCapOffsetX: activeInitialCapOffsetX,
      initialCapOffsetY: activeInitialCapOffsetY,
    }
    const newBps = [...(layoutData.breakpoints || []), newBp]
    emitLayoutChange({ ...layoutData, breakpoints: newBps })
    setEditingBreakpoint(newBps.length - 1)
  }

  const removeBreakpoint = (idx: number) => {
    const newBps = (layoutData.breakpoints || []).filter((_, i) => i !== idx)
    emitLayoutChange({ ...layoutData, breakpoints: newBps })
    if (editingBreakpoint === idx) setEditingBreakpoint(-1)
    else if (editingBreakpoint > idx) setEditingBreakpoint(editingBreakpoint - 1)
  }

  const resolveUrl = (url: string, filename: string) => {
    if (resolveImageUrl) return resolveImageUrl(url, filename)
    return url
  }

  // Sync markdown text from blocks only on initial mount (when blocks prop changes externally)
  const blocksInitRef = useRef(true)
  useEffect(() => {
    if (blocksInitRef.current) {
      blocksInitRef.current = false
      return
    }
    // Only sync if blocks changed externally (not from our own editing)
  }, [blocks])

  // Handle markdown text changes
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setMarkdownText(text)
    if (onBlocksChange) {
      onBlocksChange(parseMarkdown(text))
    }
  }, [onBlocksChange])

  // Auto-resize textarea to fit content
  const autoResizeTextarea = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = ta.scrollHeight + 'px'
  }, [])

  useEffect(() => {
    autoResizeTextarea()
  }, [markdownText, activeModes])

  // Helper: update textarea via execCommand to preserve undo/redo stack
  const replaceTextareaRange = useCallback((replaceStart: number, replaceEnd: number, replacement: string, cursorStart?: number, cursorEnd?: number) => {
    const ta = textareaRef.current
    if (!ta) return
    ta.focus()
    ta.selectionStart = replaceStart
    ta.selectionEnd = replaceEnd
    // insertText preserves the native undo stack
    document.execCommand('insertText', false, replacement)
    if (cursorStart !== undefined) {
      ta.selectionStart = cursorStart
      ta.selectionEnd = cursorEnd ?? cursorStart
    }
  }, [])

  // Markdown keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget
    const { selectionStart: start, selectionEnd: end, value } = ta
    const hasSelection = start !== end
    const selectedText = value.slice(start, end)

    // Helper: wrap selection with markers (preserves undo)
    const wrapSelection = (before: string, after: string) => {
      e.preventDefault()
      const replacement = before + selectedText + after
      replaceTextareaRange(start, end, replacement, start + before.length, end + before.length)
    }

    // Cmd/Ctrl+B → bold
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      wrapSelection('**', '**')
      return
    }
    // Cmd/Ctrl+I → italic
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      wrapSelection('*', '*')
      return
    }
    // Cmd/Ctrl+K → link
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      const linkText = hasSelection ? selectedText : 'link text'
      const replacement = `[${linkText}](url)`
      const urlStart = start + linkText.length + 3
      replaceTextareaRange(start, end, replacement, urlStart, urlStart + 3)
      return
    }

    // Wrap selection with typed character
    if (hasSelection && ['*', '`', '~'].includes(e.key)) {
      e.preventDefault()
      if (e.key === '~') {
        wrapSelection('~~', '~~')
      } else {
        wrapSelection(e.key, e.key)
      }
      return
    }

    // Tab / Shift+Tab for list indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const lineEnd = value.indexOf('\n', start)
      const lineEndPos = lineEnd === -1 ? value.length : lineEnd

      if (e.shiftKey) {
        // Unindent: remove 2 spaces from start of line
        if (value.slice(lineStart, lineStart + 2) === '  ') {
          replaceTextareaRange(lineStart, lineStart + 2, '', Math.max(lineStart, start - 2))
        }
      } else {
        // Indent: add 2 spaces at start of line
        replaceTextareaRange(lineStart, lineStart, '  ', start + 2)
      }
      return
    }

    // Enter: smart list continuation
    if (e.key === 'Enter') {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const currentLine = value.slice(lineStart, start)

      const listMatch = currentLine.match(/^(\s*)([-*]|\d+\.)\s(.*)/)
      if (listMatch) {
        const [, indent, bullet, content] = listMatch

        // Empty list item → break out of list
        if (content.trim() === '') {
          e.preventDefault()
          replaceTextareaRange(lineStart, start, '\n', lineStart + 1)
          return
        }

        // Continue list
        e.preventDefault()
        const nextBullet = bullet.match(/^\d+\./) ? `${parseInt(bullet) + 1}.` : bullet
        const continuation = `\n${indent}${nextBullet} `
        replaceTextareaRange(start, end, continuation, start + continuation.length)
        return
      }
    }
  }, [replaceTextareaRange])

  // Helper: find image element in LayoutView by index
  const findImageEl = (index: number): HTMLImageElement | null => {
    return layoutViewRef.current?.querySelector(`img[data-image-index="${index}"]`) as HTMLImageElement | null
  }

  // Background mouse down — polygon vertex drag proximity check
  const handleBackgroundMouseDown = useCallback((e: React.MouseEvent) => {
    // Polygon vertex drag — check proximity to existing vertices
    if (drawingPolygonIndex !== null) {
      const imgEl = findImageEl(drawingPolygonIndex)
      if (imgEl) {
        const rect = imgEl.getBoundingClientRect()
        const rx = (e.clientX - rect.left) / rect.width
        const ry = (e.clientY - rect.top) / rect.height
        const poly = activeImages[drawingPolygonIndex].polygon || []
        const threshold = 0.04
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
        }
      }
    }
  }, [layoutData, drawingPolygonIndex])

  // Called from LayoutView when an image is mousedowned
  const handleImageMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    if (drawingPolygonIndex !== null) return // ignore in polygon mode
    const imgEl = e.currentTarget as HTMLImageElement
    dragRef.current = {
      imageIndex: index,
      startX: e.clientX,
      startY: e.clientY,
      origX: activeImages[index].x,
      origImgY: parseFloat(imgEl.style.top) || activeImages[index].y,
      active: false,
    }
    setSelectedImageIndex(index)
    e.preventDefault()
    e.stopPropagation()
  }, [activeImages, drawingPolygonIndex])

  // Called from LayoutView when a resize handle is mousedowned
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    resizeRef.current = { imageIndex: index, startX: e.clientX, origWidth: activeImages[index].width }
    e.preventDefault()
    e.stopPropagation()
  }, [activeImages])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragRef.current) {
      const drag = dragRef.current
      const layoutWidth = layoutViewRef.current?.offsetWidth || 700
      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY

      if (!drag.active && Math.abs(dx) + Math.abs(dy) < 3) return
      drag.active = true

      const newX = drag.origX + dx
      const newY = Math.max(0, drag.origImgY + dy)

      const newImages = [...activeImages]
      newImages[drag.imageIndex] = {
        ...newImages[drag.imageIndex],
        x: newX,
        y: newY,
      }
      updateActiveImages(newImages, { editorWidth: layoutWidth })
    }

    if (resizeRef.current) {
      const r = resizeRef.current
      const dx = e.clientX - r.startX
      const layoutWidth = layoutViewRef.current?.offsetWidth || 700
      const newImages = [...activeImages]
      newImages[r.imageIndex] = { ...newImages[r.imageIndex], width: Math.max(50, r.origWidth + dx) }
      updateActiveImages(newImages, { editorWidth: layoutWidth })
    }

    if (polyDragRef.current) {
      const pd = polyDragRef.current
      const dx = e.clientX - pd.startX
      const dy = e.clientY - pd.startY
      if (!pd.active && Math.abs(dx) + Math.abs(dy) < 5) return
      pd.active = true
      const rx = Math.max(0, Math.min(1, (e.clientX - pd.imgRect.left) / pd.imgRect.width))
      const ry = Math.max(0, Math.min(1, (e.clientY - pd.imgRect.top) / pd.imgRect.height))
      const newImages = [...activeImages]
      const poly = [...(newImages[pd.imageIndex].polygon || [])]
      poly[pd.pointIndex] = { x: rx, y: ry }
      newImages[pd.imageIndex] = { ...newImages[pd.imageIndex], polygon: poly }
      updateActiveImages(newImages)
    }
  }, [layoutData, emitLayoutChange, activeImages, editingBreakpoint])

  const handleMouseUp = useCallback(() => {
    if (dragRef.current) dragRef.current = null
    if (resizeRef.current) resizeRef.current = null
    if (polyDragRef.current) polyDragRef.current = null
  }, [])

  // Click handler for polygon drawing and image selection
  const handleStageClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement

    if (drawingPolygonIndex !== null) {
      if (polyDragUsedRef.current) {
        polyDragUsedRef.current = false
        return
      }
      const imgEl = findImageEl(drawingPolygonIndex)
      if (!imgEl) return
      const rect = imgEl.getBoundingClientRect()
      const rx = (e.clientX - rect.left) / rect.width
      const ry = (e.clientY - rect.top) / rect.height
      if (rx >= -0.1 && rx <= 1.1 && ry >= -0.1 && ry <= 1.1) {
        const newImages = [...activeImages]
        const poly = newImages[drawingPolygonIndex].polygon || []
        newImages[drawingPolygonIndex] = {
          ...newImages[drawingPolygonIndex],
          polygon: [...poly, { x: Math.max(0, Math.min(1, rx)), y: Math.max(0, Math.min(1, ry)) }],
        }
        updateActiveImages(newImages)
      }
      return
    }

    if (target.dataset.imageIndex !== undefined) {
      setSelectedImageIndex(parseInt(target.dataset.imageIndex))
    } else {
      setSelectedImageIndex(null)
    }
  }, [drawingPolygonIndex, layoutData, emitLayoutChange])

  // Image actions
  const handleRemoveImage = (index: number) => {
    const newImages = activeImages.filter((_, i) => i !== index)
    updateActiveImages(newImages)
    setSelectedImageIndex(null)
  }

  const handleToggleFloat = (index: number) => {
    const layoutWidth = (layoutPanelRef.current?.offsetWidth || 700) - 40
    const newImages = [...activeImages]
    const img = newImages[index]
    const isRight = img.x > layoutWidth / 2
    newImages[index] = { ...img, x: isRight ? 0 : layoutWidth - img.width }
    updateActiveImages(newImages, { editorWidth: layoutWidth })
  }

  // Floating menu position — uses getBoundingClientRect for accurate positioning
  const getMenuPos = () => {
    if (selectedImageIndex === null || !layoutPanelRef.current) return null
    const imgEl = findImageEl(selectedImageIndex)
    if (!imgEl) return null
    const imgRect = imgEl.getBoundingClientRect()
    const panelRect = layoutPanelRef.current.getBoundingClientRect()
    return {
      top: imgRect.top - panelRect.top + layoutPanelRef.current.scrollTop - 37,
      left: imgRect.left - panelRect.left + layoutPanelRef.current.scrollLeft + imgRect.width / 2,
    }
  }

  const menuPos = getMenuPos()
  const selImg = selectedImageIndex !== null ? activeImages[selectedImageIndex] : null

  const modes: { key: EditorMode; label: string; icon: React.ReactNode }[] = [
    { key: 'write', label: 'Write', icon: <Pen size={14} /> },
    { key: 'layout', label: 'Layout', icon: <LayoutGrid size={14} /> },
  ]

  return (
    <div style={{
      marginBottom: 20,
      width: expandable
        ? `calc(${typeof width === 'number' ? width + 'px' : width || '100%'} * ${activeModes.size})`
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
        {/* Right-side controls */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Font selector */}
          {availableFonts && availableFonts.length > 0 && (
            <select
              value={activeFontFamily || ''}
              onChange={(e) => {
                const val = e.target.value || undefined
                if (editingBreakpoint === -1) {
                  emitLayoutChange({ ...layoutData, fontFamily: val })
                } else {
                  const newBps = [...(layoutData.breakpoints || [])]
                  newBps[editingBreakpoint] = { ...newBps[editingBreakpoint], fontFamily: val }
                  emitLayoutChange({ ...layoutData, breakpoints: newBps })
                }
              }}
              style={{
                padding: '3px 6px', fontSize: 12, cursor: 'pointer',
                background: 'transparent', color: '#6a4c93',
                border: '1px solid #d4c5e8', borderRadius: 3,
                outline: 'none',
              }}
            >
              <option value="">Default</option>
              {availableFonts.map(f => (
                <option key={f.name} value={f.name}>{f.name}</option>
              ))}
            </select>
          )}
          {/* Font size selector */}
          <select
            value={activeFontSize || 16}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              if (editingBreakpoint === -1) {
                emitLayoutChange({ ...layoutData, fontSize: val })
              } else {
                const newBps = [...(layoutData.breakpoints || [])]
                newBps[editingBreakpoint] = { ...newBps[editingBreakpoint], fontSize: val }
                emitLayoutChange({ ...layoutData, breakpoints: newBps })
              }
            }}
            style={{
              padding: '3px 6px', fontSize: 12, cursor: 'pointer',
              background: 'transparent', color: '#6a4c93',
              border: '1px solid #d4c5e8', borderRadius: 3,
              outline: 'none',
              width: 52,
            }}
          >
            {[12, 14, 16, 18, 20, 22, 24].map(s => (
              <option key={s} value={s}>{s}px</option>
            ))}
          </select>
          {/* Initial cap controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button type="button" title="Initial cap"
              onClick={() => {
                const val = !activeInitialCap
                if (editingBreakpoint === -1) {
                  emitLayoutChange({ ...layoutData, initialCap: val })
                } else {
                  const newBps = [...(layoutData.breakpoints || [])]
                  newBps[editingBreakpoint] = { ...newBps[editingBreakpoint], initialCap: val }
                  emitLayoutChange({ ...layoutData, breakpoints: newBps })
                }
              }}
              style={{
                padding: '3px 6px', fontSize: 12, cursor: 'pointer',
                background: activeInitialCap ? '#502581' : 'transparent',
                color: activeInitialCap ? 'white' : '#6a4c93',
                border: '1px solid #d4c5e8', borderRadius: 3,
                fontWeight: activeInitialCap ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
              <ALargeSmall size={14} />
            </button>
            {activeInitialCap && availableInitialFonts && availableInitialFonts.length > 0 && (
              <select
                value={activeInitialCapFont || ''}
                onChange={(e) => {
                  const val = e.target.value || undefined
                  if (editingBreakpoint === -1) {
                    emitLayoutChange({ ...layoutData, initialCapFont: val })
                  } else {
                    const newBps = [...(layoutData.breakpoints || [])]
                    newBps[editingBreakpoint] = { ...newBps[editingBreakpoint], initialCapFont: val }
                    emitLayoutChange({ ...layoutData, breakpoints: newBps })
                  }
                }}
                style={{
                  padding: '3px 4px', fontSize: 11, cursor: 'pointer',
                  background: 'transparent', color: '#6a4c93',
                  border: '1px solid #d4c5e8', borderRadius: 3,
                  outline: 'none',
                }}
              >
                <option value="">Default</option>
                {availableInitialFonts.map(f => (
                  <option key={f.name} value={f.name}>{f.name}</option>
                ))}
              </select>
            )}
            {activeInitialCap && (
              <select
                value={activeInitialCapSize || 96}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (editingBreakpoint === -1) {
                    emitLayoutChange({ ...layoutData, initialCapSize: val })
                  } else {
                    const newBps = [...(layoutData.breakpoints || [])]
                    newBps[editingBreakpoint] = { ...newBps[editingBreakpoint], initialCapSize: val }
                    emitLayoutChange({ ...layoutData, breakpoints: newBps })
                  }
                }}
                style={{
                  padding: '3px 4px', fontSize: 11, cursor: 'pointer',
                  background: 'transparent', color: '#6a4c93',
                  border: '1px solid #d4c5e8', borderRadius: 3,
                  outline: 'none',
                  width: 52,
                }}
              >
                {[48, 64, 80, 96, 112, 128].map(s => (
                  <option key={s} value={s}>{s}px</option>
                ))}
              </select>
            )}
            {activeInitialCap && (
              <>
                <label style={{ fontSize: 10, color: '#6a4c93' }}>x</label>
                <input type="number" value={activeInitialCapOffsetX}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    if (editingBreakpoint === -1) {
                      emitLayoutChange({ ...layoutData, initialCapOffsetX: val })
                    } else {
                      const newBps = [...(layoutData.breakpoints || [])]
                      newBps[editingBreakpoint] = { ...newBps[editingBreakpoint], initialCapOffsetX: val }
                      emitLayoutChange({ ...layoutData, breakpoints: newBps })
                    }
                  }}
                  style={{ width: 44, padding: '2px 4px', fontSize: 11, border: '1px solid #d4c5e8', borderRadius: 3, color: '#6a4c93', background: 'transparent', outline: 'none', textAlign: 'center' }}
                />
                <label style={{ fontSize: 10, color: '#6a4c93' }}>y</label>
                <input type="number" value={activeInitialCapOffsetY}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    if (editingBreakpoint === -1) {
                      emitLayoutChange({ ...layoutData, initialCapOffsetY: val })
                    } else {
                      const newBps = [...(layoutData.breakpoints || [])]
                      newBps[editingBreakpoint] = { ...newBps[editingBreakpoint], initialCapOffsetY: val }
                      emitLayoutChange({ ...layoutData, breakpoints: newBps })
                    }
                  }}
                  style={{ width: 44, padding: '2px 4px', fontSize: 11, border: '1px solid #d4c5e8', borderRadius: 3, color: '#6a4c93', background: 'transparent', outline: 'none', textAlign: 'center' }}
                />
              </>
            )}
          </div>
          {/* Column controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Columns2 size={14} color="#6a4c93" />
            {[1, 2, 3].map(n => (
              <button key={n} type="button" onClick={() => updateActiveColumns(n)}
                style={{
                  padding: '3px 8px', fontSize: 12, cursor: 'pointer',
                  background: (activeColumns || 1) === n ? '#502581' : 'transparent',
                  color: (activeColumns || 1) === n ? 'white' : '#6a4c93',
                  border: 'none', borderRadius: 3,
                  fontWeight: (activeColumns || 1) === n ? 600 : 400,
                }}>
                {n}
              </button>
            ))}
          </div>
          {/* Preview toggle */}
          <button type="button" title="Preview mode (hide editor chrome)"
            onClick={() => setPreviewMode(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', fontSize: 12, cursor: 'pointer',
              background: previewMode ? '#502581' : 'transparent',
              color: previewMode ? 'white' : '#6a4c93',
              border: 'none', borderRadius: 3,
              fontWeight: previewMode ? 600 : 400,
            }}>
            <Eye size={14} />
            Preview
          </button>
        </div>
      </div>

      {/* Editor container */}
      <div ref={containerRef}
        style={{
          display: 'flex', background: 'white', border: '1px solid #ddd', borderRadius: '0 0 6px 6px',
          borderTop: 'none', minHeight: height || 300,
        }}>

        {/* Write panel */}
        {activeModes.has('write') && (
          <div style={{ flex: 1, overflow: 'auto', borderRight: activeModes.size > 1 ? '1px solid #ddd' : 'none' }}>
            <textarea
              ref={textareaRef}
              autoFocus
              value={markdownText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Write your content here...&#10;&#10;Use ## for headings&#10;&#10;Separate paragraphs with blank lines"
              spellCheck={false}
              style={{
                width: '100%',
                minHeight: 200,
                padding: '24px 32px',
                border: 'none',
                outline: 'none',
                fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, monospace",
                fontSize: 18,
                lineHeight: '1.75',
                letterSpacing: '0.01em',
                color: '#2c2c2c',
                resize: 'none',
                caretColor: '#502581',
                boxSizing: 'border-box',
                overflow: 'hidden',
                tabSize: 2,
              }}
            />
          </div>
        )}

        {/* Layout panel */}
        {activeModes.has('layout') && (
          <div ref={layoutPanelRef} style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
            {/* Breakpoint tabs */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 10px',
              background: '#f5f0fa', borderBottom: '1px solid #ddd',
              fontSize: 11,
            }}>
              <button type="button"
                onClick={() => setEditingBreakpoint(-1)}
                style={{
                  padding: '3px 10px', cursor: 'pointer', fontSize: 11,
                  background: editingBreakpoint === -1 ? '#502581' : 'transparent',
                  color: editingBreakpoint === -1 ? 'white' : '#6a4c93',
                  border: '1px solid #d4c5e8', borderRadius: 3,
                  fontWeight: editingBreakpoint === -1 ? 600 : 400,
                }}>
                Default
              </button>
              {(layoutData.breakpoints || []).map((bp, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                  <button type="button"
                    onClick={() => setEditingBreakpoint(idx)}
                    style={{
                      padding: '3px 10px', cursor: 'pointer', fontSize: 11,
                      background: editingBreakpoint === idx ? '#502581' : 'transparent',
                      color: editingBreakpoint === idx ? 'white' : '#6a4c93',
                      border: '1px solid #d4c5e8', borderRadius: '3px 0 0 3px',
                      borderRight: 'none',
                      fontWeight: editingBreakpoint === idx ? 600 : 400,
                    }}>
                    {bp.name || `≤${bp.maxWidth}px`}
                  </button>
                  <button type="button"
                    title="Remove breakpoint"
                    onClick={(e) => { e.stopPropagation(); removeBreakpoint(idx) }}
                    style={{
                      padding: '3px 5px', cursor: 'pointer', fontSize: 11,
                      background: editingBreakpoint === idx ? '#502581' : 'transparent',
                      color: editingBreakpoint === idx ? 'white' : '#6a4c93',
                      border: '1px solid #d4c5e8', borderRadius: '0 3px 3px 0',
                      display: 'flex', alignItems: 'center',
                    }}>
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button type="button" title="Add breakpoint"
                onClick={() => {
                  // Quick options: Mobile (375), Tablet (768), or custom
                  const choice = window.prompt('Add breakpoint — enter max width in px (e.g. 375 for mobile, 768 for tablet):', '768')
                  if (!choice) return
                  const w = parseInt(choice)
                  if (isNaN(w) || w < 200) return
                  const name = w <= 480 ? 'Mobile' : w <= 1024 ? 'Tablet' : `≤${w}px`
                  addBreakpoint(w, name)
                }}
                style={{
                  padding: '3px 6px', cursor: 'pointer',
                  background: 'transparent', color: '#6a4c93',
                  border: '1px dashed #6a4c93', borderRadius: 3,
                  display: 'flex', alignItems: 'center',
                }}>
                <Plus size={12} />
              </button>
            </div>

            {/* Layout viewport — constrained to breakpoint width when editing one */}
            <div style={{
              padding: 20,
              display: 'flex',
              justifyContent: 'center',
            }}>
              <div style={{
                width: editingBreakpoint === -1 ? '100%' : (layoutData.breakpoints?.[editingBreakpoint]?.maxWidth || '100%'),
                maxWidth: '100%',
              }}>
            <LayoutView
              containerRef={layoutViewRef}
              blocks={blocks}
              layout={editingBreakpoint === -1 ? { ...layoutData, breakpoints: undefined } : { images: activeImages, columns: activeColumns, editorWidth: layoutData.breakpoints?.[editingBreakpoint]?.editorWidth, fontFamily: activeFontFamily, fontSize: activeFontSize, initialCap: activeInitialCap, initialCapFont: activeInitialCapFont, initialCapSize: activeInitialCapSize, initialCapOffsetX: activeInitialCapOffsetX, initialCapOffsetY: activeInitialCapOffsetY }}
              config={config}
              availableFonts={availableFonts}
              availableInitialFonts={availableInitialFonts}
              resolveImageUrl={resolveImageUrl}
              editorMode={previewMode ? undefined : {
                selectedImageIndex,
                drawingPolygonIndex,
                onImageMouseDown: handleImageMouseDown,
                onResizeMouseDown: handleResizeMouseDown,
                onBackgroundMouseDown: handleBackgroundMouseDown,
                onBackgroundClick: handleStageClick,
                onMouseMove: handleMouseMove,
                onMouseUp: handleMouseUp,
                onMouseLeave: handleMouseUp,
              }}
            />
              </div>
            </div>

            {/* Floating image menu */}
            {!previewMode && selectedImageIndex !== null && menuPos && selImg && (
          <div style={{
            position: 'absolute', top: menuPos.top, left: menuPos.left,
            transform: 'translateX(-50%)',
            display: 'flex', gap: 2, padding: '4px 6px',
            background: '#333', borderRadius: 4, zIndex: 150,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            {[
              { label: selImg.polygon?.length ? `◇${selImg.polygon.length}` : '◇', title: 'Polygon', active: drawingPolygonIndex === selectedImageIndex, fn: () => {
                if (drawingPolygonIndex === selectedImageIndex) setDrawingPolygonIndex(null)
                else setDrawingPolygonIndex(selectedImageIndex)
              }},
              ...(drawingPolygonIndex === selectedImageIndex && selImg.polygon?.length ? [{
                label: 'Reset', title: 'Reset polygon', fn: () => {
                  const ni = [...activeImages]; ni[selectedImageIndex] = { ...ni[selectedImageIndex], polygon: [] }
                  updateActiveImages(ni)
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

      </div>
    </div>
  )
})
