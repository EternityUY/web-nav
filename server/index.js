import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { load as yamlLoad, dump as yamlDump } from 'js-yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.resolve(__dirname, '..', 'data', 'nav.yaml')
const CONFIG_FILE = path.resolve(__dirname, '..', 'config', 'app.json')
const DIST_DIR = path.resolve(__dirname, '..', 'dist')

// Read config file (with fallback defaults)
let appConfig = { server: { port: 3001 } }
try {
  if (fs.existsSync(CONFIG_FILE)) {
    appConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
  }
} catch (err) {
  console.warn('Failed to read config file, using defaults:', err)
}

const PORT = process.env.PORT || appConfig.server.port || 3001
const isProd = process.env.NODE_ENV === 'production'

const app = express()
app.use(express.json({ limit: '1mb' }))

// --- Navigation API ---

app.get('/api/nav', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    const data = yamlLoad(raw)
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
    const raw = yamlDump(data, { indent: 2, lineWidth: -1, noRefs: true })
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
    const url = `https://www.bing.com/HPImageArchive.aspx?format=js&idx=${idx}&n=${n}&mkt=zh-CN`
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
    })
    if (!resp.ok) {
      // Fallback to cn.bing.com
      const fallbackUrl = `https://cn.bing.com/HPImageArchive.aspx?format=js&idx=${idx}&n=${n}`
      const fbResp = await fetch(fallbackUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      })
      if (!fbResp.ok) throw new Error(`Bing API returned ${resp.status} / ${fbResp.status}`)
      var json = await fbResp.json()
      var bingHost = 'https://cn.bing.com'
    } else {
      json = await resp.json()
      bingHost = 'https://www.bing.com'
    }

    // Map to a simpler response: extract image URLs
    const images = (json.images || []).map((img) => ({
      url: `${bingHost}${img.url}`,
      urlbase: `${bingHost}${img.urlbase}`,
      copyright: img.copyright,
      title: img.title,
    }))

    res.json({ success: true, images, host: bingHost })
  } catch (err) {
    console.error('Failed to fetch Bing background:', err)
    res.status(502).json({ success: false, error: 'Failed to fetch background image' })
  }
})

// Proxy for individual Bing wallpaper images (bypasses hotlinking protection)
app.get('/api/background/image', async (req, res) => {
  try {
    const imageUrl = req.query.url
    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'Missing url parameter' })
    }
    const resp = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.bing.com/',
      },
    })
    if (!resp.ok) throw new Error(`Image proxy returned ${resp.status}`)
    const contentType = resp.headers.get('content-type') || 'image/jpeg'
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    // Stream the image data to the client
    const reader = resp.body?.getReader()
    if (!reader) throw new Error('No response body')
    const chunks = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }
    const buffer = Buffer.concat(chunks)
    res.end(buffer)
  } catch (err) {
    console.error('Failed to proxy image:', err)
    res.status(502).json({ success: false, error: 'Failed to proxy image' })
  }
})

// --- Serve static files in production ---

if (isProd) {
  app.use(express.static(DIST_DIR))
  app.get('/*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${isProd ? 'production' : 'development'}]`)
})
