/**
 * Input action system for handling keyboard combinations
 * Provides a flexible way to define and prioritize player actions
 */

export interface InputState {
  keys: Record<string, boolean>
  getLastPressed: (...keys: string[]) => string | null
}

export interface ActionCondition {
  keys: string[]
  requireAll?: boolean // Default: true (all keys must be pressed)
  requireNone?: string[] // These keys must NOT be pressed
  customCheck?: (state: InputState) => boolean
}

export interface PlayerAction {
  name: string
  priority: number // Higher priority executes first
  condition: ActionCondition
  onPress?: () => void
  onHold?: () => void
  onRelease?: () => void
  blocksOtherActions?: boolean // Default: true
}

export class InputActionSystem {
  private actions: PlayerAction[] = []
  private activeActions: Set<string> = new Set()
  private previousInputState: Map<string, boolean> = new Map()

  /**
   * Register an action
   */
  public registerAction(action: PlayerAction): void {
    this.actions.push(action)
    // Sort by priority (highest first)
    this.actions.sort((a, b) => b.priority - a.priority)
  }

  /**
   * Process input and execute matching actions
   */
  public processInput(inputState: InputState): void {
    let executedBlockingAction = false
    const currentlyActiveActions = new Set<string>()

    for (const action of this.actions) {
      // Skip if a blocking action already executed
      if (executedBlockingAction && action.blocksOtherActions !== false) {
        continue
      }

      const isConditionMet = this.checkCondition(action.condition, inputState)
      const wasActive = this.activeActions.has(action.name)

      if (isConditionMet) {
        currentlyActiveActions.add(action.name)

        if (!wasActive && action.onPress) {
          // Just pressed
          action.onPress()
        }
        
        // Always execute onHold if condition is met (regardless of wasActive)
        if (action.onHold) {
          action.onHold()
        }

        if (action.blocksOtherActions !== false) {
          executedBlockingAction = true
          // Continue checking for other actions, but they won't execute if blocking
        }
      } else if (wasActive && action.onRelease) {
        // Just released
        action.onRelease()
      }
    }

    // Update active actions
    this.activeActions = currentlyActiveActions
  }

  /**
   * Check if action condition is met
   */
  private checkCondition(condition: ActionCondition, state: InputState): boolean {
    const { keys, requireAll = true, requireNone = [], customCheck } = condition

    // Check custom condition first
    if (customCheck && !customCheck(state)) {
      return false
    }

    // Check that none of the excluded keys are pressed
    if (requireNone.length > 0) {
      const hasExcludedKey = requireNone.some(key => state.keys[key.toLowerCase()])
      if (hasExcludedKey) return false
    }

    // Check required keys
    if (requireAll) {
      // All keys must be pressed
      return keys.every(key => state.keys[key.toLowerCase()])
    } else {
      // At least one key must be pressed
      return keys.some(key => state.keys[key.toLowerCase()])
    }
  }

  /**
   * Clear all active actions
   */
  public reset(): void {
    this.activeActions.clear()
    this.previousInputState.clear()
  }

  /**
   * Get list of currently active actions
   */
  public getActiveActions(): string[] {
    return Array.from(this.activeActions)
  }
}
