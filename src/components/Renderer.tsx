import type { Block, FontOption, LayoutData, LayoutConfig } from '../types'
import LayoutView from './LayoutView'

interface RendererProps {
  blocks: Block[]
  layout: LayoutData
  config?: LayoutConfig
  availableFonts?: FontOption[]
  resolveImageUrl?: (url: string, filename: string) => string
  className?: string
  style?: React.CSSProperties
}

export default function Renderer(props: RendererProps) {
  return <LayoutView {...props} />
}
