import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { MardColor } from '../data/mardColors';

interface PreviewModalProps {
  pixels: MardColor[][];
  onClose: () => void;
}

export function PreviewModal({ pixels, onClose }: PreviewModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const cellSize = 40;

  useEffect(() => {
    if (!canvasRef.current || pixels.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rows = pixels.length;
    const cols = pixels[0].length;

    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

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

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(zoom * delta, 5));
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [zoom]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">全图预览</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex gap-2 p-4 bg-gray-50 border-b">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <ZoomOut size={18} />
              缩小
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded">
              <span className="text-sm font-medium">{(zoom * 100).toFixed(0)}%</span>
            </div>
            <button
              onClick={() => setZoom(Math.min(zoom + 0.2, 5))}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <ZoomIn size={18} />
              放大
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors ml-auto"
            >
              重置视图
            </button>
          </div>

          <div
            ref={containerRef}
            className="flex-1 overflow-auto bg-gray-100 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              }}
              className="inline-block"
            >
              <canvas ref={canvasRef} className="border border-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
