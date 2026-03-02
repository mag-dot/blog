/**
 * rehype plugin to shift heading levels down by one
 * h1 → h2, h2 → h3, h3 → h4, h4 → h5, h5 → h6, h6 stays h6
 */
import { visit } from 'unist-util-visit'

export default function rehypeShiftHeadings() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const match = node.tagName.match(/^h([1-6])$/)
      if (match) {
        const level = parseInt(match[1], 10)
        const newLevel = Math.min(level + 1, 6)
        node.tagName = `h${newLevel}`
      }
    })
  }
}
