import { Download, Eye, ZoomIn, ZoomOut, FlipHorizontal, FlipVertical } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { MardColor } from '../data/mardColors';
import { PreviewModal } from './PreviewModal';

interface PixelGridProps {
  pixels: MardColor[][];
  isFlippedHorizontally?: boolean;
  isFlippedVertically?: boolean;
  onHorizontalFlip?: () => void;
  onVerticalFlip?: () => void;
  onReset?: () => void;
}

export function PixelGrid({ 
  pixels, 
  isFlippedHorizontally = false,
  isFlippedVertically = false,
  onHorizontalFlip,
  onVerticalFlip,
  onReset
}: PixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);

  const cellSize = 40;
  const rows = pixels.length;
  const cols = pixels[0]?.length || 0;

  useEffect(() => {
    if (!canvasRef.current || pixels.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = cols * cellSize + 60; // Add space for left and right row numbers
    canvas.height = rows * cellSize + 60; // Add space for top and bottom column numbers

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw light blue background for axis areas
    ctx.fillStyle = '#e6f3ff';
    
    // Top axis area
    ctx.fillRect(30, 0, cols * cellSize, 30);
    
    // Bottom axis area  
    ctx.fillRect(30, rows * cellSize + 30, cols * cellSize, 30);
    
    // Left axis area
    ctx.fillRect(0, 30, 30, rows * cellSize);
    
    // Right axis area
    ctx.fillRect(cols * cellSize + 30, 30, 30, rows * cellSize);

    // Draw axis numbers (outside flip transformations)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Top axis numbers (columns) - from left to right: 1, 2, 3...
    for (let x = 0; x < cols; x++) {
      const px = x * cellSize + cellSize / 2 + 30;
      const text = (x + 1).toString();
      ctx.fillText(text, px, 15);
    }

    // Bottom axis numbers (columns) - same as top
    for (let x = 0; x < cols; x++) {
      const px = x * cellSize + cellSize / 2 + 30;
      const text = (x + 1).toString();
      ctx.fillText(text, px, rows * cellSize + 45);
    }

    // Left axis numbers (rows) - from top to bottom: 1, 2, 3...
    ctx.textAlign = 'right';
    for (let y = 0; y < rows; y++) {
      const py = y * cellSize + cellSize / 2 + 30;
      const text = (y + 1).toString();
      ctx.fillText(text, 15, py);
    }

    // Right axis numbers (rows) - same as left
    ctx.textAlign = 'left';
    for (let y = 0; y < rows; y++) {
      const py = y * cellSize + cellSize / 2 + 30;
      const text = (y + 1).toString();
      ctx.fillText(text, cols * cellSize + 45, py);
    }

    // Apply flip transformations
    ctx.save();
    
    // Translate to account for axis space
    ctx.translate(30, 30);
    
    if (isFlippedHorizontally) {
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width + 60, 0);
    }
    
    if (isFlippedVertically) {
      ctx.scale(1, -1);
      ctx.translate(0, -canvas.height + 60);
    }

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

    ctx.restore();
  }, [pixels, rows, cols, isFlippedHorizontally, isFlippedVertically]);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.2, Math.min(zoom * delta, 5));
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

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `pixel-art-${cols}x${rows}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  if (pixels.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold" style={{color: '#d63384'}}>
            像素化图 ({cols}×{rows})
          </h2>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-white rounded-2xl transition-all duration-200 text-sm shadow-lg hover:shadow-xl hover:scale-105 flex-1 sm:flex-initial justify-center"
              style={{
                background: 'linear-gradient(135deg, #ffd6e7 0%, #e8d5f2 100%)',
                boxShadow: '0 4px 12px rgba(232, 213, 242, 0.4)'
              }}
            >
              <Eye size={16} style={{color: '#000000'}} />
              <span style={{color: '#000000'}}>查看全图预览</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-white rounded-2xl transition-all duration-200 text-sm shadow-lg hover:shadow-xl hover:scale-105 flex-1 sm:flex-initial justify-center"
              style={{
                background: 'linear-gradient(135deg, #87ceeb 0%, #98fb98 100%)',
                boxShadow: '0 4px 12px rgba(135, 206, 235, 0.4)'
              }}
            >
              <Download size={16} style={{color: '#000000'}} />
              <span style={{color: '#000000'}}>下载图片</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl shadow-lg p-2 sm:p-4" style={{backgroundColor: '#fff9f9', boxShadow: '0 4px 15px rgba(255, 214, 231, 0.3)'}}>
          <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b-2" style={{borderColor: '#ffd6e7'}}>
            <button
              onClick={() => setZoom(Math.max(0.2, zoom - 0.1))}
              className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-2xl transition-all duration-200 text-xs sm:text-sm shadow hover:shadow-md hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
                color: '#5a4a4a'
              }}
            >
              <ZoomOut size={16} style={{color: '#000000'}} />
              <span style={{color: '#000000'}}>缩小</span>
            </button>
            <div className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-2xl shadow" style={{backgroundColor: '#fff9f9', color: '#5a4a4a'}}>
              <span className="font-medium text-xs sm:text-sm" style={{color: '#000000'}}>{(zoom * 100).toFixed(0)}%</span>
            </div>
            <button
              onClick={() => setZoom(Math.min(zoom + 0.1, 5))}
              className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-2xl transition-all duration-200 text-xs sm:text-sm shadow hover:shadow-md hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
                color: '#5a4a4a'
              }}
            >
              <ZoomIn size={16} style={{color: '#000000'}} />
              <span style={{color: '#000000'}}>放大</span>
            </button>

            {/* Flip buttons */}
            <button
              onClick={onHorizontalFlip}
              className={`flex items-center gap-1 px-2 sm:px-3 py-2 rounded-2xl transition-all duration-200 text-xs sm:text-sm shadow hover:shadow-md hover:scale-105 ${
                isFlippedHorizontally
                  ? 'text-white'
                  : ''
              }`}
              style={{
                background: isFlippedHorizontally
                  ? 'linear-gradient(135deg, #d63384 0%, #e8d5f2 100%)'
                  : 'linear-gradient(135deg, #ffd6e7 0%, #ffe0e6 100%)',
                boxShadow: '0 2px 8px rgba(214, 51, 132, 0.3)'
              }}
            >
              <FlipHorizontal size={16} style={{color: '#000000'}} />
              <span style={{color: '#000000'}}>水平翻转</span>
            </button>
            <button
              onClick={onVerticalFlip}
              className={`flex items-center gap-1 px-2 sm:px-3 py-2 rounded-2xl transition-all duration-200 text-xs sm:text-sm shadow hover:shadow-md hover:scale-105 ${
                isFlippedVertically
                  ? 'text-white'
                  : ''
              }`}
              style={{
                background: isFlippedVertically
                  ? 'linear-gradient(135deg, #d63384 0%, #e8d5f2 100%)'
                  : 'linear-gradient(135deg, #ffd6e7 0%, #ffe0e6 100%)',
                boxShadow: '0 2px 8px rgba(214, 51, 132, 0.3)'
              }}
            >
              <FlipVertical size={16} style={{color: '#000000'}} />
              <span style={{color: '#000000'}}>垂直翻转</span>
            </button>

            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
                onReset?.();
              }}
              className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-2xl transition-all duration-200 text-xs sm:text-sm shadow hover:shadow-md hover:scale-105 w-full sm:w-auto sm:ml-auto justify-center"
              style={{
                background: 'linear-gradient(135deg, #a8e6cf 0%, #ffd3b6 100%)',
                color: '#5a4a4a',
                boxShadow: '0 2px 8px rgba(168, 230, 207, 0.3)'
              }}
            >
              <span style={{color: '#000000'}}>重置</span>
            </button>
          </div>

          <div
            ref={containerRef}
            className="rounded-2xl overflow-auto border-2"
            style={{
              maxWidth: '100%',
              maxHeight: '600px',
              width: '100%',
              padding: '10px',
              backgroundColor: '#fff9f9',
              borderColor: '#e6f3ff'
            }}
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
              <canvas ref={canvasRef} className="block" />
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <PreviewModal 
          pixels={pixels} 
          onClose={() => setShowPreview(false)}
          isFlippedHorizontally={isFlippedHorizontally}
          isFlippedVertically={isFlippedVertically}
        />
      )}
    </>
  );
}
