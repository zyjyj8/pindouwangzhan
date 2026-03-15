import { Copy } from 'lucide-react';
import { useState } from 'react';

interface ColorCount {
  code: string;
  name: string;
  rgb: [number, number, number];
  count: number;
}

interface ColorStatisticsProps {
  colorCounts: Map<string, ColorCount>;
}

export function ColorStatistics({ colorCounts }: ColorStatisticsProps) {
  const [copied, setCopied] = useState(false);

  const customSort = (a: string, b: string): number => {
    const letterA = a.match(/[A-Z]/)?.[0] || '';
    const letterB = b.match(/[A-Z]/)?.[0] || '';
    const numA = parseInt(a.match(/\d+/)?.[0] || '0');
    const numB = parseInt(b.match(/\d+/)?.[0] || '0');

    if (letterA !== letterB) {
      return letterA.localeCompare(letterB);
    }
    return numA - numB;
  };

  const sortedColors = Array.from(colorCounts.values()).sort((a, b) =>
    customSort(a.code, b.code)
  );

  const handleCopy = () => {
    const text = sortedColors
      .map((color) => `${color.code} ${color.name}: ${color.count}个`)
      .join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (colorCounts.size === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">色号统计</h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
        >
          <Copy size={16} />
          {copied ? '已复制' : '复制列表'}
        </button>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {sortedColors.map((color) => (
          <div
            key={color.code}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors"
          >
            <div
              className="w-8 h-8 rounded border border-gray-300 flex-shrink-0"
              style={{
                backgroundColor: `rgb(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`,
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900">{color.code}</div>
              <div className="text-xs text-gray-500 truncate">{color.name}</div>
            </div>
            <div className="text-sm font-semibold text-blue-600 flex-shrink-0">
              {color.count}个
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          共使用 <span className="font-semibold text-gray-900">{colorCounts.size}</span> 种颜色，
          总计 <span className="font-semibold text-gray-900">{sortedColors.reduce((sum, c) => sum + c.count, 0)}</span> 个拼豆
        </div>
      </div>
    </div>
  );
}
