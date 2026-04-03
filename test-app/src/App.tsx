import { useState } from 'react'
import { Editor } from '../../src'
import type { Block, LayoutData } from '../../src/types'
import { exampleBlocks, exampleLayout, exampleMedia } from './example-data'

export default function App() {
  const [blocks, setBlocks] = useState<Block[]>(exampleBlocks)
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
        width={1000}
        height={1000}
        expandable
      />
    </div>
  )
}
