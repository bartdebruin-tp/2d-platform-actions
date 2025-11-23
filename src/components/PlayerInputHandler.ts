import { Player } from './Player'
import { InputActionSystem, InputState } from './InputActionSystem'

export class PlayerInputHandler {
  private player: Player
  private actionSystem: InputActionSystem

  constructor(player: Player) {
    this.player = player
    this.actionSystem = new InputActionSystem()
    this.setupActions()
  }

  private setupActions(): void {
    // JUMP ACTION - Highest priority
    // W to jump (only when on ground and can move)
    this.actionSystem.registerAction({
      name: 'jump',
      priority: 100,
      condition: {
        keys: ['w'],
        customCheck: () => this.player.canMove() && this.player.getMovementController().isOnGround()
      },
      onPress: () => {
        this.player.jump()
      },
      blocksOtherActions: false
    })

    // SLIDE ACTION - High priority
    // Spacebar to slide (only when player can move and has been running for at least 3 frames)
    this.actionSystem.registerAction({
      name: 'slide',
      priority: 90,
      condition: {
        keys: [' '],
        customCheck: () => this.player.canMove() && this.player.getMovementController().canSlide()
      },
      onPress: () => {
        this.player.slide()
      },
      blocksOtherActions: true
    })

    // MOVEMENT - Simplified single action that handles all cases
    this.actionSystem.registerAction({
      name: 'movement',
      priority: 50,
      condition: {
        keys: [],
        customCheck: (state: InputState) => {
          return state.keys['a'] || state.keys['d']
        }
      },
      onHold: () => {
        const keys = this.getInputKeys()
        const hasShift = keys['shift']
        const hasA = keys['a']
        const hasD = keys['d']
        
        // Determine direction
        let moveRight = false
        let moveLeft = false
        
        if (hasA && hasD) {
          // Both pressed - use last pressed
          const lastKey = this.lastMovementKey
          moveRight = lastKey === 'd'
          moveLeft = lastKey === 'a'
        } else {
          moveRight = hasD
          moveLeft = hasA
        }
        
        // Apply movement with or without boost
        if (hasShift) {
          this.player.getMovementController().enableSpeedBoost()
        } else {
          this.player.getMovementController().disableSpeedBoost()
        }
        
        if (moveRight) {
          this.player.moveRight()
        } else if (moveLeft) {
          this.player.moveLeft()
        }
      },
      blocksOtherActions: true
    })

    // IDLE - Lowest priority (default action)
    // No movement keys pressed
    this.actionSystem.registerAction({
      name: 'idle',
      priority: 0,
      condition: {
        keys: [],
        customCheck: (state: InputState) => {
          return !state.keys['d'] && !state.keys['a']
        }
      },
      onHold: () => {
        this.player.stopMoving()
        this.player.getMovementController().disableSpeedBoost()
      },
      blocksOtherActions: false
    })
  }

  private inputKeys: Record<string, boolean> = {}

  private getInputKeys(): Record<string, boolean> {
    return this.inputKeys
  }

  private lastMovementKey: string | null = null

  public handleInput(keys: Record<string, boolean>, getLastPressed: (...keyList: string[]) => string | null): void {
    // Store keys for access in actions
    this.inputKeys = keys
    
    // Track last movement key
    this.lastMovementKey = getLastPressed('d', 'a')

    // Create input state
    const inputState: InputState = {
      keys,
      getLastPressed
    }

    // Process all actions
    this.actionSystem.processInput(inputState)
  }

  public reset(): void {
    this.actionSystem.reset()
    this.lastMovementKey = null
  }

  public getActiveActions(): string[] {
    return this.actionSystem.getActiveActions()
  }
}
