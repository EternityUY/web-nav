/**
 * Liquid Glass 预设配置
 *
 * 为不同 UI 场景定义最优的液态玻璃参数。
 * 暗色/亮色模式下参数略有不同，确保在任何背景下都有良好的折射效果。
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

export type PresetName = 'card' | 'prominent' | 'input' | 'panel' | 'button' | 'clock'

const presets: Record<PresetName, { dark: GlassPreset; light: GlassPreset }> = {
  /** 链接卡片 — 微妙折射，hover 时更明显 */
  card: {
    dark: {
      mode: 'standard',
      displacementScale: 50,
      blurAmount: 0.06,
      saturation: 120,
      aberrationIntensity: 1.5,
      elasticity: 0.12,
      cornerRadius: 16,
    },
    light: {
      mode: 'standard',
      displacementScale: 55,
      blurAmount: 0.05,
      saturation: 145,
      aberrationIntensity: 2,
      elasticity: 0.12,
      cornerRadius: 16,
    },
  },

  /** 搜索框 — 页面焦点，显著折射 */
  prominent: {
    dark: {
      mode: 'prominent',
      displacementScale: 70,
      blurAmount: 0.07,
      saturation: 125,
      aberrationIntensity: 2.5,
      elasticity: 0.18,
      cornerRadius: 999,
    },
    light: {
      mode: 'prominent',
      displacementScale: 75,
      blurAmount: 0.06,
      saturation: 150,
      aberrationIntensity: 3,
      elasticity: 0.18,
      cornerRadius: 999,
    },
  },

  /** 筛选输入框 — 轻度折射 */
  input: {
    dark: {
      mode: 'standard',
      displacementScale: 40,
      blurAmount: 0.05,
      saturation: 115,
      aberrationIntensity: 1.2,
      elasticity: 0.08,
      cornerRadius: 12,
    },
    light: {
      mode: 'standard',
      displacementScale: 45,
      blurAmount: 0.04,
      saturation: 140,
      aberrationIntensity: 1.5,
      elasticity: 0.08,
      cornerRadius: 12,
    },
  },

  /** 编辑面板 — 大面积玻璃，中强度 */
  panel: {
    dark: {
      mode: 'standard',
      displacementScale: 55,
      blurAmount: 0.09,
      saturation: 120,
      aberrationIntensity: 2,
      elasticity: 0.12,
      cornerRadius: 0,
    },
    light: {
      mode: 'standard',
      displacementScale: 60,
      blurAmount: 0.08,
      saturation: 145,
      aberrationIntensity: 2.5,
      elasticity: 0.12,
      cornerRadius: 0,
    },
  },

  /** 圆形按钮 — polar 模式水波纹 */
  button: {
    dark: {
      mode: 'polar',
      displacementScale: 80,
      blurAmount: 0.05,
      saturation: 120,
      aberrationIntensity: 1.5,
      elasticity: 0.25,
      cornerRadius: 999,
    },
    light: {
      mode: 'polar',
      displacementScale: 85,
      blurAmount: 0.04,
      saturation: 150,
      aberrationIntensity: 2,
      elasticity: 0.25,
      cornerRadius: 999,
    },
  },

  /** 时钟底板 — 微妙柔和 */
  clock: {
    dark: {
      mode: 'standard',
      displacementScale: 40,
      blurAmount: 0.07,
      saturation: 115,
      aberrationIntensity: 1.2,
      elasticity: 0.08,
      cornerRadius: 24,
    },
    light: {
      mode: 'standard',
      displacementScale: 45,
      blurAmount: 0.06,
      saturation: 140,
      aberrationIntensity: 1.5,
      elasticity: 0.08,
      cornerRadius: 24,
    },
  },
}

/**
 * 检测浏览器是否支持 WebGL 位移效果
 * Safari/Firefox 仅部分支持，降级到纯 blur
 */
let supportsWebGL: boolean | null = null

export function isWebGLSupported(): boolean {
  if (supportsWebGL !== null) return supportsWebGL

  // 检测 Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  // 检测 Firefox
  const isFirefox = /firefox/i.test(navigator.userAgent)
  // 移动端降级
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  supportsWebGL = !isSafari && !isFirefox && !isMobile
  return supportsWebGL
}

/**
 * 获取指定场景的玻璃预设
 * @param name 预设名称
 * @param darkMode 是否暗色模式
 * @returns 对应预设（已处理降级）
 */
export function getGlassPreset(name: PresetName, darkMode: boolean): GlassPreset {
  const preset = darkMode ? presets[name].dark : presets[name].light

  // 不支持 WebGL 位移时，关闭位移，只保留 blur 效果
  if (!isWebGLSupported()) {
    return {
      ...preset,
      mode: 'standard' as const,
      displacementScale: 0,
      aberrationIntensity: 0,
      elasticity: 0,
    }
  }

  return preset
}

/**
 * 从预设生成 LiquidGlass 组件的 props
 * 返回可直接展开到 LiquidGlass 的对象
 */
export function getGlassProps(name: PresetName, darkMode: boolean, extra?: Partial<GlassPreset>) {
  const preset = getGlassPreset(name, darkMode)
  return { ...preset, ...extra }
}
