import { describe, it, expect } from 'vitest'
import { getSlots, getBlockedInterval, prepareImageData } from './layout'
import type { LayoutImage } from '../types'

const img = (overrides: Partial<LayoutImage> = {}): LayoutImage => ({
  filename: 'test.jpg',
  alt: '',
  url: '',
  aspectRatio: 1,
  x: 0,
  y: 0,
  width: 100,
  ...overrides,
})

describe('getBlockedInterval', () => {
  it('returns null when y is above the image', () => {
    const data = prepareImageData([img({ x: 100, y: 200, width: 100 })], 1)
    expect(getBlockedInterval(data[0], 100, 10)).toBeNull()
  })

  it('returns null when y is below the image', () => {
    const data = prepareImageData([img({ x: 100, y: 200, width: 100, aspectRatio: 1 })], 1)
    // image bottom = 200 + 100 = 300; 311 is past padding
    expect(getBlockedInterval(data[0], 320, 10)).toBeNull()
  })

  it('returns rect interval when no polygon', () => {
    const data = prepareImageData([img({ x: 100, y: 200, width: 100 })], 1)
    expect(getBlockedInterval(data[0], 250, 10)).toEqual({ left: 90, right: 210 })
  })
})

describe('getBlockedInterval with lineHeight', () => {
  it('blocks a line whose bottom dips into the image even if its top is above', () => {
    // Image at y=100, height=100. Line at currentY=85 with lineHeight=26 has
    // bottom at y=111 — overlaps the image. Without lineHeight check this
    // would be unblocked and text would render under the image top.
    const data = prepareImageData([img({ x: 100, y: 100, width: 100, aspectRatio: 1 })], 1)
    expect(getBlockedInterval(data[0], 85, 10, undefined, 26)).not.toBeNull()
    // The old behaviour (no lineHeight) leaves it null
    expect(getBlockedInterval(data[0], 85, 10)).toBeNull()
  })

  it('still leaves the line above an image unblocked when there is real clearance', () => {
    // Image at y=100. Line at currentY=70 with lineHeight=26 has bottom 96 — clear.
    const data = prepareImageData([img({ x: 100, y: 100, width: 100 })], 1)
    expect(getBlockedInterval(data[0], 70, 10, undefined, 26)).toBeNull()
  })
})

describe('getSlots', () => {
  it('returns full container when no images block at y', () => {
    const data = prepareImageData([img({ x: 100, y: 500, width: 100 })], 1)
    expect(getSlots(data, 100, 800, 10)).toEqual([{ left: 0, right: 800 }])
  })

  it('returns left and right slots when image is centred', () => {
    const data = prepareImageData([img({ x: 350, y: 0, width: 100 })], 1)
    const slots = getSlots(data, 50, 800, 10)
    expect(slots).toEqual([
      { left: 0, right: 340 },
      { left: 460, right: 800 },
    ])
  })

  it('drops slots narrower than the minimum (image close to right edge)', () => {
    // image at x=720, width=100, padding=10 → blocks 710..830. Container 800.
    // Right slot would be 830..800 → invalid (negative). Left slot 0..710 is fine.
    const data = prepareImageData([img({ x: 720, y: 0, width: 100 })], 1)
    const slots = getSlots(data, 50, 800, 10)
    expect(slots).toEqual([{ left: 0, right: 710 }])
  })

  it('drops a tiny right slot to avoid mid-word fragments', () => {
    // image right edge at 720 in 800-wide container. Right slot 720..800 = 80px wide.
    // Threshold filters slots <= 80 px so only the wide left slot remains.
    const data = prepareImageData([img({ x: 600, y: 0, width: 110 })], 1)
    const slots = getSlots(data, 50, 800, 10)
    // image blocks 590..720, right slot 720..800 = 80px → filtered out
    expect(slots).toEqual([{ left: 0, right: 590 }])
  })

  it('keeps slots that comfortably fit text', () => {
    // image at x=400, width=200 → blocks 390..610. Container 800.
    // left slot 0..390 (390 wide), right slot 610..800 (190 wide) — both kept.
    const data = prepareImageData([img({ x: 400, y: 0, width: 200 })], 1)
    const slots = getSlots(data, 50, 800, 10)
    expect(slots).toEqual([
      { left: 0, right: 390 },
      { left: 610, right: 800 },
    ])
  })
})
