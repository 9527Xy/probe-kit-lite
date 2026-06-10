import type { Router } from 'vue-router'

const siteName = 'ProbeKit Lite'
const fallbackSiteUrl = 'https://probekitlite.top'
const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')

function getBaseUrl() {
  if (configuredSiteUrl) {
    return configuredSiteUrl
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return fallbackSiteUrl
}

function absoluteUrl(path: string) {
  return `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
}

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const element = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector)
  if (element) {
    element.setAttribute(attr, value)
  }
}

function ensureLink(rel: string, hreflang: string | undefined, href: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`
  let link = document.head.querySelector<HTMLLinkElement>(selector)

  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    if (hreflang) {
      link.hreflang = hreflang
    }
    document.head.append(link)
  }

  link.href = href
}

export function installSeo(router: Router) {
  router.afterEach((to) => {
    const title = typeof to.meta.title === 'string' ? to.meta.title : siteName
    const description =
      typeof to.meta.description === 'string'
        ? to.meta.description
        : 'ProbeKit Lite tests OpenAI-compatible APIs for compatibility, performance, authenticity, token usage, and gateway transparency.'
    const canonical = absoluteUrl(to.path)

    document.documentElement.lang = 'zh-CN'
    document.title = title.includes(siteName) ? title : `${title} - ${siteName}`
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', document.title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', canonical)
    setMeta('meta[name="twitter:title"]', 'content', document.title)
    setMeta('meta[name="twitter:description"]', 'content', description)
    ensureLink('canonical', undefined, canonical)
    ensureLink('alternate', 'zh-CN', canonical)
    ensureLink('alternate', 'en-US', canonical)
    ensureLink('alternate', 'x-default', canonical)
  })
}
