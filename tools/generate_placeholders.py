#!/usr/bin/env python3
"""Generate placeholder sprite images for development.
Creates colored rectangles with character labels for testing.
Run: python3 tools/generate_placeholders.py
Requires: Pillow (pip install Pillow)
"""

import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow not installed. Install with: pip install Pillow")
    print("Or skip placeholders and use Godot's built-in ColorRect for testing.")
    sys.exit(1)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITES_DIR = os.path.join(BASE_DIR, "assets", "sprites")

# Character definitions: name, color, size
# 1930s rubber hose cartoon style — original characters
CHARACTERS = {
    "william": {"color": (26, 26, 26), "size": (64, 64), "label": "W"},
    "rosie": {"color": (139, 58, 58), "size": (64, 64), "label": "R"},
    "barnaby": {"color": (120, 80, 40), "size": (64, 64), "label": "B"},
    "pepper": {"color": (50, 50, 55), "size": (48, 48), "label": "Pe"},
}

ANIMATIONS = ["idle", "walk", "jump", "fall", "crouch", "crouch_walk", "collect"]

ITEM_SPRITES = {
    "coin": {"color": (255, 215, 0), "size": (16, 16)},
    "flour": {"color": (240, 240, 230), "size": (16, 16)},
    "egg": {"color": (245, 235, 200), "size": (16, 16)},
    "butter": {"color": (255, 230, 120), "size": (16, 16)},
    "wheat": {"color": (210, 180, 80), "size": (16, 16)},
    "carrot": {"color": (255, 140, 30), "size": (16, 16)},
    "mushroom": {"color": (180, 130, 100), "size": (16, 16)},
    "apple": {"color": (165, 42, 42), "size": (16, 16)},
    "sugar": {"color": (250, 250, 250), "size": (16, 16)},
    "cinnamon": {"color": (160, 82, 45), "size": (16, 16)},
    "bread": {"color": (210, 180, 120), "size": (16, 16)},
    "water": {"color": (100, 150, 255), "size": (16, 16)},
}


def create_character_frame(char_name, char_data, anim_name, frame_num):
    """Create a single animation frame as a colored rectangle with label."""
    w, h = char_data["size"]
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    color = char_data["color"]

    # Crouch animations are shorter
    if "crouch" in anim_name:
        rect_h = int(h * 0.6)
        draw.rectangle([4, h - rect_h - 2, w - 4, h - 2], fill=color, outline=(255, 255, 255))
    elif anim_name == "jump":
        # Slightly offset upward
        offset = -4
        draw.rectangle([4, 4 + offset, w - 4, h - 4 + offset], fill=color, outline=(255, 255, 255))
    else:
        draw.rectangle([4, 4, w - 4, h - 4], fill=color, outline=(255, 255, 255))

    # Add label text
    label = char_data["label"]
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
    bbox = draw.textbbox((0, 0), label, font=font) if font else (0, 0, 10, 10)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text(((w - tw) / 2, (h - th) / 2), label, fill=(255, 255, 255), font=font)

    # Add frame number in corner
    frame_text = f"{frame_num}"
    draw.text((w - 12, h - 12), frame_text, fill=(200, 200, 200), font=font)

    return img


def create_item_sprite(item_name, item_data):
    """Create a simple item sprite."""
    w, h = item_data["size"]
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    color = item_data["color"]

    if item_name == "coin":
        # Circle for coin
        draw.ellipse([1, 1, w - 1, h - 1], fill=color, outline=(200, 170, 0))
    else:
        # Rounded rect for ingredients
        draw.rectangle([2, 2, w - 2, h - 2], fill=color, outline=(100, 100, 100))

    return img


def main():
    print("Generating placeholder sprites...")

    # Generate character sprites
    frame_counts = {
        "idle": 4, "walk": 8, "jump": 3, "fall": 1,
        "crouch": 2, "crouch_walk": 6, "collect": 4,
    }

    for char_name, char_data in CHARACTERS.items():
        char_dir = os.path.join(SPRITES_DIR, "characters", char_name)
        os.makedirs(char_dir, exist_ok=True)

        for anim_name, count in frame_counts.items():
            for i in range(count):
                frame = create_character_frame(char_name, char_data, anim_name, i)
                filename = f"{anim_name}_{i:02d}.png"
                frame.save(os.path.join(char_dir, filename))

        print(f"  Created {char_name} sprites ({sum(frame_counts.values())} frames)")

    # Generate item sprites
    items_dir = os.path.join(SPRITES_DIR, "items")
    os.makedirs(items_dir, exist_ok=True)

    for item_name, item_data in ITEM_SPRITES.items():
        sprite = create_item_sprite(item_name, item_data)
        sprite.save(os.path.join(items_dir, f"{item_name}.png"))

    print(f"  Created {len(ITEM_SPRITES)} item sprites")

    # Generate tileset placeholders for each stage environment
    env_dir = os.path.join(SPRITES_DIR, "environment")
    os.makedirs(env_dir, exist_ok=True)

    tile_size = 32
    tiles_per_row = 4

    # Stage tilesets: dock, meadow, orchard
    stage_tilesets = {
        "dock_tileset": [
            (120, 80, 40),   # wood planks
            (100, 70, 35),   # dark wood
            (90, 90, 90),    # stone
            (80, 80, 80),    # cobblestone
            (140, 100, 50),  # rope/hemp
            (60, 100, 45),   # dock moss
            (90, 150, 200),  # water surface
            (70, 120, 180),  # deep water
            (150, 100, 50),  # barrel
            (130, 90, 40),   # crate
            (50, 50, 50),    # anchor metal
            (110, 80, 35),   # dock post
            (160, 120, 60),  # lantern
            (100, 60, 30),   # timber
            (80, 120, 50),   # grass patch
            (140, 110, 50),  # sand
        ],
        "meadow_tileset": [
            (80, 120, 50),   # grass
            (100, 70, 40),   # dirt
            (60, 100, 45),   # dark grass
            (110, 140, 60),  # moss
            (140, 100, 50),  # fence post
            (130, 90, 40),   # fence rail
            (150, 100, 50),  # hay
            (210, 180, 80),  # wheat
            (90, 90, 90),    # stone wall
            (120, 80, 40),   # wood
            (70, 130, 60),   # clover
            (100, 60, 30),   # log
            (180, 140, 60),  # windmill wood
            (160, 160, 160), # windmill blade
            (50, 50, 50),    # dark rock
            (140, 110, 50),  # path
        ],
        "orchard_tileset": [
            (80, 120, 50),   # grass
            (120, 80, 40),   # tree trunk
            (70, 130, 60),   # leaves
            (165, 42, 42),   # apple
            (100, 70, 40),   # branch
            (60, 100, 45),   # dark leaves
            (110, 140, 60),  # vine
            (90, 60, 30),    # bark
            (50, 50, 50),    # tree hollow
            (140, 100, 50),  # wooden platform
            (130, 90, 40),   # ladder
            (100, 60, 30),   # root
            (80, 80, 80),    # stone
            (160, 120, 60),  # basket
            (60, 60, 60),    # dark hole
            (150, 100, 50),  # fence
        ],
    }

    for tileset_name, tile_colors in stage_tilesets.items():
        tileset = Image.new("RGBA", (tile_size * tiles_per_row, tile_size * tiles_per_row), (0, 0, 0, 0))
        draw = ImageDraw.Draw(tileset)
        for i, color in enumerate(tile_colors):
            x = (i % tiles_per_row) * tile_size
            y = (i // tiles_per_row) * tile_size
            draw.rectangle([x + 1, y + 1, x + tile_size - 1, y + tile_size - 1], fill=color, outline=(40, 40, 40))
        tileset.save(os.path.join(env_dir, f"{tileset_name}.png"))

    print("  Created tileset placeholders (dock, meadow, orchard)")

    # Generate simple background with vintage sepia tone
    bg_dir = os.path.join(SPRITES_DIR, "backgrounds")
    os.makedirs(bg_dir, exist_ok=True)

    bg = Image.new("RGB", (960, 540), (155, 181, 197))
    draw = ImageDraw.Draw(bg)
    # Vintage sky gradient
    for y_pos in range(540):
        r = int(155 + (y_pos / 540) * 90)
        g = int(181 + (y_pos / 540) * 50)
        b = int(197 - (y_pos / 540) * 80)
        draw.line([(0, y_pos), (960, y_pos)], fill=(r, g, b))
    bg.save(os.path.join(bg_dir, "sky.png"))
    print("  Created background placeholder")

    # Remove old item sprites that no longer exist
    old_items = ["honey_pot.png", "lettuce.png", "acorn.png", "flower.png", "cheese.png"]
    items_dir_path = os.path.join(SPRITES_DIR, "items")
    for old_item in old_items:
        old_path = os.path.join(items_dir_path, old_item)
        if os.path.exists(old_path):
            os.remove(old_path)
            print(f"  Removed old item sprite: {old_item}")

    # Remove old tilesets
    old_tilesets = ["forest_tileset.png", "village_tileset.png"]
    for old_ts in old_tilesets:
        old_path = os.path.join(env_dir, old_ts)
        if os.path.exists(old_path):
            os.remove(old_path)
            print(f"  Removed old tileset: {old_ts}")

    print("\nDone! Placeholder sprites generated in assets/sprites/")
    print("Replace these with real art from Midjourney + Procreate/Clip Studio Paint cleanup.")


if __name__ == "__main__":
    main()
