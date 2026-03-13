import { Download } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { MardColor } from '../data/mardColors';

interface PixelGridProps {
  pixels: MardColor[][];
}

export function PixelGrid({ pixels }: PixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || pixels.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rows = pixels.length;
    const cols = pixels[0].length;
    const cellSize = 40;

    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const color = pixels[y][x];
        const px = x * cellSize;
        const py = y * cellSize;

        ctx.fillStyle = `rgb(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`;
        ctx.fillRect(px, py, cellSize, cellSize);

        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, cellSize, cellSize);

        const brightness =
          (color.rgb[0] * 299 + color.rgb[1] * 587 + color.rgb[2] * 114) / 1000;
        ctx.fillStyle = brightness > 128 ? '#000000' : '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(color.code, px + cellSize / 2, py + cellSize / 2);
      }
    }
  }, [pixels]);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `pixel-art-${pixels.length}x${pixels[0]?.length || 0}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  if (pixels.length === 0) {
    return null;
  }

  const rows = pixels.length;
  const cols = pixels[0].length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">像素化图 ({cols}×{rows})</h2>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm shadow-md"
        >
          <Download size={16} />
          下载图片
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 overflow-auto">
        <canvas ref={canvasRef} className="border border-gray-300" />
      </div>
    </div>
  );
}
