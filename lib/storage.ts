export interface GenerationHistory {
  id: string
  type: "token" | "password" | "secret"
  value: string
  timestamp: number
  config: Record<string, any>
  favorite?: boolean
  expiresAt?: number
  label?: string
}

export interface ConfigPreset {
  id: string
  name: string
  type: "token" | "password" | "secret"
  config: Record<string, any>
  timestamp: number
}

const STORAGE_KEY = "genera8_history"
const PRESETS_KEY = "genera8_presets"
const MAX_HISTORY = 100

export const StorageManager = {
  // History Management
  getHistory(): GenerationHistory[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveToHistory(item: Omit<GenerationHistory, "id" | "timestamp">): void {
    if (typeof window === "undefined") return
    try {
      const history = this.getHistory()
      const newItem: GenerationHistory = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      }
      history.unshift(newItem)
      if (history.length > MAX_HISTORY) {
        history.splice(MAX_HISTORY)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (error) {
      console.error("Failed to save history:", error)
    }
  },

  deleteHistoryItem(id: string): void {
    if (typeof window === "undefined") return
    try {
      const history = this.getHistory().filter((item) => item.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (error) {
      console.error("Failed to delete history item:", error)
    }
  },

  clearHistory(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  },

  toggleFavorite(id: string): void {
    if (typeof window === "undefined") return
    try {
      const history = this.getHistory()
      const item = history.find((h) => h.id === id)
      if (item) {
        item.favorite = !item.favorite
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  },

  updateLabel(id: string, label: string): void {
    if (typeof window === "undefined") return
    try {
      const history = this.getHistory()
      const item = history.find((h) => h.id === id)
      if (item) {
        item.label = label
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
      }
    } catch (error) {
      console.error("Failed to update label:", error)
    }
  },

  // Preset Management
  getPresets(): ConfigPreset[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(PRESETS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  savePreset(preset: Omit<ConfigPreset, "id" | "timestamp">): void {
    if (typeof window === "undefined") return
    try {
      const presets = this.getPresets()
      const newPreset: ConfigPreset = {
        ...preset,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      }
      presets.push(newPreset)
      localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
    } catch (error) {
      console.error("Failed to save preset:", error)
    }
  },

  deletePreset(id: string): void {
    if (typeof window === "undefined") return
    try {
      const presets = this.getPresets().filter((preset) => preset.id !== id)
      localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
    } catch (error) {
      console.error("Failed to delete preset:", error)
    }
  },
}
