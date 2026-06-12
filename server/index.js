import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.resolve(__dirname, '..', 'data', 'nav.yaml')
const DIST_DIR = path.resolve(__dirname, '..', 'dist')
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

const app = express()
app.use(express.json({ limit: '1mb' }))

// --- Navigation API ---

app.get('/api/nav', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    const data = yaml.load(raw)
    res.json({ success: true, data })
  } catch (err) {
    console.error('Failed to read YAML:', err)
    res.status(500).json({ success: false, error: 'Failed to read navigation data' })
  }
})

app.put('/api/nav', (req, res) => {
  try {
    const { data } = req.body
    if (!data || !data.categories) {
      return res.status(400).json({ success: false, error: 'Invalid data: missing categories' })
    }
    const raw = yaml.dump(data, { indent: 2, lineWidth: -1, noRefs: true })
    fs.writeFileSync(DATA_FILE, raw, 'utf-8')
    res.json({ success: true })
  } catch (err) {
    console.error('Failed to write YAML:', err)
    res.status(500).json({ success: false, error: 'Failed to save navigation data' })
  }
})

// --- Background image proxy ---
// Proxies Bing wallpaper JSON to avoid CORS issues for the frontend

app.get('/api/background', async (req, res) => {
  try {
    const idx = req.query.idx ?? 0
    const n = req.query.n ?? 8
    const url = `https://cn.bing.com/HPImageArchive.aspx?format=js&idx=${idx}&n=${n}`
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    if (!resp.ok) {
      throw new Error(`Bing API returned ${resp.status}`)
    }
    const json = await resp.json()

    // Map to a simpler response: extract image URLs
    const images = (json.images || []).map((img) => ({
      url: `https://cn.bing.com${img.url}`,
      urlbase: `https://cn.bing.com${img.urlbase}`,
      copyright: img.copyright,
      title: img.title,
    }))

    res.json({ success: true, images })
  } catch (err) {
    console.error('Failed to fetch Bing background:', err)
    res.status(502).json({ success: false, error: 'Failed to fetch background image' })
  }
})

// --- Serve static files in production ---

if (isProd) {
  app.use(express.static(DIST_DIR))
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${isProd ? 'production' : 'development'}]`)
})
