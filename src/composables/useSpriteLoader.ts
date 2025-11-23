import { Spritesheet, Assets } from 'pixi.js'
import { SPRITE_ANIMATIONS, buildSpriteSheetData } from '@/composables/spriteConfig'

// Import all sprite sheets
import attackSprite from '@/assets/120x80_PNGSheets/_Attack.png'
import attack2Sprite from '@/assets/120x80_PNGSheets/_Attack2.png'
import attack2NoMovementSprite from '@/assets/120x80_PNGSheets/_Attack2NoMovement.png'
import attackComboSprite from '@/assets/120x80_PNGSheets/_AttackCombo.png'
import attackComboNoMovementSprite from '@/assets/120x80_PNGSheets/_AttackComboNoMovement.png'
import attackNoMovementSprite from '@/assets/120x80_PNGSheets/_AttackNoMovement.png'
import crouchSprite from '@/assets/120x80_PNGSheets/_Crouch.png'
import crouchAllSprite from '@/assets/120x80_PNGSheets/_CrouchAll.png'
import crouchAttackSprite from '@/assets/120x80_PNGSheets/_CrouchAttack.png'
import crouchTransitionSprite from '@/assets/120x80_PNGSheets/_CrouchTransition.png'
import crouchWalkSprite from '@/assets/120x80_PNGSheets/_CrouchWalk.png'
import dashSprite from '@/assets/120x80_PNGSheets/_Dash.png'
import deathSprite from '@/assets/120x80_PNGSheets/_Death.png'
import deathNoMovementSprite from '@/assets/120x80_PNGSheets/_DeathNoMovement.png'
import fallSprite from '@/assets/120x80_PNGSheets/_Fall.png'
import hitSprite from '@/assets/120x80_PNGSheets/_Hit.png'
import idleSprite from '@/assets/120x80_PNGSheets/_Idle.png'
import jumpSprite from '@/assets/120x80_PNGSheets/_Jump.png'
import jumpFallInbetweenSprite from '@/assets/120x80_PNGSheets/_JumpFallInbetween.png'
import rollSprite from '@/assets/120x80_PNGSheets/_Roll.png'
import runSprite from '@/assets/120x80_PNGSheets/_Run.png'
import slideSprite from '@/assets/120x80_PNGSheets/_Slide.png'
import slideAllSprite from '@/assets/120x80_PNGSheets/_SlideAll.png'
import slideTransitionEndSprite from '@/assets/120x80_PNGSheets/_SlideTransitionEnd.png'
import slideTransitionStartSprite from '@/assets/120x80_PNGSheets/_SlideTransitionStart.png'
import turnAroundSprite from '@/assets/120x80_PNGSheets/_TurnAround.png'
import wallClimbSprite from '@/assets/120x80_PNGSheets/_WallClimb.png'
import wallClimbNoMovementSprite from '@/assets/120x80_PNGSheets/_WallClimbNoMovement.png'
import wallHangSprite from '@/assets/120x80_PNGSheets/_WallHang.png'
import wallSlideSprite from '@/assets/120x80_PNGSheets/_WallSlide.png'

const SPRITE_URLS: Record<string, string> = {
  attack: attackSprite,
  attack2: attack2Sprite,
  attack2NoMovement: attack2NoMovementSprite,
  attackCombo: attackComboSprite,
  attackComboNoMovement: attackComboNoMovementSprite,
  attackNoMovement: attackNoMovementSprite,
  crouch: crouchSprite,
  crouchAll: crouchAllSprite,
  crouchAttack: crouchAttackSprite,
  crouchTransition: crouchTransitionSprite,
  crouchWalk: crouchWalkSprite,
  dash: dashSprite,
  death: deathSprite,
  deathNoMovement: deathNoMovementSprite,
  fall: fallSprite,
  hit: hitSprite,
  idle: idleSprite,
  jump: jumpSprite,
  jumpFallInbetween: jumpFallInbetweenSprite,
  roll: rollSprite,
  run: runSprite,
  slide: slideSprite,
  slideAll: slideAllSprite,
  slideTransitionEnd: slideTransitionEndSprite,
  slideTransitionStart: slideTransitionStartSprite,
  turnAround: turnAroundSprite,
  wallClimb: wallClimbSprite,
  wallClimbNoMovement: wallClimbNoMovementSprite,
  wallHang: wallHangSprite,
  wallSlide: wallSlideSprite
}

export interface LoadedSpritesheet {
  name: string
  spritesheet: Spritesheet
}

/**
 * Load all knight sprite sheets
 * @returns Array of loaded spritesheets with their names
 */
export async function loadKnightSprites(): Promise<LoadedSpritesheet[]> {
  const loadedSprites: LoadedSpritesheet[] = []

  for (const animConfig of SPRITE_ANIMATIONS) {
    const texture = await Assets.load(SPRITE_URLS[animConfig.name])
    const spritesheet = new Spritesheet(texture, buildSpriteSheetData(animConfig))
    await spritesheet.parse()

    loadedSprites.push({
      name: animConfig.name,
      spritesheet
    })
  }

  return loadedSprites
}

/**
 * Get all available animation names
 */
export function getAvailableAnimations(): string[] {
  return SPRITE_ANIMATIONS.map(anim => anim.name)
}
