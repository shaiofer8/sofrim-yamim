"""Generate the Play Store Feature Graphic (1024x500).
Regenerate any time by running: python gen_feature_graphic.py

Matches the app's actual brand tokens (style.css :root) rather than
inventing new colors -- this banner should look like it belongs to the
same app as the icon and the UI itself, not a separate marketing asset.
"""
from PIL import Image, ImageDraw, ImageFont
from bidi.algorithm import get_display
import os

W, H = 1024, 500
OUT = os.path.join(os.path.dirname(__file__), "store_feature_graphic.png")

# style.css :root -- --accent-violet / --accent-pink / --bg-base
ACCENT_VIOLET = (124, 92, 255)
ACCENT_PINK = (255, 95, 143)
BG_BASE = (21, 12, 46)

FONT_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
FONT_REGULAR = "C:/Windows/Fonts/segoeui.ttf"


def diagonal_gradient(w, h, c1, c2):
    """Diagonal gradient, same visual language as .app-header's
    135deg linear-gradient(accent-violet, accent-pink) in style.css."""
    img = Image.new("RGB", (w, h), c1)
    px = img.load()
    max_d = w + h
    for y in range(h):
        for x in range(0, w, 2):  # step 2, then fill the gap -- ~2x faster, imperceptible
            t = (x + y) / max_d
            r = int(c1[0] + (c2[0] - c1[0]) * t)
            g = int(c1[1] + (c2[1] - c1[1]) * t)
            b = int(c1[2] + (c2[2] - c1[2]) * t)
            px[x, y] = (r, g, b)
            if x + 1 < w:
                px[x + 1, y] = (r, g, b)
    return img


def draw_calendar_glyph(draw, cx, cy, size, fg=(255, 255, 255), accent=ACCENT_PINK):
    """Same glyph language as the app icon (gen_icons.py), scaled for the banner."""
    half = size / 2
    left, top, right, bottom = cx - half, cy - half, cx + half, cy + half
    header_h = size * 0.28
    radius = size * 0.14

    # Body (white card)
    draw.rounded_rectangle([left, top, right, bottom], radius=radius, fill=fg)
    # Header band (dark, rounded top only -- approximate with a clipped rect)
    draw.rounded_rectangle([left, top, right, top + header_h + radius], radius=radius, fill=BG_BASE)
    draw.rectangle([left, top + header_h, right, top + header_h + radius], fill=BG_BASE)
    draw.rectangle([left, top + header_h + radius * 0.6, right, top + header_h + radius], fill=fg)

    # Binder rings
    ring_w = size * 0.05
    ring_h = size * 0.16
    for rx in (cx - size * 0.18, cx + size * 0.18):
        draw.rounded_rectangle(
            [rx - ring_w / 2, top - ring_h * 0.25, rx + ring_w / 2, top + ring_h * 0.75],
            radius=ring_w / 2, fill=accent,
        )

    # Center ring + dot (the "counting" motif)
    ring_r = size * 0.16
    draw.ellipse([cx - ring_r, cy - ring_r + size * 0.06, cx + ring_r, cy + ring_r + size * 0.06],
                 outline=accent, width=int(size * 0.045))
    dot_r = size * 0.06
    draw.ellipse([cx - dot_r, cy - dot_r + size * 0.06, cx + dot_r, cy + dot_r + size * 0.06],
                 fill=ACCENT_VIOLET)


def main():
    img = diagonal_gradient(W, H, ACCENT_VIOLET, ACCENT_PINK)
    draw = ImageDraw.Draw(img)

    # Subtle dark scrim so white text/glyph hold contrast across the whole
    # gradient -- same technique used for .app-header in style.css (a flat
    # white foreground can't hit 4.5:1 against the raw brand gradient alone).
    scrim = Image.new("RGBA", (W, H), (0, 0, 0, 60))
    img = Image.alpha_composite(img.convert("RGBA"), scrim).convert("RGB")
    draw = ImageDraw.Draw(img)

    # Calendar glyph, right-aligned (app is RTL; visual anchor sits where a
    # Hebrew reader's eye lands first)
    draw_calendar_glyph(draw, cx=W - 190, cy=H / 2, size=280)

    # App name, right-to-left text block to the left of the glyph.
    # PIL's ImageDraw.text() draws glyphs in logical (input) order --
    # it has no bidi support, so Hebrew came out visually reversed
    # ("mi'imi mirifos"-looking garbage) until run through python-bidi's
    # get_display(), which applies the Unicode Bidirectional Algorithm
    # to produce the correct visual order before rendering. Hebrew has
    # no letter-joining forms (unlike Arabic), so bidi reordering alone
    # is sufficient -- no reshaping library needed.
    name = get_display("סופרים ימים")
    tagline = get_display("ספירה לאחור לחגים ומועדים אישיים")

    font_name = ImageFont.truetype(FONT_BOLD, 92)
    font_tag = ImageFont.truetype(FONT_REGULAR, 34)

    name_bbox = draw.textbbox((0, 0), name, font=font_name)
    name_w = name_bbox[2] - name_bbox[0]
    tag_bbox = draw.textbbox((0, 0), tagline, font=font_tag)
    tag_w = tag_bbox[2] - tag_bbox[0]

    text_right_edge = W - 380  # left of the glyph, with breathing room
    name_x = text_right_edge - name_w
    name_y = H / 2 - 80

    # Soft shadow for legibility, then the text itself
    draw.text((name_x + 3, name_y + 3), name, font=font_name, fill=(0, 0, 0, 90))
    draw.text((name_x, name_y), name, font=font_name, fill=(255, 255, 255))

    tag_x = text_right_edge - tag_w
    tag_y = name_y + 110
    draw.text((tag_x, tag_y), tagline, font=font_tag, fill=(255, 255, 255))

    img.save(OUT)
    print(f"Wrote {OUT} ({img.size[0]}x{img.size[1]})")


if __name__ == "__main__":
    main()
