// Renders og/og.html with Chrome into public/og.png, the 1200x630 Open Graph /
// Twitter card (see page-meta.ts). Set CHROME to the browser executable if it is not found.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { launch } from "puppeteer-core"

const root = path.resolve(fileURLToPath(import.meta.url), "../..")
const source = pathToFileURL(path.join(root, "og/og.html")).href

const candidates = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean)
const executablePath = candidates.find((p) => fs.existsSync(p))
if (!executablePath) throw new Error("Chrome not found: set CHROME")

const out = path.join(root, "public/og.png")
const [w, h] = [1200, 630]

const browser = await launch({ executablePath, headless: true })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
  await page.goto(`${source}?w=${w}&h=${h}`, { waitUntil: "networkidle0" })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: out })
  console.log("wrote", path.relative(process.cwd(), out))
} finally {
  await browser.close()
}
