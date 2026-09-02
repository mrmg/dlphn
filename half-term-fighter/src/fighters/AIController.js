import { GAME } from '../systems/CombatData.js';

/** Comedy CPU — holds range, throws a move, backs off. Never face-hugs. */
export class AIController {
  constructor(fighter, opponent) {
    this.fighter = fighter;
    this.opponent = opponent;
    this.actionCooldown = 0;
    this.thinkTimer = 0;
    this.pendingMove = null;
    this.aggression = fighter.charId === 'kid' ? 0.42 : 0.28;
    this.preferredRange = 98;
    this.retreatTimer = 0;
  }

  tickTimers() {
    if (this.actionCooldown > 0) this.actionCooldown--;
    if (this.thinkTimer > 0) this.thinkTimer--;
    if (this.retreatTimer > 0) this.retreatTimer--;
  }

  update() {
    const f = this.fighter;
    const o = this.opponent;
    if (!f.isAlive || f.isBusy) {
      return this.neutral();
    }

    if (this.retreatTimer > 0) {
      return this.away();
    }

    const dist = Math.abs(f.x - o.x);
    const tooClose = dist < GAME.MIN_FIGHTER_GAP + 8;
    const tooFar = dist > this.preferredRange + 28;
    const inRange = dist >= GAME.MIN_FIGHTER_GAP && dist <= this.preferredRange + 18;

    if (tooClose) return this.away();

    if (this.thinkTimer > 0) {
      if (tooFar) return this.toward();
      return this.neutral();
    }

    this.thinkTimer = 18 + Math.floor(Math.random() * 14);

    if (f.meter >= 100 && inRange && this.actionCooldown <= 0) {
      this.actionCooldown = 75;
      this.pendingMove = 'super';
      this.retreatTimer = 22;
      return this.neutral();
    }

    if (inRange && Math.random() < this.aggression * 0.55 && this.actionCooldown <= 0) {
      this.actionCooldown = 40 + Math.floor(Math.random() * 18);
      this.pendingMove = Math.random() > 0.35 ? 'specialPunch' : 'lightKick';
      this.retreatTimer = 16;
      return this.neutral();
    }

    if (inRange && this.actionCooldown <= 0) {
      this.actionCooldown = 22 + Math.floor(Math.random() * 14);
      this.pendingMove = Math.random() > 0.45 ? 'lightKick' : 'lightPunch';
      this.retreatTimer = 12;
      return this.neutral();
    }

    if (tooFar) return this.toward();
    return this.neutral();
  }

  consumePendingMove() {
    const move = this.pendingMove;
    this.pendingMove = null;
    return move;
  }

  toward() {
    const f = this.fighter;
    const o = this.opponent;
    return f.x > o.x
      ? { left: true, right: false, up: false, down: false, punch: false, kick: false, special: false, super: false }
      : { left: false, right: true, up: false, down: false, punch: false, kick: false, special: false, super: false };
  }

  away() {
    const f = this.fighter;
    const o = this.opponent;
    return f.x > o.x
      ? { left: false, right: true, up: false, down: false, punch: false, kick: false, special: false, super: false }
      : { left: true, right: false, up: false, down: false, punch: false, kick: false, special: false, super: false };
  }

  neutral() {
    return { left: false, right: false, up: false, down: false, punch: false, kick: false, special: false, super: false };
  }
}
