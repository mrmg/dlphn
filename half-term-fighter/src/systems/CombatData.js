export const GAME = {
  WIDTH: 1280,
  HEIGHT: 720,
  GROUND_Y: 598,
  ROUND_TIME: 99,
  DAY_LABEL: 'HALF TERM DAY 9',
  MIN_FIGHTER_GAP: 72,
  AUTO_LUNGE_GAP: 118
};

export const CHARACTERS = {
  dad: {
    id: 'dad',
    name: 'PARENT',
    tag: 'TAXI ATM HUMAN SHIELD',
    superName: 'CAFFEINE CRASH',
    specialPunchName: 'MUG TOSS',
    specialKickName: 'BEDTIME SLIDE',
    maxHealth: 1000,
    walkSpeed: 260,
    jumpVelocity: -680,
    portrait: 'dad-portrait',
    spriteScale: 2.55,
    stats: {
      punchDamage: 95,
      kickDamage: 115,
      specialDamage: 175,
      superDamage: 320
    },
    projectiles: {
      specialPunch: {
        texture: 'mug-projectile',
        speed: 560,
        offsetX: 62,
        offsetY: -95,
        width: 44,
        height: 44,
        scale: 4.2,
        lifetime: 150,
        maxHits: 1,
        spin: 480,
        trail: 120
      },
      super: {
        texture: 'mug-projectile',
        speed: 720,
        offsetX: 75,
        offsetY: -100,
        width: 52,
        height: 52,
        scale: 5.2,
        lifetime: 120,
        maxHits: 4,
        pierce: true,
        spin: 620,
        trail: 180
      }
    }
  },
  kid: {
    id: 'kid',
    name: 'KID',
    tag: 'SUGAR RUSH UNLIMITED',
    superName: 'SUGAR RUSH ULTIMATE',
    specialPunchName: 'TANTRUM FIST',
    specialKickName: 'BOUNCE KICK',
    maxHealth: 1300,
    walkSpeed: 300,
    jumpVelocity: -740,
    portrait: 'kid-portrait',
    spriteScale: 2.55,
    stats: {
      punchDamage: 70,
      kickDamage: 85,
      specialDamage: 145,
      superDamage: 260
    },
    projectiles: {
      specialPunch: {
        texture: 'star-projectile',
        speed: 620,
        offsetX: 58,
        offsetY: -88,
        width: 48,
        height: 48,
        scale: 4.4,
        lifetime: 140,
        maxHits: 1,
        spin: -360,
        trail: 120
      },
      super: {
        texture: 'star-projectile',
        speed: 780,
        offsetX: 68,
        offsetY: -92,
        width: 56,
        height: 56,
        scale: 5.4,
        lifetime: 115,
        maxHits: 5,
        pierce: true,
        spin: -520,
        trail: 200
      }
    }
  }
};

export const MOVES = {
  lightPunch: {
    id: 'lightPunch',
    startup: 4,
    active: 10,
    recovery: 10,
    damage: 1,
    hitstun: 12,
    knockback: 140,
    reach: 105,
    type: 'punch'
  },
  lightKick: {
    id: 'lightKick',
    startup: 5,
    active: 11,
    recovery: 11,
    damage: 1,
    hitstun: 14,
    knockback: 170,
    reach: 115,
    type: 'kick'
  },
  jumpKick: {
    id: 'jumpKick',
    startup: 3,
    active: 12,
    recovery: 8,
    damage: 1.1,
    hitstun: 14,
    knockback: 190,
    reach: 95,
    type: 'kick'
  },
  specialPunch: {
    id: 'specialPunch',
    startup: 8,
    active: 26,
    recovery: 16,
    damage: 1.9,
    hitstun: 22,
    knockback: 300,
    reach: 0,
    type: 'special',
    spawnsProjectile: true,
    projectileAt: 10
  },
  specialKick: {
    id: 'specialKick',
    startup: 6,
    active: 22,
    recovery: 18,
    damage: 1.6,
    hitstun: 18,
    knockback: 240,
    reach: 145,
    type: 'special',
    slideSpeed: 380
  },
  super: {
    id: 'super',
    startup: 6,
    active: 58,
    recovery: 20,
    damage: 3.2,
    hitstun: 52,
    knockback: 620,
    reach: 220,
    type: 'super',
    meterCost: 100,
    maxHits: 12,
    invulnStartup: 32,
    dashSpeed: 540,
    spawnsProjectile: true,
    projectileAt: 8,
    projectileBurst: 8,
    projectileInterval: 4
  }
};

/** Motion inputs — quarter-circle relative to facing (↓ ↘ → + button). */
export const MOTIONS = {
  super: { sequence: ['down', 'down-right', 'right', 'down', 'down-right', 'right'], button: 'kick' },
  specialPunch: { sequence: ['down', 'down-right', 'right'], button: 'punch' },
  specialKick: { sequence: ['down', 'down-right', 'right'], button: 'kick' }
};
