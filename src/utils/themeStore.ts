import { atom } from 'nanostores';
import { THEME_PRESETS, type ThemePreset } from '../data/themes';

const STORAGE_KEY = 'kala_active_theme';

function getInitialThemeId(): string {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && THEME_PRESETS[saved]) return saved;
    } catch (e) {
      console.error('Failed to get active theme', e);
    }
  }
  return 'fashion';
}

export const $activeThemeId = atom<string>(getInitialThemeId());

export function setActiveTheme(themeId: string) {
  if (!THEME_PRESETS[themeId]) return;
  $activeThemeId.set(themeId);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
      applyThemeToDom(THEME_PRESETS[themeId]);
    } catch (e) {
      console.error('Failed to set theme in localStorage', e);
    }
  }
}

export function applyThemeToDom(preset: ThemePreset) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Set CSS variables
  root.style.setProperty('--color-primary', preset.styles.primaryColor);
  root.style.setProperty('--color-primary-hover', preset.styles.primaryHover);
  root.style.setProperty('--color-accent', preset.styles.accentColor);
  root.style.setProperty('--color-accent-light', preset.styles.accentLight);
  root.style.setProperty('--color-bg', preset.styles.bgColor);
  root.style.setProperty('--color-card-bg', preset.styles.cardBg);

  // Always keep clean bright light mode
  root.classList.remove('dark');
  document.body.style.backgroundColor = preset.styles.bgColor;
  document.body.style.color = '#0f172a';
}
