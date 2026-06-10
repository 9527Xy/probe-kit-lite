import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = resolve(rootDir, 'public')
const fallbackSiteUrl = 'https://probekitlite.top'
const routes = [
  { path: '/', priority: '1.0' },
  { path: '/report', priority: '0.7' },
  { path: '/history', priority: '0.5' },
]

function parseEnvFile(filePath) {
  try {
    return readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .reduce((env, line) => {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) {
          return env
        }

        const equalsIndex = trimmed.indexOf('=')
        if (equalsIndex === -1) {
          return env
        }

        const key = trimmed.slice(0, equalsIndex).trim()
        const value = trimmed
          .slice(equalsIndex + 1)
          .trim()
          .replace(/^['"]|['"]$/g, '')

        env[key] = value
        return env
      }, {})
  } catch {
    return {}
  }
}

function getSiteUrl() {
  const env = {
    ...parseEnvFile(resolve(rootDir, '.env')),
    ...parseEnvFile(resolve(rootDir, '.env.local')),
    ...parseEnvFile(resolve(rootDir, '.env.production')),
    ...parseEnvFile(resolve(rootDir, '.env.production.local')),
    ...process.env,
  }

  return (env.VITE_SITE_URL || fallbackSiteUrl).replace(/\/$/, '')
}

function routeUrl(siteUrl, path) {
  return `${siteUrl}${path === '/' ? '/' : path}`
}

const siteUrl = getSiteUrl()
const today = new Date().toISOString().slice(0, 10)

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes
  .map((route) => {
    const url = routeUrl(siteUrl, route.path)
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${url}" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${url}" />
  </url>`
  })
  .join('\n')}
</urlset>
`

mkdirSync(publicDir, { recursive: true })
writeFileSync(resolve(publicDir, 'robots.txt'), robots)
writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap)
