import { AnimatedSprite, Container } from 'pixi.js'
import { loadKnightSprites } from '@/composables/useSpriteLoader'
import { PlayerMovementController } from '@/composables/usePlayerMovement'

export class Player extends Container {
  private sprite: AnimatedSprite | null = null
  private readonly SCALE = 1.5
  private animations: Record<string, AnimatedSprite> = {}
  private currentAnimation: string = 'idle'
  private movementController: PlayerMovementController
  private isSliding: boolean = false
  private slideDistance: number = 0
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
      animSprite.animationSpeed = 0.15
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
          this.isSliding = false
          this.playAnimation('idle')
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
    this.movementController.moveRight()
    if (this.currentAnimation !== 'run') {
      this.playAnimation('run')
    }
    this.movementController.updateFacing(this)
  }

  public moveLeft(): void {
    this.movementController.moveLeft()
    if (this.currentAnimation !== 'run') {
      this.playAnimation('run')
    }
    this.movementController.updateFacing(this)
  }

  public stopMoving(): void {
    this.movementController.stopMoving()
    if (this.currentAnimation === 'run') {
      this.playAnimation('idle')
    }
  }

  public slide(): void {
    if (this.isSliding) return
    
    this.isSliding = true
    const movement = this.movementController.getMovement()
    this.slideDistance = this.SLIDE_DISTANCE * (movement.facingRight ? 1 : -1)
    this.playAnimation('slideAll', false)
    this.movementController.updateFacing(this)
  }

  public canMove(): boolean {
    return !this.isSliding
  }

  public update(): void {
    // Handle slide movement
    if (this.isSliding && this.sprite) {
      const totalFrames = this.sprite.totalFrames
      const currentFrame = this.sprite.currentFrame
      const slidePerFrame = this.slideDistance / totalFrames
      this.x += slidePerFrame
    } else {
      // Update position based on movement controller
      this.movementController.updatePosition(this)
    }
  }

  public getMovementController(): PlayerMovementController {
    return this.movementController
  }
}
