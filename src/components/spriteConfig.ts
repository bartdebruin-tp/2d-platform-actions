// Sprite sheet configuration for all knight animations
// Each sprite is 120x80 pixels

export interface SpriteAnimation {
  name: string
  frameCount: number
  fileName: string
}

export const SPRITE_ANIMATIONS: SpriteAnimation[] = [
  { name: 'attack', frameCount: 4, fileName: '_Attack.png' },
  { name: 'attack2', frameCount: 4, fileName: '_Attack2.png' },
  { name: 'attack2NoMovement', frameCount: 4, fileName: '_Attack2NoMovement.png' },
  { name: 'attackCombo', frameCount: 10, fileName: '_AttackCombo.png' },
  { name: 'attackComboNoMovement', frameCount: 10, fileName: '_AttackComboNoMovement.png' },
  { name: 'attackNoMovement', frameCount: 4, fileName: '_AttackNoMovement.png' },
  { name: 'crouch', frameCount: 1, fileName: '_Crouch.png' },
  { name: 'crouchAll', frameCount: 13, fileName: '_CrouchAll.png' },
  { name: 'crouchAttack', frameCount: 4, fileName: '_CrouchAttack.png' },
  { name: 'crouchTransition', frameCount: 3, fileName: '_CrouchTransition.png' },
  { name: 'crouchWalk', frameCount: 8, fileName: '_CrouchWalk.png' },
  { name: 'dash', frameCount: 2, fileName: '_Dash.png' },
  { name: 'death', frameCount: 10, fileName: '_Death.png' },
  { name: 'deathNoMovement', frameCount: 10, fileName: '_DeathNoMovement.png' },
  { name: 'fall', frameCount: 3, fileName: '_Fall.png' },
  { name: 'hit', frameCount: 1, fileName: '_Hit.png' },
  { name: 'idle', frameCount: 10, fileName: '_Idle.png' },
  { name: 'jump', frameCount: 3, fileName: '_Jump.png' },
  { name: 'jumpFallInbetween', frameCount: 2, fileName: '_JumpFallInbetween.png' },
  { name: 'roll', frameCount: 12, fileName: '_Roll.png' },
  { name: 'run', frameCount: 10, fileName: '_Run.png' },
  { name: 'slide', frameCount: 1, fileName: '_Slide.png' },
  { name: 'slideAll', frameCount: 4, fileName: '_SlideAll.png' },
  { name: 'slideTransitionEnd', frameCount: 3, fileName: '_SlideTransitionEnd.png' },
  { name: 'slideTransitionStart', frameCount: 2, fileName: '_SlideTransitionStart.png' },
  { name: 'turnAround', frameCount: 3, fileName: '_TurnAround.png' },
  { name: 'wallClimb', frameCount: 6, fileName: '_WallClimb.png' },
  { name: 'wallClimbNoMovement', frameCount: 4, fileName: '_WallClimbNoMovement.png' },
  { name: 'wallHang', frameCount: 1, fileName: '_WallHang.png' },
  { name: 'wallSlide', frameCount: 3, fileName: '_WallSlide.png' }
]

const FRAME_WIDTH = 120
const FRAME_HEIGHT = 80

// Generate frame definitions for a sprite sheet
function generateFrames(frameCount: number, animationName: string) {
  const frames: Record<string, { frame: { x: number; y: number; w: number; h: number } }> = {}
  
  for (let i = 0; i < frameCount; i++) {
    frames[`${animationName}_${i}`] = {
      frame: { x: i * FRAME_WIDTH, y: 0, w: FRAME_WIDTH, h: FRAME_HEIGHT }
    }
  }
  
  return frames
}

// Generate animation sequence
function generateAnimation(frameCount: number, animationName: string) {
  return Array.from({ length: frameCount }, (_, i) => `${animationName}_${i}`)
}

// Build complete sprite sheet data for a single animation
export function buildSpriteSheetData(animation: SpriteAnimation) {
  return {
    frames: generateFrames(animation.frameCount, animation.name),
    animations: {
      [animation.name]: generateAnimation(animation.frameCount, animation.name)
    },
    meta: {
      scale: '1'
    }
  }
}
