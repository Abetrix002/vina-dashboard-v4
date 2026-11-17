#!/usr/bin/env python3
"""Inline src/core.css, src/core.js, src/views/*.js and src/zz-boot.js into one page.
python3 -I build.py  ->  dist/index.html (+ a copy at the path given as argv[1], if any)."""
import pathlib, sys

HERE = pathlib.Path(__file__).parent
SRC = HERE / "src"
css = (SRC / "core.css").read_text()
js = [(SRC / "core.js").read_text()]
js += [p.read_text() for p in sorted((SRC / "views").glob("*.js"))]
js.append((SRC / "zz-boot.js").read_text())
body = "\n;\n".join(js).replace("</script", "<\\/script")

PAGE = f"""<title>VINA Dashboard V4</title>
<meta name="description" content="V4 of the VINA Dashboard for iCaur Alghanim: new logo, WhatsApp and web chat for sales, calmer layout. All 49 screens, light and dark.">
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap">
<style>
{css}
</style>
<div id="app"></div>
<div id="layers"></div>
<div id="pops"></div>
<div id="proto"></div>
<script>
{body}
</script>
"""

# Standalone document for Vercel (the artifact host adds this wrapper itself). Sample data only, so not indexed.
SITE = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<style>body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
{PAGE.split('<div id="app">')[0]}</head>
<body>
<div id="app">{PAGE.split('<div id="app">', 1)[1]}</body>
</html>
"""

if __name__ == "__main__":
    out = HERE / "dist" / "index.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(PAGE)
    site = HERE / "site"; site.mkdir(exist_ok=True)
    (site / "index.html").write_text(SITE)
    if len(sys.argv) > 1:
        pathlib.Path(sys.argv[1]).write_text(PAGE)
    print(out, len(PAGE) // 1024, "KB · site/index.html")
