import React, { useState } from 'react';
import {
  DunhuangStyleConfig,
  PaletteId,
  FeitianId,
  CloudId,
  BaoxiangId,
  BorderId,
  StarTrailId,
  UserAstralProfile,
} from '../types';
import {
  DUNHUANG_PALETTES,
  FEITIAN_LIST,
  CLOUD_LIST,
  BAOXIANG_LIST,
  BORDER_LIST,
  TRAIL_LIST,
  DunhuangSvgAssets,
} from '../utils/dunhuangMuralAssets';
import { X, Sparkles, Wand2, Compass, Layers, Palette, Eye } from 'lucide-react';

interface MuralAssetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  styleConfig: DunhuangStyleConfig;
  onChangeStyle: (newConfig: DunhuangStyleConfig) => void;
  profile: UserAstralProfile;
}

export const MuralAssetLibraryModal: React.FC<MuralAssetLibraryModalProps> = ({
  isOpen,
  onClose,
  styleConfig,
  onChangeStyle,
  profile,
}) => {
  const [activeTab, setActiveTab] = useState<'palette' | 'feitian' | 'cloud' | 'baoxiang' | 'border' | 'trail'>('palette');

  if (!isOpen) return null;

  const currentPalette = DUNHUANG_PALETTES[styleConfig.paletteId] || DUNHUANG_PALETTES['cinnabar-gold'];

  // Harmonize with User's Natal Five Elements & Mansion
  const handleAutoHarmonize = () => {
    const element = profile.mansion.element;
    let targetPalette: PaletteId = 'cinnabar-gold';
    let targetFeitian: FeitianId = 'feitian-pipa';
    let targetCloud: CloudId = 'cloud-ruyi';
    let targetBaoxiang: BaoxiangId = 'baoxiang-lotus';
    let targetBorder: BorderId = 'border-pearl-vine';
    let targetTrail: StarTrailId = 'trails-lotus';

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

    onChangeStyle({
      paletteId: targetPalette,
      feitianId: targetFeitian,
      cloudId: targetCloud,
      baoxiangId: targetBaoxiang,
      borderId: targetBorder,
      trailId: targetTrail,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div
        style={{
          backgroundColor: currentPalette.bgDark,
          borderColor: currentPalette.gold,
        }}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-lg border shadow-2xl overflow-hidden font-serif-sc"
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: currentPalette.bgMedium,
            borderBottomColor: currentPalette.gold + '40',
          }}
          className="flex items-center justify-between px-6 py-4 border-b"
        >
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: currentPalette.cinnabar + '30', color: currentPalette.goldBright }}
              className="p-2 rounded-full border border-[#C5A059]/40"
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold tracking-wider text-[#E8DCBF]">
                  敦煌壁画风格素材馆
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-[#C5A059]/40 text-[#C5A059] bg-[#1C1914]">
                  莫高窟原典艺术库
                </span>
              </div>
              <p className="text-xs text-[#E8DCBF]/70 mt-0.5">
                汇集莫高窟唐代飞天、藻井宝相花、祥云与五大天然矿物色彩体系
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoHarmonize}
              style={{
                backgroundColor: currentPalette.cinnabar + '25',
                borderColor: currentPalette.gold,
                color: currentPalette.goldBright,
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border hover:brightness-110 transition-all font-medium"
              title="根据用户本命五行纳音自动推演和谐配色与纹样"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>本命五行和韵</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#E8DCBF]/70 hover:text-[#E8DCBF] rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{ backgroundColor: currentPalette.bgMedium + '80' }}
          className="flex border-b border-[#C5A059]/20 px-6 overflow-x-auto no-scrollbar gap-1"
        >
          {[
            { id: 'palette', label: '莫高矿彩', sub: '配色方案' },
            { id: 'feitian', label: '飞天仙姿', sub: '飞天纹样' },
            { id: 'cloud', label: '天穹瑞彩', sub: '祥云卷法' },
            { id: 'baoxiang', label: '藻井天心', sub: '宝相花徽' },
            { id: 'border', label: '壁画边饰', sub: '经卷边框' },
            { id: 'trail', label: '度数星轨', sub: '天体运行' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  color: isActive ? currentPalette.goldBright : '#DBCBB1',
                  borderBottomColor: isActive ? currentPalette.cinnabar : 'transparent',
                }}
                className={`py-3 px-3.5 border-b-2 text-xs md:text-sm font-medium whitespace-nowrap transition-all flex flex-col items-center gap-0.5 ${
                  isActive ? 'border-b-2' : 'hover:opacity-80'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-60 scale-90">{tab.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {/* TAB 1: PALETTE SCHEMES */}
          {activeTab === 'palette' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(DUNHUANG_PALETTES).map((pal) => {
                const isSelected = styleConfig.paletteId === pal.id;
                return (
                  <div
                    key={pal.id}
                    onClick={() => onChangeStyle({ ...styleConfig, paletteId: pal.id })}
                    style={{
                      backgroundColor: pal.bgMedium,
                      borderColor: isSelected ? pal.goldBright : pal.border + '60',
                    }}
                    className={`relative p-4 rounded border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                      isSelected ? 'ring-1 ring-[#C5A059]' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Top title & origin */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-[#E8DCBF] tracking-wide">
                            {pal.name}
                          </h4>
                          <span
                            style={{ color: pal.goldBright, backgroundColor: pal.bgDark }}
                            className="text-[10px] px-1.5 py-0.5 rounded border border-[#C5A059]/30"
                          >
                            {pal.dynasty}
                          </span>
                        </div>
                        <p className="text-xs text-[#C5A059] mt-0.5">{pal.cave}</p>
                      </div>

                      {/* Swatch dots */}
                      <div className="flex items-center gap-1.5">
                        <span
                          style={{ backgroundColor: pal.cinnabar }}
                          className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                          title="主矿彩"
                        />
                        <span
                          style={{ backgroundColor: pal.gold }}
                          className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                          title="泥金/沥粉"
                        />
                        <span
                          style={{ backgroundColor: pal.bgPaper }}
                          className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                          title="古绢/羊皮纸"
                        />
                        <span
                          style={{ backgroundColor: pal.bgDark }}
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          title="夜曜玄墨"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-[#E8DCBF]/80 mt-2.5 leading-relaxed">
                      {pal.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-[#C5A059]/20 flex items-center justify-between text-[11px] text-[#C5A059]/90">
                      <span>研磨配方: {pal.mineralOrigin}</span>
                      {isSelected && (
                        <span className="font-bold text-[#E8C67B] flex items-center gap-1">
                          ✓ 当前应用
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: FEITIAN MOTIFS */}
          {activeTab === 'feitian' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FEITIAN_LIST.map((item) => {
                const isSelected = styleConfig.feitianId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => onChangeStyle({ ...styleConfig, feitianId: item.id })}
                    style={{
                      backgroundColor: currentPalette.bgMedium,
                      borderColor: isSelected ? currentPalette.goldBright : currentPalette.border + '60',
                    }}
                    className={`relative p-4 rounded border-2 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between ${
                      isSelected ? 'ring-1 ring-[#C5A059]' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-[#E8DCBF]">
                            {item.name}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded border border-[#C5A059]/30 text-[#C5A059]">
                            {item.dynasty}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="text-xs font-bold text-[#E8C67B]">✓ 已选</span>
                        )}
                      </div>
                      {item.cave && (
                        <p className="text-xs text-[#C5A059] mb-2">{item.cave}</p>
                      )}

                      {/* SVG Motif Graphic Preview */}
                      <div
                        style={{ backgroundColor: currentPalette.bgDark }}
                        className="w-full h-32 rounded flex items-center justify-center p-2 border border-[#C5A059]/30 overflow-hidden"
                      >
                        {item.id === 'feitian-none' ? (
                          <div className="text-center text-xs text-[#E8DCBF]/50 flex flex-col items-center gap-1">
                            <Compass className="w-6 h-6 stroke-1" />
                            <span>纯粹天象规矩 · 无具象飞天</span>
                          </div>
                        ) : (
                          <svg
                            viewBox="0 0 220 130"
                            className="w-full h-full max-h-28"
                          >
                            {DunhuangSvgAssets.renderFeitian(item.id, 220, 130, currentPalette, 0.9)}
                          </svg>
                        )}
                      </div>

                      <p className="text-xs text-[#E8DCBF]/80 mt-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: XIANGYUN MOTIFS */}
          {activeTab === 'cloud' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CLOUD_LIST.map((item) => {
                const isSelected = styleConfig.cloudId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => onChangeStyle({ ...styleConfig, cloudId: item.id })}
                    style={{
                      backgroundColor: currentPalette.bgMedium,
                      borderColor: isSelected ? currentPalette.goldBright : currentPalette.border + '60',
                    }}
                    className={`relative p-4 rounded border-2 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between ${
                      isSelected ? 'ring-1 ring-[#C5A059]' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-[#E8DCBF]">
                            {item.name}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded border border-[#C5A059]/30 text-[#C5A059]">
                            {item.dynasty}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="text-xs font-bold text-[#E8C67B]">✓ 已选</span>
                        )}
                      </div>
                      {item.cave && (
                        <p className="text-xs text-[#C5A059] mb-2">{item.cave}</p>
                      )}

                      {/* SVG Cloud Preview */}
                      <div
                        style={{ backgroundColor: currentPalette.bgDark }}
                        className="w-full h-24 rounded flex items-center justify-center p-2 border border-[#C5A059]/30"
                      >
                        <svg viewBox="0 0 220 60" className="w-full h-full">
                          {DunhuangSvgAssets.renderXiangyun(item.id, 220, 60, currentPalette, 0.95)}
                        </svg>
                      </div>

                      <p className="text-xs text-[#E8DCBF]/80 mt-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: BAOXIANGHUA MOTIFS */}
          {activeTab === 'baoxiang' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BAOXIANG_LIST.map((item) => {
                const isSelected = styleConfig.baoxiangId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => onChangeStyle({ ...styleConfig, baoxiangId: item.id })}
                    style={{
                      backgroundColor: currentPalette.bgMedium,
                      borderColor: isSelected ? currentPalette.goldBright : currentPalette.border + '60',
                    }}
                    className={`relative p-4 rounded border-2 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between ${
                      isSelected ? 'ring-1 ring-[#C5A059]' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-[#E8DCBF]">
                          {item.name}
                        </h4>
                        {isSelected && (
                          <span className="text-xs font-bold text-[#E8C67B]">✓ 已选</span>
                        )}
                      </div>
                      {item.cave && (
                        <p className="text-[11px] text-[#C5A059] mb-2">{item.cave}</p>
                      )}

                      {/* SVG Baoxianghua Preview */}
                      <div
                        style={{ backgroundColor: currentPalette.bgDark }}
                        className="w-full h-36 rounded flex items-center justify-center p-2 border border-[#C5A059]/30"
                      >
                        <svg viewBox="-60 -60 120 120" className="w-28 h-28">
                          {DunhuangSvgAssets.renderBaoxianghua(item.id, 110, currentPalette, 0.95)}
                        </svg>
                      </div>

                      <p className="text-xs text-[#E8DCBF]/80 mt-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 5: BORDERS */}
          {activeTab === 'border' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BORDER_LIST.map((item) => {
                const isSelected = styleConfig.borderId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => onChangeStyle({ ...styleConfig, borderId: item.id })}
                    style={{
                      backgroundColor: currentPalette.bgMedium,
                      borderColor: isSelected ? currentPalette.goldBright : currentPalette.border + '60',
                    }}
                    className={`relative p-4 rounded border-2 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between ${
                      isSelected ? 'ring-1 ring-[#C5A059]' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-[#E8DCBF]">
                          {item.name}
                        </h4>
                        {isSelected && (
                          <span className="text-xs font-bold text-[#E8C67B]">✓ 已选</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#C5A059] mb-2">{item.dynasty}</p>

                      {/* Border preview band */}
                      <div
                        style={{ backgroundColor: currentPalette.bgDark }}
                        className="w-full h-20 rounded flex items-center justify-center p-2 border border-[#C5A059]/30"
                      >
                        <svg className="w-full h-10">
                          <defs>
                            {DunhuangSvgAssets.renderBorderDef(item.id, currentPalette)}
                          </defs>
                          <rect
                            x="4"
                            y="10"
                            width="96%"
                            height="18"
                            fill={`url(#dunhuang-border-${item.id})`}
                            stroke={currentPalette.gold}
                            strokeWidth="1"
                          />
                        </svg>
                      </div>

                      <p className="text-xs text-[#E8DCBF]/80 mt-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 6: TRAILS */}
          {activeTab === 'trail' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TRAIL_LIST.map((item) => {
                const isSelected = styleConfig.trailId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => onChangeStyle({ ...styleConfig, trailId: item.id })}
                    style={{
                      backgroundColor: currentPalette.bgMedium,
                      borderColor: isSelected ? currentPalette.goldBright : currentPalette.border + '60',
                    }}
                    className={`relative p-4 rounded border-2 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between ${
                      isSelected ? 'ring-1 ring-[#C5A059]' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-[#E8DCBF]">
                          {item.name}
                        </h4>
                        {isSelected && (
                          <span className="text-xs font-bold text-[#E8C67B]">✓ 已选</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#C5A059] mb-2">{item.dynasty}</p>

                      {/* Trail simulation */}
                      <div
                        style={{ backgroundColor: currentPalette.bgDark }}
                        className="w-full h-24 rounded flex items-center justify-center p-2 border border-[#C5A059]/30"
                      >
                        <svg viewBox="0 0 160 80" className="w-full h-full">
                          <circle cx="80" cy="80" r="60" fill="none" stroke={currentPalette.textColor} strokeWidth="1" strokeDasharray="3 3" />
                          <circle cx="80" cy="80" r="45" fill="none" stroke={currentPalette.cinnabar} strokeWidth="1" />
                          {item.id === 'trails-lotus' && (
                            [0, 30, 60, 90, 120, 150].map((deg) => (
                              <g key={deg} transform={`translate(${80 + 45 * Math.cos((deg * Math.PI)/180)}, ${80 - 45 * Math.sin((deg * Math.PI)/180)})`}>
                                <circle cx="0" cy="0" r="2.5" fill={currentPalette.gold} />
                              </g>
                            ))
                          )}
                          {item.id === 'trails-ribbon' && (
                            <path d="M 30,55 Q 80,20 130,55" fill="none" stroke={currentPalette.goldBright} strokeWidth="1.5" strokeDasharray="4 2" />
                          )}
                        </svg>
                      </div>

                      <p className="text-xs text-[#E8DCBF]/80 mt-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info & Apply button */}
        <div
          style={{
            backgroundColor: currentPalette.bgMedium,
            borderTopColor: currentPalette.gold + '30',
          }}
          className="flex items-center justify-between px-6 py-3 border-t text-xs"
        >
          <div className="flex items-center gap-2 text-[#E8DCBF]/70">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>
              当前组合: <strong className="text-[#E8DCBF]">{currentPalette.name}</strong> ·{' '}
              {FEITIAN_LIST.find((f) => f.id === styleConfig.feitianId)?.name} ·{' '}
              {CLOUD_LIST.find((c) => c.id === styleConfig.cloudId)?.name} ·{' '}
              {BAOXIANG_LIST.find((b) => b.id === styleConfig.baoxiangId)?.name}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: currentPalette.cinnabar,
              borderColor: currentPalette.gold,
              color: '#FFFFFF',
            }}
            className="px-5 py-1.5 rounded font-bold tracking-wider hover:brightness-110 transition-all shadow-md"
          >
            应用并在星图显现
          </button>
        </div>
      </div>
    </div>
  );
};
