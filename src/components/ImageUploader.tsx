import { Upload } from 'lucide-react';
import { useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-6 py-3 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #ffd6e7 0%, #e8d5f2 100%)',
          boxShadow: '0 4px 12px rgba(232, 213, 242, 0.4)'
        }}
      >
        <Upload size={20} style={{color: '#000000'}} />
        <span className="font-medium" style={{color: '#000000'}}>上传图片</span>
      </button>
    </div>
  );
}
