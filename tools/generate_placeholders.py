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
CHARACTERS = {
    "mickey": {"color": (40, 40, 40), "size": (64, 64), "label": "M"},
    "pooh": {"color": (139, 90, 43), "size": (64, 64), "label": "P"},
    "christopher_robin": {"color": (70, 100, 140), "size": (64, 64), "label": "CR"},
    "piglet": {"color": (220, 150, 170), "size": (48, 48), "label": "Pi"},
}

ANIMATIONS = ["idle", "walk", "jump", "fall", "crouch", "crouch_walk", "collect"]

ITEM_SPRITES = {
    "coin": {"color": (255, 215, 0), "size": (16, 16)},
    "bread": {"color": (210, 180, 120), "size": (16, 16)},
    "cheese": {"color": (255, 220, 50), "size": (16, 16)},
    "lettuce": {"color": (100, 200, 80), "size": (16, 16)},
    "honey_pot": {"color": (220, 160, 30), "size": (16, 16)},
    "flour": {"color": (240, 240, 230), "size": (16, 16)},
    "egg": {"color": (245, 235, 200), "size": (16, 16)},
    "acorn": {"color": (120, 80, 40), "size": (16, 16)},
    "carrot": {"color": (255, 140, 30), "size": (16, 16)},
    "mushroom": {"color": (180, 130, 100), "size": (16, 16)},
    "water": {"color": (100, 150, 255), "size": (16, 16)},
    "flower": {"color": (255, 100, 150), "size": (16, 16)},
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

    # Generate a simple tileset placeholder (32x32 tiles in a 4x4 grid)
    env_dir = os.path.join(SPRITES_DIR, "environment")
    os.makedirs(env_dir, exist_ok=True)

    tile_size = 32
    tiles_per_row = 4
    tileset = Image.new("RGBA", (tile_size * tiles_per_row, tile_size * tiles_per_row), (0, 0, 0, 0))
    draw = ImageDraw.Draw(tileset)

    tile_colors = [
        (80, 120, 50),   # grass
        (100, 70, 40),   # dirt
        (90, 90, 90),    # stone
        (60, 100, 45),   # dark grass
        (120, 80, 40),   # wood
        (70, 130, 60),   # leaves
        (50, 50, 50),    # rock
        (140, 100, 50),  # sand
        (80, 80, 80),    # cobblestone
        (100, 60, 30),   # log
        (60, 60, 60),    # dark rock
        (110, 140, 60),  # moss
        (90, 150, 200),  # water surface
        (70, 120, 180),  # deep water
        (150, 100, 50),  # fence
        (130, 90, 40),   # planks
    ]

    for i, color in enumerate(tile_colors):
        x = (i % tiles_per_row) * tile_size
        y = (i // tiles_per_row) * tile_size
        draw.rectangle([x + 1, y + 1, x + tile_size - 1, y + tile_size - 1], fill=color, outline=(40, 40, 40))

    tileset.save(os.path.join(env_dir, "forest_tileset.png"))
    tileset.save(os.path.join(env_dir, "village_tileset.png"))
    print("  Created tileset placeholders")

    # Generate simple background
    bg_dir = os.path.join(SPRITES_DIR, "backgrounds")
    os.makedirs(bg_dir, exist_ok=True)

    bg = Image.new("RGB", (960, 540), (135, 180, 220))
    draw = ImageDraw.Draw(bg)
    # Simple gradient sky
    for y_pos in range(540):
        r = int(135 + (y_pos / 540) * 40)
        g = int(180 + (y_pos / 540) * 30)
        b = int(220 - (y_pos / 540) * 60)
        draw.line([(0, y_pos), (960, y_pos)], fill=(r, g, b))
    bg.save(os.path.join(bg_dir, "sky.png"))
    print("  Created background placeholder")

    print("\nDone! Placeholder sprites generated in assets/sprites/")
    print("Replace these with real art from PixelLab/Midjourney + Aseprite cleanup.")


if __name__ == "__main__":
    main()
