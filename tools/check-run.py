"""CI check for an automated run (--shots=<dir>): no JS errors, every step captured, exported files valid."""
import json, os, re, sys, zipfile
import xml.dom.minidom as md

d = sys.argv[1]
fail = []
errs = json.load(open(os.path.join(d, 'errors.json'), encoding='utf-8'))
if errs: fail.append('JS errors: ' + '; '.join(errs))
steps = json.load(open(os.path.join(d, 'steps.json'), encoding='utf-8'))
missing = [s for s in steps if not os.path.exists(os.path.join(d, s + '.png'))]
if missing: fail.append('missing screenshots: ' + ', '.join(missing))
for name in ('export-test.pptx', 'export-v5.pptx'):
    p = os.path.join(d, name)
    if not os.path.exists(p): fail.append(name + ' was not exported'); continue
    z = zipfile.ZipFile(p)
    for n in z.namelist():
        if n.endswith(('.xml', '.rels')):
            try: md.parseString(z.read(n))
            except Exception as e: fail.append(f'{name}:{n}: {e}')
    if name == 'export-test.pptx':
        xml = ''.join(z.read(n).decode('utf-8') for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', n))
        if 'p159:morph' not in xml: fail.append('no native Morph transition in export-test.pptx')
        if 'presetClass="entr"' not in xml: fail.append('no entrance animations in export-test.pptx')
print(f'{len(steps)} steps checked')
if fail:
    print('\n'.join('FAIL: ' + f for f in fail)); sys.exit(1)
print('OK')
