# -*- coding: utf-8 -*-
"""Zapíše schválené texty z hárku späť do public/data/course.js.

Nepracuje s poradím ani s riadkami, ale s presným reťazcom pôvodného textu
v zdrojáku. Keď sa taký reťazec nenájde alebo sa nájde viackrát mimo bloku
danej obrazovky, riadok sa preskočí a vypíše — radšej nech nesedí jeden
text, než aby sa prepísal cudzí.
"""
import io, json, re, sys

src_path = "public/data/course.js"
changes = json.load(open(sys.argv[1], encoding="utf-8"))
apply = len(sys.argv) > 2 and sys.argv[2] == "--zapis"

src = io.open(src_path, encoding="utf-8").read()


def js_literal(text):
    return '"' + text.replace("\\", "\\\\").replace('"', '\\"') + '"'


def slide_span(source, slide_id):
    """Nájde rozsah zdrojáku patriaci obrazovke s daným id."""
    m = re.search(r"\n  \{\s*id:\s*%d\s*," % slide_id, source)
    if not m:
        return None
    start = m.start()
    nxt = re.search(r"\n  \{\s*id:\s*\d+\s*,", source[start + 5:])
    end = start + 5 + nxt.start() if nxt else len(source)
    return start, end


ok, skipped = 0, []
for ch in changes:
    if ch["new"] == ch["orig"]:
        continue
    lit_old = js_literal(ch["orig"])
    lit_new = js_literal(ch["new"])

    span = slide_span(src, ch["slideId"])
    if not span:
        skipped.append((ch["row"], ch["slideId"], ch["path"], "obrazovka sa v zdrojáku nenašla"))
        continue
    a, b = span
    block = src[a:b]

    n_block = block.count(lit_old)
    if n_block == 1:
        src = src[:a] + block.replace(lit_old, lit_new) + src[b:]
        ok += 1
    elif n_block == 0:
        skipped.append((ch["row"], ch["slideId"], ch["path"], "pôvodný text sa v zdrojáku nenašiel"))
    else:
        skipped.append((ch["row"], ch["slideId"], ch["path"], "pôvodný text je v obrazovke %dx" % n_block))

print("zapísaných:", ok)
print("preskočených:", len(skipped))
for s in skipped:
    print("  riadok %s | obrazovka %s | %s — %s" % s)

if apply and ok:
    io.open(src_path, "w", encoding="utf-8", newline="").write(src)
    print("súbor uložený")
