<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Application } from 'pixi.js'
import { Level } from './Level'
import { Player } from './Player'
import { PlayerInputHandler } from './PlayerInputHandler'
import { useKeyboard } from '@/composables/useKeyboard'

const canvasContainer = ref<HTMLDivElement | null>(null)
let app: Application | null = null
let level: Level | null = null
let player: Player | null = null
let inputHandler: PlayerInputHandler | null = null

const { keys, getLastPressedKey } = useKeyboard()

onMounted(async () => {
  if (!canvasContainer.value) return

  // Create Pixi Application
  app = new Application()
  
  await app.init({
    resizeTo: window,
    backgroundColor: 0x1a1a1a,
    antialias: true,
  })

  // Append canvas to container
  canvasContainer.value.appendChild(app.canvas)

  // Create level
  level = new Level(app.screen.width, app.screen.height)
  app.stage.addChild(level)

  // Create player
  player = new Player()
  await player.init()
  
  // Position player on the floor (anchor is now centered, so adjust position)
  const floorY = app.screen.height - level.getFloorHeight()
  player.setPosition(100, floorY - player.getHeight() / 2)
  app.stage.addChild(player)

  // Create input handler
  inputHandler = new PlayerInputHandler(player)

  // Game loop
  app.ticker.add(() => {
    if (!player || !inputHandler) return

    // Handle input using the new action system
    inputHandler.handleInput(keys.value, getLastPressedKey)
    
    // Update player
    player.update()
  })

  // Handle window resize
  const handleResize = () => {
    if (app && level) {
      app.renderer.resize(window.innerWidth, window.innerHeight)
      level.resize(window.innerWidth, window.innerHeight)
    }
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (app) {
    app.destroy(true, { children: true })
  }
  window.removeEventListener('resize', () => {})
})
</script>

<template>
  <div ref="canvasContainer" class="game-canvas-container"></div>
</template>

<style scoped>
.game-canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.game-canvas-container :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
