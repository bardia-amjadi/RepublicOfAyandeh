"""Creates clearly-labelled PLACEHOLDER images (SVG) so the sample site has no missing assets.
Replace any of them by dropping a real image with the same name — or point the JSON entry to a new file.
Run: python scripts/generate-placeholders.py"""
import os

G, R, W, INK = '#1f9d55', '#d7263d', '#ffffff', '#0d1411'

def write(path, w, h, body):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
                f'<rect width="{w}" height="{h}" fill="{INK}"/>{body}</svg>')

def label(w, h, text, size):
    return (f'<text x="{w/2}" y="{h-size*1.2}" text-anchor="middle" fill="{W}" opacity=".85" '
            f'font-family="Vazirmatn, Tahoma, sans-serif" font-size="{size}">{text}</text>')

def stripes(w, h, k, angle=0):
    cols = [G, W, R]
    c = cols[k % 3]; d = cols[(k + 1) % 3]
    return (f'<g opacity=".9"><rect width="{w}" height="{h*0.34}" fill="{c}"/>'
            f'<rect y="{h*0.34}" width="{w}" height="{h*0.33}" fill="{INK}" opacity=".0"/>'
            f'<circle cx="{w*0.72}" cy="{h*0.45}" r="{h*0.22}" fill="{d}" opacity=".85"/>'
            f'<path d="M0 {h*0.78} Q {w*0.35} {h*0.52} {w*0.7} {h*0.72} T {w} {h*0.6} V{h} H0Z" fill="{c}" opacity=".55"/></g>')

for i in range(1, 5):
    write(f'public/assets/news/news-{i}.svg', 1200, 675, stripes(1200, 675, i) + label(1200, 675, 'تصویر نمونه — جایگزین شود', 38))
for i in range(1, 5):
    body = (f'<rect width="600" height="750" fill="#17211c"/><circle cx="300" cy="280" r="110" fill="#2b3a33"/>'
            f'<path d="M90 750 C90 540 210 470 300 470 S510 540 510 750Z" fill="#2b3a33"/>'
            f'<rect y="0" width="600" height="14" fill="{G}"/><rect y="14" width="600" height="14" fill="{W}"/><rect y="28" width="600" height="14" fill="{R}"/>')
    write(f'public/assets/characters/portrait-{i}.svg', 600, 750, body + label(600, 750, 'پرتره نمونه', 34))
sizes = [(800, 800), (800, 1000), (800, 800), (1000, 700), (800, 1000), (800, 800)]
for i, (w, h) in enumerate(sizes, 1):
    write(f'public/assets/media/media-{i}.svg', w, h, stripes(w, h, i) + label(w, h, f'رسانه نمونه {i}', 40))
for i in range(1, 4):
    write(f'public/assets/instagram/post-{i}.svg', 600, 600, stripes(600, 600, i) + label(600, 600, f'پست نمونه {i}', 32))
print('placeholders written')
