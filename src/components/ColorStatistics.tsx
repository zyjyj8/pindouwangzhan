import { Copy } from 'lucide-react';
import { useState } from 'react';
import { MARD_COLOR_ORDER } from '../data/mardColors';

interface ColorCount {
  code: string;
  name: string;
  rgb: [number, number, number];
  count: number;
}

interface ColorStatisticsProps {
  colorCounts: Map<string, ColorCount>;
}

/** 按官方色卡顺序排序：A1→A10→…→A26, B1→…, C1→… */
function sortByOfficialOrder(a: ColorCount, b: ColorCount): number {
  const orderA = MARD_COLOR_ORDER.get(a.code) ?? 9999;
  const orderB = MARD_COLOR_ORDER.get(b.code) ?? 9999;
  return orderA - orderB;
}

export function ColorStatistics({ colorCounts }: ColorStatisticsProps) {
  const [copied, setCopied] = useState(false);

  const sortedColors = Array.from(colorCounts.values()).sort(sortByOfficialOrder);

  const handleCopy = () => {
    const text = sortedColors
      .map((color) => `${color.code} ${color.name}：${color.count}个`)
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
    <div className="rounded-2xl shadow-lg p-4 sm:p-6" style={{backgroundColor: '#fff9f9', boxShadow: '0 4px 15px rgba(255, 214, 231, 0.3)'}}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" style={{color: '#d63384'}}>🎨</span>
          <h2 className="text-lg font-semibold" style={{color: '#d63384'}}>色号统计</h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 text-white rounded-2xl transition-all duration-200 text-sm shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto justify-center"
          style={{
            background: 'linear-gradient(135deg, #ffd6e7 0%, #e8d5f2 100%)',
            boxShadow: '0 4px 12px rgba(232, 213, 242, 0.4)'
          }}
        >
          <Copy size={16} style={{color: '#000000'}} />
          <span style={{color: '#000000'}}>{copied ? '已复制' : '复制列表'}</span>
        </button>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto rounded-2xl p-2" style={{backgroundColor: '#fff9f9'}}>
        {sortedColors.map((color) => (
          <div
            key={color.code}
            className="flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 hover:shadow-md hover:scale-102"
            style={{backgroundColor: '#fff9f9'}}
          >
            <div
              className="w-8 h-8 rounded-2xl border-2 flex-shrink-0"
              style={{
                backgroundColor: `rgb(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`,
                borderColor: '#ffd6e7'
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm" style={{color: '#5a4a4a'}}>{color.code}</div>
              <div className="text-xs" style={{color: '#888888'}}>{color.name}</div>
            </div>
            <div className="text-sm font-semibold flex-shrink-0" style={{color: '#d63384'}}>
              {color.count}个
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t-2" style={{borderColor: '#ffd6e7'}}>
        <div className="text-sm" style={{color: '#5a4a4a'}}>
          共使用 <span className="font-semibold" style={{color: '#d63384'}}>{colorCounts.size}</span> 种颜色，
          总计 <span className="font-semibold" style={{color: '#d63384'}}>{sortedColors.reduce((sum, c) => sum + c.count, 0)}</span> 个拼豆
        </div>
      </div>
    </div>
  );
}
