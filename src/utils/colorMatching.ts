import { MardColor, MARD_COLORS } from '../data/mardColors';

/** RGB 欧氏距离：√[(R1-R2)² + (G1-G2)² + (B1-B2)²] */
export function getColorDistance(
  rgb1: [number, number, number],
  rgb2: [number, number, number]
): number {
  const [r1, g1, b1] = rgb1;
  const [r2, g2, b2] = rgb2;
  return Math.sqrt(
    Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
  );
}

/**
 * 仅从官方标准色卡中按 RGB 欧氏距离取最近色号，返回 code/name/rgb/hex。
 * 兜底：任意输入 RGB 均匹配到色卡中距离最近的一项，绝不输出非标准色号。
 */
export function findClosestMardColor(rgb: [number, number, number]): MardColor {
  if (MARD_COLORS.length === 0) {
    throw new Error('色卡未加载，请刷新页面');
  }
  let closestColor = MARD_COLORS[0];
  let minDistance = getColorDistance(rgb, closestColor.rgb);

  for (let i = 1; i < MARD_COLORS.length; i++) {
    const distance = getColorDistance(rgb, MARD_COLORS[i].rgb);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = MARD_COLORS[i];
    }
  }

  return closestColor;
}

/** 页面加载时校验官方色卡是否正常加载，避免色号缺失 */
export function validatePalette(): boolean {
  if (!MARD_COLORS?.length) return false;
  const expectedMin = 200;
  if (MARD_COLORS.length < expectedMin) return false;
  const first = MARD_COLORS[0];
  return Boolean(
    first &&
      typeof first.code === 'string' &&
      typeof first.name === 'string' &&
      Array.isArray(first.rgb) &&
      first.rgb.length === 3
  );
}

export function getAverageColor(
  imageData: ImageData,
  x: number,
  y: number,
  blockSize: number,
  imageWidth: number,
  imageHeight: number
): [number, number, number] {
  let r = 0,
    g = 0,
    b = 0;
  let count = 0;

  for (let dy = 0; dy < blockSize; dy++) {
    for (let dx = 0; dx < blockSize; dx++) {
      const px = x + dx;
      const py = y + dy;

      if (px < imageWidth && py < imageHeight) {
        const index = (py * imageWidth + px) * 4;
        r += imageData.data[index];
        g += imageData.data[index + 1];
        b += imageData.data[index + 2];
        count++;
      }
    }
  }

  return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
}
