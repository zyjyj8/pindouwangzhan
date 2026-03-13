interface SizeSelectorProps {
  selectedResolution: number;
  onResolutionChange: (resolution: number) => void;
}

export function SizeSelector({ selectedResolution, onResolutionChange }: SizeSelectorProps) {
  const resolutions = [
    { value: 128, label: '高清晰度' },
    { value: 64, label: '中等清晰度' },
    { value: 32, label: '低清晰度' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">选择清晰度：</label>
      <div className="flex gap-4">
        {resolutions.map(({ value, label }) => (
          <label
            key={value}
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
          >
            <input
              type="radio"
              name="resolution"
              value={value}
              checked={selectedResolution === value}
              onChange={() => onResolutionChange(value)}
              className="w-4 h-4 text-blue-600 cursor-pointer"
            />
            <span className="text-sm font-medium">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
