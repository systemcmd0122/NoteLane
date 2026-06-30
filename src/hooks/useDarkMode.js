import { useEffect, useState, useCallback } from 'react'

function applyDark(dark) {
  document.documentElement.classList.toggle('dark', dark)
  try {
    localStorage.setItem('notelane-dark', JSON.stringify(dark))
  } catch {}
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('notelane-dark')
      if (stored !== null) return stored === 'true'
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    applyDark(isDark)
  }, [isDark])

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev)
  }, [])

  return { isDark, toggle }
}
