import { Container, Graphics } from 'pixi.js'

export class Level extends Container {
  private background: Graphics
  private floor: Graphics
  private readonly FLOOR_HEIGHT = 100

  constructor(screenWidth: number, screenHeight: number) {
    super()

    // Create background with grey-purple tint
    this.background = new Graphics()
    this.background.rect(0, 0, screenWidth, screenHeight)
    this.background.fill(0x3d3d4d) // Grey with slight purple hint
    this.addChild(this.background)

    // Create dark black-grey floor platform
    this.floor = new Graphics()
    const floorY = screenHeight - this.FLOOR_HEIGHT
    this.floor.rect(0, floorY, screenWidth, this.FLOOR_HEIGHT)
    this.floor.fill(0x1a1a1f) // Dark black-grey
    this.addChild(this.floor)
  }

  public resize(screenWidth: number, screenHeight: number): void {
    // Resize background
    this.background.clear()
    this.background.rect(0, 0, screenWidth, screenHeight)
    this.background.fill(0x3d3d4d)

    // Resize floor
    this.floor.clear()
    const floorY = screenHeight - this.FLOOR_HEIGHT
    this.floor.rect(0, floorY, screenWidth, this.FLOOR_HEIGHT)
    this.floor.fill(0x1a1a1f)
  }

  public getFloorY(): number {
    return this.floor.y
  }

  public getFloorHeight(): number {
    return this.FLOOR_HEIGHT
  }
}
