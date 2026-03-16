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
  const [isFlippedHorizontally, setIsFlippedHorizontally] = useState(false);
  const [isFlippedVertically, setIsFlippedVertically] = useState(false);
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
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #fff9f9 0%, #fef5f5 50%, #ffd6e7 100%)`,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffd6e7' fill-opacity='0.08'%3E%3Cpath d='M30 15c1.5 0 3-1.5 3-3s-1.5-3-3-3-3 1.5-3 3 1.5 3 3 3zm0 0'/%3E%3Ccircle cx='15' cy='45' r='2'/%3E%3Ccircle cx='45' cy='45' r='2'/%3E%3Cpath d='M20 35c0-1.5-1.5-3-3-3s-3 1.5-3 3 1.5 3 3 3 3-1.5 3-3zm0 0'/%3E%3Cpath d='M50 20c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zm0 0'/%3E%3Cpath d='M25 25c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1zm0 0'/%3E%3Cpath d='M35 35c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1zm0 0'/%3E%3Cpath d='M10 20c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1zm0 0'/%3E%3Cpath d='M50 50c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1zm0 0'/%3E%3Cpath d='M8 8c-.3 0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5zm0 0'/%3E%3Cpath d='M52 8c-.3 0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5zm0 0'/%3E%3Cpath d='M8 52c-.3 0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5zm0 0'/%3E%3Cpath d='M52 52c-.3 0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5zm0 0'/%3E%3Cpath d='M15 15c-.3 0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5zm0 0'/%3E%3Cpath d='M45 15c-.3 0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5zm0 0'/%3E%3Cpath d='M15 45c-.3 0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5zm0 0'/%3E%3Cpath d='M45 45c-.3 0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5zm0 0'/%3E%3Cpath d='M30 30c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zm0 0'/%3E%3Cpath d='M40 40c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1zm0 0'/%3E%3Cpath d='M20 40c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1zm0 0'/%3E%3Cpath d='M40 20c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1zm0 0'/%3E%3Cpath d='M20 20c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1zm0 0'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Left side decorative elements */}
      <div className="fixed left-4 top-1/4 hidden lg:block" style={{opacity: '0.2'}}>
        <div className="flex flex-col gap-8">
          <span className="text-4xl" style={{color: '#ffd6e7'}}>🐕</span>
          <span className="text-3xl" style={{color: '#e8d5f2'}}>🎀</span>
          <span className="text-3xl" style={{color: '#ffeaa7'}}>🐶</span>
          <span className="text-2xl" style={{color: '#ffd6e7'}}>💕</span>
          <span className="text-3xl" style={{color: '#a8e6cf'}}>⭐</span>
          <span className="text-4xl" style={{color: '#e8d5f2'}}>🐕</span>
        </div>
      </div>

      {/* Right side decorative elements */}
      <div className="fixed right-4 top-1/3 hidden lg:block" style={{opacity: '0.2'}}>
        <div className="flex flex-col gap-8">
          <span className="text-3xl" style={{color: '#ffd6e7'}}>🐶</span>
          <span className="text-4xl" style={{color: '#87ceeb'}}>☁️</span>
          <span className="text-3xl" style={{color: '#ffd6e7'}}>💖</span>
          <span className="text-2xl" style={{color: '#ffeaa7'}}>🐕</span>
          <span className="text-3xl" style={{color: '#a8e6cf'}}>🌸</span>
          <span className="text-3xl" style={{color: '#e8d5f2'}}>🐶</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {paletteValid === false && (
        <div className="bg-pink-100 border-b border-pink-300 text-pink-900 text-center py-2 px-4 text-sm" style={{backgroundColor: '#ffe0e6', borderColor: '#ffb3c1'}}>
          官方色卡(mard-color.js)未正确加载，请刷新页面后再使用，以免色号缺失。
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-bold" style={{color: '#d63384'}}>💕</span>
            <h1 className="text-4xl font-bold" style={{color: '#d63384', fontFamily: 'cursive'}}>佳佳小霸王专属拼豆工具</h1>
            <span className="text-4xl font-bold" style={{color: '#d63384'}}>💕</span>
          </div>
          <p className="text-gray-700" style={{color: '#5a4a4a'}}>上传图片，自动转换为拼豆像素画并生成色号统计</p>
        </div>

        {/* Top decorative text */}
        <div className="text-center mb-6 hidden md:block">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl" style={{color: '#ffd6e7'}}>🐕</span>
            <span className="text-lg font-medium" style={{color: '#000000', fontFamily: 'cursive'}}>✨ 把喜欢的图片变成超可爱拼豆图纸吧 ✨</span>
            <span className="text-2xl" style={{color: '#ffd6e7'}}>🐕</span>
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center gap-6">
          <ImageUploader onImageUpload={handleImageUpload} />
          {originalImage && (
            <div className="rounded-2xl shadow-lg p-4" style={{backgroundColor: '#fff9f9', boxShadow: '0 4px 15px rgba(255, 214, 231, 0.3)'}}>
              <SizeSelector selectedResolution={selectedResolution} onResolutionChange={setSelectedResolution} />
            </div>
          )}
        </div>

        {originalImage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <div className="rounded-2xl shadow-lg p-4 relative" style={{backgroundColor: '#fff9f9', boxShadow: '0 4px 15px rgba(255, 214, 231, 0.3)'}}>
                {/* Corner decorations */}
                <span className="absolute top-2 left-2 text-xl" style={{color: '#ffd6e7', opacity: '0.25'}}>🎀</span>
                <span className="absolute bottom-2 right-2 text-xl" style={{color: '#ffd6e7', opacity: '0.25'}}>🐕</span>
                
                <h2 className="text-lg font-semibold mb-4" style={{color: '#d63384'}}>原图</h2>
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-auto rounded-xl border-2"
                  style={{borderColor: '#ffd6e7'}}
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative">
                {/* Corner decorations for PixelGrid */}
                <span className="absolute top-2 left-2 text-xl z-10" style={{color: '#ffd6e7', opacity: '0.25'}}>💕</span>
                <span className="absolute bottom-2 right-2 text-xl z-10" style={{color: '#ffd6e7', opacity: '0.25'}}>🐶</span>
                
                <PixelGrid 
                  pixels={pixels} 
                  isFlippedHorizontally={isFlippedHorizontally}
                  isFlippedVertically={isFlippedVertically}
                  onHorizontalFlip={() => setIsFlippedHorizontally(!isFlippedHorizontally)}
                  onVerticalFlip={() => setIsFlippedVertically(!isFlippedVertically)}
                  onReset={() => {
                    setIsFlippedHorizontally(false);
                    setIsFlippedVertically(false);
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl shadow-lg p-4 relative" style={{backgroundColor: '#fff9f9', boxShadow: '0 4px 15px rgba(255, 214, 231, 0.3)'}}>
                {/* Corner decorations */}
                <span className="absolute top-2 left-2 text-xl" style={{color: '#ffd6e7', opacity: '0.25'}}>🌸</span>
                <span className="absolute bottom-2 right-2 text-xl" style={{color: '#ffd6e7', opacity: '0.25'}}>🐕</span>
                
                <ColorStatistics colorCounts={colorCounts} />
              </div>
            </div>
          </div>
        )}

        {/* Bottom decorative text */}
        <div className="text-center mt-16 mb-8 hidden md:block">
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-medium" style={{color: '#000000', fontFamily: 'cursive'}}>💖 Mard拼豆爱好者专属工具 | 祝你拼豆愉快 💖</span>
            <span className="text-2xl" style={{color: '#ffd6e7', opacity: '0.3'}}>🐕</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
