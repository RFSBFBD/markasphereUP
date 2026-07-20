export function truncateText(text, maxLength = 100, suffix = '...') {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trimEnd() + suffix
}

export function truncateWords(text, wordCount = 20) {
  if (!text) return ''
  const words = text.split(/\s+/)
  if (words.length <= wordCount) return text
  return words.slice(0, wordCount).join(' ') + '...'
}
