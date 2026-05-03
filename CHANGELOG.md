# Changelog

## 0.1.6

- **Fix: image drag/resize no longer rescales the layout** — when dragging or resizing an image, mouse delta is now converted from screen pixel-space to `editorWidth` coordinate-space. Previously each drag overwrote `editorWidth` with the current container width, which made all other (non-dragged) images appear to shrink on the first interaction.
- **Demo**: live demo at <https://pretext-editor.asbjornenge.com>. Build via `npm run demo:build`; container build via `Dockerfile.demo`.

## 0.1.5

- **Selectable text in renderer mode** — text spans are now click/select-pass-through only in editor mode; the `Renderer` component allows native text selection
- **Per-breakpoint font state stored in `layoutData`** — `bodyFontCSS`, `bodyLineHeight`, and `headingLineHeight` are resolved by the Editor and stored on both top-level layout and each breakpoint, so renderers can reproduce layouts exactly without needing to know about the original `availableFonts`

## 0.1.4

- **Portable layout rendering** — `bodyFontCSS` and `initialCapFontCSS` are written into `layoutData` on change so a downstream `Renderer` can reproduce the editor's layout without needing access to the same `availableFonts` lookup

## 0.1.3

- **Fix**: `addImage` (via `EditorRef`) read stale state from a closure; now reads current `layoutData` and `editingBreakpoint` directly

## 0.1.2

- **`EditorRef` with `addImage(image)` method** — programmatically add an image to the active breakpoint via `useRef`

## 0.1.1

- **`defaultMode` config option** — open the editor in `'write'` or `'layout'` mode

## 0.1.0 (2026-04-13)

Initial release.

### Features

- **Editor component** with Write (markdown) and Layout (visual) modes
- **Renderer component** for display-only rendering
- **Unified LayoutView** — Editor and Renderer share the same rendering engine
- **Markdown support** via `marked` parser
  - Headings (h1/h2/h3), paragraphs, bold, italic, strikethrough
  - Links, inline code, lists (ordered/unordered), blockquotes
  - Code blocks with language annotation, horizontal rules
- **Free image placement** with drag-and-drop
- **Polygon text wrapping** — define custom shapes for text to flow around
  - Visual polygon editor with vertex dragging
  - Dashed outline in edit mode, clip-path in preview
  - Faded image backdrop for visibility while editing
- **Multi-column layouts** (1-3 columns)
  - Column-by-column text streaming
  - Images can span multiple columns
  - Balanced column heights with image displacement estimation
- **Responsive breakpoints**
  - Per-breakpoint image positions, columns, fonts, and sizes
  - Constrained viewport editing for each breakpoint
  - Cascade fallback (breakpoint -> default)
- **Font selection** with configurable font options
  - Per-level heading sizes (h1: 2x, h2: 1.5x, h3: 1.25x)
  - Per-breakpoint font family and size
- **Initial/drop caps**
  - Custom decorative fonts (e.g. Floral Capitals)
  - Adjustable size and x/y offset
  - Text flows under drop cap when shorter than paragraph
  - Font preloading for consistent measurements
- **Smart Write mode**
  - Auto-resizing textarea
  - JetBrains Mono editor font (bundled)
  - Keyboard shortcuts (Cmd+B/I/K, Tab indent, smart lists)
  - Wrap-selection with markdown characters
  - Native undo/redo preservation
- **Preview toggle** — hide editor chrome without separate panel
- **Image scaling** — sqrt scaling for gentler downsizing at smaller breakpoints
- **Dynamic content height** — layout grows with content and images
