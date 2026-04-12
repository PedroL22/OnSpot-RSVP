import { describe, expect, it } from 'vitest'

import { escapeCsvCell } from './csv'

describe('escapeCsvCell', () => {
  it('escapes double quotes', () => {
    expect(escapeCsvCell('Alex "Ace" Morgan')).toBe('"Alex ""Ace"" Morgan"')
  })

  it('preserves commas and newlines by quoting the entire cell', () => {
    expect(escapeCsvCell('Alex,\nMorgan')).toBe('"Alex,\nMorgan"')
  })

  it('neutralizes formula cells starting with equals', () => {
    expect(escapeCsvCell('=SUM(A1:A2)')).toBe(`"'=SUM(A1:A2)"`)
  })

  it('neutralizes formula cells starting with plus', () => {
    expect(escapeCsvCell('+SUM(A1:A2)')).toBe(`"'+SUM(A1:A2)"`)
  })

  it('neutralizes formula cells starting with minus', () => {
    expect(escapeCsvCell('-SUM(A1:A2)')).toBe(`"'-SUM(A1:A2)"`)
  })

  it('neutralizes formula cells starting with at-sign', () => {
    expect(escapeCsvCell('@SUM(A1:A2)')).toBe(`"'@SUM(A1:A2)"`)
  })

  it('neutralizes formula cells starting with tabs or carriage returns', () => {
    expect(escapeCsvCell('\tSUM(A1:A2)')).toBe(`"'\tSUM(A1:A2)"`)
    expect(escapeCsvCell('\rSUM(A1:A2)')).toBe(`"'\rSUM(A1:A2)"`)
  })
})
