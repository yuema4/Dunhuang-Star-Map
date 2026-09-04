import React, { useRef, useState } from 'react';
import { UserAstralProfile, DunhuangStyleConfig } from '../types';
import { StarChartSvg } from './StarChartSvg';
import {
  DUNHUANG_PALETTES,
  DEFAULT_STYLE_CONFIG,
  DunhuangSvgAssets,
} from '../utils/dunhuangMuralAssets';
import { Download, Sparkles, Scroll, Minimize2, Check, Palette, Wand2 } from 'lucide-react';

interface CelestialScrollProps {
  profile: UserAstralProfile;
  isAiLoading?: boolean;
  styleConfig?: DunhuangStyleConfig;
  onChangeStyle?: (newConfig: DunhuangStyleConfig) => void;
  onOpenAssetLibrary?: () => void;
}

export const CelestialScroll: React.FC<CelestialScrollProps> = ({
  profile,
  isAiLoading = false,
  styleConfig = DEFAULT_STYLE_CONFIG,
  onChangeStyle,
  onOpenAssetLibrary,
}) => {
  const [viewMode, setViewMode] = useState<'editorial' | 'panorama'>('editorial');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { mansion, lunarInfo, oracle, name, solarDate } = profile;
  const palette = DUNHUANG_PALETTES[styleConfig.paletteId] || DUNHUANG_PALETTES['cinnabar-gold'];

  // Extract Earthly branch for the authentic seal
  const primaryBranch = lunarInfo.cyclicalDay?.slice(1) || '辰';

  // Export scroll as image using standard Canvas, faithfully reflecting the chosen Dunhuang style
  const handleExportImage = () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 900;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw dynamic parchment background matching chosen palette
      ctx.fillStyle = palette.bgPaper;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Aged paper texture subtle noise
      for (let i = 0; i < 24000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle =
          Math.random() > 0.5
            ? 'rgba(42, 38, 31, 0.04)'
            : `${palette.cinnabar}12`;
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      // 2. Dunhuang Wall Border Frames
      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

      // Dunhuang Beaded Pearl Inner String along outer border
      const step = 20;
      ctx.fillStyle = palette.gold;
      for (let x = 50; x < canvas.width - 50; x += step) {
        ctx.beginPath();
        ctx.arc(x, 42, 2, 0, Math.PI * 2);
        ctx.arc(x, canvas.height - 42, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let y = 50; y < canvas.height - 50; y += step) {
        ctx.beginPath();
        ctx.arc(42, y, 2, 0, Math.PI * 2);
        ctx.arc(canvas.width - 42, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Corner Caisson Bracket Ornaments on Canvas
      const drawCornerBracket = (cx: number, cy: number, flipX: boolean, flipY: boolean) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
        ctx.fillStyle = `${palette.cinnabar}33`;
        ctx.strokeStyle = palette.gold;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(48, 0);
        ctx.quadraticCurveTo(24, 24, 0, 48);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = palette.goldBright;
        ctx.beginPath();
        ctx.arc(14, 14, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawCornerBracket(42, 42, false, false);
      drawCornerBracket(canvas.width - 42, 42, true, false);
      drawCornerBracket(42, canvas.height - 42, false, true);
      drawCornerBracket(canvas.width - 42, canvas.height - 42, true, true);

      // 4. Top Header & Metadata
      ctx.fillStyle = palette.cinnabar;
      ctx.font = 'bold 26px serif';
      ctx.fillText('大唐敦煌藏经洞 S.3326 本命星曜天象真形长卷', 75, 88);

      ctx.fillStyle = palette.textColor;
      ctx.font = '14px serif';
      ctx.fillText(
        `求占者：${name || '敦煌行客'}   生辰：${solarDate} (${lunarInfo.cyclicalYear}年 ${lunarInfo.cyclicalMonth}月 ${lunarInfo.cyclicalDay}日)   纳音：${lunarInfo.naYin}   矿彩：${palette.name}`,
        75,
        118
      );

      // 5. Left Vertical Title with Dunhuang Cartouche
      ctx.fillStyle = palette.textColor;
      ctx.font = 'bold 36px serif';
      const title = `${mansion.name}宿 · ${mansion.symbol}`;
      for (let i = 0; i < title.length; i++) {
        ctx.fillText(title[i], 85, 200 + i * 46);
      }

      ctx.fillStyle = palette.cinnabar;
      ctx.font = 'bold 16px serif';
      ctx.fillText(`【${mansion.fullName}】`, 80, 520);
      ctx.font = '14px serif';
      ctx.fillStyle = palette.textColor;
      ctx.fillText(`度数：${mansion.degrees}° · 曜宿：${mansion.planet}`, 80, 550);

      // 6. Draw Central Dunhuang Star Disk & Baoxianghua Rosette
      const cx = 580;
      const cy = 480;
      const r = 260;

      // Outer degree ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Equatorial ring
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Polar enclosure ring
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.38, 0, Math.PI * 2);
      ctx.strokeStyle = palette.cinnabar;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw Baoxianghua mandala behind center
      ctx.save();
      ctx.translate(cx, cy);
      for (let a = 0; a < 8; a++) {
        ctx.rotate((Math.PI * 2) / 8);
        ctx.fillStyle = `${palette.gold}28`;
        ctx.strokeStyle = palette.goldBright;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, -60, 16, 36, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      // Draw Constellation Stars & Lines on Canvas
      mansion.connections.forEach(([aIdx, bIdx]) => {
        const sA = mansion.stars[aIdx];
        const sB = mansion.stars[bIdx];
        if (!sA || !sB) return;
        ctx.strokeStyle = palette.cinnabar;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + sA.x * 2.8, cy + sA.y * 2.8);
        ctx.lineTo(cx + sB.x * 2.8, cy + sB.y * 2.8);
        ctx.stroke();
      });

      mansion.stars.forEach((s) => {
        const sx = cx + s.x * 2.8;
        const sy = cy + s.y * 2.8;
        // Glow
        ctx.fillStyle = `${palette.cinnabar}40`;
        ctx.beginPath();
        ctx.arc(sx, sy, 10, 0, Math.PI * 2);
        ctx.fill();
        // Core
        ctx.fillStyle = palette.cinnabar;
        ctx.beginPath();
        ctx.arc(sx, sy, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 7. Draw Divination Text & S.3326 Ancient Sutra Excerpt
      ctx.fillStyle = palette.textColor;
      ctx.font = 'bold 22px serif';
      ctx.fillText(`【${oracle.poemTitle || '本命星曜'}】`, 960, 200);

      ctx.font = 'italic 18px serif';
      const poemLines = (oracle.tangPoem || '').split('\n');
      poemLines.forEach((line, idx) => {
        ctx.fillText(line, 960, 240 + idx * 32);
      });

      ctx.font = '16px serif';
      ctx.fillText(`尊号：${oracle.imperialTitle || mansion.fullName}`, 960, 360);
      ctx.fillText(`敦煌矿彩：${palette.name} (${palette.cave})`, 960, 395);
      ctx.fillText(`护持吉语：${oracle.talismanAdvice}`, 960, 430);

      // Ancient S.3326 text excerpt
      ctx.font = '14px serif';
      ctx.fillStyle = palette.textColor;
      ctx.fillText('敦煌遗书 S.3326 经文记叙：', 960, 480);
      const excerpt = mansion.tangText.slice(0, 38);
      ctx.fillText(excerpt, 960, 510);

      // Style motifs indicator on exported canvas
      ctx.fillStyle = `${palette.cinnabar}20`;
      ctx.fillRect(960, 545, 520, 50);
      ctx.strokeStyle = palette.gold;
      ctx.strokeRect(960, 545, 520, 50);
      ctx.fillStyle = palette.textColor;
      ctx.font = '13px serif';
      ctx.fillText(
        `壁画要素：${styleConfig.feitianId !== 'feitian-none' ? '飞天仙姿 · ' : ''}${styleConfig.cloudId} · ${styleConfig.baoxiangId}`,
        975,
        575
      );

      // 8. Dunhuang Red Official Seal
      ctx.fillStyle = `${palette.cinnabar}22`;
      ctx.fillRect(1410, 700, 95, 95);
      ctx.strokeStyle = palette.cinnabar;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(1410, 700, 95, 95);
      ctx.fillStyle = palette.cinnabar;
      ctx.font = 'bold 44px serif';
      ctx.fillText(primaryBranch, 1435, 765);

      // 9. Footer
      ctx.fillStyle = palette.textColor;
      ctx.font = '12px monospace';
      ctx.fillText(
        'BRITISH LIBRARY OR.8210 / S.3326 · MOGAO CAVES STAR ATLAS · VIBECODING',
        75,
        845
      );

      // Download
      const link = document.createElement('a');
      link.download = `Dunhuang-Star-Scroll-${name || 'User'}-${mansion.name}Xiu.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Export error', e);
    } finally {
      setIsExporting(false);
    }
  };

  const copyShareText = () => {
    const text = `【敦煌星图 · 专属星曜长卷】\n姓名：${name || '敦煌行客'}\n本命宿：${mansion.fullName}（${mansion.symbol}）\n五行：${mansion.element}德 · 度数：${mansion.degrees}度\n壁画配色：${palette.name}（${palette.cave}）\n唐风绝句：\n${oracle.tangPoem}\n吉语：${oracle.talismanAdvice}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-4 font-serif-sc">
      {/* Action & Style Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A059] opacity-90">
            CELESTIAL SCROLL
          </span>
          <div className="h-3 w-[1px] bg-[#C5A059]/30" />
          <span className="text-[11px] text-[#E2DCC8]/80">
            {mansion.fullName} · {lunarInfo.cyclicalYear} ({lunarInfo.naYin})
          </span>

          {/* Quick Palette Circles Bar */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-2 border-l border-[#C5A059]/30">
            {Object.values(DUNHUANG_PALETTES).map((pal) => (
              <button
                key={pal.id}
                onClick={() => onChangeStyle?.({ ...styleConfig, paletteId: pal.id })}
                style={{
                  backgroundColor: pal.cinnabar,
                  borderColor: styleConfig.paletteId === pal.id ? pal.goldBright : 'transparent',
                }}
                className={`w-4 h-4 rounded-full border-2 transition-transform ${
                  styleConfig.paletteId === pal.id ? 'scale-125 ring-1 ring-white/50' : 'hover:scale-110 opacity-70'
                }`}
                title={`${pal.name} (${pal.cave})`}
              />
            ))}
          </div>

          {isAiLoading && (
            <span className="flex items-center gap-1 text-[10px] text-[#C5A059] animate-pulse">
              <Sparkles className="w-3 h-3" />
              司天监推演中...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mural Asset Studio Launcher Button */}
          {onOpenAssetLibrary && (
            <button
              onClick={onOpenAssetLibrary}
              style={{
                backgroundColor: palette.cinnabar + '25',
                borderColor: palette.gold,
                color: palette.goldBright,
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs tracking-wider hover:brightness-110 transition-all font-medium"
              title="打开敦煌壁画飞天、祥云、宝相花素材库与配色定制"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>壁画素材馆</span>
            </button>
          )}

          <button
            onClick={() => setViewMode(viewMode === 'editorial' ? 'panorama' : 'editorial')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/10 text-xs tracking-wider transition-colors rounded-xs"
            title="切换典雅构图/全景长卷"
          >
            {viewMode === 'editorial' ? (
              <>
                <Scroll className="w-3.5 h-3.5" />
                <span>全景长卷</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>精装图卷</span>
              </>
            )}
          </button>

          <button
            onClick={copyShareText}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#C5A059]/40 text-[#E2DCC8] hover:bg-[#C5A059]/10 text-xs tracking-wider transition-colors rounded-xs"
            title="复制本命诗箴"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{copied ? '已复制' : '分享批语'}</span>
          </button>

          <button
            onClick={handleExportImage}
            disabled={isExporting}
            style={{ backgroundColor: palette.gold, color: palette.bgDark }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 hover:brightness-110 text-xs font-bold tracking-widest uppercase transition-all shadow-md rounded-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? '拓印中...' : '拓印长卷'}</span>
          </button>
        </div>
      </div>

      {/* Main Scroll Container: Dynamic Dunhuang Paper & Motifs */}
      {viewMode === 'editorial' ? (
        <div
          ref={scrollRef}
          style={{
            backgroundColor: palette.bgPaper,
            color: palette.textColor,
            borderColor: palette.border,
          }}
          className="relative w-full min-h-[530px] rounded-xs shadow-2xl overflow-hidden flex flex-col select-none transition-all duration-300 border-2"
        >
          {/* Top & Bottom Dunhuang wall shading */}
          <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-black/12 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black/12 to-transparent pointer-events-none z-10" />

          {/* Aged plaster & paper specks */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#2A261F_0.6px,transparent_0.6px)] [background-size:24px_24px]" />

          {/* 4 Corner Caisson Ornaments (壁画藻井角饰) */}
          <div className="absolute top-2 left-2 pointer-events-none opacity-80 z-20">
            <svg width="36" height="36">
              {DunhuangSvgAssets.renderCornerBracket('tl', 34, palette)}
            </svg>
          </div>
          <div className="absolute top-2 right-2 pointer-events-none opacity-80 z-20">
            <svg width="36" height="36">
              {DunhuangSvgAssets.renderCornerBracket('tr', 34, palette)}
            </svg>
          </div>
          <div className="absolute bottom-2 left-2 pointer-events-none opacity-80 z-20">
            <svg width="36" height="36">
              {DunhuangSvgAssets.renderCornerBracket('bl', 34, palette)}
            </svg>
          </div>
          <div className="absolute bottom-2 right-2 pointer-events-none opacity-80 z-20">
            <svg width="36" height="36">
              {DunhuangSvgAssets.renderCornerBracket('br', 34, palette)}
            </svg>
          </div>

          {/* Core Content Area */}
          <div className="flex-1 flex flex-col md:flex-row px-8 md:px-12 py-4 items-center justify-between relative z-10 gap-6">
            {/* Left Column: Vertical Title, Natal Emblem & Meridian Info */}
            <div
              style={{ borderLeftColor: palette.textColor + '40' }}
              className="flex flex-col gap-4 border-l pl-6 my-auto"
            >
              <div
                style={{ color: palette.textColor }}
                className="writing-vertical-rl text-2xl md:text-3xl font-bold tracking-[0.25em] h-48 md:h-52 font-serif-sc"
              >
                {mansion.name}宿 · {mansion.animal}象之座
              </div>
              <div className="text-[10px] uppercase tracking-tighter opacity-70 font-cinzel">
                Meridian Transit {mansion.degrees}°
              </div>
              <div
                style={{ color: palette.cinnabar }}
                className="text-xs font-serif-sc font-bold tracking-widest"
              >
                {mansion.fullName} · {palette.name}
              </div>
            </div>

            {/* Center Area: Authentic Dunhuang S.3326 Star Chart with Feitian & Baoxianghua */}
            <div className="relative flex-1 flex items-center justify-center h-full px-2">
              <StarChartSvg natalMansion={mansion} size={390} styleConfig={styleConfig} />
            </div>

            {/* Right Column: Destiny Vector & Seals */}
            <div className="flex flex-col items-end justify-between h-64 md:h-72 w-52 text-right py-2">
              <div className="text-right">
                <h3
                  style={{ color: palette.cinnabar }}
                  className="text-[10px] font-bold uppercase tracking-widest"
                >
                  Destiny Vector
                </h3>
                <p className="text-sm font-bold font-serif-sc mt-0.5">
                  {mansion.planet}曜入{mansion.name}宿
                </p>
                <p className="text-[11px] opacity-75 font-serif-sc">
                  纳音五行：{lunarInfo.naYin}
                </p>
              </div>

              <div className="text-right max-w-[200px]">
                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  Mogao Wall Note
                </h3>
                <p
                  style={{ color: palette.textColor }}
                  className="text-xs font-serif-sc leading-relaxed mt-1"
                >
                  {mansion.temperament}
                </p>
                <p className="text-[10px] italic opacity-60 font-cinzel mt-0.5">
                  {palette.cave} · 矿彩古韵
                </p>
              </div>

              {/* Red Ancient Branch Seal Stamp */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-widest opacity-50 block">SEAL / 官印</span>
                  <span
                    style={{ color: palette.cinnabar }}
                    className="text-[10px] font-bold font-serif-sc"
                  >
                    司天监校订
                  </span>
                </div>
                <div
                  style={{
                    borderColor: palette.cinnabar,
                    color: palette.cinnabar,
                    backgroundColor: palette.cinnabar + '18',
                  }}
                  className="w-13 h-13 border-2 flex items-center justify-center text-2xl font-bold font-serif-sc shadow-xs"
                >
                  {primaryBranch}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <footer
            style={{ borderTopColor: palette.textColor + '25', color: palette.textColor }}
            className="h-11 border-t flex items-center justify-between px-8 text-[9px] uppercase tracking-[0.2em] opacity-75 z-10"
          >
            <span>Charted via Dunhuang S.3326 · {palette.name}</span>
            <span className="font-serif-sc">
              求占者：{name || '敦煌行客'} · 阳历：{solarDate} · 节气：{lunarInfo.solarTerm}
            </span>
            <span>Mogao Vault Protocol</span>
          </footer>
        </div>
      ) : (
        /* Panorama Horizontal Scroll Mode */
        <div
          ref={scrollRef}
          style={{
            backgroundColor: palette.bgPaper,
            color: palette.textColor,
            borderColor: palette.border,
          }}
          className="relative w-full overflow-x-auto rounded-xs shadow-2xl p-8 border-2"
        >
          <div className="min-w-[1280px] flex items-stretch gap-10">
            {/* Frontispiece Section with Baoxianghua Watermark */}
            <div
              style={{ borderRightColor: palette.textColor + '30' }}
              className="w-56 border-r pr-6 flex flex-col justify-between"
            >
              <div>
                <div
                  style={{ color: palette.cinnabar }}
                  className="writing-vertical-rl text-2xl font-bold tracking-[0.3em] font-serif-sc h-56 mx-auto"
                >
                  大唐敦煌本命星曜长卷
                </div>
                <div className="mt-4 text-center">
                  <div
                    style={{
                      borderColor: palette.cinnabar,
                      color: palette.cinnabar,
                      backgroundColor: palette.cinnabar + '18',
                    }}
                    className="w-16 h-16 border mx-auto flex items-center justify-center text-3xl font-bold font-serif-sc"
                  >
                    唐
                  </div>
                  <span className="text-[10px] tracking-widest opacity-60 block mt-2">
                    莫高窟藏经洞遗珍
                  </span>
                </div>
              </div>
              <div className="text-[11px] font-serif-sc space-y-1 text-center opacity-80">
                <div>行客：{name || '敦煌行客'}</div>
                <div>干支：{lunarInfo.cyclicalYear}年</div>
                <div>值宿：{mansion.fullName}</div>
                <div style={{ color: palette.cinnabar }}>矿色：{palette.name}</div>
              </div>
            </div>

            {/* Central Astronomical Chart */}
            <div
              style={{ borderRightColor: palette.textColor + '30' }}
              className="flex flex-col items-center justify-center border-r pr-10"
            >
              <span
                style={{ color: palette.cinnabar }}
                className="text-xs font-bold tracking-[0.2em] uppercase mb-2 font-serif-sc"
              >
                {mansion.symbol} · {mansion.fullName}图谱
              </span>
              <StarChartSvg natalMansion={mansion} size={370} styleConfig={styleConfig} />
            </div>

            {/* Tang Dynasty Manuscript Excerpt */}
            <div
              style={{ borderRightColor: palette.textColor + '30' }}
              className="w-72 border-r pr-8 flex flex-col justify-between"
            >
              <div>
                <h4
                  style={{ color: palette.cinnabar, borderBottomColor: palette.textColor + '25' }}
                  className="text-xs font-bold tracking-widest uppercase mb-4 border-b pb-2 font-serif-sc"
                >
                  敦煌遗书 S.3326 经文抄本
                </h4>
                <div className="writing-vertical-rl font-serif-sc text-sm leading-loose tracking-widest h-64 overflow-hidden opacity-90">
                  {mansion.tangText}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: palette.textColor + '0d',
                  borderColor: palette.textColor + '20',
                }}
                className="p-3 border rounded-xs text-xs font-serif-sc"
              >
                <span style={{ color: palette.cinnabar }} className="font-bold">
                  宿度：
                </span>
                广延{mansion.degrees}度，四象所属：{mansion.symbol}，属相：{mansion.animal}
              </div>
            </div>

            {/* Imperial Oracle & Tang Quatrain */}
            <div className="flex-1 flex flex-col justify-between pl-2 min-w-[340px]">
              <div>
                <div
                  style={{ borderBottomColor: palette.textColor + '25' }}
                  className="flex items-center justify-between border-b pb-2 mb-4"
                >
                  <h4
                    style={{ color: palette.cinnabar }}
                    className="text-xs font-bold tracking-widest uppercase font-serif-sc"
                  >
                    司天监本命谶语 · {oracle.poemTitle || '曜灵舒光'}
                  </h4>
                  <span
                    style={{
                      backgroundColor: palette.cinnabar + '15',
                      borderColor: palette.cinnabar + '35',
                      color: palette.cinnabar,
                    }}
                    className="text-[10px] px-2 py-0.5 border font-serif-sc"
                  >
                    {oracle.isAiGenerated ? 'AI司天官推演' : '敦煌原典秘籍'}
                  </span>
                </div>

                <div className="text-sm font-bold font-serif-sc mb-3">
                  {oracle.imperialTitle || `${mansion.symbol}${mansion.name}宿度曜星君`}
                </div>

                {/* Quatrain Poem */}
                <div
                  style={{
                    backgroundColor: palette.textColor + '0d',
                    borderLeftColor: palette.cinnabar,
                  }}
                  className="p-4 border-l-2 my-3"
                >
                  <p className="font-calligraphy text-lg whitespace-pre-line leading-relaxed tracking-wider">
                    {oracle.tangPoem}
                  </p>
                </div>

                {/* Omen Reading */}
                <p className="text-xs font-serif-sc leading-relaxed opacity-85 text-justify mt-3 whitespace-pre-line">
                  {oracle.omenReading}
                </p>
              </div>

              {/* Auspicious Color and Talisman */}
              <div
                style={{ borderTopColor: palette.textColor + '20' }}
                className="pt-4 border-t flex items-center justify-between text-xs font-serif-sc"
              >
                <div>
                  <span className="opacity-60">契合矿彩：</span>
                  <span style={{ color: palette.cinnabar }} className="font-bold">
                    {palette.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="opacity-60">护身吉语：</span>
                  <span className="font-bold">{oracle.talismanAdvice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-cards matching Editorial Style with Active Dunhuang Palette */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          style={{ backgroundColor: palette.bgDark, borderColor: palette.gold + '40' }}
          className="p-5 border text-[#E2DCC8] rounded-xs flex flex-col justify-between"
        >
          <div>
            <span
              style={{ color: palette.goldBright }}
              className="text-[10px] tracking-[0.3em] uppercase block mb-2 font-cinzel"
            >
              ASTRONOMICAL ESSENCE
            </span>
            <h4 className="text-lg font-serif-sc font-bold text-[#E2DCC8]">
              {mansion.fullName}
            </h4>
            <p className="text-xs text-[#E2DCC8]/75 font-serif-sc mt-2 leading-relaxed">
              {mansion.tangText.slice(0, 70)}...
            </p>
          </div>
          <div
            style={{ borderTopColor: palette.gold + '30', color: palette.goldBright }}
            className="mt-4 pt-3 border-t flex justify-between text-xs"
          >
            <span>度数：{mansion.degrees}°</span>
            <span>星曜宿主：{mansion.planet}</span>
          </div>
        </div>

        <div
          style={{ backgroundColor: palette.bgDark, borderColor: palette.gold + '40' }}
          className="p-5 border text-[#E2DCC8] rounded-xs flex flex-col justify-between"
        >
          <div>
            <span
              style={{ color: palette.cinnabarLight }}
              className="text-[10px] tracking-[0.3em] uppercase block mb-2 font-cinzel"
            >
              TANG DYNASTY ORACLE
            </span>
            <h4 style={{ color: palette.goldBright }} className="text-sm font-serif-sc font-bold">
              {oracle.poemTitle}
            </h4>
            <p className="text-xs font-serif-sc text-[#E2DCC8]/85 mt-2 leading-relaxed whitespace-pre-line italic">
              {oracle.tangPoem}
            </p>
          </div>
          <div
            style={{ borderTopColor: palette.gold + '30' }}
            className="mt-4 pt-3 border-t flex justify-between text-xs text-[#E2DCC8]/60"
          >
            <span>尊号：{oracle.imperialTitle}</span>
          </div>
        </div>

        <div
          style={{ backgroundColor: palette.bgDark, borderColor: palette.gold + '40' }}
          className="p-5 border text-[#E2DCC8] rounded-xs flex flex-col justify-between"
        >
          <div>
            <span
              style={{ color: palette.goldBright }}
              className="text-[10px] tracking-[0.3em] uppercase block mb-2 font-cinzel"
            >
              DUNHUANG PIGMENT & MOTIFS
            </span>
            <div className="flex items-center gap-3 mt-1">
              <div
                className="w-8 h-8 rounded-full border border-[#C5A059]/50 shadow-xs"
                style={{ backgroundColor: palette.cinnabar }}
              />
              <div>
                <h5 className="text-sm font-serif-sc font-bold text-[#E2DCC8]">
                  {palette.name}
                </h5>
                <p className="text-[10px] text-[#E2DCC8]/60 uppercase tracking-wider">
                  {palette.cave}
                </p>
              </div>
            </div>
            <p className="text-xs text-[#E2DCC8]/75 font-serif-sc mt-3 leading-relaxed">
              矿物配方：{palette.mineralOrigin}
            </p>
          </div>
          <div
            style={{ borderTopColor: palette.gold + '30', color: palette.goldBright }}
            className="mt-4 pt-3 border-t text-[11px] font-serif-sc"
          >
            吉瑞要语：{mansion.fortuneKeywords.join(' · ')}
          </div>
        </div>
      </div>
    </div>
  );
};
