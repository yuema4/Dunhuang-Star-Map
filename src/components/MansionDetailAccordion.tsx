import React, { useState } from 'react';
import { Mansion28, LunarDateInfo, PaletteId, FiveElement } from '../types';
import { DUNHUANG_PALETTES } from '../utils/dunhuangMuralAssets';
import {
  ChevronDown,
  ChevronUp,
  Compass,
  Sparkles,
  BookOpen,
  Layers,
  Flame,
  Droplets,
  Trees,
  Mountain,
  Shield,
  Sun,
  Moon,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MansionDetailAccordionProps {
  mansion: Mansion28;
  lunarInfo: LunarDateInfo;
  paletteId?: PaletteId;
  defaultOpen?: boolean;
}

// Five elements metadata and mineral colors
const FIVE_ELEMENTS_CONFIG: Record<
  FiveElement,
  {
    name: string;
    english: string;
    color: string;
    mineral: string;
    virtue: string;
    direction: string;
    planet: string;
    generates: FiveElement;
    overcomes: FiveElement;
    generatedBy: FiveElement;
    overcomeBy: FiveElement;
    desc: string;
  }
> = {
  木: {
    name: '木德',
    english: 'Wood / Jupiter',
    color: '#416B58',
    mineral: '孔雀石绿 (石绿粉)',
    virtue: '仁者乐生 · 生机开拓',
    direction: '东方 (青龙七宿)',
    planet: '岁星 (木星)',
    generates: '火',
    overcomes: '土',
    generatedBy: '水',
    overcomeBy: '金',
    desc: '主生发奋进、春气发陈、骨秀神清，宜秉持仁爱之心顺应万物勃兴。',
  },
  火: {
    name: '火德',
    english: 'Fire / Mars & Sun',
    color: '#A64B3E',
    mineral: '天然辰砂 (朱砂赤)',
    virtue: '明辨昭然 · 热情果决',
    direction: '南方 (朱雀七宿)',
    planet: '荧惑 / 太阳',
    generates: '土',
    overcomes: '金',
    generatedBy: '木',
    overcomeBy: '水',
    desc: '主宣明炎上、赫赫光明、灵觉洞察，行事若胡旋飞天，炽烈通达。',
  },
  土: {
    name: '土德',
    english: 'Earth / Saturn',
    color: '#C5A059',
    mineral: '沙州雄黄 (赭石泥金)',
    virtue: '敦厚信实 · 容纳百川',
    direction: '中央季夏 (天市厚载)',
    planet: '镇星 (土星)',
    generates: '金',
    overcomes: '水',
    generatedBy: '火',
    overcomeBy: '木',
    desc: '主厚德载物、重整山川、从容沉静，如莫高崖壁历千载风霜而不动。',
  },
  金: {
    name: '金德',
    english: 'Metal / Venus',
    color: '#D4AF37',
    mineral: '玄墨沥粉 (赤金叶箔)',
    virtue: '刚正威仪 · 法度坚毅',
    direction: '西方 (白虎七宿)',
    planet: '太白 (金星)',
    generates: '水',
    overcomes: '木',
    generatedBy: '土',
    overcomeBy: '火',
    desc: '主西肃从革、裁决精敏、威重明达，大漠孤烟金戈铁马，卓然挺立。',
  },
  水: {
    name: '水德',
    english: 'Water / Mercury & Moon',
    color: '#2B4C7E',
    mineral: '青金石青 (铜矿石青)',
    virtue: '哲思润下 · 通变玄远',
    direction: '北方 (玄武七宿)',
    planet: '辰星 / 太阴',
    generates: '木',
    overcomes: '火',
    generatedBy: '金',
    overcomeBy: '土',
    desc: '主渊深清澈、变幻无常、灵性通天，犹如丝路大漠深处之月牙清泉。',
  },
};

// Calculate Five Elements balance scores
function calculateElementDistribution(
  mansionElement: FiveElement,
  naYin: string,
  symbol: string
): Record<FiveElement, number> {
  const base: Record<FiveElement, number> = {
    木: 15,
    火: 15,
    土: 15,
    金: 15,
    水: 15,
  };

  // Primary mansion element gets major weight (+35)
  base[mansionElement] += 35;

  // NaYin elemental booster (+25)
  if (naYin.includes('金')) base['金'] += 25;
  else if (naYin.includes('木')) base['木'] += 25;
  else if (naYin.includes('水')) base['水'] += 25;
  else if (naYin.includes('火')) base['火'] += 25;
  else if (naYin.includes('土')) base['土'] += 25;

  // Four Symbols quadrant booster (+15)
  if (symbol.includes('龙')) base['木'] += 15;
  else if (symbol.includes('雀')) base['火'] += 15;
  else if (symbol.includes('虎')) base['金'] += 15;
  else if (symbol.includes('武')) base['水'] += 15;

  // Normalize to 100%
  const total = Object.values(base).reduce((a, b) => a + b, 0);
  const normalized: Record<FiveElement, number> = {
    木: Math.round((base['木'] / total) * 100),
    火: Math.round((base['火'] / total) * 100),
    土: Math.round((base['土'] / total) * 100),
    金: Math.round((base['金'] / total) * 100),
    水: Math.round((base['水'] / total) * 100),
  };

  // Adjust rounding differences to exactly 100%
  const sum = Object.values(normalized).reduce((a, b) => a + b, 0);
  if (sum !== 100) {
    normalized[mansionElement] += 100 - sum;
  }

  return normalized;
}

// Compute generation/restriction text between mansion element and naYin
function analyzeElementHarmony(mansionElem: FiveElement, naYin: string): {
  relation: string;
  verdict: string;
  type: 'generate' | 'same' | 'overcome' | 'restrained';
} {
  let naYinElem: FiveElement = '水';
  if (naYin.includes('金')) naYinElem = '金';
  else if (naYin.includes('木')) naYinElem = '木';
  else if (naYin.includes('水')) naYinElem = '水';
  else if (naYin.includes('火')) naYinElem = '火';
  else if (naYin.includes('土')) naYinElem = '土';

  const cfg = FIVE_ELEMENTS_CONFIG[mansionElem];

  if (mansionElem === naYinElem) {
    return {
      relation: `${mansionElem}德同气 · 比和之象`,
      verdict: `本命值宿与生辰纳音同秉${mansionElem}气，同声相应，同气相求，根基磐固无虞。`,
      type: 'same',
    };
  } else if (cfg.generatedBy === naYinElem) {
    return {
      relation: `${naYinElem}生${mansionElem} · 逢生大吉`,
      verdict: `纳音${naYinElem}元气生发本命${mansionElem}宿，如源头活水，贵人多助，逢凶化吉。`,
      type: 'generate',
    };
  } else if (cfg.generates === naYinElem) {
    return {
      relation: `${mansionElem}生${naYinElem} · 施惠布德`,
      verdict: `本命${mansionElem}德化育纳音${naYinElem}气，能成经纬大业，利物济人，后福悠长。`,
      type: 'generate',
    };
  } else if (cfg.overcomes === naYinElem) {
    return {
      relation: `${mansionElem}克${naYinElem} · 治定经纶`,
      verdict: `本命${mansionElem}德统御纳音${naYinElem}度，主掌权谋裁断，宜戒躁进，刚柔兼济。`,
      type: 'overcome',
    };
  } else {
    return {
      relation: `${naYinElem}克${mansionElem} · 砥砺淬炼`,
      verdict: `纳音${naYinElem}气陶铸本命${mansionElem}宿，如良玉经琢磨而成重器，百炼成金。`,
      type: 'restrained',
    };
  }
}

export const MansionDetailAccordion: React.FC<MansionDetailAccordionProps> = ({
  mansion,
  lunarInfo,
  paletteId = 'cinnabar-gold',
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState<'atlas' | 'wuxing'>('atlas');

  const palette = DUNHUANG_PALETTES[paletteId] || DUNHUANG_PALETTES['cinnabar-gold'];
  const elementConfig = FIVE_ELEMENTS_CONFIG[mansion.element];
  const elementDistribution = calculateElementDistribution(
    mansion.element,
    lunarInfo.naYin,
    mansion.symbol
  );
  const harmony = analyzeElementHarmony(mansion.element, lunarInfo.naYin);

  // Determinator Star (距星) typically the first star in the list
  const determinatorStar = mansion.stars[0] || { name: `${mansion.name}宿一`, x: 0, y: 0 };

  return (
    <div
      id="mansion-detail-accordion"
      style={{
        backgroundColor: palette.bgDark,
        borderColor: palette.gold + '40',
      }}
      className="w-full border rounded-xs shadow-xl transition-all duration-300 font-serif-sc overflow-hidden mt-4"
    >
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors text-left border-b border-transparent focus:outline-none"
        style={{
          borderBottomColor: isOpen ? palette.gold + '30' : 'transparent',
        }}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3.5">
          <div
            style={{
              backgroundColor: palette.cinnabar + '25',
              borderColor: palette.gold,
              color: palette.goldBright,
            }}
            className="w-9 h-9 border rounded-xs flex items-center justify-center shadow-inner"
          >
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#E2DCC8] tracking-wider">
                本命星宿详细解读
              </h3>
              <span
                style={{
                  backgroundColor: palette.cinnabar + '20',
                  color: palette.cinnabarLight,
                  borderColor: palette.cinnabar + '40',
                }}
                className="text-[11px] px-2 py-0.5 border rounded-xs font-bold"
              >
                {mansion.fullName}
              </span>
            </div>
            <p className="text-xs text-[#E2DCC8]/60 mt-0.5">
              敦煌遗书 S.3326 司天监古图谱考释 · 五行七曜属性图表
            </p>
          </div>
        </div>

        {/* Right side summary chips & collapse icon */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] rounded-xs">
              四象：{mansion.symbol} ({mansion.animal})
            </span>
            <span
              style={{ color: elementConfig.color }}
              className="px-2 py-0.5 bg-white/5 border border-current rounded-xs font-bold"
            >
              五行：{mansion.element}德
            </span>
            <span className="px-2 py-0.5 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#E2DCC8]/80 rounded-xs">
              宿度：{mansion.degrees}°
            </span>
          </div>

          <div
            style={{ borderColor: palette.gold + '40', color: palette.goldBright }}
            className="w-8 h-8 border rounded-xs flex items-center justify-center transition-transform duration-300"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Accordion Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {/* Navigation Tabs */}
            <div className="px-6 pt-3 flex items-center gap-2 border-b border-white/5 bg-black/20">
              <button
                onClick={() => setActiveTab('atlas')}
                style={{
                  color: activeTab === 'atlas' ? palette.goldBright : '#E2DCC8',
                  borderColor: activeTab === 'atlas' ? palette.gold : 'transparent',
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 tracking-wider transition-all cursor-pointer ${
                  activeTab === 'atlas' ? 'bg-white/[0.04]' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>古代星宿图谱说明</span>
              </button>
              <button
                onClick={() => setActiveTab('wuxing')}
                style={{
                  color: activeTab === 'wuxing' ? palette.goldBright : '#E2DCC8',
                  borderColor: activeTab === 'wuxing' ? palette.gold : 'transparent',
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 tracking-wider transition-all cursor-pointer ${
                  activeTab === 'wuxing' ? 'bg-white/[0.04]' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>星曜五行属性图表</span>
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'atlas' ? (
                /* Tab 1: 古代星宿图谱说明 */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Historical Lore & Blueprint */}
                  <div className="lg:col-span-7 flex flex-col gap-5">
                    {/* S.3326 Folio Lore */}
                    <div className="p-4 bg-white/[0.02] border border-[#C5A059]/20 rounded-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-cinzel">
                          DUNHUANG S.3326 / P.2508 CANON
                        </span>
                        <span className="text-[11px] text-[#A64B3E] font-bold">
                          莫高窟藏经洞写本天象卷
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#E2DCC8] mb-2">
                        大唐司天监经纬星仪图谱规制
                      </h4>
                      <p className="text-xs text-[#E2DCC8]/80 leading-relaxed text-justify">
                        依大唐长庆年间敦煌写本《全天星图》（英国国家图书馆 Or.8210 / S.3326）与伯希和
                        P.2508 号经卷载录，二十八宿按中昏中旦之日轨均匀划分。此本命【
                        <strong className="text-[#C5A059]">{mansion.fullName}</strong>
                        】属{mansion.symbol}之位，为东方苍龙、南方朱雀、西方白虎或北方玄武的重要经纬标尺。
                      </p>
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-4 text-[11px] text-[#C5A059]">
                        <span>四象所属：{mansion.symbol}</span>
                        <span>对应属相：{mansion.animal}</span>
                        <span>周天度数：广延 {mansion.degrees} 度</span>
                        <span>绘制学派：石氏官星（朱砂点染）</span>
                      </div>
                    </div>

                    {/* Sutra Excerpt Blockquote */}
                    <div className="p-4 bg-[#151412] border-l-2 border-[#C5A059] border-y border-r border-white/5 rounded-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] tracking-widest uppercase text-[#A64B3E] font-bold">
                          敦煌写本 S.3326 原典经文记叙
                        </span>
                        <span className="text-[10px] text-[#E2DCC8]/40">李淳风《乙巳占》参互校勘</span>
                      </div>
                      <p className="font-serif-sc text-sm text-[#E2DCC8] leading-relaxed tracking-wide italic my-1">
                        “{mansion.tangText}”
                      </p>
                      <div className="mt-2 text-[11px] text-[#E2DCC8]/70 leading-relaxed">
                        <strong className="text-[#C5A059]">【太史令解颐】：</strong>
                        古人视{mansion.name}宿为天体运行节律之关钥。日落初昏或日出平旦之时，若{mansion.name}
                        宿恰入中天，则标志时令物候流转，司天监据此为天子颁朔、为边庭行旅测度吉凶。
                      </div>
                    </div>

                    {/* Temperament and Fortune Keywords */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-xs">
                        <span className="text-[10px] uppercase tracking-wider text-[#C5A059] block mb-1 font-cinzel">
                          ASTRAL ESSENCE / 气象骨相
                        </span>
                        <p className="text-xs text-[#E2DCC8] leading-relaxed font-bold">
                          {mansion.temperament}
                        </p>
                        <p className="text-[10px] text-[#E2DCC8]/50 mt-1">
                          秉唐风豪迈气韵，命格如高天星宿澄明无碍
                        </p>
                      </div>

                      <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-xs">
                        <span className="text-[10px] uppercase tracking-wider text-[#A64B3E] block mb-1 font-cinzel">
                          FORTUNE SIGNS / 吉瑞要语
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {mansion.fortuneKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-[#A64B3E]/10 border border-[#A64B3E]/30 text-[#A64B3E] text-[11px] rounded-xs font-bold"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-[#E2DCC8]/50 mt-2">
                          四柱纳音合润，行旅通达莫高福地
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mini Asterism Blueprint Visualizer */}
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="p-5 bg-[#0F0E0C] border border-[#C5A059]/30 rounded-xs flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Atmospheric circle behind */}
                      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.4px,transparent_0.4px)] [background-size:16px_16px] opacity-15" />
                      <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-[#C5A059] font-cinzel">
                        ASTERISM GEOMETRY
                      </div>
                      <div className="absolute top-3 right-3 text-[10px] text-[#A64B3E] font-bold">
                        {mansion.name}宿古构型
                      </div>

                      {/* Mini SVG of the Asterism */}
                      <div className="w-56 h-56 relative my-2 flex items-center justify-center">
                        <svg viewBox="-60 -60 120 120" className="w-full h-full overflow-visible">
                          {/* Radial coordinates guide */}
                          <circle cx="0" cy="0" r="48" fill="none" stroke="#C5A059" strokeWidth="0.6" strokeDasharray="3,3" opacity="0.3" />
                          <circle cx="0" cy="0" r="28" fill="none" stroke="#C5A059" strokeWidth="0.5" opacity="0.2" />
                          <line x1="-54" y1="0" x2="54" y2="0" stroke="#C5A059" strokeWidth="0.4" opacity="0.25" />
                          <line x1="0" y1="-54" x2="0" y2="54" stroke="#C5A059" strokeWidth="0.4" opacity="0.25" />

                          {/* Connecting lines */}
                          {mansion.connections.map(([aIdx, bIdx], idx) => {
                            const starA = mansion.stars[aIdx];
                            const starB = mansion.stars[bIdx];
                            if (!starA || !starB) return null;
                            return (
                              <line
                                key={idx}
                                x1={starA.x}
                                y1={starA.y}
                                x2={starB.x}
                                y2={starB.y}
                                stroke={palette.cinnabar}
                                strokeWidth="1.8"
                                opacity="0.85"
                              />
                            );
                          })}

                          {/* Stars */}
                          {mansion.stars.map((s, idx) => {
                            const isDeterminator = idx === 0;
                            return (
                              <g key={idx}>
                                {isDeterminator && (
                                  <circle
                                    cx={s.x}
                                    cy={s.y}
                                    r="8"
                                    fill={palette.gold}
                                    fillOpacity="0.25"
                                    className="animate-pulse"
                                  />
                                )}
                                <circle
                                  cx={s.x}
                                  cy={s.y}
                                  r={isDeterminator ? 4.5 : 3.5}
                                  fill={isDeterminator ? palette.goldBright : palette.cinnabar}
                                  stroke="#FFFFFF"
                                  strokeWidth="0.8"
                                />
                                <text
                                  x={s.x + 6}
                                  y={s.y - 4}
                                  fontSize="7"
                                  fill="#E2DCC8"
                                  className="font-serif-sc select-none"
                                >
                                  {s.name}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>

                      {/* Explanatory legend below mini chart */}
                      <div className="w-full pt-3 border-t border-white/10 text-xs flex justify-between items-center text-[#E2DCC8]/70">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] inline-block shadow-xs" />
                          <span>距星基准：{determinatorStar.name}</span>
                        </div>
                        <div>
                          <span>正星共 {mansion.starsCount} 颗</span>
                        </div>
                      </div>
                    </div>

                    {/* Mineral Pigment Match */}
                    <div className="p-4 bg-white/[0.02] border border-[#C5A059]/20 rounded-xs flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full border border-[#C5A059]/50 shadow-md shrink-0"
                        style={{ backgroundColor: palette.cinnabar }}
                      />
                      <div>
                        <span className="text-[10px] uppercase text-[#C5A059] tracking-wider block font-cinzel">
                          PIGMENT ALCHEMY / 敦煌矿彩
                        </span>
                        <h5 className="text-xs font-bold text-[#E2DCC8]">
                          {mansion.auspiciousMineral}
                        </h5>
                        <p className="text-[11px] text-[#E2DCC8]/60 mt-0.5">
                          唐代莫高窟工匠采祁连金石研磨，历经千年依然光华不褪。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Tab 2: 星曜五行属性图表 */
                <div className="flex flex-col gap-6">
                  {/* Harmony Analysis Banner */}
                  <div
                    style={{
                      borderColor: harmony.type === 'generate' || harmony.type === 'same' ? '#416B58' : '#A64B3E',
                      backgroundColor: harmony.type === 'generate' || harmony.type === 'same' ? '#416B5815' : '#A64B3E15',
                    }}
                    className="p-4 border rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          backgroundColor: elementConfig.color,
                        }}
                        className="w-10 h-10 rounded-xs flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md"
                      >
                        {mansion.element}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#E2DCC8]">
                            本命【{mansion.fullName}】五行曜理：{elementConfig.name} ({elementConfig.english})
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 bg-white/10 border border-white/20 text-[#E2DCC8] rounded-xs font-serif-sc">
                            {harmony.relation}
                          </span>
                        </div>
                        <p className="text-xs text-[#E2DCC8]/80 mt-1 leading-relaxed">
                          {harmony.verdict}
                        </p>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-white/10 sm:pl-4 shrink-0">
                      <span className="text-[10px] text-[#E2DCC8]/50 block font-cinzel">LUNAR NAYIN</span>
                      <span className="text-xs font-bold text-[#C5A059]">{lunarInfo.naYin}</span>
                    </div>
                  </div>

                  {/* Five Elements Energy Distribution Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Distribution Bars */}
                    <div className="lg:col-span-7 p-5 bg-white/[0.02] border border-[#C5A059]/20 rounded-xs flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#C5A059]" />
                          <h4 className="text-sm font-bold text-[#E2DCC8]">
                            本命五行气场量化图谱 (Elemental Distribution)
                          </h4>
                        </div>
                        <span className="text-[10px] text-[#C5A059] font-cinzel">TOTAL: 100%</span>
                      </div>

                      <div className="space-y-3.5">
                        {(['木', '火', '土', '金', '水'] as FiveElement[]).map((elem) => {
                          const cfg = FIVE_ELEMENTS_CONFIG[elem];
                          const score = elementDistribution[elem];
                          const isPrimary = elem === mansion.element;

                          return (
                            <div key={elem} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span
                                    style={{ backgroundColor: cfg.color }}
                                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                                  />
                                  <span className={`font-bold ${isPrimary ? 'text-[#C5A059]' : 'text-[#E2DCC8]'}`}>
                                    {cfg.name} · {elem}
                                  </span>
                                  {isPrimary && (
                                    <span className="text-[9px] px-1.5 py-0.2 bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059] rounded-xs">
                                      主宿值令
                                    </span>
                                  )}
                                  <span className="text-[10px] opacity-50 hidden sm:inline">
                                    ({cfg.virtue})
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 font-cinzel font-bold">
                                  <span style={{ color: isPrimary ? palette.goldBright : '#E2DCC8' }}>
                                    {score}%
                                  </span>
                                </div>
                              </div>

                              {/* Progress Track */}
                              <div className="w-full h-3 bg-black/40 rounded-xs overflow-hidden border border-white/5 relative">
                                <div
                                  style={{
                                    width: `${score}%`,
                                    backgroundColor: cfg.color,
                                  }}
                                  className="h-full rounded-xs transition-all duration-700 shadow-sm relative overflow-hidden"
                                >
                                  {/* Light reflection stripe */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <p className="text-[11px] text-[#E2DCC8]/60 mt-1 leading-relaxed italic border-t border-white/5 pt-2">
                        ※ 五行能量根据求占者农历干支纳音（{lunarInfo.naYin}）、四象经天分野（{mansion.symbol}）与二十八宿主星综合推演。
                      </p>
                    </div>

                    {/* Circular Generating/Restraining Cycle Diagram */}
                    <div className="lg:col-span-5 p-5 bg-[#0F0E0C] border border-[#C5A059]/30 rounded-xs flex flex-col items-center">
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-[10px] tracking-widest uppercase text-[#C5A059] font-cinzel">
                          WUXING CYCLE / 生克图谶
                        </span>
                        <span className="text-[10px] text-[#A64B3E] font-bold">
                          {mansion.planet}
                        </span>
                      </div>

                      {/* Pentagram SVG */}
                      <div className="w-56 h-56 relative my-2 flex items-center justify-center">
                        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                          {/* Circular Generating Rim */}
                          <circle cx="100" cy="100" r="70" fill="none" stroke="#C5A059" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />

                          {/* Outer Pentagram Star (相克之线) */}
                          {/* Coordinates for 木(0), 火(72), 土(144), 金(216), 水(288) */}
                          {/* 0 deg is top (90 - 90): (100, 30) */}
                          <polygon
                            points="100,32 165,80 140,158 60,158 35,80"
                            fill="none"
                            stroke="#C5A059"
                            strokeWidth="0.8"
                            opacity="0.25"
                          />

                          {/* Generating arrows (相生循环) */}
                          <path
                            d="M 100,32 L 140,158 L 35,80 L 165,80 L 60,158 Z"
                            fill="none"
                            stroke="#A64B3E"
                            strokeWidth="0.9"
                            strokeDasharray="3,3"
                            opacity="0.35"
                          />

                          {/* Node circles */}
                          {/* 木 (Top): 100, 32 */}
                          <g transform="translate(100, 32)">
                            <circle r={mansion.element === '木' ? 17 : 13} fill="#416B58" stroke={mansion.element === '木' ? '#C5A059' : '#FFFFFF'} strokeWidth={mansion.element === '木' ? 2 : 1} />
                            <text y="4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">木</text>
                          </g>

                          {/* 火 (Top Right): 165, 80 */}
                          <g transform="translate(165, 80)">
                            <circle r={mansion.element === '火' ? 17 : 13} fill="#A64B3E" stroke={mansion.element === '火' ? '#C5A059' : '#FFFFFF'} strokeWidth={mansion.element === '火' ? 2 : 1} />
                            <text y="4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">火</text>
                          </g>

                          {/* 土 (Bottom Right): 140, 158 */}
                          <g transform="translate(140, 158)">
                            <circle r={mansion.element === '土' ? 17 : 13} fill="#C5A059" stroke={mansion.element === '土' ? '#C5A059' : '#FFFFFF'} strokeWidth={mansion.element === '土' ? 2 : 1} />
                            <text y="4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">土</text>
                          </g>

                          {/* 金 (Bottom Left): 60, 158 */}
                          <g transform="translate(60, 158)">
                            <circle r={mansion.element === '金' ? 17 : 13} fill="#D4AF37" stroke={mansion.element === '金' ? '#C5A059' : '#FFFFFF'} strokeWidth={mansion.element === '金' ? 2 : 1} />
                            <text y="4" textAnchor="middle" fill="#0F0E0C" fontSize="11" fontWeight="bold">金</text>
                          </g>

                          {/* 水 (Top Left): 35, 80 */}
                          <g transform="translate(35, 80)">
                            <circle r={mansion.element === '水' ? 17 : 13} fill="#2B4C7E" stroke={mansion.element === '水' ? '#C5A059' : '#FFFFFF'} strokeWidth={mansion.element === '水' ? 2 : 1} />
                            <text y="4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">水</text>
                          </g>
                        </svg>
                      </div>

                      <div className="w-full pt-3 border-t border-white/10 text-xs space-y-1.5 text-[#E2DCC8]/80">
                        <div className="flex justify-between">
                          <span className="opacity-60">生我者 (逢生吉星):</span>
                          <strong className="text-[#416B58]">{elementConfig.generatedBy}德</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-60">我生者 (化育大顺):</span>
                          <strong className="text-[#A64B3E]">{elementConfig.generates}德</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-60">克我者 (戒慎戒躁):</span>
                          <strong className="text-[#D4AF37]">{elementConfig.overcomeBy}德</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seven Luminaries and Directional Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] mb-1">
                        <Sun className="w-3.5 h-3.5" />
                        <span>曜主天象与运行</span>
                      </div>
                      <p className="text-xs text-[#E2DCC8] font-bold mt-1">
                        {mansion.planet}
                      </p>
                      <p className="text-[11px] text-[#E2DCC8]/70 mt-1 leading-relaxed">
                        {elementConfig.desc}
                      </p>
                    </div>

                    <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#A64B3E] mb-1">
                        <Compass className="w-3.5 h-3.5" />
                        <span>大唐星宿分野与方位</span>
                      </div>
                      <p className="text-xs text-[#E2DCC8] font-bold mt-1">
                        {elementConfig.direction}
                      </p>
                      <p className="text-[11px] text-[#E2DCC8]/70 mt-1 leading-relaxed">
                        广延 {mansion.degrees}°，为天穹黄道赤道交替处关键枢纽。
                      </p>
                    </div>

                    <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] mb-1">
                        <Shield className="w-3.5 h-3.5" />
                        <span>司天监辟邪护身矿彩</span>
                      </div>
                      <p className="text-xs text-[#E2DCC8] font-bold mt-1">
                        {elementConfig.mineral}
                      </p>
                      <p className="text-[11px] text-[#E2DCC8]/70 mt-1 leading-relaxed">
                        日常宜着此色系衣饰或佩戴对应矿晶，调和周天阴阳之气。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
