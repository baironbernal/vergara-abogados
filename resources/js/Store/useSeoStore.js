// stores/useSeoStore.js
import { create } from 'zustand'

export const useSeoStore = create((set) => ({
  title: '',
  description: '',
  keywords: '',
  setSeo: (seo) => set({
    title: seo.title || '',
    description: seo.description || '',
    keywords: seo.keywords || ''
  })
}))