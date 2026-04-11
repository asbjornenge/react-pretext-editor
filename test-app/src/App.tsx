import { useState } from 'react'
import { Editor, parseMarkdown } from '../../src'
import type { Block, FontOption, LayoutData } from '../../src/types'
import { exampleMarkdown, exampleLayout, exampleMedia } from './example-data'

const fonts: FontOption[] = [
  { name: 'Lato', bodyFont: '16px Lato, sans-serif', bodyLineHeight: 26 },
  { name: 'Georgia', bodyFont: '16px Georgia, serif', bodyLineHeight: 28 },
  { name: 'System', bodyFont: '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', bodyLineHeight: 26 },
  { name: 'Mono', bodyFont: '14px "SF Mono", "Fira Code", Consolas, monospace', bodyLineHeight: 22 },
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
        images={exampleMedia}
        availableFonts={fonts}
        width={1000}
        expandable
      />
    </div>
  )
}
