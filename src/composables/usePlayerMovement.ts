import { Container } from 'pixi.js'

export interface PlayerMovement {
  velocityX: number
  velocityY: number
  isMoving: boolean
  facingRight: boolean
  isOnGround: boolean
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
    facingRight: true,
    isOnGround: false
  }

  private readonly baseSpeed: number
  private currentSpeed: number
  private readonly jumpForce: number
  private readonly gravity: number
  private readonly speedBoost: number = 1

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
    console.log('moveRight', { currentSpeed: this.currentSpeed })
    this.movement.velocityX = this.currentSpeed
    this.movement.isMoving = true
    this.movement.facingRight = true
    return this.movement
  }

  /**
   * Move player to the left
   */
  public moveLeft(): PlayerMovement {
    console.log('moveLeft', { currentSpeed: this.currentSpeed })
    this.movement.velocityX = -this.currentSpeed
    this.movement.isMoving = true
    this.movement.facingRight = false
    return this.movement
  }

  /**
   * Stop horizontal movement
   */
  public stopMoving(): PlayerMovement {
    //console.log('stopMoving')
    this.movement.velocityX = 0
    this.movement.isMoving = false
    return this.movement
  }

  /**
   * Make player jump (only when on ground)
   */
  public jump(): boolean {
    console.log('jump', { isOnGround: this.movement.isOnGround, jumpForce: this.jumpForce })
    if (this.movement.isOnGround) {
      this.movement.velocityY = -this.jumpForce
      this.movement.isOnGround = false
      return true
    }
    return false
  }

  /**
   * Apply gravity to player
   */
  public applyGravity(): PlayerMovement {
    console.log('applyGravity', { gravity: this.gravity, currentVelocityY: this.movement.velocityY })
    this.movement.velocityY += this.gravity
    return this.movement
  }

  /**
   * Update player position on container
   */
  public updatePosition(container: Container): void {
    //console.log('updatePosition', { velocityX: this.movement.velocityX, velocityY: this.movement.velocityY, containerX: container.x, containerY: container.y })
    container.x += this.movement.velocityX
    container.y += this.movement.velocityY
  }

  /**
   * Update player facing direction
   */
  public updateFacing(container: Container): void {
    console.log('updateFacing', { facingRight: this.movement.facingRight, scaleX: container.scale.x })
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
    console.log('getMovement', { movement: this.movement })
    return { ...this.movement }
  }

  /**
   * Reset velocities
   */
  public reset(): void {
    console.log('reset')
    this.movement.velocityX = 0
    this.movement.velocityY = 0
    this.movement.isMoving = false
  }

  /**
   * Set velocity Y (useful for landing on ground)
   */
  public setVelocityY(value: number): void {
    console.log('setVelocityY', { value })
    this.movement.velocityY = value
  }

  /**
   * Set ground state
   */
  public setOnGround(onGround: boolean): void {
    //console.log('setOnGround', { onGround })
    this.movement.isOnGround = onGround
    if (onGround) {
      this.movement.velocityY = 0
    }
  }

  /**
   * Check if player is on ground
   */
  public isOnGround(): boolean {
    //console.log('isOnGround', { isOnGround: this.movement.isOnGround })
    return this.movement.isOnGround
  }

  /**
   * Enable speed boost (e.g., when shift is held)
   */
  public enableSpeedBoost(): void {
    console.log('enableSpeedBoost', { baseSpeed: this.baseSpeed, speedBoost: this.speedBoost, newSpeed: this.baseSpeed + this.speedBoost })
    this.currentSpeed = this.baseSpeed + this.speedBoost
  }

  /**
   * Disable speed boost
   */
  public disableSpeedBoost(): void {
    //console.log('disableSpeedBoost', { baseSpeed: this.baseSpeed })
    this.currentSpeed = this.baseSpeed
  }
}
