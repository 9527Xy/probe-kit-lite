import { Readable } from 'node:stream'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const fallbackSiteUrl = 'https://probekitlite.top'

function normalizeSiteUrl(siteUrl) {
  return (siteUrl || fallbackSiteUrl).replace(/\/$/, '')
}

function siteUrlHtml(siteUrl) {
  return {
    name: 'site-url-html',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', normalizeSiteUrl(siteUrl))
    },
  }
}

function devCorsProxy() {
  return {
    name: 'dev-cors-proxy',
    configureServer(server) {
      server.middlewares.use('/api/proxy/chat', async (req, res) => {
        try {
          const requestUrl = new URL(req.url || '', 'http://localhost')
          const target = requestUrl.searchParams.get('target')

          if (!target) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: { message: 'Missing target URL.' } }))
            return
          }

          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (!value || ['host', 'origin', 'referer', 'accept-encoding'].includes(key.toLowerCase())) {
              continue
            }

            headers.set(key, Array.isArray(value) ? value.join(', ') : value)
          }
          headers.set('accept-encoding', 'identity')

          const response = await fetch(target, {
            method: req.method,
            headers,
            body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req,
            duplex: 'half',
          })

          res.statusCode = response.status
          response.headers.forEach((value, key) => {
            if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
              res.setHeader(key, value)
            }
          })

          if (!response.body) {
            res.end()
            return
          }

          Readable.fromWeb(response.body).pipe(res)
        } catch (error) {
          res.statusCode = 502
          res.setHeader('content-type', 'application/json')
          res.end(
            JSON.stringify({
              error: {
                message: error instanceof Error ? error.message : 'Dev proxy request failed.',
              },
            }),
          )
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), devCorsProxy(), siteUrlHtml(env.VITE_SITE_URL)],
  }
})
