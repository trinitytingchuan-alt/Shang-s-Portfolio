import fitz

src = r'C:/Users/Administrator/Desktop/zg/sumwork/bgy/'
out = r'C:/Users/Administrator/Desktop/zg/workbuddy/assets/bgy/'
DPI = 200

for name, outname in [('商业市场研究.pdf', 'bgy_market_p1.png'),
                      ('定位策划.pdf', 'bgy_positioning_p1.png')]:
    doc = fitz.open(src + name)
    print(name, 'pages', doc.page_count)
    doc[0].get_pixmap(dpi=DPI).save(out + outname)
    doc.close()
    print('saved', outname)

# report sizes
from PIL import Image
for f in ['bgy_market_p1.png', 'bgy_positioning_p1.png']:
    print(f, Image.open(out + f).size)
