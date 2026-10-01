#!/usr/bin/env python3
"""Stamp a new version on every CSS/JS file the site loads.

Run before each commit that changes the site:  python3 tools/bump-version.py
Phones then fetch fresh files instead of reusing old saved copies, and
index.html reloads itself once if version.json says a newer build exists.
"""
import json, pathlib, re, time

ROOT = pathlib.Path(__file__).resolve().parent.parent
V = time.strftime('%Y%m%d%H%M%S')

# JS: every relative import gets the same ?v= (identical URLs keep one copy of each module)
js_spec = re.compile(r"""((?:from|import)\s*\(?\s*['"])(\.{1,2}/[^'"?]+\.js)(?:\?v=[^'"]*)?(['"])""")
for f in (ROOT / 'js').rglob('*.js'):
    s = f.read_text()
    n = js_spec.sub(lambda m: f"{m[1]}{m[2]}?v={V}{m[3]}", s)
    if n != s:
        f.write_text(n)

html = ROOT / 'index.html'
s = html.read_text()
s = re.sub(r'((?:href|src)="(?:css|js)/[^"?]+\.(?:css|js))(?:\?v=[^"]*)?"', lambda m: f'{m[1]}?v={V}"', s)
s = re.sub(r"const BUILD = '[^']*';", f"const BUILD = '{V}';", s)
html.write_text(s)

(ROOT / 'version.json').write_text(json.dumps({'v': V}) + '\n')
print('version', V)
