export default defineNuxtConfig({
  ssr: true,
  target: 'static',

  modules: ['@nuxt/content', '@nuxtjs/sitemap', '@nuxtjs/tailwindcss'],

  site: {
    url: 'https://junbx.cn',
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
      },
    },
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
    },
  },

  app: {
    head: {
      title: 'JunbXの小作坊',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: '个人博客 - 记录思考与学习' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/LOGO.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Reenie+Beanie&display=swap' },
      ],
      script: [
        { src: 'https://hm.baidu.com/hm.js?b02d8ae47ab5021074830c32ba315093', async: true },
      ],
    },
  },

  css: [
    '~/assets/css/variables.css',
    '~/assets/css/typography.css',
    '~/assets/css/prose-phycat.css',
    '~/assets/css/main.css',
  ],

  devServer: {
    port: 8001,
  },

  vite: {
    server: {
      allowedHosts: true,
    },
  },

  compatibilityDate: '2026-06-03',
})
