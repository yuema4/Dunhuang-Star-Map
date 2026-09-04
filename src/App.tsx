/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserAstralProfile, DunhuangStyleConfig, PaletteId, FeitianId, CloudId, BaoxiangId } from './types';
import { calculateLunarInfo } from './utils/lunar';
import { getMansionByDate, getPresetOracle } from './utils/dunhuangData';
import { CelestialScroll } from './components/CelestialScroll';
import { MuralAssetLibraryModal } from './components/MuralAssetLibraryModal';
import { toggleDunhuangAmbient, playDunhuangChime } from './utils/audio';
import {
  DEFAULT_STYLE_CONFIG,
  DUNHUANG_PALETTES,
  FEITIAN_LIST,
  CLOUD_LIST,
  BAOXIANG_LIST,
} from './utils/dunhuangMuralAssets';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Compass,
  History,
  RefreshCw,
  Palette,
  Wand2,
} from 'lucide-react';

const HISTORICAL_SAMPLES = [
  { name: '李嘉禾', date: '1995-05-20', hour: 8, title: '当代敦煌旅人' },
  { name: '李太白', date: '0701-02-28', hour: 23, title: '大唐谪仙人' },
  { name: '武媚娘', date: '0624-02-17', hour: 12, title: '大周则天皇帝' },
  { name: '张议潮', date: '0799-08-15', hour: 10, title: '归义军节度使' },
  { name: '解脱和尚', date: '0850-06-06', hour: 6, title: '莫高窟抄经僧' },
];

export default function App() {
  const [name, setName] = useState<string>('李嘉禾');
  const [solarDate, setSolarDate] = useState<string>('1995-05-20');
  const [birthHour, setBirthHour] = useState<number>(8);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserAstralProfile | null>(null);

  // Dunhuang Mural Style & Motif Customization
  const [styleConfig, setStyleConfig] = useState<DunhuangStyleConfig>(DEFAULT_STYLE_CONFIG);
  const [isMuralModalOpen, setIsMuralModalOpen] = useState<boolean>(false);

  // Auto harmonize style based on elemental energy
  const harmonizeStyleWithElement = (element: string) => {
    let targetPalette: PaletteId = 'cinnabar-gold';
    let targetFeitian: FeitianId = 'feitian-pipa';
    let targetCloud: CloudId = 'cloud-ruyi';
    let targetBaoxiang: BaoxiangId = 'baoxiang-lotus';

    if (element === '火') {
      targetPalette = 'cinnabar-gold';
      targetFeitian = 'feitian-pipa';
      targetCloud = 'cloud-ruyi';
      targetBaoxiang = 'baoxiang-lotus';
    } else if (element === '木') {
      targetPalette = 'malachite-spring';
      targetFeitian = 'feitian-scatter';
      targetCloud = 'cloud-flowing';
      targetBaoxiang = 'baoxiang-arabesque';
    } else if (element === '水') {
      targetPalette = 'lapis-azure';
      targetFeitian = 'feitian-soaring';
      targetCloud = 'cloud-flowing';
      targetBaoxiang = 'baoxiang-beaded';
    } else if (element === '土') {
      targetPalette = 'orpiment-ochre';
      targetFeitian = 'feitian-scatter';
      targetCloud = 'cloud-lingzhi';
      targetBaoxiang = 'baoxiang-lotus';
    } else if (element === '金') {
      targetPalette = 'obsidian-gilded';
      targetFeitian = 'feitian-soaring';
      targetCloud = 'cloud-ruyi';
      targetBaoxiang = 'baoxiang-beaded';
    }

    setStyleConfig((prev) => ({
      ...prev,
      paletteId: targetPalette,
      feitianId: targetFeitian,
      cloudId: targetCloud,
      baoxiangId: targetBaoxiang,
    }));
  };

  // Derive Astral profile from inputs
  const generateProfile = async (
    targetName = name,
    targetDate = solarDate,
    targetHour = birthHour,
    requestAi = true,
    autoHarmonize = false
  ) => {
    playDunhuangChime(528);

    const lunar = calculateLunarInfo(targetDate, targetHour);
    const mansion = getMansionByDate(targetDate);
    const preset = getPresetOracle(mansion, targetName, lunar.cyclicalYear);

    if (autoHarmonize) {
      harmonizeStyleWithElement(mansion.element);
    }

    // Set immediate synchronous profile
    const initialProfile: UserAstralProfile = {
      name: targetName,
      solarDate: targetDate,
      birthHour: lunar.shichen,
      lunarInfo: lunar,
      mansion,
      natalStarName: `${mansion.name}宿`,
      natalStarTitle: `${mansion.symbol} · ${mansion.fullName}`,
      oracle: preset,
      generatedAt: new Date().toISOString(),
      styleConfig,
    };

    setProfile(initialProfile);

    // Call server AI endpoint for personalized Tang Dynasty imperial horoscope
    if (requestAi) {
      setIsAiLoading(true);
      try {
        const res = await fetch('/api/star-oracle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: targetName,
            solarDate: targetDate,
            lunarInfo: lunar,
            mansionInfo: mansion,
            fourSymbols: mansion.symbol,
            temperament: mansion.temperament,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.oracle) {
            setProfile((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                oracle: {
                  ...data.oracle,
                  isAiGenerated: data.useFallback ? false : true,
                },
              };
            });
          }
        }
      } catch (err) {
        console.warn('Using authentic Dunhuang canon preset:', err);
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  // Initial generation on first mount
  useEffect(() => {
    generateProfile('李嘉禾', '1995-05-20', 8, false, true);
  }, []);

  const handleAudioToggle = () => {
    const active = toggleDunhuangAmbient();
    setIsAudioActive(active);
  };

  const handleApplySample = (sample: (typeof HISTORICAL_SAMPLES)[0]) => {
    setName(sample.name);
    setSolarDate(sample.date);
    setBirthHour(sample.hour);
    generateProfile(sample.name, sample.date, sample.hour, true, true);
  };

  // Compute live lunar preview for aside
  const currentLunar = calculateLunarInfo(solarDate, birthHour);
  const activePalette = DUNHUANG_PALETTES[styleConfig.paletteId] || DUNHUANG_PALETTES['cinnabar-gold'];
  const activeFeitian = FEITIAN_LIST.find((f) => f.id === styleConfig.feitianId);
  const activeCloud = CLOUD_LIST.find((c) => c.id === styleConfig.cloudId);
  const activeBaoxiang = BAOXIANG_LIST.find((b) => b.id === styleConfig.baoxiangId);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0F0E0C] text-[#E2DCC8] font-serif overflow-x-hidden select-none">
      {/* Editorial Header */}
      <header className="flex justify-between items-center px-6 lg:px-10 py-5 border-b border-[#C5A059]/20 bg-[#0F0E0C] z-20">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.3em] uppercase opacity-60 font-cinzel">
            Celestial Document · S.3326
          </span>
          <div className="flex items-center gap-3">
            <h1 className="text-xl lg:text-2xl tracking-widest font-bold text-[#C5A059] font-serif-sc">
              敦煌星圖 · DUNHUANG STARGAZER
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] tracking-widest font-serif-sc">
              莫高藏经卷
            </span>
          </div>
        </div>

        <div className="flex gap-3 lg:gap-6 items-center text-[11px] tracking-widest uppercase font-cinzel">
          <span className="hidden md:inline">Perspective: 40.1°N (Dunhuang)</span>
          <span className="hidden lg:inline">Epoch: Tang Dynasty</span>
          <div className="hidden sm:block w-8 h-[1px] bg-[#C5A059]/40" />

          {/* Quick open Mural Asset Studio */}
          <button
            onClick={() => setIsMuralModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 border border-[#C5A059]/40 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] text-xs tracking-wider transition-colors font-serif-sc rounded-xs"
            title="查看敦煌壁画飞天、祥云、宝相花素材库"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">壁画素材馆</span>
          </button>

          {/* Ambient Sound Toggle */}
          <button
            onClick={handleAudioToggle}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10 text-xs tracking-wider transition-colors cursor-pointer rounded-xs"
            title="敦煌大漠风声与铜磬梵音"
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="hidden sm:inline">大漠梵音: 开</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
                <span className="hidden sm:inline">大漠梵音: 关</span>
              </>
            )}
          </button>

          <span className="text-[#C5A059]">No. 0825</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Editorial Aside: Personal Alignment & Style Studio */}
        <aside className="w-full lg:w-[330px] xl:w-[360px] border-b lg:border-b-0 lg:border-r border-[#C5A059]/20 p-6 lg:p-7 flex flex-col justify-between bg-[#0F0E0C] z-10 overflow-y-auto">
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] tracking-[0.4em] uppercase text-[#C5A059] font-cinzel">
                  Personal Alignment
                </h2>
                <span className="text-[10px] text-[#E2DCC8]/40 font-serif-sc">本命司仪</span>
              </div>

              {/* Input Forms */}
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[11px] opacity-50 mb-1 font-cinzel">
                    NAME / 姓名名号
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="输入姓名或字号"
                    className="w-full bg-transparent border-b border-[#C5A059]/40 py-1.5 text-lg text-[#E2DCC8] font-serif-sc focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                </div>

                <div className="group">
                  <label className="block text-[11px] opacity-50 mb-1 font-cinzel">
                    BIRTH DATE / 阳历生辰
                  </label>
                  <input
                    type="date"
                    value={solarDate}
                    onChange={(e) => setSolarDate(e.target.value)}
                    className="w-full bg-transparent border-b border-[#C5A059]/40 py-1.5 text-base text-[#E2DCC8] font-serif-sc focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                </div>

                <div className="group">
                  <label className="block text-[11px] opacity-50 mb-1 font-cinzel">
                    BIRTH HOUR / 出生时辰
                  </label>
                  <select
                    value={birthHour}
                    onChange={(e) => setBirthHour(Number(e.target.value))}
                    className="w-full bg-[#151412] border-b border-[#C5A059]/40 py-1.5 text-sm text-[#E2DCC8] font-serif-sc focus:outline-none focus:border-[#C5A059] transition-colors cursor-pointer"
                  >
                    <option value={0}>子时 (23:00 - 01:00 夜半)</option>
                    <option value={2}>丑时 (01:00 - 03:00 鸡鸣)</option>
                    <option value={4}>寅时 (03:00 - 05:00 平旦)</option>
                    <option value={6}>卯时 (05:00 - 07:00 日出)</option>
                    <option value={8}>辰时 (07:00 - 09:00 食时)</option>
                    <option value={10}>巳时 (09:00 - 11:00 隅中)</option>
                    <option value={12}>午时 (11:00 - 13:00 日中)</option>
                    <option value={14}>未时 (13:00 - 15:00 日昳)</option>
                    <option value={16}>申时 (15:00 - 17:00 晡时)</option>
                    <option value={18}>酉时 (17:00 - 19:00 日入)</option>
                    <option value={20}>戌时 (19:00 - 21:00 黄昏)</option>
                    <option value={22}>亥时 (21:00 - 23:00 人定)</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-[11px] opacity-50 mb-1 font-cinzel">
                    LUNAR CALENDAR / 农历干支
                  </label>
                  <div className="border-b border-[#C5A059]/40 py-1.5 text-base text-[#C5A059] font-serif-sc">
                    {currentLunar.cyclicalYear}年 {currentLunar.cyclicalMonth}月 {currentLunar.cyclicalDay}日
                  </div>
                  <div className="text-[10px] text-[#E2DCC8]/50 mt-1 font-serif-sc">
                    节气：{currentLunar.solarTerm} · 纳音：{currentLunar.naYin}
                  </div>
                </div>
              </div>

              {/* Historical Samples */}
              <div className="mt-5 pt-3 border-t border-[#C5A059]/15">
                <div className="flex items-center gap-1.5 text-[10px] text-[#C5A059] uppercase tracking-wider mb-2 font-cinzel">
                  <History className="w-3 h-3" />
                  <span>Historical Traveler Presets</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {HISTORICAL_SAMPLES.map((sample) => (
                    <button
                      key={sample.name}
                      onClick={() => handleApplySample(sample)}
                      className="px-2 py-1 bg-[#151412] hover:bg-[#C5A059]/20 border border-[#C5A059]/30 text-[11px] text-[#E2DCC8] rounded-xs transition-colors cursor-pointer font-serif-sc"
                      title={sample.title}
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dunhuang Mural Elements Studio Quick Card */}
            <div className="p-4 bg-[#151412] border border-[#C5A059]/30 rounded-xs mb-5 font-serif-sc">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#C5A059]">
                  <Palette className="w-3.5 h-3.5" />
                  <span>壁画风格与装饰元素</span>
                </div>
                <button
                  onClick={() => profile && harmonizeStyleWithElement(profile.mansion.element)}
                  className="flex items-center gap-1 text-[10px] text-[#C5A059] hover:underline"
                  title="依生辰五行一键和韵"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>五行和韵</span>
                </button>
              </div>

              {/* Active element summary */}
              <div className="space-y-1.5 text-xs text-[#E2DCC8]/80 mb-3">
                <div className="flex items-center justify-between">
                  <span className="opacity-60 text-[11px]">莫高矿彩:</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{ backgroundColor: activePalette.cinnabar }}
                      className="w-2.5 h-2.5 rounded-full"
                    />
                    <strong className="text-[#C5A059]">{activePalette.name}</strong>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-60 text-[11px]">飞天姿仪:</span>
                  <span>{activeFeitian?.name || '无飞天'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-60 text-[11px]">天宇祥云:</span>
                  <span>{activeCloud?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-60 text-[11px]">藻井天心:</span>
                  <span>{activeBaoxiang?.name}</span>
                </div>
              </div>

              <button
                onClick={() => setIsMuralModalOpen(true)}
                className="w-full py-2 bg-[#C5A059]/15 hover:bg-[#C5A059]/25 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>进入敦煌壁画素材馆定制</span>
              </button>
            </div>
          </div>

          {/* Action Button: Generate Scroll */}
          <button
            onClick={() => generateProfile(name, solarDate, birthHour, true, false)}
            disabled={isAiLoading}
            className="w-full py-4 border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0F0E0C] transition-all duration-300 tracking-[0.4em] text-sm uppercase font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99] rounded-xs"
          >
            {isAiLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-current" />
                <span>推演天象中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-current" />
                <span>推演专属星图长卷</span>
              </>
            )}
          </button>
        </aside>

        {/* Section: Main Celestial Scroll Viewer */}
        <section className="flex-1 relative bg-[#151412] flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-[600px]">
          {/* Subtle Stargazer Grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#C5A059 0.5px, transparent 0.5px)',
              backgroundSize: '32px 32px',
            }}
          />

          {profile ? (
            <div className="w-full max-w-6xl relative z-10">
              <CelestialScroll
                profile={profile}
                isAiLoading={isAiLoading}
                styleConfig={styleConfig}
                onChangeStyle={setStyleConfig}
                onOpenAssetLibrary={() => setIsMuralModalOpen(true)}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-[#E2DCC8]/60 relative z-10">
              <Compass className="w-12 h-12 text-[#C5A059] animate-pulse mb-4 opacity-70" />
              <h3 className="text-lg font-serif-sc text-[#C5A059] tracking-widest">
                正在展开敦煌藏经洞星卷...
              </h3>
              <p className="text-xs font-serif-sc mt-2 opacity-60">
                请在左侧核准生辰八字，司天监太史令将为您观星演宿
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Editorial Theme Footer */}
      <footer className="h-12 bg-[#C5A059] flex items-center px-6 lg:px-10 justify-between text-[#0F0E0C] font-bold text-[10px] tracking-[0.4em] uppercase z-20">
        <span className="truncate">Mogao Grottoes Collection</span>
        <span className="hidden sm:inline truncate">Celestial Mapping Protocol · S.3326</span>
        <span>© 2024 VibeCoding Projects</span>
      </footer>

      {/* Dunhuang Mural Asset Library & Customizer Modal */}
      {profile && (
        <MuralAssetLibraryModal
          isOpen={isMuralModalOpen}
          onClose={() => setIsMuralModalOpen(false)}
          styleConfig={styleConfig}
          onChangeStyle={setStyleConfig}
          profile={profile}
        />
      )}
    </div>
  );
}
