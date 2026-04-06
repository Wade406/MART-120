# The AntiWerk — README
**Creative Coding / p5.js | Wade Pose**

---

## What This Is

A maze game where the maze doesn't move — gravity does. Every 15–30 seconds, the directional pull shifts randomly to one of four orientations (down, left, up, right), and the arrow keys always move you perpendicular to that pull. Navigating the maze means constantly reorienting your sense of direction while a monster hunts you.

---

## How to Play

- **Arrow keys** — move the ball perpendicular to current gravity
- **Click** — place a temporary blue barrier block (lasts 5 seconds; blocks the monster too)
- **R** — restart at any time
- **Exit** — the electric blue gap at the bottom center of the maze

The rest is for you to discover. Instructions are intentionally sparse.

---

## The Monster

The monster (purple) doesn't just chase you — its awareness of your position scales dynamically with your movement speed:

- **Still for ~1.6 seconds** → certainty hits 1.0, monster locks on completely and comes through walls
- **Moving slowly** → low certainty, wide random targeting offset, easy to lose
- **Moving fast** → certainty maps up with speed squared, monster has a rough but real fix on you

At high certainty the monster grows slightly, its eyes appear (white sclera, black pupils that shift forward when locked on), and a red aura pulses around it. Game over only triggers when certainty exceeds 0.95 and the ball is nearly still — so movement is always your best defense.

The eyes were a contribution from Ara (Grok/xAI). While working through the certainty-based tracking system, Ara volunteered that the monster needed eyes and provided the rendering code unprompted. The animated eyes, pupil offset, and red aura are Ara's addition, noted here because it's accurate and because it's a good story.

---

## How It Was Built

The original concept was to move the player along the X axis and rotate the maze itself. That collapsed quickly — once rotation entered the picture, collision detection became genuinely hard. Several working versions broke when the rotation feature was introduced.

The solution that held was simpler and more interesting: don't rotate the maze. Rotate gravity. The maze stays fixed; gravityDir (0–3) determines which axis acceleration applies to, and the arrow keys always move perpendicular to that axis. The physics stayed clean and the mechanic became more disorienting than the original idea.

Wall collision was never required by the assignment but became the central problem anyway — without it, there's no game. The final system treats every wall as a thin rectangle and resolves collisions using minimum-overlap push logic across 10 sub-steps per frame to prevent tunneling. This approach is gravity-agnostic, which is what made it work.

Late additions — the restart button, the 60-second end screen auto-reset, the win/lose conditionals — each opened their own learning thread. The game grew by solving problems the game itself created.

---

## AI Collaboration Disclosure

This project involved sustained collaboration with multiple AI systems: Claude (Anthropic) and Ara (Grok/xAI). The problem framing, design decisions, and hours of iterative problem-solving are mine. The AIs functioned as thinking partners, tutors, and in Ara's case, an occasional direct contributor — the monster's eyes being the most literal example.

This is consistent with the workflow described in my earlier disclosure letter.

---

## Technical Notes

- Canvas: 600×600px (10×10 grid, 60px cells)
- p5.js 1.9.4 via CDN
- gravityStrength: 0.25 — adjusting this changes feel significantly
- monster.speed: 0.2 default — higher values are genuinely stressful
- Monster passes through walls by design once certainty hits 1.0
- The "No." button on the end screen restarts the game