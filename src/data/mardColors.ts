/**
 * Mard 拼豆 221 色官方标准色卡
 * 数据源：项目根目录 mard-color.js（Mard221 官方标准色卡）
 */

// @ts-expect-error mard-color.js 为 CommonJS/ESM 双导出，类型由下方接口保证
import mardColorsArray from '../../mard-color.js';

export interface MardColor {
  code: string;
  name: string;
  rgb: [number, number, number];
  hex: string;
}

/** 官方标准色卡（仅此数据源，禁止使用其他色卡） */
export const MARD_COLORS: MardColor[] = mardColorsArray;

/** 色号在官方色卡中的顺序，用于统计列表按 A1→A10、B1→B10… 排序 */
export const MARD_COLOR_ORDER = new Map<string, number>(
  MARD_COLORS.map((c, i) => [c.code, i])
);
