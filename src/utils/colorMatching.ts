import { MardColor, MARD_COLORS } from '../data/mardColors';

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

export function findClosestMardColor(rgb: [number, number, number]): MardColor {
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
