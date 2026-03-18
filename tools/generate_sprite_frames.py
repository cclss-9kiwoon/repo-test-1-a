#!/usr/bin/env python3
"""Generate Godot 4.4 SpriteFrames .tres text resource files.

Produces:
  resources/sprite_frames/william_frames.tres
  resources/sprite_frames/rosie_frames.tres
  resources/sprite_frames/barnaby_frames.tres
  resources/sprite_frames/pepper_frames.tres
  resources/sprite_frames/coin_frames.tres
"""

import os

# ---------------------------------------------------------------------------
# Project root (same directory the repo lives in)
# ---------------------------------------------------------------------------
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "resources", "sprite_frames")

# ---------------------------------------------------------------------------
# Animation definitions for characters
# ---------------------------------------------------------------------------
CHARACTER_ANIMATIONS = [
    # (name, frame_count, fps, loop)
    ("idle",        4,  4.0,  True),
    ("walk",        8,  12.0, True),
    ("jump",        3,  8.0,  False),
    ("fall",        1,  1.0,  False),
    ("crouch",      2,  4.0,  False),
    ("crouch_walk", 6,  10.0, True),
    ("collect",     4,  8.0,  False),
]

CHARACTERS = ["william", "rosie", "barnaby", "pepper"]


def _bool_str(val):
    return "true" if val else "false"


def generate_character_tres(name):
    """Return the full .tres text for a character SpriteFrames resource."""

    sprite_dir = f"res://assets/sprites/characters/{name}"

    # -- Build ext_resource lines and collect id mapping -----------------
    ext_lines = []
    resource_id = 0
    anim_resource_ids = {}

    for anim_name, frame_count, _fps, _loop in CHARACTER_ANIMATIONS:
        ids_for_anim = []
        for fi in range(frame_count):
            resource_id += 1
            filename = f"{anim_name}_{fi:02d}.png"
            path = f"{sprite_dir}/{filename}"
            ext_lines.append(
                f'[ext_resource type="Texture2D" path="{path}" id="{resource_id}"]'
            )
            ids_for_anim.append(resource_id)
        anim_resource_ids[anim_name] = ids_for_anim

    total_frames = resource_id  # should be 28
    load_steps = total_frames + 1  # 29

    # -- Build animation array entries ----------------------------------
    anim_entries = []
    for anim_name, _frame_count, fps, loop in CHARACTER_ANIMATIONS:
        ids = anim_resource_ids[anim_name]
        frame_strs = ", ".join(
            f'{{\n"duration": 1.0,\n"texture": ExtResource("{rid}")\n}}'
            for rid in ids
        )
        entry = (
            f'{{\n'
            f'"frames": [{frame_strs}],\n'
            f'"loop": {_bool_str(loop)},\n'
            f'"name": &"{anim_name}",\n'
            f'"speed": {fps}\n'
            f'}}'
        )
        anim_entries.append(entry)

    animations_value = "[" + ", ".join(anim_entries) + "]"

    # -- Assemble full file ---------------------------------------------
    parts = [
        f'[gd_resource type="SpriteFrames" load_steps={load_steps} format=3]',
        "",
    ]
    parts.extend(ext_lines)
    parts.append("")
    parts.append("[resource]")
    parts.append(f"animations = {animations_value}")
    parts.append("")  # trailing newline

    return "\n".join(parts)


def generate_coin_tres():
    """Return the full .tres text for the coin SpriteFrames resource."""
    path = "res://assets/sprites/items/coin.png"
    lines = [
        '[gd_resource type="SpriteFrames" load_steps=2 format=3]',
        '',
        f'[ext_resource type="Texture2D" path="{path}" id="1"]',
        '',
        '[resource]',
        'animations = [{',
        '"frames": [{',
        '"duration": 1.0,',
        '"texture": ExtResource("1")',
        '}],',
        '"loop": true,',
        '"name": &"default",',
        '"speed": 1.0',
        '}]',
        '',
    ]
    return "\n".join(lines)


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Character SpriteFrames
    for name in CHARACTERS:
        content = generate_character_tres(name)
        out_path = os.path.join(OUTPUT_DIR, f"{name}_frames.tres")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  wrote {out_path}")

    # Coin SpriteFrames
    coin_content = generate_coin_tres()
    coin_path = os.path.join(OUTPUT_DIR, "coin_frames.tres")
    with open(coin_path, "w", encoding="utf-8") as f:
        f.write(coin_content)
    print(f"  wrote {coin_path}")

    print("\nDone. Generated 5 SpriteFrames .tres files.")


if __name__ == "__main__":
    main()
