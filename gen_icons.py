"""Generate placeholder app icons (gradient + emoji-ish glyph) for the PWA/TWA.
Regenerate any time by running: python gen_icons.py
"""
from PIL import Image, ImageDraw, ImageFont
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "icons")
os.makedirs(OUT_DIR, exist_ok=True)

BG_TOP = (124, 92, 255)     # --accent2
BG_BOTTOM = (255, 95, 143)  # --accent


def gradient(size):
    img = Image.new("RGB", (size, size), BG_TOP)
    draw = ImageDraw.Draw(img)
    for y in range(size):
        t = y / size
        r = int(BG_TOP[0] + (BG_BOTTOM[0] - BG_TOP[0]) * t)
        g = int(BG_TOP[1] + (BG_BOTTOM[1] - BG_TOP[1]) * t)
        b = int(BG_TOP[2] + (BG_BOTTOM[2] - BG_TOP[2]) * t)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    return img


def draw_glyph(img, size, scale=0.55):
    draw = ImageDraw.Draw(img)
    # Simple calendar glyph drawn with primitives (no external font/emoji needed)
    pad = size * (1 - scale) / 2
    box = [pad, pad * 1.2, size - pad, size - pad * 0.8]
    radius = size * 0.06
    draw.rounded_rectangle(box, radius=radius, fill=(255, 255, 255, 235))
    # header strip
    header_h = (box[3] - box[1]) * 0.28
    draw.rounded_rectangle(
        [box[0], box[1], box[2], box[1] + header_h],
        radius=radius,
        fill=(38, 24, 63),
    )
    # rings
    ring_w = size * 0.025
    ring_h = size * 0.09
    for fx in (0.3, 0.7):
        x = box[0] + (box[2] - box[0]) * fx
        draw.rounded_rectangle(
            [x - ring_w, box[1] - ring_h * 0.4, x + ring_w, box[1] + ring_h * 0.6],
            radius=ring_w,
            fill=(255, 95, 143),
        )
    # a big "days left" number-ish dot grid to suggest a countdown
    dot_r = size * 0.035
    cx, cy = (box[0] + box[2]) / 2, box[1] + header_h + (box[3] - box[1] - header_h) / 2
    draw.ellipse(
        [cx - size * 0.11, cy - size * 0.11, cx + size * 0.11, cy + size * 0.11],
        outline=(255, 95, 143),
        width=int(size * 0.025),
    )
    draw.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=(124, 92, 255))
    return img


def make_icon(size, maskable=False):
    scale = 0.42 if maskable else 0.62  # maskable needs more safe-zone padding
    img = gradient(size)
    draw_glyph(img, size, scale=scale)
    return img


sizes = {
    "icon-192.png": (192, False),
    "icon-512.png": (512, False),
    "icon-maskable-192.png": (192, True),
    "icon-maskable-512.png": (512, True),
}

for filename, (size, maskable) in sizes.items():
    icon = make_icon(size, maskable)
    icon.save(os.path.join(OUT_DIR, filename))
    print("wrote", filename)

# Also a favicon
fav = make_icon(64, False)
fav.save(os.path.join(os.path.dirname(__file__), "favicon.png"))
print("wrote favicon.png")
