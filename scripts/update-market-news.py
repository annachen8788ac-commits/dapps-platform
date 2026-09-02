#!/usr/bin/env python3
import json, html, re, time, urllib.parse, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

QUERIES = [
    'digital asset regulation institutional finance',
    'tokenization financial markets blockchain infrastructure',
    'stablecoin regulation payments institutions',
    'crypto market structure institutional liquidity',
    'digital asset cybersecurity blockchain security'
]
TRUSTED = {
    'Reuters': 100, 'Bloomberg': 98, 'Financial Times': 96, 'The Wall Street Journal': 95,
    'U.S. Securities and Exchange Commission': 100, 'SEC.gov': 100, 'CFTC': 100,
    'Bank for International Settlements': 100, 'Federal Reserve': 100, 'U.S. Department of the Treasury': 100,
    'CoinDesk': 86, 'The Block': 84, 'Fortune': 80, 'CNBC': 82, 'Forbes': 76
}
SEED = [
    {'source':'U.S. SEC','date':'POLICY','title':'Digital Asset Regulation & Policy','summary':'Current U.S. Securities and Exchange Commission information relevant to crypto assets, market structure and investor protection.','url':'https://www.sec.gov/about/crypto-task-force/crypto-newsroom'},
    {'source':'U.S. CFTC','date':'MARKETS','title':'Derivatives & Market Structure Updates','summary':'Current releases affecting derivatives, trading infrastructure, market integrity and digital assets.','url':'https://www.cftc.gov/PressRoom/PressReleases'},
    {'source':'BIS','date':'INFRASTRUCTURE','title':'Tokenisation & Financial Infrastructure','summary':'Research and initiatives covering tokenisation, payments and next-generation financial-market infrastructure.','url':'https://www.bis.org/about/innovation-hub/overview.htm'},
    {'source':'CISA','date':'SECURITY','title':'Cybersecurity Advisories','summary':'Current U.S. cybersecurity advisories and defensive guidance relevant to technology and digital infrastructure.','url':'https://www.cisa.gov/news-events/cybersecurity-advisories'}
]

def clean(s):
    s = html.unescape(re.sub(r'<[^>]+>', ' ', s or ''))
    return re.sub(r'\s+', ' ', s).strip()

def fetch(url, attempts=4):
    err = None
    for i in range(attempts):
        try:
            req = urllib.request.Request(url, headers={'User-Agent':'DAppsPlatformMarketIntelligence/1.0'})
            with urllib.request.urlopen(req, timeout=20) as r:
                return r.read()
        except Exception as e:
            err = e
            time.sleep(min(2 ** i, 8))
    raise err

def score(source):
    for key, value in TRUSTED.items():
        if key.lower() in source.lower(): return value
    return 55

def parse_query(query):
    url = 'https://news.google.com/rss/search?' + urllib.parse.urlencode({'q':query,'hl':'en-US','gl':'US','ceid':'US:en'})
    root = ET.fromstring(fetch(url))
    out = []
    for item in root.findall('.//item'):
        title = clean(item.findtext('title'))
        link = clean(item.findtext('link'))
        source_el = item.find('source')
        source = clean(source_el.text if source_el is not None else '') or 'Market News'
        pub = clean(item.findtext('pubDate'))
        try:
            dt = parsedate_to_datetime(pub).astimezone(timezone.utc)
        except Exception:
            dt = datetime.now(timezone.utc)
        if not title or not link: continue
        out.append({'source':source,'title':title,'url':link,'dt':dt,'score':score(source)})
    return out

def main():
    items, seen = [], set()
    for q in QUERIES:
        try:
            for x in parse_query(q):
                key = re.sub(r'[^a-z0-9]+','',x['title'].lower())[:120]
                if key in seen: continue
                seen.add(key); items.append(x)
        except Exception as e:
            print('query failed:', q, e)
    items.sort(key=lambda x:(x['score'], x['dt']), reverse=True)
    selected=[]
    source_counts={}
    for x in items:
        if len(selected)>=8: break
        if source_counts.get(x['source'],0)>=2: continue
        age=(datetime.now(timezone.utc)-x['dt']).total_seconds()/86400
        if age>14: continue
        source_counts[x['source']]=source_counts.get(x['source'],0)+1
        selected.append({'source':x['source'],'date':x['dt'].strftime('%b %d'),'title':x['title'],'summary':'Current reporting relevant to digital assets, institutional markets, regulation, infrastructure or security.','url':x['url']})
    if len(selected)<4:
        selected.extend(SEED[:4-len(selected)])
    payload={'generated_at':datetime.now(timezone.utc).isoformat().replace('+00:00','Z'),'items':selected}
    path=Path(__file__).resolve().parents[1]/'data'/'market-news.json'
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(payload,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print('wrote',len(selected),'items')

if __name__=='__main__': main()
