from corporate_alignment_common import ROOT
import hashlib

def run(expected):
    pdf = ROOT / 'documents/dapps-platform-inc-corporate-authorization-dapps-platform-usa.pdf'
    if hashlib.sha256(pdf.read_bytes()).hexdigest() != expected:
        raise SystemExit('Published PDF failed SHA-256 verification')
    pages = list(ROOT.rglob('*.html'))
    banned = [
        'DApps Platform USA, Inc.',
        'DApps Platform USA is the independently governed U.S. operating organization',
        'DApps Platform USA operates as an independently governed U.S. operating organization',
        'DApps Platform USA maintains its own U.S. governance structure',
        'DApps Platform USA maintains a dedicated Board governance structure for its U.S. operating organization',
        'One U.S. operating organization. Clear legal responsibility.',
    ]
    for p in pages:
        text = p.read_text(encoding='utf-8', errors='ignore')
        for phrase in banned:
            if phrase in text:
                raise SystemExit(f'{p}: stale corporate-structure language remains: {phrase}')
    required = {
        'index.html': ['U.S. market-facing business brand and operating designation of DApps Platform Inc.'],
        'about/index.html': ['Company-authorized U.S. market-facing business brand', 'does not constitute a separate legal entity'],
        'careers/index.html': ['Clear U.S. identity. Clear legal responsibility.', 'applicable legal employer and contracting party'],
        'company-verification/index.html': ['4190391 (C4190391)', 'VIEW SIGNED CORPORATE AUTHORIZATION (PDF)', 'not the board of a separately incorporated DApps Platform USA entity'],
        'compliance/index.html': ['U.S. Governance &amp; Authorized Operations', 'U.S. market-facing business brand and operating designation'],
        'leadership/index.html': ['Internal governance for U.S. market operations.', 'not the board of a separately incorporated DApps Platform USA entity'],
        'terms/index.html': ['U.S. market-facing business brand, trade name, and operating designation'],
        'privacy/index.html': ['U.S. market-facing business and operating designation of DApps Platform Inc.'],
        'trust-wallet/index.html': ['How DApps Platform USA is authorized', 'does not transfer ownership of Trust Wallet'],
        'Vice-President-of-Sales-DApps-Platform-USA/index.html': ['U.S. Business Designation', 'DApps Platform USA Board', 'Legal Employer'],
        'Head-of-Internal-Audit-DApps-Platform-USA/index.html': ['U.S. Business Designation', 'DApps Platform USA Board', 'Legal Employer'],
    }
    for path, phrases in required.items():
        text = (ROOT / path).read_text(encoding='utf-8')
        for phrase in phrases:
            if phrase not in text:
                raise SystemExit(f'{path}: missing aligned disclosure: {phrase}')
    print('Audited', len(pages), 'HTML pages against the signed Corporate Authorization.')
