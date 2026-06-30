import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { translations } from './translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useLocalStorage('notelane-lang', 'ja')

  const t = (key, params = {}) => {
    const text = translations[lang]?.[key] ?? key
    if (!params || Object.keys(params).length === 0) return text
    return Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(`{${k}}`, v),
      text,
    )
  }

  useEffect(() => {
    const title = translations[lang]?.['meta.title']
    const desc = translations[lang]?.['meta.description']
    if (title) document.title = title
    if (desc) {
      const el = document.querySelector('meta[name="description"]')
      if (el) el.setAttribute('content', desc)
    }
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
