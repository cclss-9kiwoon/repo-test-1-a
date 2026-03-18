# AI Art Generation Prompts Guide — 1930s Rubber Hose Style

This guide provides ready-to-use prompts for generating game sprites in the
**1930s rubber hose cartoon / Cuphead** style. Replace placeholder sprites in
`assets/sprites/` with generated art.

---

## Art Style Reference

### Core Visual Style
- **Thick ink outlines** with tapered brush strokes
- **Watercolor wash** shading (not flat color, not cell-shading)
- **Rubber hose limbs** — no joints, noodle-like arms and legs
- **Squash & stretch** on all animations
- **Pie-cut eyes** (white circle with black wedge pupil)
- **Big round shoes** and **white gloves** (era-typical)
- **Vintage paper texture** — cream/sepia undertone
- **Film grain overlay** in final compositing

### Color Palette
```
Background cream:  #F5E6C8    Ink black:       #1A1A1A
Warm paper:        #EED9B6    Soft shadow:     #8B7355
Highlight:         #FFF8E7    Sepia midtone:   #C4A882
Accent red:        #8B3A3A    Accent gold:     #B8860B
Leaf green:        #556B2F    Sky blue:        #9BB5C5
Apple red:         #A52A2A    Water blue:      #6B8FA3
```

---

## Tool Setup

### Midjourney (Primary — concept art + backgrounds)
- Use `--sref [URL]` to lock rubber hose style across generations
- Use `--seed [number]` for repeatable results
- Recommended flags: `--ar 1:1 --style raw --stylize 200`

### Stable Diffusion + ControlNet (Animation frames)
- Use OpenPose or depth ControlNet for consistent character poses
- Train LoRA on selected Midjourney outputs for style consistency
- Generate animation frames with pose sequence

### Procreate / Clip Studio Paint (Cleanup)
- Import generated sprites
- Clean up artifacts, add tapered ink outlines
- Align animation frames, set timing
- Export as individual PNG frames

### Suno AI (Music)
- Generate ragtime/jazz BGM tracks
- Style prompt: "1920s ragtime piano, upbeat cartoon music, silent film era"

---

## William — Player Character (Mouse, Steamboat Pilot)

### Visual Description
Rubber hose style mouse. Round head, big round ears, pie-cut eyes, long snout.
Captain's hat, striped vest, white gloves, big oval shoes. Noodle-like flexible
limbs. Black body with cream/white face patch. Cheerful expression.

### Midjourney Concept Art
```
/imagine 1930s rubber hose cartoon mouse character, steamboat captain,
round head with big circular ears, pie-cut eyes, captain's hat,
striped vest, white gloves, big oval shoes, noodle-like limbs,
thick ink outlines, watercolor wash shading, vintage animation style,
full character turnaround sheet, cream paper background
--ar 1:1 --style raw --seed 42
```

### Animation Prompts (Stable Diffusion)

**Idle (4 frames):**
```
1930s rubber hose cartoon mouse, captain's hat, striped vest,
standing idle, gentle breathing animation, squash and stretch,
thick ink outlines, watercolor wash, side view, 64x64 sprite,
transparent background
```

**Walk cycle (8 frames):**
```
1930s rubber hose cartoon mouse, captain's hat, striped vest,
walk cycle animation, bouncy rubber hose movement, noodle arms swinging,
thick ink outlines, watercolor wash, side view, 64x64 sprite,
transparent background
```

**Jump (3 frames):**
```
1930s rubber hose cartoon mouse, captain's hat, striped vest,
jumping pose sequence: launch / apex / falling,
stretch on launch, squash on land, arms up,
thick ink outlines, watercolor wash, side view, 64x64 sprite
```

**Crouch (2 frames):**
```
1930s rubber hose cartoon mouse, captain's hat, striped vest,
crouching low, squashed down pose, big eyes looking up,
thick ink outlines, watercolor wash, side view, 64x64 sprite
```

**Collect item (4 frames):**
```
1930s rubber hose cartoon mouse, captain's hat, striped vest,
reaching forward, picking up item, happy celebration pose,
thick ink outlines, watercolor wash, side view, 64x64 sprite
```

---

## Rosie — Companion 1 (Hen, Village Greeter)

### Visual Description
Plump rubber hose hen. Round body, small wings like noodle arms. Rose flower
behind ear, apron, carries a small basket. Short legs with big shoes.
Warm reddish-brown feathers. Friendly, bustling expression.

### Midjourney Concept Art
```
/imagine 1930s rubber hose cartoon hen character, plump and round,
rose flower behind ear, apron, carrying small basket,
pie-cut eyes, white gloves, big shoes, noodle limbs,
thick ink outlines, watercolor wash shading, vintage animation style,
full character turnaround sheet, cream paper background
--ar 1:1 --style raw --seed 42
```

### Animation Prompts

**Idle (4 frames):**
```
1930s rubber hose cartoon hen, apron, rose behind ear, basket,
standing idle, gentle bobbing animation, plump round body,
thick ink outlines, watercolor wash, side view, 64x64 sprite
```

**Walk cycle (8 frames):**
```
1930s rubber hose cartoon hen, apron, rose behind ear,
walk cycle, bustling waddle, wings swinging like noodle arms,
thick ink outlines, watercolor wash, side view, 64x64 sprite
```

---

## Barnaby — Companion 2 (Bull, Cook & Miller)

### Visual Description
Large, gentle rubber hose bull. Small horns, brass bell on neck,
suspender overalls. Big barrel chest, tiny legs (classic rubber hose
proportions). Slow, dopey but lovable expression. Brown/tan coloring.

### Midjourney Concept Art
```
/imagine 1930s rubber hose cartoon bull character, large and gentle,
small horns, brass bell on neck chain, suspender overalls,
pie-cut eyes, white gloves, big shoes, barrel chest tiny legs,
thick ink outlines, watercolor wash shading, vintage animation style,
full character turnaround sheet, cream paper background
--ar 1:1 --style raw --seed 42
```

### Animation Prompts

**Idle (4 frames):**
```
1930s rubber hose cartoon bull, overalls, bell on neck,
standing idle, gentle breathing, slow blink animation,
thick ink outlines, watercolor wash, side view, 64x64 sprite
```

**Walk cycle (8 frames):**
```
1930s rubber hose cartoon bull, overalls, bell on neck,
walk cycle, heavy lumbering walk, bell swinging,
thick ink outlines, watercolor wash, side view, 64x64 sprite
```

---

## Pepper — Companion 3 (Cat, Mischievous Helper)

### Visual Description
Small, scrawny rubber hose alley cat. Huge round eyes, question-mark shaped
tail, crooked bow tie. White chest patch. Twitchy, curious, always looking
around. Black fur with expressive whiskers.

### Midjourney Concept Art
```
/imagine 1930s rubber hose cartoon cat character, small and scrawny,
huge round eyes, question mark shaped tail, crooked bow tie,
white chest patch, twitchy and curious expression,
pie-cut eyes, white gloves, big shoes, thin noodle limbs,
thick ink outlines, watercolor wash shading, vintage animation style,
full character turnaround sheet, cream paper background
--ar 1:1 --style raw --seed 42
```

### Animation Prompts

**Idle (4 frames):**
```
1930s rubber hose cartoon cat, bow tie, question mark tail,
standing idle, twitchy nervous animation, looking around,
thick ink outlines, watercolor wash, side view, 48x48 sprite
```

**Walk cycle (8 frames):**
```
1930s rubber hose cartoon cat, bow tie, question mark tail,
walk cycle, sneaky tiptoeing, exaggerated cautious steps,
thick ink outlines, watercolor wash, side view, 48x48 sprite
```

---

## Captain Barnacle — NPC (Parrot, Narrator)

### Visual Description
Gruff rubber hose parrot. Tricorn hat, peg leg, eye patch. Sits on ship's
wheel. Weathered feathers, one big round eye visible. Grumpy expression
but warm underneath.

### Midjourney Concept Art
```
/imagine 1930s rubber hose cartoon parrot character, pirate narrator,
tricorn hat, peg leg, eye patch, sitting on ship wheel,
pie-cut eye, grumpy expression, weathered feathers,
thick ink outlines, watercolor wash shading, vintage animation style,
cream paper background
--ar 1:1 --style raw --seed 42
```

---

## Environment Tilesets

### Stage 1: The Steamboat Dock
```
2D game tileset, 1930s cartoon style wooden dock and village,
wooden planks, rope coils, barrel stacks, rope bridges,
village rooftops, cobblestone path, lanterns, anchor,
thick ink outlines, watercolor wash, vintage animation background,
32x32 tile grid, transparent background
```

### Stage 2: The Meadow Mill
```
2D game tileset, 1930s cartoon style countryside meadow,
hay bale platforms, wooden fences, stone walls, windmill,
wheat fields, clover patches, dirt path, wildflowers,
thick ink outlines, watercolor wash, vintage animation background,
32x32 tile grid, transparent background
```

### Stage 3: The Old Orchard
```
2D game tileset, 1930s cartoon style apple orchard on hill,
twisted tree branches as platforms, vine swings, tree hollows,
apple-laden trees, wooden ladders, baskets, fallen leaves,
thick ink outlines, watercolor wash, vintage animation background,
32x32 tile grid, transparent background
```

### Background Layers (Parallax)
```
1930s cartoon style background painting, rolling hills with village,
steamboat on river, church steeple, chimneys with musical smoke,
warm vintage palette, watercolor wash, soft edges,
960x540 resolution, separated parallax layers:
- far sky with clouds
- distant hills with village silhouette
- mid-ground trees and river
```

---

## Items

### Coins
```
1930s cartoon style gold coin, spinning animation, 6 frames,
thick ink outline, watercolor gold shimmer, sparkle effect,
16x16 sprite, transparent background
```

### Food Ingredients
For each ingredient, use this base prompt and replace `[ITEM]`:
```
1930s cartoon style food item, [ITEM], cute and simple,
thick ink outline, watercolor wash coloring,
16x16 sprite, transparent background
```

Items to generate:
- `flour`: white flour sack with "FLOUR" label
- `egg`: brown speckled egg
- `butter`: yellow butter block on paper wrapper
- `wheat`: golden wheat sheaf bundle
- `carrot`: orange carrot with green leafy top
- `mushroom`: brown and tan mushroom with spots
- `apple`: red apple with small leaf
- `sugar`: white sugar cube or sugar bag
- `cinnamon`: brown cinnamon stick bundle
- `bread`: round rustic bread loaf

---

## Workflow Checklist

1. [ ] Generate William concept art in Midjourney (10+ images, select best)
2. [ ] Lock style with `--sref` using best William image URL
3. [ ] Generate Rosie, Barnaby, Pepper, Captain Barnacle concepts (same --sref)
4. [ ] Train Stable Diffusion LoRA on selected concept images
5. [ ] Generate William animation frames with ControlNet poses
6. [ ] Generate companion animation frames (same LoRA + ControlNet)
7. [ ] Clean up all frames in Procreate/Clip Studio Paint
8. [ ] Export as individual PNG frames to `assets/sprites/characters/[name]/`
9. [ ] Generate item sprites (coins, ingredients)
10. [ ] Generate environment tilesets for all 3 stages
11. [ ] Generate parallax background layers
12. [ ] Generate ragtime BGM tracks with Suno AI
13. [ ] Generate SFX with jsfxr (jump, coin, collect, menu)
14. [ ] Replace all placeholder files in `assets/sprites/`
15. [ ] Apply film grain shader and test visual cohesion
