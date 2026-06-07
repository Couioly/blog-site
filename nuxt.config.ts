export default defineNuxtConfig({
  ssr: true,
  target: 'static',

  modules: ['@nuxt/content'],

  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
      },
    },
    highlight: {
      theme: 'github-dark',
    },
  },

  app: {
    head: {
      title: '我的博客',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: '个人博客 - 记录思考与学习' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  css: [
    '~/assets/css/variables.css',
    '~/assets/css/typography.css',
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
