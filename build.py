# -*- coding: utf-8 -*-
# Reassemble the grouped src/ files into the deployable index.html (GitHub Pages)
# and the floodlight-fc.html build (used to publish the claude.ai artifact).
#
#   Edit files in src/, then run:  python3 build.py
#
import glob, os, sys

HERE=os.path.dirname(os.path.abspath(__file__))
def rd(p): return open(os.path.join(HERE,p),encoding='utf-8').read()

head = rd('src/_head.html')
css  = rd('src/styles.css')
app  = rd('src/app.html')
js_files = sorted(glob.glob(os.path.join(HERE,'src','js','*.js')))
jsbody = ''.join(open(f,encoding='utf-8').read() for f in js_files)

JS_OPEN='<script>\n(function(){\n"use strict";\n'
JS_TAIL='})();\n</script>\n'

# --- 1) artifact build (claude.ai) : identical structure to the original ---
artifact = head + '<style>' + css + '</style>' + app + JS_OPEN + jsbody + JS_TAIL
open(os.path.join(HERE,'floodlight-fc.html'),'w',encoding='utf-8').write(artifact)

# --- 2) GitHub Pages build : standalone doctype, no claude-only meta ---
banner=('<!doctype html>\n<!--\n  TacTicToe  |  (c) 2026 Kai Winterbottom. All Rights Reserved.\n'
        '  See the LICENSE file in this repository.\n-->\n')
reset=('<html lang="en">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
       '<style>html,body{margin:0;padding:0}*{box-sizing:border-box}img{max-width:100%}[hidden]{display:none!important}</style>\n')
head_pages = head.replace('<meta name="claude:viewport-fit-sides" content="cover">\n','')
page = (banner + reset + head_pages + '<style>' + css + '</style>\n</head>\n<body>\n'
        + app + JS_OPEN + jsbody + JS_TAIL + '</body>\n</html>\n')
open(os.path.join(HERE,'index.html'),'w',encoding='utf-8').write(page)

print('built index.html (%d bytes) and floodlight-fc.html (%d bytes) from %d js groups'
      % (len(page), len(artifact), len(js_files)))
