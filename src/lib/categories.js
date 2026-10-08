export const CATEGORIES = [
  { key: 'website', label: 'Websites', icon: '🌐' },
  { key: 'landing-page', label: 'Landing Pages', icon: '🚀' },
  { key: 'software', label: 'Custom Software', icon: '🛠️' },
  { key: 'automation', label: 'AI Automation Agents', icon: '🤖' },
  { key: 'voice-agent', label: 'AI Voice Calling Agents', icon: '📞' },
]

export function categoryLabel(key) {
  return CATEGORIES.find((c) => c.key === key)?.label || key
}

export function categoryIcon(key) {
  return CATEGORIES.find((c) => c.key === key)?.icon || '📁'
}
