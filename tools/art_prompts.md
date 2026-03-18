# AI Art Generation Prompts Guide

This guide provides ready-to-use prompts for generating game sprites with AI tools.
Replace placeholder sprites in `assets/sprites/` with generated art.

---

## Tool Setup

### PixelLab (pixellab.ai) — Primary sprite tool
- Best for: character animation sprite sheets
- Supports: consistent style across frames, transparency, animation

### Midjourney — Style reference
- Best for: concept art, environment backgrounds
- Use `--sref [URL]` for style consistency
- Use `--seed [number]` for repeatable results

### Aseprite — Cleanup & export
- Import generated sprites
- Clean up artifacts, align frames
- Export as sprite sheet PNG + JSON metadata

---

## Mickey Mouse (Steamboat Willie 1928)

### CRITICAL: Legal constraints
- Black and white ONLY
- NO gloves
- NO red shorts
- Pie-cut eyes (white circle with black wedge)
- Long pointed snout
- Thin limbs, large round ears
- Simple clothing or no clothing

### PixelLab Prompts

**Idle animation:**
```
1928 Steamboat Willie Mickey Mouse, black and white, side view, standing idle,
pie-cut eyes, long snout, no gloves, thin limbs, large round ears,
vintage 1920s rubber hose cartoon style, pixel art, 64x64,
breathing idle animation, 4 frames
```

**Walk cycle:**
```
1928 Steamboat Willie Mickey Mouse, black and white, side view walk cycle,
pie-cut eyes, long snout, no gloves, thin limbs, large shoes,
vintage 1920s rubber hose cartoon style, pixel art, 64x64,
smooth walking animation, 8 frames
```

**Jump:**
```
1928 Steamboat Willie Mickey Mouse, black and white, jumping pose,
pie-cut eyes, long snout, no gloves, arms raised,
vintage 1920s rubber hose cartoon style, pixel art, 64x64,
jump arc: launch, apex, falling, 3 frames
```

**Crouch:**
```
1928 Steamboat Willie Mickey Mouse, black and white, crouching low,
pie-cut eyes, long snout, no gloves, squatting position,
vintage 1920s rubber hose cartoon style, pixel art, 64x64, 2 frames
```

**Crouch walk:**
```
1928 Steamboat Willie Mickey Mouse, black and white, crouching walk,
sneaking low to ground, pie-cut eyes, long snout, no gloves,
vintage 1920s rubber hose cartoon style, pixel art, 64x64, 6 frames
```

**Collect item:**
```
1928 Steamboat Willie Mickey Mouse, black and white, reaching forward,
picking up item, celebrating, pie-cut eyes, long snout, no gloves,
vintage 1920s rubber hose cartoon style, pixel art, 64x64, 4 frames
```

### Midjourney Style Reference Prompt
```
/imagine 1928 Steamboat Willie style cartoon mouse character,
black and white, rubber hose animation style, simple expressive pose,
vintage silent film cartoon aesthetic --ar 1:1 --style raw --seed 42
```

---

## Winnie-the-Pooh (E.H. Shepard 1926)

### CRITICAL: Legal constraints
- NO red shirt (Disney trademark)
- NO bright yellow coloring (Disney trademark)
- Naturalistic bear proportions (Shepard's realistic style)
- Pen-and-ink cross-hatching
- Small, stocky bear
- Warm sepia/brown tones allowed

### PixelLab Prompts

**Idle animation:**
```
E.H. Shepard style Winnie the Pooh bear, pen and ink illustration,
cross-hatched shading, naturalistic small stocky bear, no clothing,
warm brown tones, children's book illustration style, pixel art, 64x64,
gentle idle breathing animation, 4 frames
```

**Walk cycle:**
```
E.H. Shepard style bear, pen and ink illustration,
cross-hatched shading, small stocky bear walking, no clothing,
warm brown tones, storybook illustration style, pixel art, 64x64,
walking animation side view, 8 frames
```

**Jump / Crouch / Collect — same pattern, adjust pose description**

### Midjourney Style Reference Prompt
```
/imagine E.H. Shepard pen and ink illustration style, small bear character,
cross-hatched shading, vintage 1920s children's book illustration,
warm sepia tones, detailed naturalistic style --ar 1:1 --style raw --seed 42
```

---

## Christopher Robin (E.H. Shepard 1926)

### PixelLab Prompts

**Base prompt prefix:**
```
E.H. Shepard style young boy, pen and ink illustration,
period 1920s clothing, knee-length shorts, button-up shirt,
cross-hatched shading, children's book illustration style, pixel art, 64x64
```

---

## Piglet (E.H. Shepard 1926)

### PixelLab Prompts

**Base prompt prefix:**
```
E.H. Shepard style very small piglet character, pen and ink illustration,
striped body, tiny and timid looking, cross-hatched shading,
children's book illustration style, pixel art, 48x48
```

---

## Environment Tiles

### Forest Tileset
```
2D game tileset, pen and ink style forest, cross-hatched shading,
ground tiles, grass, dirt path, tree trunks, branches, leaves,
mushrooms, rocks, bushes, vintage children's book illustration,
32x32 tile grid, transparent background
```

### Village Tileset
```
2D game tileset, vintage storybook village, cobblestone path,
wooden fences, cottage walls, lanterns, bridge stones,
pen and ink illustration with warm tones, 32x32 tile grid
```

---

## Items

### Coins
```
Spinning gold coin, simple pixel art, 16x16, 6 frame animation,
shiny metallic, sparkle effect, transparent background
```

### Food Ingredients
```
Pixel art food item, [specific item name], simple cute style,
16x16, transparent background, children's game style
- honey pot: golden honey jar with dripping honey
- bread: round loaf of bread
- cheese: wedge of yellow cheese
- flour: white flour sack
- egg: brown egg
- acorn: small brown acorn with cap
- carrot: orange carrot with green top
- mushroom: red and white spotted mushroom
```

---

## Workflow Checklist

1. [ ] Generate Mickey reference in Midjourney (5-10 images for style lock)
2. [ ] Generate Pooh reference in Midjourney using Shepard illustration refs
3. [ ] Use PixelLab to create Mickey idle, walk, jump (core 3 first)
4. [ ] Use PixelLab to create Pooh idle, walk, jump
5. [ ] Clean up in Aseprite: align frames, fix artifacts, set timing
6. [ ] Export from Aseprite as sprite sheet PNG + JSON
7. [ ] Add remaining animations: crouch, crouch_walk, collect
8. [ ] Generate Christopher Robin and Piglet sprites
9. [ ] Generate item sprites (coins, food)
10. [ ] Generate environment tilesets
11. [ ] Generate background layers
12. [ ] Replace placeholder files in assets/sprites/
