// Three-state theme management: auto / dark / light
type ThemeMode = 'auto' | 'dark' | 'light'

const STORAGE_KEY = 'blog-theme-mode'

export function useTheme() {
  const mode = ref<ThemeMode>('auto')
  const isDark = ref(false)

  // Resolve the actual dark/light state based on mode and system preference
  function updateActual() {
    if (process.client) {
      const html = document.documentElement
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      if (mode.value === 'dark' || (mode.value === 'auto' && prefersDark)) {
        isDark.value = true
        html.classList.add('dark')
        html.classList.remove('light')
      } else {
        isDark.value = false
        html.classList.remove('dark')
        if (mode.value === 'light') {
          html.classList.add('light')
        } else {
          html.classList.remove('light')
        }
      }
    }
  }

  function setMode(newMode: ThemeMode) {
    mode.value = newMode
    if (process.client) {
      localStorage.setItem(STORAGE_KEY, newMode)
    }
    updateActual()
  }

  // Initialize from localStorage
  function init() {
    if (process.client) {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
      if (saved === 'dark' || saved === 'light' || saved === 'auto') {
        mode.value = saved
      }
      updateActual()

      // Listen for system changes (relevant in 'auto' mode)
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (mode.value === 'auto') updateActual()
      })
    }
  }

  return { mode, isDark, setMode, init }
}
