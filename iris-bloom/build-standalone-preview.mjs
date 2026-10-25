/**
 * Bundle the approved 60 extracted WebP frames into a self-contained preview.
 * This is a mechanical packaging step; the individual frame files remain intact.
 * Run from any working directory: node iris-bloom/build-standalone-preview.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('./gesture-sequence/', import.meta.url);
const templateUrl = new URL('preview.html', root);
const outputUrl = new URL('FLORA-iris-standalone.html', root);
const count = 60;
const frames = [];
for (let i = 1; i <= count; i++) {
  const bytes = await readFile(new URL(`frames/lavender-iris/${i}.webp`, root));
  // WebP RIFF header check: reject an invalid or truncated file before bundling.
  if (bytes.length < 16 || bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error(`Invalid WebP frame ${i}`);
  }
  frames.push(`data:image/webp;base64,${bytes.toString('base64')}`);
}
const template = await readFile(templateUrl, 'utf8');
const sourceMarker = 'const COUNT = 60, DURATION = 5033;';
const imageMarker = 'image.src = `./frames/lavender-iris/${i + 1}.webp`;';
if (!template.includes(sourceMarker) || !template.includes(imageMarker)) {
  throw new Error('Preview markup changed: cannot safely embed images.');
}
const bundled = template
  .replace(sourceMarker, `${sourceMarker}\n      const embeddedFrames = ${JSON.stringify(frames)};`)
  .replace(imageMarker, 'image.src = embeddedFrames[i];')
  .replace('由原始连续视频提取的真实 60 帧 WebP 动画 · 无需打开摄像头', '独立 HTML · 内嵌真实 60 帧 WebP · 无需联网或摄像头')
  .replace('<a href="./index.html">前往 Skill 手势控制实验版（需要 HTTPS 摄像头权限）</a>', '');
await writeFile(outputUrl, bundled, { encoding: 'utf8', flag: 'wx' });
console.log(`Created ${outputUrl.pathname} (${(Buffer.byteLength(bundled)/1024/1024).toFixed(2)} MiB)`);
