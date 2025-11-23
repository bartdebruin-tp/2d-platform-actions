import { Container, Graphics } from 'pixi.js'

export interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: 'wall' | 'platform'
}

interface ObstacleGraphics {
  graphic: Graphics
  bounds: Obstacle
}

export class Level extends Container {
  private background: Graphics
  private floor: Graphics
  private obstacles: ObstacleGraphics[] = []
  private readonly FLOOR_HEIGHT = 100
  private levelWidth: number
  private levelHeight: number

  constructor(screenWidth: number, screenHeight: number, levelWidth?: number) {
    super()

    // Level width defaults to 3x screen width for scrolling
    this.levelWidth = levelWidth || screenWidth * 3
    this.levelHeight = screenHeight

    // Create background with grey-purple tint
    this.background = new Graphics()
    this.background.rect(0, 0, this.levelWidth, screenHeight)
    this.background.fill(0x3d3d4d) // Grey with slight purple hint
    this.addChild(this.background)

    // Create dark black-grey floor platform
    this.floor = new Graphics()
    const floorY = screenHeight - this.FLOOR_HEIGHT
    this.floor.rect(0, floorY, this.levelWidth, this.FLOOR_HEIGHT)
    this.floor.fill(0x1a1a1f) // Dark black-grey
    this.addChild(this.floor)

    // Create level obstacles (walls and platforms)
    this.createObstacles(screenWidth, screenHeight, floorY)
  }

  private createObstacles(screenWidth: number, _screenHeight: number, floorY: number): void {
    // Clear existing obstacles
    this.obstacles.forEach(obs => this.removeChild(obs.graphic))
    this.obstacles = []

    // Define obstacles for this level
    const obstacleDefinitions: Obstacle[] = [
      // Wall in first part of level
      {
        x: screenWidth * 0.4,
        y: floorY - 200,
        width: 40,
        height: 200,
        type: 'wall'
      },
      // Platform example (you can add more)
      {
        x: screenWidth * 0.6,
        y: floorY - 150,
        width: 120,
        height: 20,
        type: 'platform'
      }
    ]

    // Create graphics for each obstacle
    obstacleDefinitions.forEach(def => {
      const graphic = new Graphics()
      graphic.rect(def.x, def.y, def.width, def.height)
      graphic.fill(def.type === 'wall' ? 0x2a2a2f : 0x3a3a3f)
      this.addChild(graphic)

      this.obstacles.push({
        graphic,
        bounds: def
      })
    })
  }

  public resize(screenWidth: number, screenHeight: number, levelWidth?: number): void {
    if (levelWidth !== undefined) {
      this.levelWidth = levelWidth
    }
    this.levelHeight = screenHeight

    // Resize background
    this.background.clear()
    this.background.rect(0, 0, this.levelWidth, screenHeight)
    this.background.fill(0x3d3d4d)

    // Resize floor
    this.floor.clear()
    const floorY = screenHeight - this.FLOOR_HEIGHT
    this.floor.rect(0, floorY, this.levelWidth, this.FLOOR_HEIGHT)
    this.floor.fill(0x1a1a1f)

    // Recreate obstacles with new dimensions
    this.createObstacles(screenWidth, screenHeight, floorY)
  }

  public getFloorY(): number {
    return this.floor.y
  }

  public getFloorHeight(): number {
    return this.FLOOR_HEIGHT
  }

  public getLevelWidth(): number {
    return this.levelWidth
  }

  public getLevelHeight(): number {
    return this.levelHeight
  }

  public getObstacles(): Obstacle[] {
    return this.obstacles.map(obs => obs.bounds)
  }

  /**
   * Check if a horizontal movement would collide with any obstacle
   * Returns the corrected x position if collision would occur
   */
  public checkWallCollision(playerX: number, playerY: number, playerWidth: number, playerHeight: number, newX: number): number {
    let correctedX = newX
    
    // Use tighter collision box
    const collisionWidth = playerWidth * 0.2
    const collisionHeight = playerHeight * 0.8
    
    // Calculate player collision bounds (assuming center anchor)
    const playerTop = playerY - collisionHeight / 2
    const playerBottom = playerY + collisionHeight / 2
    
    // Check collision with each obstacle
    for (const { bounds: obstacle } of this.obstacles) {
      const playerLeft = correctedX - collisionWidth / 2
      const playerRight = correctedX + collisionWidth / 2
      
      // Check if player overlaps with obstacle vertically
      const verticalOverlap = playerBottom > obstacle.y && playerTop < obstacle.y + obstacle.height
      
      if (!verticalOverlap) {
        continue // No collision possible with this obstacle
      }
      
      // Check horizontal collision
      const obstacleLeft = obstacle.x
      const obstacleRight = obstacle.x + obstacle.width
      
      // Moving right into obstacle
      if (playerRight > obstacleLeft && playerLeft < obstacleLeft && correctedX > playerX) {
        correctedX = obstacleLeft - collisionWidth / 2
      }
      
      // Moving left into obstacle
      if (playerLeft < obstacleRight && playerRight > obstacleRight && correctedX < playerX) {
        correctedX = obstacleRight + collisionWidth / 2
      }
    }
    
    return correctedX
  }

  /**
   * Check if player should land on top of any obstacle
   * Returns the highest obstacle top Y position if player should land on it, otherwise returns null
   */
  public checkWallTopCollision(playerX: number, playerY: number, playerWidth: number, playerHeight: number): number | null {
    // Use tighter collision box
    const collisionWidth = playerWidth * 0.2
    const collisionHeight = playerHeight * 0.8
    
    // Calculate player collision bounds (assuming center anchor)
    const playerLeft = playerX - collisionWidth / 2
    const playerRight = playerX + collisionWidth / 2
    const playerBottom = playerY + collisionHeight / 2
    const playerTop = playerY - collisionHeight / 2
    
    const threshold = 20 // Pixels of tolerance for landing detection
    let landingY: number | null = null
    
    // Check each obstacle
    for (const { bounds: obstacle } of this.obstacles) {
      // Check if player is horizontally aligned with obstacle
      const obstacleLeft = obstacle.x
      const obstacleRight = obstacle.x + obstacle.width
      const horizontalOverlap = playerRight > obstacleLeft && playerLeft < obstacleRight
      
      if (!horizontalOverlap) {
        continue // Not above this obstacle
      }
      
      const obstacleTop = obstacle.y
      
      // Check if player is landing or standing on this obstacle
      const isLanding = playerBottom >= obstacleTop - threshold && 
                       playerBottom < obstacleTop + threshold && 
                       playerTop < obstacleTop
      
      const isStanding = Math.abs(playerBottom - obstacleTop) < 2 && playerTop < obstacleTop
      
      if (isLanding || isStanding) {
        // Use the highest platform the player is touching
        if (landingY === null || obstacleTop < landingY) {
          landingY = obstacleTop
        }
      }
    }
    
    return landingY
  }
}
