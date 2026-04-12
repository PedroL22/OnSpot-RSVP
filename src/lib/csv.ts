const csvFormulaPattern = /^[=+\-@\t\r]/

export const escapeCsvCell = (value: string) => {
  const neutralizedValue = csvFormulaPattern.test(value) ? `'${value}` : value
  const escapedValue = neutralizedValue.replaceAll('"', '""')

  return `"${escapedValue}"`
}
