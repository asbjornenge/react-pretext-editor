import { describe, it, expect } from 'vitest'
import { parseMarkdown, blocksToMarkdown } from './markdown'

describe('parseMarkdown', () => {
  it('parses a single paragraph', () => {
    const blocks = parseMarkdown('Hello world')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].type).toBe('paragraph')
    expect(blocks[0].text).toBe('Hello world')
  })

  it('parses an h1 heading', () => {
    const blocks = parseMarkdown('# Title')
    expect(blocks[0]).toMatchObject({ type: 'heading', tag: 'h1', text: 'Title' })
  })

  it('parses h2 and h3 headings', () => {
    const blocks = parseMarkdown('## Two\n\n### Three')
    expect(blocks[0].tag).toBe('h2')
    expect(blocks[1].tag).toBe('h3')
  })

  it('preserves bold and italic as segment metadata', () => {
    const blocks = parseMarkdown('A **bold** and *italic* line')
    const segs = blocks[0].segments!
    expect(segs.find(s => s.bold)?.text).toBe('bold')
    expect(segs.find(s => s.italic)?.text).toBe('italic')
  })

  it('keeps plain text intact when joined from segments', () => {
    const blocks = parseMarkdown('Plain **bold** mid *italic* end')
    expect(blocks[0].text).toBe('Plain bold mid italic end')
  })

  it('parses [[N]](url) footnote-style links with bracket-preserving text', () => {
    const blocks = parseMarkdown('Ref.[[1]](https://example.com) more text')
    const segs = blocks[0].segments!
    const linkSeg = segs.find(s => s.link)
    expect(linkSeg?.text).toBe('[1]')
    expect(linkSeg?.link).toBe('https://example.com')
    // joined text retains the surrounding punctuation
    expect(blocks[0].text).toBe('Ref.[1] more text')
  })

  it('parses two adjacent footnote links without losing chars', () => {
    const blocks = parseMarkdown('End.[[1]](https://a.com)[[2]](https://b.com) next')
    const links = blocks[0].segments!.filter(s => s.link)
    expect(links.map(s => s.text)).toEqual(['[1]', '[2]'])
    expect(blocks[0].text).toBe('End.[1][2] next')
  })

  it('parses a regular link with multi-word text', () => {
    const blocks = parseMarkdown('See [the docs](https://docs.example.com) here')
    const linkSeg = blocks[0].segments!.find(s => s.link)
    expect(linkSeg?.text).toBe('the docs')
    expect(blocks[0].text).toBe('See the docs here')
  })

  it('collapses soft line breaks within a paragraph to single spaces', () => {
    const blocks = parseMarkdown('first line\nsecond line\nthird line')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].text).toBe('first line second line third line')
    // No literal newlines should leak into segments — they break the renderer
    // because it uses `whiteSpace: pre`.
    for (const seg of blocks[0].segments || []) {
      expect(seg.text).not.toContain('\n')
    }
  })

  it('collapses soft line breaks inside emphasis spans', () => {
    const md = 'pre *Tea & Coffee\nTrade Journal* post'
    const blocks = parseMarkdown(md)
    const italic = blocks[0].segments!.find(s => s.italic)
    expect(italic?.text).toBe('Tea & Coffee Trade Journal')
    expect(blocks[0].text).toBe('pre Tea & Coffee Trade Journal post')
  })

  it('collapses soft line breaks across links and adjacent text', () => {
    const md = 'See\n[the docs](https://x.com)\nhere'
    const blocks = parseMarkdown(md)
    expect(blocks[0].text).toBe('See the docs here')
    for (const seg of blocks[0].segments || []) {
      expect(seg.text).not.toContain('\n')
    }
  })

  it('parses a paragraph with mixed inline formatting', () => {
    const md = 'Plain, **bold**, *italic*, `code`, ~~struck~~, [link](https://x.com).'
    const blocks = parseMarkdown(md)
    const segs = blocks[0].segments!
    expect(segs.find(s => s.bold)?.text).toBe('bold')
    expect(segs.find(s => s.italic)?.text).toBe('italic')
    expect(segs.find(s => s.code)?.text).toBe('code')
    expect(segs.find(s => s.strikethrough)?.text).toBe('struck')
    expect(segs.find(s => s.link)?.text).toBe('link')
  })

  it('parses unordered and ordered lists', () => {
    const ul = parseMarkdown('- one\n- two\n- three')
    expect(ul[0]).toMatchObject({ type: 'list', tag: 'ul' })
    expect(ul[0].items?.map(i => i.text)).toEqual(['one', 'two', 'three'])

    const ol = parseMarkdown('1. one\n2. two')
    expect(ol[0]).toMatchObject({ type: 'list', tag: 'ol' })
  })

  it('parses blockquote', () => {
    const blocks = parseMarkdown('> quoted')
    expect(blocks[0].type).toBe('blockquote')
    expect(blocks[0].text).toBe('quoted')
  })

  it('parses fenced code block with language', () => {
    const blocks = parseMarkdown('```js\nconsole.log("x")\n```')
    expect(blocks[0]).toMatchObject({ type: 'code', language: 'js' })
    expect(blocks[0].text).toBe('console.log("x")')
  })

  it('parses horizontal rule', () => {
    const blocks = parseMarkdown('---')
    expect(blocks[0].type).toBe('hr')
  })

  it('handles Norwegian characters', () => {
    const blocks = parseMarkdown('Spesialkaffe — bøllefrø, æøå')
    expect(blocks[0].text).toBe('Spesialkaffe — bøllefrø, æøå')
  })
})

describe('blocksToMarkdown', () => {
  it('round-trips a simple paragraph', () => {
    const md = 'Hello world'
    expect(blocksToMarkdown(parseMarkdown(md))).toBe(md)
  })

  it('round-trips bold and italic', () => {
    const md = 'A **bold** and *italic* line'
    expect(blocksToMarkdown(parseMarkdown(md))).toBe(md)
  })

  it('round-trips headings at every level', () => {
    expect(blocksToMarkdown(parseMarkdown('# H1'))).toBe('# H1')
    expect(blocksToMarkdown(parseMarkdown('## H2'))).toBe('## H2')
    expect(blocksToMarkdown(parseMarkdown('### H3'))).toBe('### H3')
  })

  it('round-trips a paragraph with a link', () => {
    const md = 'See [the docs](https://docs.example.com) here'
    expect(blocksToMarkdown(parseMarkdown(md))).toBe(md)
  })
})
