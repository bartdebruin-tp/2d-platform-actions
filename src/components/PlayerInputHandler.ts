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
    // SLIDE ACTION - Highest priority
    // Spacebar to slide (only when player can move)
    this.actionSystem.registerAction({
      name: 'slide',
      priority: 100,
      condition: {
        keys: [' '],
        customCheck: () => this.player.canMove()
      },
      onPress: () => {
        this.player.slide()
      },
      blocksOtherActions: true
    })

    // MOVE RIGHT WITH BOOST - High priority
    // D + Shift to run right with speed boost
    this.actionSystem.registerAction({
      name: 'moveRightBoosted',
      priority: 80,
      condition: {
        keys: ['d', 'shift'],
        customCheck: () => this.player.canMove()
      },
      onPress: () => {
        this.player.getMovementController().enableSpeedBoost()
        this.player.moveRight()
      },
      onHold: () => {
        this.player.getMovementController().enableSpeedBoost()
        this.player.moveRight()
      },
      blocksOtherActions: true
    })

    // MOVE LEFT WITH BOOST
    // A + Shift to run left with speed boost
    this.actionSystem.registerAction({
      name: 'moveLeftBoosted',
      priority: 80,
      condition: {
        keys: ['a', 'shift'],
        customCheck: () => this.player.canMove()
      },
      onPress: () => {
        this.player.getMovementController().enableSpeedBoost()
        this.player.moveLeft()
      },
      onHold: () => {
        this.player.getMovementController().enableSpeedBoost()
        this.player.moveLeft()
      },
      blocksOtherActions: true
    })

    // MOVE RIGHT - Normal priority
    // D to run right
    this.actionSystem.registerAction({
      name: 'moveRight',
      priority: 50,
      condition: {
        keys: ['d'],
        requireNone: ['a'], // Don't activate if both A and D pressed
        customCheck: () => this.player.canMove()
      },
      onPress: () => {
        this.player.getMovementController().disableSpeedBoost()
        this.player.moveRight()
      },
      onHold: () => {
        this.player.getMovementController().disableSpeedBoost()
        this.player.moveRight()
      },
      blocksOtherActions: true
    })

    // MOVE LEFT
    // A to run left
    this.actionSystem.registerAction({
      name: 'moveLeft',
      priority: 50,
      condition: {
        keys: ['a'],
        requireNone: ['d'], // Don't activate if both A and D pressed
        customCheck: () => this.player.canMove()
      },
      onPress: () => {
        this.player.getMovementController().disableSpeedBoost()
        this.player.moveLeft()
      },
      onHold: () => {
        this.player.getMovementController().disableSpeedBoost()
        this.player.moveLeft()
      },
      blocksOtherActions: true
    })

    // MOVE WITH LAST PRESSED KEY - Fallback for both keys pressed
    // When both A and D are pressed, use the last pressed key
    this.actionSystem.registerAction({
      name: 'moveWithPriority',
      priority: 45,
      condition: {
        keys: ['a', 'd'],
        customCheck: (state: InputState) => {
          return this.player.canMove() && state.keys['a'] && state.keys['d']
        }
      },
      onHold: () => {
        const lastKey = this.getLastMovementKey()
        if (lastKey === 'd') {
          this.player.moveRight()
        } else if (lastKey === 'a') {
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
          return this.player.canMove() && !state.keys['d'] && !state.keys['a']
        }
      },
      onHold: () => {
        this.player.stopMoving()
        this.player.getMovementController().disableSpeedBoost()
      },
      blocksOtherActions: false
    })

    // SLIDING STATE - Maintain stopped movement while sliding
    this.actionSystem.registerAction({
      name: 'maintainSlideState',
      priority: 1,
      condition: {
        keys: [],
        customCheck: () => !this.player.canMove()
      },
      onHold: () => {
        this.player.getMovementController().stopMoving()
      },
      blocksOtherActions: false
    })
  }

  private lastMovementKey: string | null = null

  public handleInput(keys: Record<string, boolean>, getLastPressed: (...keyList: string[]) => string | null): void {
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

  private getLastMovementKey(): string | null {
    return this.lastMovementKey
  }

  public reset(): void {
    this.actionSystem.reset()
    this.lastMovementKey = null
  }

  public getActiveActions(): string[] {
    return this.actionSystem.getActiveActions()
  }
}
