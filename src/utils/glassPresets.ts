/**
 * Liquid Glass 预设 — 仅用于简单展示元素（Clock / Weather / 按钮）
 */

export interface GlassPreset {
  mode: 'standard' | 'polar' | 'prominent' | 'shader'
  displacementScale: number
  blurAmount: number
  saturation: number
  aberrationIntensity: number
  elasticity: number
  cornerRadius: number
}

export type PresetName = 'card' | 'button' | 'clock'

const presets: Record<PresetName, { dark: GlassPreset; light: GlassPreset }> = {
  /** Weather 天气胶囊、小型展示卡片 */
  card: {
    dark: {
      mode: 'standard',
      displacementScale: 45,
      blurAmount: 0.05,
      saturation: 120,
      aberrationIntensity: 1.5,
      elasticity: 0.10,
      cornerRadius: 20,
    },
    light: {
      mode: 'standard',
      displacementScale: 50,
      blurAmount: 0.04,
      saturation: 145,
      aberrationIntensity: 2,
      elasticity: 0.10,
      cornerRadius: 20,
    },
  },

  /** Settings / Edit 按钮 — polar 水波纹 */
  button: {
    dark: {
      mode: 'polar',
      displacementScale: 70,
      blurAmount: 0.04,
      saturation: 120,
      aberrationIntensity: 1.5,
      elasticity: 0.22,
      cornerRadius: 999,
    },
    light: {
      mode: 'polar',
      displacementScale: 80,
      blurAmount: 0.03,
      saturation: 150,
      aberrationIntensity: 2,
      elasticity: 0.22,
      cornerRadius: 999,
    },
  },

  /** Clock 时钟底板 */
  clock: {
    dark: {
      mode: 'standard',
      displacementScale: 35,
      blurAmount: 0.06,
      saturation: 115,
      aberrationIntensity: 1,
      elasticity: 0.06,
      cornerRadius: 24,
    },
    light: {
      mode: 'standard',
      displacementScale: 40,
      blurAmount: 0.05,
      saturation: 140,
      aberrationIntensity: 1.5,
      elasticity: 0.06,
      cornerRadius: 24,
    },
  },
}

function isWebGLSupported(): boolean {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  const isFirefox = /firefox/i.test(navigator.userAgent)
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  return !isSafari && !isFirefox && !isMobile
}

export function getGlassPreset(name: PresetName, darkMode: boolean): GlassPreset {
  const preset = darkMode ? presets[name].dark : presets[name].light
  if (!isWebGLSupported()) {
    return { ...preset, mode: 'standard', displacementScale: 0, aberrationIntensity: 0, elasticity: 0 }
  }
  return preset
}
