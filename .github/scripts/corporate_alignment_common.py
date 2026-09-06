from pathlib import Path
ROOT = Path('.')

def repl(path, old, new, required=True):
    p = ROOT / path
    s = p.read_text(encoding='utf-8')
    if old not in s:
        if new in s:
            return
        if required:
            raise SystemExit(f'{path}: expected source text not found: {old[:120]!r}')
        return
    p.write_text(s.replace(old, new), encoding='utf-8')

def all_html(old, new):
    for p in ROOT.rglob('*.html'):
        s = p.read_text(encoding='utf-8', errors='ignore')
        if old in s:
            p.write_text(s.replace(old, new), encoding='utf-8')
