import { Container, Graphics } from 'pixi.js'

export class Level extends Container {
  private background: Graphics
  private floor: Graphics
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
}
