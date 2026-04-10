import { marked } from 'marked'
import type { Block, TextSegment } from '../types'

// Convert marked inline tokens to TextSegments
function inlineTokensToSegments(tokens: any[], inherited: Partial<TextSegment> = {}): TextSegment[] {
  const segments: TextSegment[] = []
  for (const token of tokens) {
    switch (token.type) {
      case 'text':
        segments.push({ text: token.text, ...inherited })
        break
      case 'strong':
        segments.push(...inlineTokensToSegments((token as any).tokens || [], { ...inherited, bold: true }))
        break
      case 'em':
        segments.push(...inlineTokensToSegments((token as any).tokens || [], { ...inherited, italic: true }))
        break
      case 'codespan':
        segments.push({ text: (token as any).text, ...inherited, code: true })
        break
      case 'link':
        segments.push(...inlineTokensToSegments((token as any).tokens || [], { ...inherited, link: (token as any).href }))
        break
      case 'del':
        segments.push(...inlineTokensToSegments((token as any).tokens || [], { ...inherited, strikethrough: true }))
        break
      case 'br':
        segments.push({ text: '\n', ...inherited })
        break
      case 'escape':
        segments.push({ text: (token as any).text, ...inherited })
        break
      default:
        // Fallback: use raw text if available
        if ('text' in token) {
          segments.push({ text: (token as any).text, ...inherited })
        }
    }
  }
  return segments
}

// Extract plain text from segments
function segmentsToText(segments: TextSegment[]): string {
  return segments.map(s => s.text).join('')
}

// Convert a list of marked tokens to blocks
function tokensToBlocks(tokens: any[]): Block[] {
  const blocks: Block[] = []

  for (const token of tokens) {
    switch (token.type) {
      case 'heading': {
        const segments = inlineTokensToSegments((token as any).tokens || [])
        blocks.push({
          type: 'heading',
          text: segmentsToText(segments),
          segments,
          tag: `h${(token as any).depth || 2}`,
        })
        break
      }
      case 'paragraph': {
        const segments = inlineTokensToSegments((token as any).tokens || [])
        blocks.push({
          type: 'paragraph',
          text: segmentsToText(segments),
          segments,
        })
        break
      }
      case 'list': {
        const listToken = token as any
        const items: Block[] = listToken.items.map((item: any) => {
          // List item can contain paragraphs, nested lists, etc.
          // For simplicity, flatten to text with segments
          const innerBlocks = tokensToBlocks(item.tokens || [])
          if (innerBlocks.length === 1) {
            return { ...innerBlocks[0], type: 'paragraph' as const }
          }
          // Multiple blocks in a list item — join with newlines
          const allSegments = innerBlocks.flatMap(b => b.segments || [{ text: b.text }])
          return {
            type: 'paragraph' as const,
            text: innerBlocks.map(b => b.text).join(' '),
            segments: allSegments,
          }
        })
        blocks.push({
          type: 'list',
          text: items.map(i => i.text).join('\n'),
          tag: listToken.ordered ? 'ol' : 'ul',
          items,
        })
        break
      }
      case 'blockquote': {
        const innerBlocks = tokensToBlocks((token as any).tokens || [])
        const allSegments = innerBlocks.flatMap(b => b.segments || [{ text: b.text }])
        blocks.push({
          type: 'blockquote',
          text: innerBlocks.map(b => b.text).join(' '),
          segments: allSegments,
        })
        break
      }
      case 'code': {
        blocks.push({
          type: 'code',
          text: (token as any).text,
          language: (token as any).lang || undefined,
        })
        break
      }
      case 'hr': {
        blocks.push({ type: 'hr', text: '' })
        break
      }
      case 'space': {
        // Ignore whitespace tokens
        break
      }
      default: {
        // Fallback: treat as paragraph
        if ('text' in token && (token as any).text) {
          blocks.push({
            type: 'paragraph',
            text: (token as any).text,
          })
        }
      }
    }
  }

  return blocks
}

// Parse markdown string to blocks
export function parseMarkdown(md: string): Block[] {
  const tokens = marked.lexer(md)
  return tokensToBlocks(tokens)
}

// Convert blocks back to markdown
export function blocksToMarkdown(blocks: Block[]): string {
  return blocks.map(b => {
    switch (b.type) {
      case 'heading': {
        const level = b.tag === 'h1' ? '#' : b.tag === 'h3' ? '###' : '##'
        return `${level} ${segmentsToMarkdown(b.segments) || b.text}`
      }
      case 'paragraph':
        return segmentsToMarkdown(b.segments) || b.text
      case 'list': {
        const prefix = b.tag === 'ol' ? (i: number) => `${i + 1}. ` : () => '- '
        return (b.items || []).map((item, i) =>
          `${prefix(i)}${segmentsToMarkdown(item.segments) || item.text}`
        ).join('\n')
      }
      case 'blockquote':
        return `> ${segmentsToMarkdown(b.segments) || b.text}`
      case 'code':
        return `\`\`\`${b.language || ''}\n${b.text}\n\`\`\``
      case 'hr':
        return '---'
      default:
        return b.text
    }
  }).join('\n\n')
}

// Convert segments to inline markdown
function segmentsToMarkdown(segments?: TextSegment[]): string {
  if (!segments) return ''
  return segments.map(s => {
    let text = s.text
    if (s.code) text = `\`${text}\``
    if (s.bold && s.italic) text = `***${text}***`
    else if (s.bold) text = `**${text}**`
    else if (s.italic) text = `*${text}*`
    if (s.strikethrough) text = `~~${text}~~`
    if (s.link) text = `[${text}](${s.link})`
    return text
  }).join('')
}
