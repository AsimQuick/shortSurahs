/**
 * @file scripts/build-icons.js
 * @description Builds every app icon asset from one source image.
 *              The source (assets/source/app-icon-source.jpeg) is a rendering of
 *              the icon: a brown rounded square on a cream border. iOS and Android
 *              apply their own corner masks, so this script:
 *                1. crops to the brown square,
 *                2. re-draws its vertical brown gradient full-bleed (no rounded
 *                   corners, no edge highlight) and lifts only the light logo
 *                   from the source onto it, then
 *                3. writes:
 *                   - assets/icon.png                     1024, iOS + store icon
 *                   - assets/android-icon-foreground.png  1024, adaptive foreground
 *                     (icon scaled into the 72/108 visible zone, background extended)
 *                   - assets/android-icon-background.png  512, solid brown
 *                   - assets/android-icon-monochrome.png  432, white logo on
 *                     transparent (Android 13+ themed icons)
 *                   - assets/splash-icon.png              1024, logo only on
 *                     transparent, shown on the dark splash background
 *                   - assets/favicon.png                  48, web
 *              Usage: node scripts/build-icons.js [sourceImage]
 *              Uses jimp-compact (already installed via Expo's image tooling).
 *              A full-bleed PNG export from the original design file would give
 *              crisper results than this crop (the square is upscaled ~1.25x).
 * @project shortSurahs
 * @story US-12: Design refresh (app icon)
 * @sprint Sprint 7
 * @created 2026-11-07
 */

const path = require('path');
const Jimp = require('jimp-compact');

// Repo root: this script lives in <root>/scripts/.
const ROOT = path.resolve(process.argv[1], '..', '..');
const SOURCE = process.argv[2] || path.join(ROOT, 'assets', 'source', 'app-icon-source.jpeg');
const out = (name) => path.join(ROOT, 'assets', name);

const isBrown = ({ r, g, b }) => r < 150 && g < 110 && b < 90;
const rgba = (img, x, y) => Jimp.intToRGBA(img.getPixelColor(x, y));
const lum = ({ r, g, b }) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** Finds the brown square's bounds and corner radius in the source image. */
function measure(img) {
  const { width: W, height: H } = img.bitmap;
  const mid = Math.floor(W / 2);
  let left = 0;
  while (!isBrown(rgba(img, left, mid))) left++;
  let right = W - 1;
  while (!isBrown(rgba(img, right, mid))) right--;
  let top = 0;
  while (!isBrown(rgba(img, mid, top))) top++;
  let bottom = H - 1;
  while (!isBrown(rgba(img, mid, bottom))) bottom--;
  let d = 0;
  while (!isBrown(rgba(img, left + d, top + d))) d++;
  const radius = Math.round(d / (1 - 1 / Math.SQRT2));
  return { left, top, size: Math.min(right - left, bottom - top) + 1, radius };
}

/**
 * Rebuilds the icon on a clean background: the source's brown is a vertical
 * gradient, so it is re-drawn from samples (smoothed), and only the light logo
 * is lifted from the source. This removes the rounded corners, the thin edge
 * highlight and JPEG noise in the background.
 */
function cleanIcon(src, { left, top, size, radius }) {
  const sq = src.clone().crop(left, top, size, size);
  const avg = (x0, x1, y) => {
    let r = 0, g = 0, b = 0;
    for (let x = x0; x <= x1; x++) {
      const c = rgba(sq, x, y);
      r += c.r; g += c.g; b += c.b;
    }
    const n = x1 - x0 + 1;
    return [r / n, g / n, b / n];
  };
  // Raw row colours: edge band where the sides are straight, centre band in the
  // top/bottom corner rows (no logo there). Skip the 6px highlight rim.
  const raw = [];
  for (let y = 0; y < size; y++) {
    const yy = Math.min(size - 7, Math.max(6, y));
    raw.push(yy > radius && yy < size - radius ? avg(30, 70, yy) : avg(380, 440, yy));
  }
  // Smooth (moving average) to remove JPEG noise.
  const win = 15;
  const smooth = raw.map((_, y) => {
    let r = 0, g = 0, b = 0, n = 0;
    for (let k = Math.max(0, y - win); k <= Math.min(size - 1, y + win); k++) {
      r += raw[k][0]; g += raw[k][1]; b += raw[k][2]; n++;
    }
    return [r / n, g / n, b / n];
  });

  const S = 1024;
  const up = sq.clone().resize(S, S, Jimp.RESIZE_BICUBIC);
  const grad = [];
  for (let y = 0; y < S; y++) grad.push(smooth[Math.min(size - 1, Math.round((y * (size - 1)) / (S - 1)))]);

  // The old rounded square, scaled to S. Anything outside it (cream corners,
  // edge highlight) is background, never logo.
  const R = (radius * S) / size;
  const insideRounded = (x, y, inset) => {
    if (x < inset || y < inset || x > S - 1 - inset || y > S - 1 - inset) return false;
    const cx = x < R ? R : x > S - 1 - R ? S - 1 - R : x;
    const cy = y < R ? R : y > S - 1 - R ? S - 1 - R : y;
    return Math.hypot(x - cx, y - cy) <= R - inset;
  };

  const icon = new Jimp(S, S, 0x000000ff);
  const alpha = new Float32Array(S * S);
  for (let y = 0; y < S; y++) {
    const [gr, gg, gb] = grad[y];
    const bgL = 0.2126 * gr + 0.7152 * gg + 0.0722 * gb;
    for (let x = 0; x < S; x++) {
      const c = rgba(up, x, y);
      // Ignore the rim and corners: outside the old rounded square there is no logo.
      const inner = insideRounded(x, y, 14);
      const a = inner ? Math.max(0, Math.min(1, (lum(c) - bgL - 22) / 55)) : 0;
      alpha[y * S + x] = a;
      icon.setPixelColor(
        Jimp.rgbaToInt(
          Math.round(c.r * a + gr * (1 - a)),
          Math.round(c.g * a + gg * (1 - a)),
          Math.round(c.b * a + gb * (1 - a)),
          255,
        ),
        x,
        y,
      );
    }
  }
  return { icon, alpha, grad };
}

async function main() {
  const src = await Jimp.read(SOURCE);
  const m = measure(src);
  const { icon, alpha, grad } = cleanIcon(src, m);
  const S = 1024;

  // 1. iOS / store icon
  await icon.writeAsync(out('icon.png'));

  // 2. Android adaptive foreground: icon in the visible 72/108 zone, gradient
  //    extended to the canvas edges (only seen during launcher motion).
  const visible = Math.round(S * (72 / 108));
  const offset = Math.round((S - visible) / 2);
  const inner = icon.clone().resize(visible, visible, Jimp.RESIZE_BICUBIC);
  const fg = new Jimp(S, S, 0x000000ff);
  for (let y = 0; y < S; y++) {
    const iy = Math.min(S - 1, Math.max(0, Math.round(((y - offset) * (S - 1)) / (visible - 1))));
    const [r, g, b] = grad[iy];
    const colour = Jimp.rgbaToInt(Math.round(r), Math.round(g), Math.round(b), 255);
    for (let x = 0; x < S; x++) fg.setPixelColor(colour, x, y);
  }
  fg.composite(inner, offset, offset);
  await fg.writeAsync(out('android-icon-foreground.png'));

  // 3. Android adaptive background: solid mid brown.
  const [mr, mg, mb] = grad[S / 2];
  await new Jimp(512, 512, Jimp.rgbaToInt(Math.round(mr), Math.round(mg), Math.round(mb), 255)).writeAsync(
    out('android-icon-background.png'),
  );

  // 4. Monochrome (themed icons) and 5. splash: logo only, on transparent.
  const mono = new Jimp(S, S, 0x00000000);
  const splash = new Jimp(S, S, 0x00000000);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const a = alpha[y * S + x];
      if (a <= 0) continue;
      const c = rgba(icon, x, y);
      const A = Math.round(a * 255);
      mono.setPixelColor(Jimp.rgbaToInt(255, 255, 255, A), x, y);
      splash.setPixelColor(Jimp.rgbaToInt(c.r, c.g, c.b, A), x, y);
    }
  }
  const monoCanvas = new Jimp(S, S, 0x00000000);
  monoCanvas.composite(mono.clone().resize(visible, visible, Jimp.RESIZE_BICUBIC), offset, offset);
  await monoCanvas.resize(432, 432, Jimp.RESIZE_BICUBIC).writeAsync(out('android-icon-monochrome.png'));
  await splash.writeAsync(out('splash-icon.png'));

  // 6. Favicon
  await icon.clone().resize(48, 48, Jimp.RESIZE_BICUBIC).writeAsync(out('favicon.png'));

  console.log('source square', m, '→ icons written');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
