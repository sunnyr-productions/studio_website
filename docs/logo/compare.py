"""Builds the before/after sheet: python compare.py <old.svg> <out.svg>

The old artwork is in git: git show d20ab25:public/images/sunnyr-logo.svg
"""
import re
import sys

import build_logo as b

CREAM, DARK = "#fbeee3", "#1e1b30"
LIGHT_FILL, DARK_FILL = "#db8a12", "#f5a623"

raw = open(sys.argv[1], encoding="utf8").read()
inner = raw[raw.index(">") + 1: raw.rindex("</svg>")]
# The same artwork with its shadows and raster suns removed: top 28 paths only.
top = "".join(re.findall(r"<path\b[^>]*/>", raw)[-28:]).replace("#f5a623", "currentColor")
new = b.build()
new_inner = new[new.index("<g "): new.rindex("</svg>")]
# The heavier cut used below 80 px tall.
regular = (b.STEM, b.THIN, b.SWELL, b.TIP, b.DOT)
b.STEM, b.THIN, b.SWELL, b.TIP, b.DOT = 31, 23, 41, 19, 15
small = b.build()
small_inner = small[small.index("<g "): small.rindex("</svg>")]
b.STEM, b.THIN, b.SWELL, b.TIP, b.DOT = regular
sun = "".join(f'<path d="{d}"/>' for d in b.sun(0, 0))
OLD_VB = "462 28 3172 2104"
NEW_VB = "10 105 1566 842"


def text(x, y, s, size=20, fill="#1f2430", weight=400):
    return f'<text x="{x}" y="{y}" font-family="Segoe UI,Arial,sans-serif" font-size="{size}" font-weight="{weight}" fill="{fill}">{s}</text>'


def rect(x, y, w, h, fill):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}"/>'


def old(x, y, h, vb=None):
    w = h * 3172 / 2104 if not vb else None
    return f'<svg x="{x}" y="{y}" width="{w}" height="{h}" viewBox="{OLD_VB}">{inner}</svg>'


def stripped(x, y, h, fill):
    w = h * 3172 / 2104
    # Flat sun where the raster one sat; the artwork's centre is (2048, 1080).
    place = f'<g transform="translate(2895 279) scale(2)">{sun}</g><g transform="translate(1201 1881) scale(2)">{sun}</g>'
    return f'<svg x="{x}" y="{y}" width="{w}" height="{h}" viewBox="{OLD_VB}" color="{fill}" fill="{fill}">{top}{place}</svg>'


def redraw(x, y, h, fill, vb=NEW_VB, w=None, art=None):
    a = [float(v) for v in vb.split()]
    w = w or h * a[2] / a[3]
    return f'<svg x="{x}" y="{y}" width="{w}" height="{h}" viewBox="{vb}" fill="{fill}">{art or new_inner}</svg>'


W = 1800
PANEL = 600
out = [rect(0, 0, W, 1720, "#ffffff")]

# Row 1 and 2: all three states, light then dark.
for row, (bg, fill, ink) in enumerate([(CREAM, LIGHT_FILL, "#1f2430"), (DARK, DARK_FILL, "#f6f1e6")]):
    y = row * 400
    out.append(rect(0, y, W, 400, bg))
    labels = ["Now", "Same art, shadows and raster suns removed", "Redrawn"]
    for i, label in enumerate(labels):
        out.append(text(i * PANEL + 24, y + 36, label, 20, ink, 600))
    out.append(old(40, y + 50, 340))
    out.append(stripped(PANEL + 40, y + 50, 340, fill))
    out.append(redraw(2 * PANEL + 25, y + 60, 295, fill))

# Row 3: header sizes, at 1:1 pixels.
y = 800
out.append(rect(0, y, W, 300, CREAM))
out.append(rect(W / 2, y, W / 2, 300, DARK))
out.append(text(24, y + 34, "Actual pixels: 36, 48, 80 px tall. Redrawn uses the heavier cut at 36 and 48.", 20, "#1f2430", 600))
for side, (x0, fill) in enumerate([(24, LIGHT_FILL), (W / 2 + 24, DARK_FILL)]):
    ink = "#1f2430" if side == 0 else "#f6f1e6"
    out.append(text(x0, y + 70, "Now", 16, ink))
    out.append(text(x0, y + 190, "Redrawn", 16, ink))
    x = x0 + 90
    for h in (36, 48, 80):
        out.append(old(x, y + 50, h))
        out.append(redraw(x, y + 170, h, fill, art=small_inner if h < 80 else None))
        x += h * 1.86 + 60

# Row 4: joins up close, same region of the s in both.
y = 1100
out.append(rect(0, y, W, 620, "#fffdf7"))
out.append(text(24, y + 36, "Up close: the y arm crossing the s bowl", 20, "#1f2430", 600))
out.append(f'<svg x="40" y="{y + 50}" width="840" height="560" viewBox="462 900 1200 800">{inner}</svg>')
out.append(redraw(920, y + 50, 560, LIGHT_FILL, "10 380 600 400", 840))

svg = f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{W}" height="1720" viewBox="0 0 {W} 1720">{"".join(out)}</svg>'
open(sys.argv[2], "w", encoding="utf8").write(svg)
