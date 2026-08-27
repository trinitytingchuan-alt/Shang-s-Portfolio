import subprocess, re
h = subprocess.check_output(['git','show','57d597a:index.html'], encoding='utf-8')
# 找股票相关 article 块：从含"股票"的 article 开始到 </article>
arts = re.findall(r'<article\b.*?</article>', h, re.S)
for a in arts:
    if '股票' in a:
        print('==== ARTICLE ====')
        print(a)
        print()
# 列出股票相关 data-modal 图片路径
print('==== IMG PATHS ====')
for m in re.findall(r'data-modal="([^"]*stock[^"]*)"', h):
    print(m)
