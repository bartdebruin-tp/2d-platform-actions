import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for managing keyboard input state
 * Tracks which keys are currently pressed and their press order
 */
export function useKeyboard() {
  const keys = ref<Record<string, boolean>>({})
  const keyPressOrder = ref<string[]>([])

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    if (!keys.value[key]) {
      keys.value[key] = true
      // Add to press order if not already there
      keyPressOrder.value = keyPressOrder.value.filter(k => k !== key)
      keyPressOrder.value.push(key)
    }
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    keys.value[key] = false
    // Remove from press order
    keyPressOrder.value = keyPressOrder.value.filter(k => k !== key)
  }

  const isKeyPressed = (key: string): boolean => {
    return keys.value[key.toLowerCase()] || false
  }

  const areKeysPressed = (...keyList: string[]): boolean => {
    return keyList.every(key => isKeyPressed(key))
  }

  const isAnyKeyPressed = (...keyList: string[]): boolean => {
    return keyList.some(key => isKeyPressed(key))
  }

  const getLastPressedKey = (...keyList: string[]): string | null => {
    // Return the most recently pressed key from the list
    const lowerKeyList = keyList.map(k => k.toLowerCase())
    for (let i = keyPressOrder.value.length - 1; i >= 0; i--) {
      if (lowerKeyList.includes(keyPressOrder.value[i])) {
        return keyPressOrder.value[i]
      }
    }
    return null
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  })

  return {
    keys,
    isKeyPressed,
    areKeysPressed,
    isAnyKeyPressed,
    getLastPressedKey
  }
}
