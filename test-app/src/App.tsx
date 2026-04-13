import { useState } from 'react'
import { Editor, parseMarkdown } from '../../src'
import type { Block, FontOption, InitialCapOption, LayoutData } from '../../src/types'
import { exampleMarkdown, exampleLayout } from './example-data'

const fonts: FontOption[] = [
  { name: 'Lato', bodyFont: '16px Lato, sans-serif', bodyLineHeight: 26 },
  { name: 'Georgia', bodyFont: '16px Georgia, serif', bodyLineHeight: 28 },
  { name: 'System', bodyFont: '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', bodyLineHeight: 26 },
  { name: 'Mono', bodyFont: '14px "SF Mono", "Fira Code", Consolas, monospace', bodyLineHeight: 22 },
]

const initialFonts: InitialCapOption[] = [
  { name: 'Floral Capitals', fontFamily: 'FloralCapitals, serif' },
]

export default function App() {
  const [blocks, setBlocks] = useState<Block[]>(() => parseMarkdown(exampleMarkdown))
  const [layout, setLayout] = useState<LayoutData>(exampleLayout)

  return (
    <div style={{ fontFamily: 'Lato, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
      <h1 style={{ marginBottom: 20, fontSize: 24, color: '#333' }}>
        react-pretext-editor
      </h1>
      <Editor
        blocks={blocks}
        layout={layout}
        onLayoutChange={setLayout}
        onBlocksChange={setBlocks}
        availableFonts={fonts}
        availableInitialFonts={initialFonts}
        width={1000}
        expandable
      />
    </div>
  )
}
