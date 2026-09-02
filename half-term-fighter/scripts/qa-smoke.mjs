#!/usr/bin/env node
/** Headless smoke test — Half Term Punchdown combat feel */
import { chromium } from 'playwright';

const BASE = process.env.HTF_URL || 'http://127.0.0.1:3457/half-term-fighter/';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=swiftshader', '--disable-gpu-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];

  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });

  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);
  await page.waitForFunction(() => {
    const g = window.__HTF_GAME__;
    return g?.scene?.keys && Object.keys(g.scene.keys).length > 0;
  }, null, { timeout: 45000 });
  await sleep(1200);

  await page.evaluate(() => {
    const game = window.__HTF_GAME__;
    const sel = game.scene.getScene('CharacterSelectScene');
    if (sel) sel.scene.start('FightScene', { playerChar: 'dad', cpuChar: 'kid' });
  });

  await sleep(2200);

  const results = await page.evaluate(async () => {
    const game = window.__HTF_GAME__;
    const scene = game.scene.getScene('FightScene');
    if (!scene?.player) return { ok: false, reason: 'no fight scene' };

    scene.fightStarted = true;
    scene.roundOver = false;

    const p = scene.player;
    const c = scene.cpu;
    p.sprite.x = 400;
    c.sprite.x = 880;
    p.sprite.y = 598;
    c.sprite.y = 598;
    p.body.setVelocity(0, 0);
    c.body.setVelocity(0, 0);
    scene.prevInput = { left: false, right: false, up: false, down: false };
    scene.inputBuffer.clearMotion();

    const step = async (fn) => {
      scene.frame++;
      scene.inputBuffer.tick();
      fn();
      p.snapToGround();
      c.snapToGround();
      scene.separateFighters();
      await new Promise((r) => requestAnimationFrame(r));
    };

    const startKidHp = c.health;
    const startDadHp = p.health;

    for (let i = 0; i < 55; i++) {
      await step(() => {
        scene.readPlayerInput = () => ({ left: false, right: true, up: false, down: false, punch: false, kick: false, special: false, super: false });
        scene.processPlayerInput();
        scene.cpu.applyInput({ left: true, right: false, up: false, down: false });
      });
    }

    // Close gap for punch test
    c.sprite.x = p.x + 90;

    const distBefore = Math.abs(p.x - c.x);

    await step(() => {
      scene.readPlayerInput = () => ({ left: false, right: false, up: false, down: false, punch: true, kick: false, special: false, super: false });
      scene.processPlayerInput();
    });

    for (let f = 0; f < 35; f++) {
      await step(() => {
        if (p.updateAttack()) scene.checkHit(p, c);
        c.updateAttack();
        p.tickHitRecovery();
        c.tickHitRecovery();
        p.tickCooldowns();
        c.tickCooldowns();
      });
    }
    const afterPunchKid = c.health;
    const kidStuckInHit = c.state === 'hit' && c.hitstun > 0;

    // Wait for hitstun to clear
    for (let f = 0; f < 40; f++) {
      await step(() => {
        p.tickHitRecovery();
        c.tickHitRecovery();
        p.tickCooldowns();
        c.tickCooldowns();
        if (c.state === 'hit' && c.hitstun <= 0) c.applyInput({ left: false, right: false, up: false, down: false });
      });
    }
    const kidRecovered = c.state === 'idle' || c.state === 'walk' || (c.state === 'hit' && c.hitstun <= 0 && c.knockdownTimer <= 0);
    const kidStateAfterWait = { state: c.state, hitstun: c.hitstun, kd: c.knockdownTimer };

    // Regression: CPU must not stay frozen after hitstun with idle state + orphaned hitstun
    c.state = 'idle';
    c.hitstun = 18;
    let cpuGhostStun = true;
    for (let f = 0; f < 5; f++) {
      await step(() => {
        c.tickHitRecovery();
        const blocked = c.hitstun > 0;
        c.applyInput({ left: true, right: false, up: false, down: false });
        if (c.body.velocity.x !== 0) cpuGhostStun = false;
      });
    }

    p.state = 'idle';
    p.currentMove = null;
    p.attackPoseLocked = false;
    p.specialCooldown = 0;
    p.jumpGraceFrames = 0;
    p.hitstun = 0;
    p.body.setVelocity(0, 0);
    p.sprite.x = 400;
    c.sprite.x = 880;
    p.sprite.y = 598;
    c.sprite.y = 598;
    scene.prevInput = { left: false, right: false, up: false, down: false };
    scene.inputBuffer.clearMotion();

    // Motion special: ↓ ↘ → + punch
    await step(() => {
      scene.readPlayerInput = () => ({ left: false, right: false, up: false, down: true, punch: false, kick: false });
      scene.processPlayerInput();
    });
    for (let i = 0; i < 3; i++) {
      await step(() => {
        scene.readPlayerInput = () => ({ left: false, right: true, up: false, down: true, punch: false, kick: false });
        scene.processPlayerInput();
      });
    }
    await step(() => {
      scene.readPlayerInput = () => ({ left: false, right: true, up: false, down: false, punch: true, kick: false });
      scene.processPlayerInput();
    });

    let specialStarted = p.state === 'attack' && p.currentMove?.type === 'special';
    const motionDebug = {
      grounded: p.isGrounded,
      qcf: scene.inputBuffer.matchMotionForFacing(['down', 'down-right', 'right'], p.facing),
      timer: scene.inputBuffer.motionTimer
    };
    let maxProjectilesSpawned = 0;

    for (let f = 0; f < 45; f++) {
      await step(() => {
        if (p.updateAttack()) scene.checkHit(p, c);
        scene.updateProjectiles();
        maxProjectilesSpawned = Math.max(maxProjectilesSpawned, p.projectilesSpawned);
      });
    }
    const projectileSpawned = maxProjectilesSpawned > 0;

    c.sprite.x = p.x + 48;
    c.sprite.y = p.GROUND_Y;
    c.tryStartMove('lightPunch', p);
    for (let f = 0; f < 35; f++) {
      await step(() => {
        if (c.updateAttack()) scene.checkHit(c, p);
      });
    }
    const afterCpuHitDad = p.health;

    return {
      ok: true,
      distBefore,
      startKidHp,
      afterPunchKid,
      kidDamaged: afterPunchKid < startKidHp,
      kidRecovered,
      kidStateAfterWait,
      cpuGhostStun,
      kidStuckInHit,
      startDadHp,
      afterCpuHitDad,
      dadDamaged: afterCpuHitDad < startDadHp,
      specialStarted,
      motionDebug,
      projectileSpawned: projectileSpawned,
      playerAnim: p.sprite.anims.currentAnim?.key,
      playerFrame: p.sprite.frame.name
    };
  });

  await browser.close();

  const fails = [];
  if (errors.length) fails.push(...errors);
  if (!results.ok) fails.push(results.reason);
  if (!results.kidDamaged) fails.push('player punch did not damage kid');
  if (!results.kidRecovered) fails.push('cpu stuck in hit stun after punch');
  if (results.cpuGhostStun) fails.push('cpu ghost-stunned (idle + hitstun blocks movement)');
  if (!results.dadDamaged) fails.push('cpu punch did not damage dad');
  if (!results.specialStarted) fails.push('motion special (↓↘→+J) did not start');
  if (!results.projectileSpawned) fails.push('special did not spawn projectile');

  console.log(JSON.stringify({ results, errors, fails }, null, 2));
  process.exit(fails.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
