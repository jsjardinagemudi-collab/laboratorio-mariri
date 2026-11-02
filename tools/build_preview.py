"""Generate an offline single-file preview from the same source used by Pages."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text(encoding='utf-8')
html=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>\n'+(root/m[1]).read_text(encoding='utf-8')+'\n</style>',html)
html=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>\n'+(root/m[1]).read_text(encoding='utf-8')+'\n</script>',html)
(root/'preview.html').write_text(html,encoding='utf-8')
print('preview.html regenerated from index.html + css + js')
