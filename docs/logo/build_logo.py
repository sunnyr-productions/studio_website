"""Generates the redrawn sunny*r ambigram from one half of its skeleton.

Only half the word is drawn. The other half is the same geometry rotated 180
degrees about the centre, so the ambigram is exact by construction. Every curl
comes from one spiral (K) and every width from the weights below.

Usage: python build_logo.py <output.svg> [fill] [small|sun]

The site uses public/images/sunnyr-logo.svg (regular cut) and
sunnyr-logo-small.svg (small). export_png.mjs makes the PNGs from these.
"""
import math
import sys

W, H = 1586, 1052
CX, CY = W / 2, H / 2

# Weights, in drawing units.
STEM = 23     # main verticals
THIN = 16     # N diagonal, r stem, secondary strokes
SWELL = 35    # heaviest point of the s spine and the u bowl
TIP = 12      # where a curl narrows before its ball
BALL = 14     # terminal radius on the two big curls
DOT = 11      # terminal radius on every small curl

K = 0.14      # the one spiral rate every curl shares


def curl(p0, heading, side, radius, turns, w0, w1=TIP):
    """Spiral leaving p0 along heading (degrees). side=+1 turns clockwise on screen."""
    h = math.radians(heading)
    n = (math.cos(h + side * math.pi / 2), math.sin(h + side * math.pi / 2))
    c = (p0[0] + radius * n[0], p0[1] + radius * n[1])
    t0 = h - side * math.pi / 2
    total = turns * 2 * math.pi
    steps = max(8, int(turns * 32))
    pts = []
    for i in range(1, steps + 1):
        f = i / steps
        phi = f * total
        r = radius * math.exp(-K * phi)
        a = t0 + side * phi
        w = w0 + (w1 - w0) * f
        pts.append((c[0] + r * math.cos(a), c[1] + r * math.sin(a), w))
    return pts


def catmull(pts, per=10):
    """Centripetal Catmull-Rom through (x, y, w), returning dense samples."""
    p = [pts[0]] + list(pts) + [pts[-1]]
    out = []

    def dist(a, b):
        return max(math.hypot(a[0] - b[0], a[1] - b[1]), 1e-6) ** 0.5

    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        t1, t2, t3 = dist(p0, p1), dist(p1, p2), dist(p2, p3)
        for s in range(per):
            u = s / per
            q = []
            for k in range(2):
                d = p2[k] - p1[k]
                m1 = d + t2 * ((p1[k] - p0[k]) / t1 - (p2[k] - p0[k]) / (t1 + t2)) if t1 > 1e-2 else d
                m2 = d + t2 * ((p3[k] - p2[k]) / t3 - (p3[k] - p1[k]) / (t2 + t3)) if t3 > 1e-2 else d
                a = 2 * p1[k] - 2 * p2[k] + m1 + m2
                b = -3 * p1[k] + 3 * p2[k] - 2 * m1 - m2
                q.append(a * u ** 3 + b * u ** 2 + m1 * u + p1[k])
            q.append(p1[2] + (p2[2] - p1[2]) * u)
            out.append(tuple(q))
    out.append(tuple(pts[-1]))
    return out


def fair(samples, spacing=2.0, sigma=9):
    """Resample evenly by arc length, then blur so curvature never jumps."""
    even = [samples[0]]
    carry = 0.0
    for a, b in zip(samples, samples[1:]):
        seg = math.hypot(b[0] - a[0], b[1] - a[1])
        if seg == 0:
            continue
        pos = spacing - carry
        while pos <= seg:
            f = pos / seg
            even.append(tuple(a[k] + (b[k] - a[k]) * f for k in range(3)))
            pos += spacing
        carry = (carry + seg) % spacing
    even.append(samples[-1])
    radius = int(sigma * 2.5)
    weights = [math.exp(-(i * i) / (2 * sigma * sigma)) for i in range(radius + 1)]
    out = []
    n = len(even)
    for i in range(n):
        # Shrink the window near the ends so the terminals stay pinned.
        r = min(radius, i, n - 1 - i)
        total = weights[0]
        acc = list(even[i])
        for j in range(1, r + 1):
            w = weights[j]
            total += 2 * w
            for k in range(3):
                acc[k] += w * (even[i - j][k] + even[i + j][k])
        out.append(tuple(v / total for v in acc))
    return out


def spline(pts):
    """Open Catmull-Rom spline through pts, as cubic Bezier commands."""
    d = ""
    n = len(pts)
    for i in range(n - 1):
        p0, p1, p2, p3 = pts[max(i - 1, 0)], pts[i], pts[i + 1], pts[min(i + 2, n - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f"C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}"
    return d


def dot(x, y, r):
    return f"M{x - r:.1f} {y:.1f}a{r:.1f} {r:.1f} 0 1 0 {2 * r:.1f} 0a{r:.1f} {r:.1f} 0 1 0 {-2 * r:.1f} 0Z"


def stroke(pts, ball_start=0, ball_end=0, sigma=9):
    """Outline a variable-width stroke; ends get a ball of that radius or a round cap."""
    s = fair(catmull(pts), sigma=sigma)
    left, right = [], []
    for i, (x, y, w) in enumerate(s):
        a = s[max(i - 1, 0)]
        b = s[min(i + 1, len(s) - 1)]
        tx, ty = b[0] - a[0], b[1] - a[1]
        m = math.hypot(tx, ty) or 1
        nx, ny = -ty / m, tx / m
        left.append((x + nx * w / 2, y + ny * w / 2))
        right.append((x - nx * w / 2, y - ny * w / 2))
    step = 4
    side_a = left[::step] + ([left[-1]] if (len(left) - 1) % step else [])
    side_b = right[::-1][::step] + ([right[0]] if (len(right) - 1) % step else [])
    outline = (
        f"M{side_a[0][0]:.1f} {side_a[0][1]:.1f}{spline(side_a)}"
        f"L{side_b[0][0]:.1f} {side_b[0][1]:.1f}{spline(side_b)}Z"
    )
    return [
        outline,
        dot(s[0][0], s[0][1], ball_start or s[0][2] / 2),
        dot(s[-1][0], s[-1][1], ball_end or s[-1][2] / 2),
    ]


def half():
    """The left half of the word: s (with the y arm), u, and half of the nn."""
    parts = []

    # s: top curl, spine, then the big bowl. This is the r's swash when rotated.
    top = (183, 232)
    spine = [
        (*top, STEM - 3), (208, 305, STEM + 1), (252, 420, SWELL - 4),
        (292, 545, SWELL), (313, 640, SWELL - 4), (317, 722, STEM + 3),
    ]
    head = list(reversed(curl(top, -100, +1, 72, 0.92, STEM - 3)))
    bowl = curl((317, 722), 90, +1, 152, 1.62, STEM + 3)
    # Give the bowl its one swell, along the bottom of the first turn.
    last = len(bowl) - 1
    bowl = [
        (x, y, w + (SWELL - STEM) * math.exp(-(((i / last - 0.26) / 0.13) ** 2)))
        for i, (x, y, w) in enumerate(bowl)
    ]
    parts += stroke(head + spine + bowl, BALL, BALL)

    # The y arm on the s, which becomes the leg of the r.
    arm_top = (80, 468)
    arm = list(reversed(curl(arm_top, -108, -1, 34, 0.72, STEM - 3))) + [
        (*arm_top, STEM - 3), (108, 556, STEM - 1), (137, 604, STEM - 2),
        (176, 620, STEM - 4), (214, 604, THIN), (232, 580, TIP),
    ]
    parts += stroke(arm, DOT, DOT)

    # The r's stem. It stops at the s bowl instead of threading through it.
    parts += stroke([(182, 474, THIN - 2), (182, 555, THIN - 2), (182, 640, THIN - 2)])

    # u: left ascender curl, stem, bowl, right stem, right curl.
    ul, ur = 360, 588
    u_head = list(reversed(curl((ul, 272), -90, +1, 34, 0.72, STEM)))
    u_tail = curl((ur, 472), -90, -1, 34, 0.72, STEM)
    u_body = [
        (ul, 272, STEM), (ul, 500, STEM), (ul, 680, STEM + 1),
        (ul + 7, 752, STEM + 7), (ul + 46, 806, SWELL - 2), (ul + 114, 822, SWELL),
        (ur - 46, 806, SWELL - 2), (ur - 7, 752, STEM + 7), (ur, 680, STEM + 1),
        (ur, 472, STEM),
    ]
    parts += stroke(u_head + u_body + u_tail, DOT, DOT)

    # The ligature inside the u: an h here, the y's left arm when rotated.
    ax = ul + 60
    a_tail = curl((ax, 620), 90, -1, 32, 0.72, STEM - 3)
    parts += stroke(
        [
            (ul, 470, THIN), (ul + 1, 430, THIN), (ul + 26, 392, THIN + 1),
            (ax - 6, 412, STEM - 5), (ax, 470, STEM - 3), (ax, 620, STEM - 3),
        ] + a_tail,
        0, DOT,
    )

    # n: left stem with its two curls.
    nx = 683
    t = list(reversed(curl((nx, 318), -90, -1, 34, 0.72, STEM)))
    b = curl((nx, 734), 90, +1, 34, 0.72, STEM)
    parts += stroke(t + [(nx, 318, STEM), (nx, 526, STEM), (nx, 734, STEM)] + b, DOT, DOT)
    return parts


def centre():
    """Pieces that map onto themselves: the shared n stem and the diagonal."""
    nx = 683
    parts = []
    parts += stroke([(CX, 292, STEM), (CX, CY, STEM), (CX, 2 * CY - 292, STEM)])
    parts += stroke([(nx, 396, THIN), (CX, CY, THIN), (2 * CX - nx, 2 * CY - 396, THIN)])
    return parts


def sun(cx, cy, disc=30, ray_out=56, root=32, tip=18):
    """The asterisk: a disc and eight tapered, round-tipped rays, one silhouette."""
    d = [dot(cx, cy, disc)]
    for i in range(8):
        a = math.radians(i * 45 - 90)
        ca, sa = math.cos(a), math.sin(a)
        mid = (disc + ray_out) / 2
        d += stroke(
            [
                (cx + disc * 0.6 * ca, cy + disc * 0.6 * sa, root),
                (cx + mid * ca, cy + mid * sa, (root + tip) / 2),
                (cx + ray_out * ca, cy + ray_out * sa, tip),
            ],
            sigma=1,
        )
    return d


def build(fill="#db8a12"):
    h = "".join(f'<path d="{d}"/>' for d in half())
    c = "".join(f'<path d="{d}"/>' for d in centre())
    s = "".join(f'<path d="{d}"/>' for d in sun(1232, 172))
    body = (
        f'<g id="half">{h}</g>'
        f'<use href="#half" transform="rotate(180 {CX} {CY})"/>'
        f"{c}"
        f'<g id="sun">{s}</g>'
        f'<use href="#sun" transform="rotate(180 {CX} {CY})"/>'
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 105 1566 842" '
        f'width="1566" height="842" fill="{fill}" role="img">'
        f"<title>sunny*r</title>{body}</svg>"
    )


# The outline behind the mark: a hairline hugging the edge of every line, drawn
# round the mark as one shape (so none where strokes overlap or join), and a soft
# shadow just outside it, for a little more contrast on any background. The mark
# is blurred and cut off a hair outside its edge, about 3 out, and the line is
# what that adds. Units are the drawing's; the mark is 842 tall, so on the site
# 10 is about a pixel.
MARGIN = 110  # room round the drawing for the line and shadow; the site's CSS insets by this


def outline(fill="#db8a12"):
    mark = build(fill)
    body = mark[mark.index("<g id=\"half\">"):mark.rindex("</svg>")]
    x, y, w, h = 10 - MARGIN, 105 - MARGIN, 1566 + 2 * MARGIN, 842 + 2 * MARGIN
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {w} {h}" '
        f'width="{w}" height="{h}">'
        f'<filter id="o" filterUnits="userSpaceOnUse" x="{x}" y="{y}" width="{w}" height="{h}" '
        'color-interpolation-filters="sRGB">'
        '<feGaussianBlur in="SourceAlpha" stdDeviation="3"/>'
        '<feComponentTransfer result="outer"><feFuncA type="linear" slope="14" intercept="-1.2"/></feComponentTransfer>'
        '<feComposite in="outer" in2="SourceAlpha" operator="out" result="ring"/>'
        '<feFlood flood-color="#fff"/>'
        '<feComposite in2="ring" operator="in" result="line"/>'
        '<feGaussianBlur in="outer" stdDeviation="14"/>'
        '<feOffset dy="14"/>'
        '<feComposite in2="outer" operator="out" result="shade"/>'
        '<feFlood flood-color="#1f2430" flood-opacity="0.58"/>'
        '<feComposite in2="shade" operator="in" result="shadow"/>'
        '<feMerge><feMergeNode in="shadow"/><feMergeNode in="line"/></feMerge>'
        "</filter>"
        f'<g filter="url(#o)">{body}</g></svg>'
    )


if __name__ == "__main__":
    out = sys.argv[1]
    fill = sys.argv[2] if len(sys.argv) > 2 else "#db8a12"
    # A third argument draws the heavier cut for small sizes, and a fourth (or a
    # third, for the regular cut) "outline" draws the outline that goes behind it.
    if len(sys.argv) > 3 and sys.argv[3] == "small":
        STEM, THIN, SWELL, TIP, DOT = 31, 23, 41, 19, 15
    with open(out, "w", encoding="utf8") as f:
        if "outline" in sys.argv[3:]:
            f.write(outline(fill))
        elif len(sys.argv) > 3 and sys.argv[3] == "sun":
            paths = "".join(f'<path d="{d}"/>' for d in sun(0, 0))
            f.write(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-74 -74 148 148" '
                f'width="512" height="512" fill="{fill}">{paths}</svg>'
            )
        else:
            f.write(build(fill))
