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
      <label className="text-sm font-medium" style={{color: '#d63384'}}>选择清晰度：</label>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {resolutions.map(({ value, label }) => (
          <label
            key={value}
            className="flex items-center gap-2 p-2 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-102"
            style={{
              backgroundColor: selectedResolution === value ? '#ffd6e7' : '#fff9f9',
              border: `2px solid ${selectedResolution === value ? '#d63384' : '#ffd6e7'}`
            }}
          >
            <input
              type="radio"
              name="resolution"
              value={value}
              checked={selectedResolution === value}
              onChange={() => onResolutionChange(value)}
              className="w-4 h-4 cursor-pointer"
              style={{accentColor: '#d63384'}}
            />
            <span className="text-sm font-medium" style={{color: selectedResolution === value ? '#ffffff' : '#5a4a4a'}}>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
