from pathlib import Path
import base64, hashlib
from corporate_alignment_common import ROOT, all_html
import corporate_alignment_a, corporate_alignment_b, corporate_alignment_audit

PARTS = [ROOT / f'.github/corporate-authorization.part{i}.b64' for i in range(1, 5)]
PDF = ROOT / 'documents/dapps-platform-inc-corporate-authorization-dapps-platform-usa.pdf'
EXPECTED = 'a841d6b080cb98e23e34194db97e5d76d3f59f8be60b47a43f8ee4d6169ab26a'

encoded = ''.join(p.read_text(encoding='ascii') for p in PARTS)
data = base64.b64decode(encoded)
actual = hashlib.sha256(data).hexdigest()
if actual != EXPECTED:
    raise SystemExit(f'Corporate Authorization PDF hash mismatch: {actual}')
PDF.parent.mkdir(parents=True, exist_ok=True)
PDF.write_bytes(data)

all_html('U.S. operations in development in Los Angeles, California.',
         'U.S. market operations are conducted under the DApps Platform USA business designation.')
all_html('developing U.S. organization', 'developing U.S. market operations')

corporate_alignment_a.run()
corporate_alignment_b.run()
corporate_alignment_audit.run(EXPECTED)
print('Published signed Corporate Authorization and aligned all public disclosures.')
