import { Container } from 'pixi.js'

export interface PlayerMovement {
  velocityX: number
  velocityY: number
  isMoving: boolean
  facingRight: boolean
}

export interface PlayerMovementConfig {
  speed?: number
  jumpForce?: number
  gravity?: number
}

/**
 * Player movement controller
 * Handles movement state, velocity, and direction
 */
export class PlayerMovementController {
  private movement: PlayerMovement = {
    velocityX: 0,
    velocityY: 0,
    isMoving: false,
    facingRight: true
  }

  private readonly baseSpeed: number
  private currentSpeed: number
  private readonly jumpForce: number
  private readonly gravity: number
  private readonly speedBoost: number = 0.5

  constructor(config: PlayerMovementConfig = {}) {
    this.baseSpeed = config.speed ?? 2
    this.currentSpeed = this.baseSpeed
    this.jumpForce = config.jumpForce ?? 10
    this.gravity = config.gravity ?? 0.5
  }

  /**
   * Move player to the right
   */
  public moveRight(): PlayerMovement {
    this.movement.velocityX = this.currentSpeed
    this.movement.isMoving = true
    this.movement.facingRight = true
    return this.movement
  }

  /**
   * Move player to the left
   */
  public moveLeft(): PlayerMovement {
    this.movement.velocityX = -this.currentSpeed
    this.movement.isMoving = true
    this.movement.facingRight = false
    return this.movement
  }

  /**
   * Stop horizontal movement
   */
  public stopMoving(): PlayerMovement {
    this.movement.velocityX = 0
    this.movement.isMoving = false
    return this.movement
  }

  /**
   * Make player jump
   */
  public jump(): PlayerMovement {
    this.movement.velocityY = -this.jumpForce
    return this.movement
  }

  /**
   * Apply gravity to player
   */
  public applyGravity(): PlayerMovement {
    this.movement.velocityY += this.gravity
    return this.movement
  }

  /**
   * Update player position on container
   */
  public updatePosition(container: Container): void {
    container.x += this.movement.velocityX
    container.y += this.movement.velocityY
  }

  /**
   * Update player facing direction
   */
  public updateFacing(container: Container): void {
    if (this.movement.facingRight) {
      container.scale.x = Math.abs(container.scale.x)
    } else {
      container.scale.x = -Math.abs(container.scale.x)
    }
  }

  /**
   * Get current movement state
   */
  public getMovement(): PlayerMovement {
    return { ...this.movement }
  }

  /**
   * Reset velocities
   */
  public reset(): void {
    this.movement.velocityX = 0
    this.movement.velocityY = 0
    this.movement.isMoving = false
  }

  /**
   * Set velocity Y (useful for landing on ground)
   */
  public setVelocityY(value: number): void {
    this.movement.velocityY = value
  }

  /**
   * Enable speed boost (e.g., when shift is held)
   */
  public enableSpeedBoost(): void {
    this.currentSpeed = this.baseSpeed + this.speedBoost
  }

  /**
   * Disable speed boost
   */
  public disableSpeedBoost(): void {
    this.currentSpeed = this.baseSpeed
  }
}
