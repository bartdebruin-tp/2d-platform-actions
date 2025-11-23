import { Container } from 'pixi.js'

export interface CameraOptions {
  viewportWidth: number
  viewportHeight: number
  levelWidth: number
  levelHeight: number
}

export class CameraController {
  private viewportWidth: number
  private viewportHeight: number
  private levelWidth: number
  private levelHeight: number
  private cameraX: number = 0
  private cameraY: number = 0

  constructor(options: CameraOptions) {
    this.viewportWidth = options.viewportWidth
    this.viewportHeight = options.viewportHeight
    this.levelWidth = options.levelWidth
    this.levelHeight = options.levelHeight
  }

  /**
   * Update camera position to follow target (usually the player)
   * Camera follows when target is in middle of screen, stops at level boundaries
   */
  public followTarget(targetX: number, targetY: number): void {
    // Calculate the middle of the screen
    const screenCenterX = this.viewportWidth / 2
    const screenCenterY = this.viewportHeight / 2

    // Desired camera position (keeping target at center)
    let desiredCameraX = targetX - screenCenterX
    let desiredCameraY = targetY - screenCenterY

    // Clamp camera position to level boundaries
    // Left boundary: camera can't go below 0
    // Right boundary: camera can't show beyond level width
    desiredCameraX = Math.max(0, Math.min(desiredCameraX, this.levelWidth - this.viewportWidth))
    
    // Clamp vertical camera (usually not needed for side-scrollers but included for completeness)
    desiredCameraY = Math.max(0, Math.min(desiredCameraY, this.levelHeight - this.viewportHeight))

    this.cameraX = desiredCameraX
    this.cameraY = desiredCameraY
  }

  /**
   * Apply camera transform to a container (usually the stage or world container)
   */
  public applyToContainer(container: Container): void {
    container.x = -this.cameraX
    container.y = -this.cameraY
  }

  /**
   * Update viewport and level dimensions (for window resize)
   */
  public resize(viewportWidth: number, viewportHeight: number, levelWidth?: number, levelHeight?: number): void {
    this.viewportWidth = viewportWidth
    this.viewportHeight = viewportHeight
    
    if (levelWidth !== undefined) {
      this.levelWidth = levelWidth
    }
    if (levelHeight !== undefined) {
      this.levelHeight = levelHeight
    }
  }

  /**
   * Get current camera position
   */
  public getPosition(): { x: number; y: number } {
    return { x: this.cameraX, y: this.cameraY }
  }

  /**
   * Get viewport dimensions
   */
  public getViewport(): { width: number; height: number } {
    return { width: this.viewportWidth, height: this.viewportHeight }
  }

  /**
   * Check if camera is at left boundary
   */
  public isAtLeftBoundary(): boolean {
    return this.cameraX <= 0
  }

  /**
   * Check if camera is at right boundary
   */
  public isAtRightBoundary(): boolean {
    return this.cameraX >= this.levelWidth - this.viewportWidth
  }
}

/**
 * Factory function to create a camera controller
 */
export function useCamera(options: CameraOptions): CameraController {
  return new CameraController(options)
}
