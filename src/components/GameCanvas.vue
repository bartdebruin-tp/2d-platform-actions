<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Application, Container } from 'pixi.js'
import { Level } from '../composables/Level'
import { Player } from '../composables/Player'
import { PlayerInputHandler } from '../composables/PlayerInputHandler'
import { useKeyboard } from '@/composables/useKeyboard'
import { useCamera } from '@/composables/useCamera'

const canvasContainer = ref<HTMLDivElement | null>(null)
let app: Application | null = null
let level: Level | null = null
let player: Player | null = null
let inputHandler: PlayerInputHandler | null = null
let worldContainer: Container | null = null
let camera: ReturnType<typeof useCamera> | null = null

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

  // Create world container (this will be moved by the camera)
  worldContainer = new Container()
  app.stage.addChild(worldContainer)

  // Create level with extended width for scrolling
  level = new Level(app.screen.width, app.screen.height)
  worldContainer.addChild(level)

  // Create camera
  camera = useCamera({
    viewportWidth: app.screen.width,
    viewportHeight: app.screen.height,
    levelWidth: level.getLevelWidth(),
    levelHeight: level.getLevelHeight()
  })

  // Create player
  player = new Player()
  await player.init()
  
  // Position player on the floor (anchor is now centered, so adjust position)
  const floorY = app.screen.height - level.getFloorHeight()
  player.setPosition(100, floorY - player.getHeight() / 2)
  worldContainer.addChild(player)

  // Create input handler
  inputHandler = new PlayerInputHandler(player)

  // Game loop
  app.ticker.add(() => {
    if (!player || !inputHandler || !level || !app || !camera || !worldContainer) return

    // Handle input using the new action system
    inputHandler.handleInput(keys.value, getLastPressedKey)
    
    // Calculate ground Y position
    const groundY = app.screen.height - level.getFloorHeight()
    
    // Update player with ground collision
    player.update(groundY)

    // Update camera to follow player
    camera.followTarget(player.x, player.y)
    camera.applyToContainer(worldContainer)
  })

  // Handle window resize
  const handleResize = () => {
    if (app && level && camera) {
      app.renderer.resize(window.innerWidth, window.innerHeight)
      level.resize(window.innerWidth, window.innerHeight)
      camera.resize(window.innerWidth, window.innerHeight, level.getLevelWidth(), level.getLevelHeight())
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
