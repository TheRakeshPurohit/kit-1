import type { Metadata, Snippet } from '../types/index.js'
import { kenvPath } from './resolvers.js'
import { escapeHTML, getKenvFromPath, getMetadata, postprocessMetadata } from './utils.js'

export let parseSnippets = async (): Promise<Snippet[]> => {
  let snippetPaths = await globby([
    kenvPath('snippets', '**', '*.txt').replaceAll('\\', '/'),
    kenvPath('kenvs', '*', 'snippets', '**', '*.txt').replaceAll('\\', '/')
  ])

  let snippetChoices:Partial<Snippet>[] = []
  for await (let s of snippetPaths) {
    let contents = await readFile(s, 'utf8')
    let { metadata, snippet } = getSnippet(contents)
    let formattedSnippet = escapeHTML(snippet)

    let expand = (metadata?.expand || metadata?.snippet || '').trim()
    let postfix = false
    if (expand.startsWith('*')) {
      postfix = true
      expand = expand.slice(1)
    }

    snippetChoices.push({
      ...metadata,
      filePath: s,
      name: metadata?.name || s,
      tag: metadata?.snippet || '',
      description: s,
      text: snippet.trim(),
      preview: `<div class="p-4">${formattedSnippet}</div>`,
      group: 'Snippets',
      kenv: getKenvFromPath(s),
      value: snippet.trim(),
      expand,
      postfix: postfix ? 'true' : 'false',
      snippetKey: expand,
    })
  }

  return snippetChoices as Snippet[]
}

const snippetRegex = /(?<=^(?:(?:\/\/)|#)\s{0,2})([\w-]+)(?::)(.*)/
export let getSnippet = (
  contents: string
): {
  metadata: Metadata
  snippet: string
} => {
  let lines = contents.split('\n')
  let metadata = postprocessMetadata(getMetadata(contents), contents) as Metadata
  delete (metadata as any).type
  let contentStartIndex = lines.length

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    let match = line.match(snippetRegex)

    if (!match) {
      contentStartIndex = i
      break
    }
  }
  let snippet = lines.slice(contentStartIndex).join('\n')
  return { metadata, snippet }
}
