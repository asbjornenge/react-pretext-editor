import { useState } from 'react'
import { Editor, Renderer } from '../../src'
import type { Block, LayoutData } from '../../src/types'
import { exampleBlocks, exampleLayout, exampleMedia } from './example-data'

export default function App() {
  const [blocks, setBlocks] = useState<Block[]>(exampleBlocks)
  const [layout, setLayout] = useState<LayoutData>(exampleLayout)
  const [rendererWidth, setRendererWidth] = useState(100)

  return (
    <div style={{ fontFamily: 'Lato, sans-serif', maxWidth: 1400, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 20, fontSize: 24, color: '#333' }}>
        react-pretext-editor
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: 18, marginBottom: 10, color: '#502581' }}>Editor</h2>
          <Editor
            blocks={blocks}
            layout={layout}
            onLayoutChange={setLayout}
            onBlocksChange={setBlocks}
            images={exampleMedia}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <h2 style={{ fontSize: 18, color: '#502581', margin: 0 }}>Renderer</h2>
            <input
              type="range"
              min={30}
              max={100}
              value={rendererWidth}
              onChange={(e) => setRendererWidth(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 12, color: '#888', minWidth: 40 }}>{rendererWidth}%</span>
          </div>
          <div style={{
            border: '1px solid #ddd',
            borderRadius: 4,
            padding: 20,
            background: 'white',
            width: `${rendererWidth}%`,
          }}>
            <Renderer
              blocks={blocks}
              layout={layout}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
