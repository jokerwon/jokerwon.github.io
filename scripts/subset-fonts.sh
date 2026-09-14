#!/usr/bin/env bash
# 从 fonts/ 的完整 LXGW WenKai 字体生成 src/assets/fonts/ 下的按需子集。
# 字符集 = 站点源文件用字 ∪ 可打印 ASCII ∪ 常用中文标点 ∪ 词频表 top 20000 词的字（≈常用字 3500+）。
# 新增文章后运行：./scripts/subset-fonts.sh && npm run build
set -euo pipefail

command -v pyftsubset >/dev/null 2>&1 || {
  echo "缺少 pyftsubset，安装：uv tool install fonttools --with brotli" >&2
  exit 1
}

CHARSET=/tmp/site-font-charset.txt

node - "$CHARSET" <<'NODEEOF'
const fs = require('fs');
const path = require('path');
const [, , charsetPath] = process.argv;
const chars = new Set();

// 1) 站点源文件用字（文章正文 + 页面 UI 文案）
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(md|astro|ts)$/.test(entry.name)) {
      for (const ch of fs.readFileSync(p, 'utf8')) chars.add(ch);
    }
  }
};
walk('src');

// 2) 可打印 ASCII
for (let c = 0x20; c < 0x7f; c++) chars.add(String.fromCharCode(c));

// 3) 常用中文标点与符号
for (const ch of '、。〈〉《》「」『』【】〔〕！？：；，（）．·—…～￥％℃°×÷±≥≤≠≈∞→←↑↓⇒★☆○●◎◆□■△▲※§¶†‡•“”‘’　￣︰﹁﹂') {
  chars.add(ch);
}

// 4) 词频表 top 20000 词覆盖的字（≈常用字 3500+，保证后续新文章绝大多数用字可用）
const lines = fs.readFileSync('fonts/zh-cn-word-freq-50k.txt', 'utf8').split('\n');
for (let i = 0; i < Math.min(20000, lines.length); i++) {
  for (const ch of lines[i].split(' ')[0]) chars.add(ch);
}

fs.writeFileSync(charsetPath, [...chars].sort().join(''), 'utf8');
console.log('字符集：' + chars.size + ' 个字符 -> ' + charsetPath);
NODEEOF

for f in lxgw-wenkai-lite-regular lxgw-wenkai-lite-medium lxgw-wenkai-mono-lite-regular lxgw-wenkai-mono-lite-medium; do
  pyftsubset "fonts/$f.woff2" \
    --text-file="$CHARSET" \
    --flavor=woff2 \
    --layout-features='*' \
    --name-IDs='*' \
    --name-legacy \
    --output-file="src/assets/fonts/$f.woff2"
  echo "src/assets/fonts/$f.woff2: $(du -h "src/assets/fonts/$f.woff2" | cut -f1)（原 $(du -h "fonts/$f.woff2" | cut -f1)）"
done
