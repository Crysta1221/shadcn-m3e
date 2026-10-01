/**
 * Syntax highlighting with Shiki. The theme is "css-variables": tokens carry
 * `var(--shiki-token-*)` colors, which `src/styles/m3e.css` maps to M3 color
 * roles, so code follows the active color scheme (light, dark, any seed).
 *
 * Shiki and its grammars are loaded on first use, in their own chunks.
 */
import {
  createCssVariablesTheme,
  createHighlighterCore,
  type HighlighterCore,
  type ThemedToken,
} from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

export type CodeLang = "tsx" | "css" | "bash" | "json" | "text"
export type { ThemedToken }

const theme = createCssVariablesTheme({
  name: "m3e",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
})

let highlighter: Promise<HighlighterCore> | null = null

function load() {
  highlighter ??= createHighlighterCore({
    themes: [theme],
    langs: [
      import("shiki/langs/tsx.mjs"),
      import("shiki/langs/css.mjs"),
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/json.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  })
  return highlighter
}

const cache = new Map<string, ThemedToken[][]>()

/** the tokens of a snippet, line by line */
export async function tokenize(
  code: string,
  lang: CodeLang
): Promise<ThemedToken[][]> {
  const key = `${lang}\0${code}`
  const hit = cache.get(key)
  if (hit) return hit
  const h = await load()
  const { tokens } = h.codeToTokens(code, {
    lang: lang === "text" ? "text" : lang,
    theme: "m3e",
  })
  cache.set(key, tokens)
  return tokens
}

/** the tokens if they are already computed */
export const peek = (code: string, lang: CodeLang) =>
  cache.get(`${lang}\0${code}`)
