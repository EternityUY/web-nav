/**
 * Vaso (shuding/liquid-glass) 预设配置
 *
 * Vaso 用 SVG feDisplacementMap + Canvas 实现背景扭曲液态玻璃。
 * 所有浏览器均支持，无需 WebGL。
 */

export interface VasoPreset {
  px: number
  py: number
  radius: number
  depth: number
  blur: number
  dispersion: number
}

export type PresetName = 'card' | 'input' | 'panel' | 'button' | 'clock'

const presets: Record<PresetName, { dark: VasoPreset; light: VasoPreset }> = {
  /** LinkCard / Weather / NavGrid filter */
  card: {
    dark: {
      px: 12, py: 8, radius: 16, depth: 0.8, blur: 0.3, dispersion: 0.6,
    },
    light: {
      px: 12, py: 8, radius: 16, depth: 1.0, blur: 0.25, dispersion: 0.7,
    },
  },

  /** SearchBar — 最大视觉焦点 */
  input: {
    dark: {
      px: 16, py: 12, radius: 999, depth: 1.2, blur: 0.5, dispersion: 0.8,
    },
    light: {
      px: 16, py: 12, radius: 999, depth: 1.4, blur: 0.4, dispersion: 0.9,
    },
  },

  /** EditorPanel */
  panel: {
    dark: {
      px: 0, py: 0, radius: 0, depth: 0.6, blur: 0.5, dispersion: 0.5,
    },
    light: {
      px: 0, py: 0, radius: 0, depth: 0.7, blur: 0.4, dispersion: 0.6,
    },
  },

  /** Settings / Edit 按钮 */
  button: {
    dark: {
      px: 4, py: 4, radius: 999, depth: 1.5, blur: 0.3, dispersion: 0.8,
    },
    light: {
      px: 4, py: 4, radius: 999, depth: 1.7, blur: 0.25, dispersion: 0.9,
    },
  },

  /** Clock 底板 */
  clock: {
    dark: {
      px: 20, py: 16, radius: 24, depth: 0.5, blur: 0.4, dispersion: 0.5,
    },
    light: {
      px: 20, py: 16, radius: 24, depth: 0.6, blur: 0.35, dispersion: 0.6,
    },
  },
}

export function getGlassPreset(name: PresetName, darkMode: boolean): VasoPreset {
  return darkMode ? presets[name].dark : presets[name].light
}
