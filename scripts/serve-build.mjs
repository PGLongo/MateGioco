/**
 * Serve la build statica (`.output/public`) sotto il prefisso della baseURL di produzione,
 * `/MateGioco/`: e' lo stesso percorso di GitHub Pages.
 *
 * Lo usano i test visivi (come `webServer`) e il generatore della galleria. Sta in un file
 * a parte perche' entrambi devono servire l'artefatto **esattamente** allo stesso modo:
 * fotografare qualcosa di diverso da cio' che si confronta non avrebbe senso.
 */

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const PORT = Number(process.env.SCREENSHOT_PORT ?? 4173)
const BASE_PATH = '/MateGioco'
const BUILD_DIR = '.output/public'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
}

export const startStaticServer = () => new Promise((resolve, reject) => {
  const server = createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      if (path.startsWith(BASE_PATH)) path = path.slice(BASE_PATH.length)
      if (path === '' || path.endsWith('/')) path += 'index.html'
      if (!extname(path)) path += '/index.html'

      const body = await readFile(join(BUILD_DIR, path))
      res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' })
      res.end(body)
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' })
      res.end('not found')
    }
  })

  server.on('error', reject)
  server.listen(PORT, () => resolve(server))
})

// Eseguito direttamente (come webServer di Playwright) resta in ascolto
if (import.meta.url === `file://${process.argv[1]}`) {
  await startStaticServer()
  console.log(`Build statica servita su http://localhost:${PORT}${BASE_PATH}/`)
}
