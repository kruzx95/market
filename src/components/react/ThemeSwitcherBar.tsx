import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $activeThemeId, setActiveTheme, applyThemeToDom } from '../../utils/themeStore';
import { THEME_PRESETS } from '../../data/themes';
import { Palette, Sparkles, Check, ChevronDown, RefreshCw } from 'lucide-react';

export default function ThemeSwitcherBar() {
  const currentThemeId = useStore($activeThemeId);
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const activePreset = THEME_PRESETS[currentThemeId] || THEME_PRESETS.fashion;
    applyThemeToDom(activePreset);
  }, [currentThemeId]);

  const handleSelectTheme = (id: string) => {
    setActiveTheme(id);
    setIsOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const activePreset = THEME_PRESETS[currentThemeId] || THEME_PRESETS.fashion;

  return (
    <>
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-white">
              Tema Berhasil Diubah: {activePreset.name}
            </p>
            <p className="text-[11px] text-slate-300 font-normal">
              Preset Industri: {activePreset.industry}
            </p>
          </div>
        </div>
      )}

      {/* Floating Demo White-Label Widget on Bottom Left */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="relative">
          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute bottom-14 left-0 w-72 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-2xl space-y-1.5 animate-fade-in text-xs z-50">
              <div className="px-2 py-1.5 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider">
                  Pilih Preset Industri Klien
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">White-Label</span>
              </div>

              {Object.values(THEME_PRESETS).map((preset) => {
                const isSelected = preset.id === currentThemeId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectTheme(preset.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: preset.styles.primaryColor }}
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{preset.name}</p>
                        <p className="text-[10px] text-slate-400">{preset.industry}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Trigger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-950/90 hover:bg-slate-900 text-white rounded-full border border-slate-700 shadow-float backdrop-blur-md text-xs font-bold transition-all hover:scale-105"
            title="Ganti Tema White-Label"
          >
            <Palette className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Tema:</span>
            <span className="text-emerald-400">{activePreset.name}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </>
  );
}
