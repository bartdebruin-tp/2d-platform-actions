import { AnimatedSprite, Container } from 'pixi.js'
import { loadKnightSprites } from '@/composables/useSpriteLoader'
import { PlayerMovementController } from '@/composables/usePlayerMovement'

export class Player extends Container {
  private sprite: AnimatedSprite | null = null
  private readonly SCALE = 2
  private animations: Record<string, AnimatedSprite> = {}
  private currentAnimation: string = 'idle'
  private movementController: PlayerMovementController
  private readonly SLIDE_DISTANCE = 7 * this.SCALE

  constructor() {
    super()
    this.movementController = new PlayerMovementController({ speed: 2 })
  }

  public async init(): Promise<void> {
    // Load all sprite sheets using composable
    const loadedSprites = await loadKnightSprites()

    // Create animated sprites from loaded spritesheets
    for (const { name, spritesheet } of loadedSprites) {
      const animSprite = new AnimatedSprite(spritesheet.animations[name])
      animSprite.animationSpeed = 0.2
      animSprite.scale.set(this.SCALE)
      animSprite.anchor.set(0.5, 0.5) // Set anchor to center to prevent jumping when flipping
      animSprite.visible = false
      
      this.animations[name] = animSprite
      this.addChild(animSprite)
    }

    // Set initial animation to idle
    this.playAnimation('idle')
  }

  public playAnimation(name: string, loop: boolean = true): void {
    if (!this.animations[name]) {
      console.warn(`Animation ${name} not found`)
      return
    }

    // Hide current animation
    if (this.sprite) {
      this.sprite.visible = false
      this.sprite.stop()
    }

    // Show and play new animation
    this.sprite = this.animations[name]
    this.sprite.visible = true
    this.sprite.loop = loop
    this.sprite.gotoAndPlay(0)
    this.currentAnimation = name

    // Setup onComplete callback for non-looping animations
    if (!loop && this.sprite) {
      this.sprite.onComplete = () => {
        if (name === 'slideAll') {
          this.movementController.endSlide()
          // Reset running frame count after slide completes
          this.movementController.resetRunningFrames()
          // Check if still in air or on ground
          if (!this.movementController.isOnGround()) {
            this.playAnimation('jump', false)
          } else {
            const movement = this.movementController.getMovement()
            if (movement.isMoving) {
              this.playAnimation('run')
            } else {
              this.playAnimation('idle')
            }
          }
        }
      }
    }
  }

  public getCurrentAnimation(): string {
    return this.currentAnimation
  }

  public setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  public getWidth(): number {
    return this.sprite ? this.sprite.width : 0
  }

  public getHeight(): number {
    return this.sprite ? this.sprite.height : 0
  }

  public getAnimations(): string[] {
    return Object.keys(this.animations)
  }

  public moveRight(): void {
    // During slide, only update facing but don't set velocity
    if (this.movementController.isCurrentlySliding()) {
      this.movementController.updateFacing(this)
      return
    }
    
    this.movementController.moveRight()
    // Only play run animation if on ground and not jumping
    if (this.currentAnimation !== 'run' && this.movementController.isOnGround() && this.currentAnimation !== 'jump') {
      this.playAnimation('run')
    }
    this.movementController.updateFacing(this)
  }

  public moveLeft(): void {
    // During slide, only update facing but don't set velocity
    if (this.movementController.isCurrentlySliding()) {
      this.movementController.updateFacing(this)
      return
    }
    
    this.movementController.moveLeft()
    // Only play run animation if on ground and not jumping
    if (this.currentAnimation !== 'run' && this.movementController.isOnGround() && this.currentAnimation !== 'jump') {
      this.playAnimation('run')
    }
    this.movementController.updateFacing(this)
  }

  public stopMoving(): void {
    // During slide, don't modify velocity
    if (this.movementController.isCurrentlySliding()) {
      return
    }
    
    this.movementController.stopMoving()
    if (this.currentAnimation === 'run') {
      this.playAnimation('idle')
    }
  }

  public slide(): void {
    if (this.movementController.isCurrentlySliding()) return
    
    const movement = this.movementController.getMovement()
    const slideDistance = this.SLIDE_DISTANCE * (movement.facingRight ? 1 : -1)
    
    if (this.sprite) {
      this.movementController.startSlide(slideDistance, this.animations['slideAll'].totalFrames)
    }
    
    this.playAnimation('slideAll', false)
    this.movementController.updateFacing(this)
    console.log('slide initiated')
  }

  public jump(): void {
    const didJump = this.movementController.jump()
    if (didJump && this.currentAnimation !== 'jump') {
      this.playAnimation('jump', false)
    }
  }

  public canMove(): boolean {
    return !this.movementController.isCurrentlySliding()
  }

  public update(
    groundY: number, 
    wallCollisionCheck?: (playerX: number, playerY: number, playerWidth: number, playerHeight: number, newX: number) => number,
    wallTopCheck?: (playerX: number, playerY: number, playerWidth: number, playerHeight: number) => number | null
  ): void {
    // Apply gravity when not on ground (even during slide)
    if (!this.movementController.isOnGround()) {
      this.movementController.applyGravity()
    }

    // Store old position for collision checking
    const oldX = this.x

    // Handle slide movement
    if (this.movementController.isCurrentlySliding()) {
      const slideDisplacement = this.movementController.updateSlide()
      this.x += slideDisplacement
      // Apply vertical movement from gravity during slide
      this.y += this.movementController.getMovement().velocityY
    } else {
      // Update position based on movement controller
      this.movementController.updatePosition(this)
    }

    // Check wall collision if collision check function provided
    if (wallCollisionCheck) {
      const correctedX = wallCollisionCheck(oldX, this.y, this.getWidth(), this.getHeight(), this.x)
      if (correctedX !== this.x) {
        this.x = correctedX
        // Stop horizontal movement when hitting wall
        this.movementController.stopMoving()
      }
    }

    // Check if player should land on wall top
    let effectiveGroundY = groundY
    if (wallTopCheck) {
      const wallTopY = wallTopCheck(this.x, this.y, this.getWidth(), this.getHeight())
      if (wallTopY !== null && wallTopY < groundY) {
        // Player is above the wall, use wall top as ground
        effectiveGroundY = wallTopY
      }
    }

    // Ground collision detection using movement controller
    const landed = this.movementController.handleGroundCollision(this, effectiveGroundY, this.getHeight())
    
    // Return to idle or run animation when landing (but not during slide animation)
    if (landed && this.currentAnimation === 'jump' && !this.movementController.isCurrentlySliding()) {
      const movement = this.movementController.getMovement()
      if (movement.isMoving) {
        this.playAnimation('run')
      } else {
        this.playAnimation('idle')
      }
    }
  }

  public getMovementController(): PlayerMovementController {
    return this.movementController
  }
}
