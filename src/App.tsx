import { useState, useRef, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { SizeSelector } from './components/SizeSelector';
import { PixelGrid } from './components/PixelGrid';
import { ColorStatistics } from './components/ColorStatistics';
import { MardColor } from './data/mardColors';
import { getAverageColor, findClosestMardColor, validatePalette } from './utils/colorMatching';

interface ColorCount {
  code: string;
  name: string;
  rgb: [number, number, number];
  count: number;
}

function App() {
  const [selectedResolution, setSelectedResolution] = useState(64);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [pixels, setPixels] = useState<MardColor[][]>([]);
  const [colorCounts, setColorCounts] = useState<Map<string, ColorCount>>(new Map());
  const [paletteValid, setPaletteValid] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = (imageUrl: string, maxResolution: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const aspectRatio = img.width / img.height;

      let gridWidth: number;
      let gridHeight: number;

      if (img.width >= img.height) {
        gridWidth = maxResolution;
        gridHeight = Math.round(maxResolution / aspectRatio);
      } else {
        gridHeight = maxResolution;
        gridWidth = Math.round(maxResolution * aspectRatio);
      }

      const blockWidth = img.width / gridWidth;
      const blockHeight = img.height / gridHeight;
      const blockSize = Math.max(blockWidth, blockHeight);

      const newPixels: MardColor[][] = [];
      const counts = new Map<string, ColorCount>();

      for (let row = 0; row < gridHeight; row++) {
        const pixelRow: MardColor[] = [];
        for (let col = 0; col < gridWidth; col++) {
          const x = Math.floor(col * blockWidth);
          const y = Math.floor(row * blockHeight);

          const avgColor = getAverageColor(
            imageData,
            x,
            y,
            Math.ceil(blockSize),
            img.width,
            img.height
          );

          const mardColor = findClosestMardColor(avgColor);
          pixelRow.push(mardColor);

          const existing = counts.get(mardColor.code);
          if (existing) {
            existing.count++;
          } else {
            counts.set(mardColor.code, {
              code: mardColor.code,
              name: mardColor.name,
              rgb: mardColor.rgb,
              count: 1,
            });
          }
        }
        newPixels.push(pixelRow);
      }

      setPixels(newPixels);
      setColorCounts(counts);
    };

    img.src = imageUrl;
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setOriginalImage(imageUrl);
      processImage(imageUrl, selectedResolution);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (originalImage) {
      processImage(originalImage, selectedResolution);
    }
  }, [selectedResolution, originalImage]);

  useEffect(() => {
    setPaletteValid(validatePalette());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <canvas ref={canvasRef} className="hidden" />

      {paletteValid === false && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-center py-2 px-4 text-sm">
          官方色卡(mard-color.js)未正确加载，请刷新页面后再使用，以免色号缺失。
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mard拼豆像素画转换器</h1>
          <p className="text-gray-600">上传图片，自动转换为拼豆像素画并生成色号统计</p>
        </div>

        <div className="mb-8 flex flex-col items-center gap-6">
          <ImageUploader onImageUpload={handleImageUpload} />
          {originalImage && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <SizeSelector selectedResolution={selectedResolution} onResolutionChange={setSelectedResolution} />
            </div>
          )}
        </div>

        {originalImage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">原图</h2>
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-auto rounded border border-gray-300"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <PixelGrid pixels={pixels} />
            </div>

            <div className="lg:col-span-3">
              <ColorStatistics colorCounts={colorCounts} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
