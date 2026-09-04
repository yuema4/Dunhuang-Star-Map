import React from 'react';
import {
  PaletteId,
  FeitianId,
  CloudId,
  BaoxiangId,
  BorderId,
  StarTrailId,
  DunhuangStyleConfig,
} from '../types';

export interface DunhuangPalette {
  id: PaletteId;
  name: string;
  enName: string;
  dynasty: string;
  cave: string;
  description: string;
  mineralOrigin: string;
  bgDark: string;
  bgMedium: string;
  bgPaper: string;
  paperTexture: string;
  cinnabar: string;
  cinnabarLight: string;
  gold: string;
  goldBright: string;
  goldMuted: string;
  mineralAccent: string;
  textColor: string;
  cardBg: string;
  border: string;
}

export const DUNHUANG_PALETTES: Record<PaletteId, DunhuangPalette> = {
  'cinnabar-gold': {
    id: 'cinnabar-gold',
    name: '辰砂赤金',
    enName: 'Cinnabar & Gold Leaf',
    dynasty: '莫高窟 · 盛唐',
    cave: '第130窟 / 第172窟',
    description: '盛唐经典矿彩，天然朱砂与泥金沥粉交辉，气象雍容端严',
    mineralOrigin: '辰砂研末、库金泥粉、象牙白垩',
    bgDark: '#13110E',
    bgMedium: '#1C1914',
    bgPaper: '#DCCDB5',
    paperTexture: '#E8DCBF',
    cinnabar: '#A64B3E',
    cinnabarLight: '#C75D4E',
    gold: '#C5A059',
    goldBright: '#E8C67B',
    goldMuted: '#96743A',
    mineralAccent: '#A64B3E',
    textColor: '#2A261F',
    cardBg: 'rgba(220, 205, 181, 0.95)',
    border: '#8D4B32',
  },
  'lapis-azure': {
    id: 'lapis-azure',
    name: '石青绀蓝',
    enName: 'Lapis Lazuli Azure',
    dynasty: '莫高窟 · 初唐',
    cave: '第220窟 / 第321窟',
    description: '丝路青金石与蓝铜矿石青，湛深若大漠星河天幕',
    mineralOrigin: '阿富汗巴达赫尚青金石、石青、银箔',
    bgDark: '#0B121C',
    bgMedium: '#121C2B',
    bgPaper: '#C8D5E3',
    paperTexture: '#D5DFEA',
    cinnabar: '#3A6B9B',
    cinnabarLight: '#5587BC',
    gold: '#C5A059',
    goldBright: '#E8CD8B',
    goldMuted: '#8A703D',
    mineralAccent: '#2C5A88',
    textColor: '#142337',
    cardBg: 'rgba(200, 213, 227, 0.95)',
    border: '#2C5A88',
  },
  'malachite-spring': {
    id: 'malachite-spring',
    name: '孔雀石绿',
    enName: 'Malachite Verdant Spring',
    dynasty: '莫高窟 · 西魏 / 隋',
    cave: '第249窟 / 第305窟',
    description: '纯正孔雀石粉末石绿，西域绿洲生机与菩萨天衣翠羽',
    mineralOrigin: '孔雀石绿、氯铜矿、金银泥',
    bgDark: '#0D1612',
    bgMedium: '#15211B',
    bgPaper: '#CBD7CD',
    paperTexture: '#D7DFD9',
    cinnabar: '#366850',
    cinnabarLight: '#4D8569',
    gold: '#C5A059',
    goldBright: '#DFC076',
    goldMuted: '#8B723E',
    mineralAccent: '#265C40',
    textColor: '#14271D',
    cardBg: 'rgba(203, 215, 205, 0.95)',
    border: '#2B583F',
  },
  'orpiment-ochre': {
    id: 'orpiment-ochre',
    name: '雄黄赭石',
    enName: 'Orpiment & Sandstone Ochre',
    dynasty: '莫高窟 · 中晚唐',
    cave: '第156窟 / 第196窟',
    description: '鸣沙山月牙泉千年风蚀沉淀，雄黄与大漠熟褐赭石',
    mineralOrigin: '天然雄黄、赤铁矿赭石、胡粉',
    bgDark: '#17130F',
    bgMedium: '#221D16',
    bgPaper: '#DDD0BF',
    paperTexture: '#E8DDD0',
    cinnabar: '#A0632F',
    cinnabarLight: '#BD7D42',
    gold: '#C5A059',
    goldBright: '#E5C07A',
    goldMuted: '#8E6F38',
    mineralAccent: '#9B5B28',
    textColor: '#2B1E16',
    cardBg: 'rgba(221, 208, 191, 0.95)',
    border: '#844E24',
  },
  'obsidian-gilded': {
    id: 'obsidian-gilded',
    name: '泥金玄曜',
    enName: 'Gilded Obsidian Manuscript',
    dynasty: '莫高窟 · 藏经洞S.3326',
    cave: '第17窟 藏经洞密卷',
    description: '敦煌藏经洞星图原卷玄墨基底，大唐司天监泥金规矩同心环',
    mineralOrigin: '古法松烟墨、泥金水、朱砂',
    bgDark: '#0D0D0C',
    bgMedium: '#171614',
    bgPaper: '#D5C7B0',
    paperTexture: '#DFD3BF',
    cinnabar: '#A64B3E',
    cinnabarLight: '#C35F50',
    gold: '#D4AF37',
    goldBright: '#F3CF65',
    goldMuted: '#9F7C20',
    mineralAccent: '#B8860B',
    textColor: '#1E1D1B',
    cardBg: 'rgba(213, 199, 176, 0.95)',
    border: '#705721',
  },
};

export interface MotifItem<T> {
  id: T;
  name: string;
  dynasty: string;
  cave?: string;
  description: string;
}

export const FEITIAN_LIST: MotifItem<FeitianId>[] = [
  {
    id: 'feitian-pipa',
    name: '反弹琵琶飞天',
    dynasty: '中唐',
    cave: '莫高窟第112窟',
    description: '身姿反折如满月，天衣飞扬绕体，双手反抱琵琶凌空弹拨，为敦煌艺术巅峰绝韵',
  },
  {
    id: 'feitian-scatter',
    name: '散花天女飞天',
    dynasty: '盛唐',
    cave: '莫高窟第320窟',
    description: '双髻华冠，漫天芬芳，舒展长臂挥撒优昙宝华，丝带飘摇轻拂二十八宿天穹',
  },
  {
    id: 'feitian-soaring',
    name: '乘风凌虚飞天',
    dynasty: '西魏',
    cave: '莫高窟第249窟',
    description: '身形修长如虹，乘西域天风凌虚翱翔，衣带连绵如星轨牵引斗柄',
  },
  {
    id: 'feitian-none',
    name: '简雅纯粹 (无飞天)',
    dynasty: '唐司天监',
    description: '屏退具象飞天身姿，专注大唐藏经洞S.3326原始纯粹经纬星仪与度数同心环',
  },
];

export const CLOUD_LIST: MotifItem<CloudId>[] = [
  {
    id: 'cloud-ruyi',
    name: '盛唐如意卷云',
    dynasty: '盛唐',
    cave: '莫高窟第172窟',
    description: '双回旋如意云头，尾羽飘逸连绵，层染矿物朱金，显现唐代盛世祥和之瑞气',
  },
  {
    id: 'cloud-flowing',
    name: '飘逸天宇流云',
    dynasty: '初唐',
    cave: '莫高窟第220窟',
    description: '如天河奔涌的狭长飘拂云气，宛若轻纱织锦，与星宿运行轨道相互萦绕',
  },
  {
    id: 'cloud-lingzhi',
    name: '灵芝宝相祥霞',
    dynasty: '隋唐',
    cave: '莫高窟第305窟',
    description: '三段式灵芝云头层层托衬，寓意延年长寿、仙山琼阁与本命吉曜临门',
  },
  {
    id: 'cloud-minimal',
    name: '简雅微云',
    dynasty: '晚唐',
    description: '凝练微小的古法水墨写意云气，宁静含蓄，烘托星宿本体',
  },
];

export const BAOXIANG_LIST: MotifItem<BaoxiangId>[] = [
  {
    id: 'baoxiang-lotus',
    name: '盛唐重瓣宝相莲花',
    dynasty: '盛唐',
    cave: '莫高窟第329窟藻井',
    description: '八瓣舒展，莲瓣中重叠如意纹、石榴纹与宝珠，敦煌藻井万花之冠',
  },
  {
    id: 'baoxiang-arabesque',
    name: '忍冬蔓草宝相花',
    dynasty: '北周 / 隋',
    cave: '莫高窟第205窟',
    description: '忍冬叶与宝相花瓣缠绕循环，生生不息，古朴流转，蕴含西域流丽风韵',
  },
  {
    id: 'baoxiang-beaded',
    name: '联珠重光宝相花',
    dynasty: '隋代',
    cave: '莫高窟第407窟三兔外周',
    description: '波斯联珠纹环绕中心重光宝相花，东西方文明在敦煌交汇融合的璀璨结晶',
  },
];

export const BORDER_LIST: MotifItem<BorderId>[] = [
  {
    id: 'border-pearl-vine',
    name: '莫高窟联珠忍冬卷草',
    dynasty: '隋唐经典',
    description: '外框连缀圆润宝石连珠，内嵌波状连绵忍冬蔓草，四角镶嵌藻井角花',
  },
  {
    id: 'border-meander',
    name: '盛唐回字雷纹边框',
    dynasty: '盛唐',
    description: '源于殷商青铜、盛于大唐经卷的金线连续回字雷纹，规矩庄严，百代流传',
  },
  {
    id: 'border-classical',
    name: '简雅双重沥粉金边',
    dynasty: '藏经洞写本',
    description: '唐代经卷规范双层泥金朱砂勾边，内敛沉静，凸显手卷正文书法与星曜',
  },
];

export const TRAIL_LIST: MotifItem<StarTrailId>[] = [
  {
    id: 'trails-lotus',
    name: '莲瓣度数星轨',
    dynasty: '唐宋星图',
    description: '赤道天轮与二十八宿分度环饰以敦煌微型莲瓣刻度，如法相天轮旋转',
  },
  {
    id: 'trails-ribbon',
    name: '飞天流光星轨',
    dynasty: '敦煌壁画意象',
    description: '星宿行度轨道如飞天天衣金带般流光溢彩，将二十八宿连缀成天宇金桥',
  },
  {
    id: 'trails-celestial',
    name: '司天监古法经纬环',
    dynasty: '藏经洞S.3326',
    description: '复刻大唐司天监推步赤道度数、恒显圈与内规外规同心环，严谨考究',
  },
];

export const DEFAULT_STYLE_CONFIG: DunhuangStyleConfig = {
  paletteId: 'cinnabar-gold',
  feitianId: 'feitian-pipa',
  cloudId: 'cloud-ruyi',
  baoxiangId: 'baoxiang-lotus',
  borderId: 'border-pearl-vine',
  trailId: 'trails-lotus',
};

// SVG Paths and Rendering Utilities
export const DunhuangSvgAssets = {
  /**
   * Baoxianghua Rosette Motif (Centered at 0,0)
   */
  renderBaoxianghua: (
    type: BaoxiangId,
    size: number,
    palette: DunhuangPalette,
    opacity = 1
  ) => {
    const r = size / 2;
    const gold = palette.gold;
    const cinnabar = palette.cinnabar;
    const bright = palette.goldBright;

    if (type === 'baoxiang-arabesque') {
      // Honeysuckle vine arabesque baoxiang
      return (
        <g opacity={opacity} className="baoxiang-flower">
          {/* Outer vine ring */}
          <circle cx={0} cy={0} r={r * 0.9} fill="none" stroke={gold} strokeWidth="1.2" strokeDasharray="4 2" />
          <circle cx={0} cy={0} r={r * 0.72} fill="none" stroke={cinnabar} strokeWidth="0.8" opacity="0.6" />

          {/* 6 arabesque scrolling petals */}
          {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
            <g key={idx} transform={`rotate(${angle})`}>
              <path
                d={`M 0,0 C ${r * 0.2},-${r * 0.1} ${r * 0.4},-${r * 0.4} ${r * 0.7},-${r * 0.2}
                    C ${r * 0.8},0 ${r * 0.6},${r * 0.3} 0,0`}
                fill={idx % 2 === 0 ? cinnabar : gold}
                fillOpacity="0.18"
                stroke={gold}
                strokeWidth="1.2"
              />
              <path
                d={`M ${r * 0.3},-${r * 0.15} C ${r * 0.5},-${r * 0.3} ${r * 0.65},-${r * 0.1} ${r * 0.55},0`}
                fill="none"
                stroke={bright}
                strokeWidth="0.9"
              />
            </g>
          ))}

          {/* Central Stamen */}
          <circle cx={0} cy={0} r={r * 0.22} fill={cinnabar} fillOpacity="0.3" stroke={gold} strokeWidth="1.5" />
          <circle cx={0} cy={0} r={r * 0.1} fill={bright} />
        </g>
      );
    }

    if (type === 'baoxiang-beaded') {
      // Continuous pearl baoxiang roundel
      const pearlCount = 24;
      const pearlRadius = r * 0.85;
      return (
        <g opacity={opacity} className="baoxiang-flower">
          <circle cx={0} cy={0} r={r * 0.92} fill="none" stroke={cinnabar} strokeWidth="1" opacity="0.5" />
          <circle cx={0} cy={0} r={r * 0.78} fill="none" stroke={gold} strokeWidth="1" />

          {/* Pearls circle */}
          {Array.from({ length: pearlCount }).map((_, i) => {
            const rad = (i * 2 * Math.PI) / pearlCount;
            const px = pearlRadius * Math.cos(rad);
            const py = pearlRadius * Math.sin(rad);
            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r={size * 0.018}
                fill={gold}
                stroke={cinnabar}
                strokeWidth="0.5"
              />
            );
          })}

          {/* 8-Petal radiating lotus */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <g key={idx} transform={`rotate(${angle})`}>
              <path
                d={`M 0,0 Q ${r * 0.25},-${r * 0.25} ${r * 0.65},0 Q ${r * 0.25},${r * 0.25} 0,0`}
                fill={cinnabar}
                fillOpacity="0.22"
                stroke={gold}
                strokeWidth="1.2"
              />
              <circle cx={r * 0.45} cy={0} r={r * 0.05} fill={bright} />
            </g>
          ))}

          <circle cx={0} cy={0} r={r * 0.2} fill={gold} fillOpacity="0.4" stroke={bright} strokeWidth="1.5" />
          <circle cx={0} cy={0} r={r * 0.08} fill={palette.textColor} />
        </g>
      );
    }

    // Default: 盛唐第329窟重瓣宝相莲花 (baoxiang-lotus)
    return (
      <g opacity={opacity} className="baoxiang-flower">
        {/* Halo outer rings */}
        <circle cx={0} cy={0} r={r * 0.94} fill="none" stroke={gold} strokeWidth="1.2" />
        <circle cx={0} cy={0} r={r * 0.88} fill="none" stroke={cinnabar} strokeWidth="0.8" opacity="0.6" strokeDasharray="3 3" />

        {/* 8 outer pointed petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
          <g key={`outer-${idx}`} transform={`rotate(${angle})`}>
            <path
              d={`M 0,0 C ${r * 0.3},-${r * 0.2} ${r * 0.6},-${r * 0.25} ${r * 0.86},0 C ${r * 0.6},${r * 0.25} ${r * 0.3},${r * 0.2} 0,0`}
              fill={idx % 2 === 0 ? cinnabar : gold}
              fillOpacity="0.2"
              stroke={gold}
              strokeWidth="1.2"
            />
            {/* Inner diamond heart */}
            <path
              d={`M ${r * 0.4},0 L ${r * 0.6},-${r * 0.1} L ${r * 0.75},0 L ${r * 0.6},${r * 0.1} Z`}
              fill={bright}
              fillOpacity="0.7"
            />
          </g>
        ))}

        {/* 8 inner offset petals */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, idx) => (
          <g key={`inner-${idx}`} transform={`rotate(${angle})`}>
            <path
              d={`M 0,0 Q ${r * 0.2},-${r * 0.15} ${r * 0.55},0 Q ${r * 0.2},${r * 0.15} 0,0`}
              fill={cinnabar}
              fillOpacity="0.3"
              stroke={bright}
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Central Core Medallion */}
        <circle cx={0} cy={0} r={r * 0.26} fill={gold} fillOpacity="0.3" stroke={gold} strokeWidth="1.5" />
        <circle cx={0} cy={0} r={r * 0.18} fill={cinnabar} fillOpacity="0.5" stroke={bright} strokeWidth="1" />
        <circle cx={0} cy={0} r={r * 0.08} fill={bright} />
      </g>
    );
  },

  /**
   * Feitian Motif (Flying Apsaras)
   */
  renderFeitian: (
    type: FeitianId,
    width: number,
    height: number,
    palette: DunhuangPalette,
    opacity = 0.85
  ) => {
    if (type === 'feitian-none') return null;

    const gold = palette.gold;
    const bright = palette.goldBright;
    const cinnabar = palette.cinnabar;

    if (type === 'feitian-pipa') {
      // 莫高窟第112窟 反弹琵琶 (Inverted Pipa Dancer in dynamic arched flight)
      return (
        <g opacity={opacity} className="feitian-motif">
          {/* Swirling celestial silk scarves (天衣飞带) */}
          <path
            d="M 10,75 C 35,40 60,15 110,22 C 160,28 175,85 140,110 C 110,132 50,115 35,80 C 25,55 50,30 90,32"
            fill="none"
            stroke={gold}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 18,78 C 40,46 62,24 108,28 C 152,32 165,80 135,102 C 110,122 60,108 45,78"
            fill="none"
            stroke={cinnabar}
            strokeWidth="1.2"
            opacity="0.8"
          />
          <path
            d="M 130,95 C 160,115 190,125 210,110 C 225,98 215,75 185,65 C 150,55 130,45 115,35"
            fill="none"
            stroke={bright}
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Arched body silhouette (轻盈仰身背屈躯干) */}
          <path
            d="M 85,62 C 90,52 105,48 118,54 C 128,60 125,75 115,82 C 105,88 95,95 88,108 C 82,118 70,128 62,122 C 55,116 65,102 75,90 Z"
            fill={cinnabar}
            fillOpacity="0.35"
            stroke={gold}
            strokeWidth="1.6"
          />

          {/* Extended arm & mudra hand */}
          <path
            d="M 115,55 C 130,45 145,42 162,48 C 166,50 162,54 155,54 C 142,52 128,58 118,62"
            fill="none"
            stroke={gold}
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Hair chignon with golden ornaments (高髻花冠) */}
          <ellipse cx="124" cy="52" rx="6" ry="8" fill={palette.bgDark} stroke={gold} strokeWidth="1" />
          <circle cx="128" cy="46" r="3" fill={bright} />
          <path d="M 120,50 Q 110,42 105,46" fill="none" stroke={gold} strokeWidth="1" />

          {/* Reverse Pipa (反抱曲颈琵琶) */}
          <g transform="translate(92, 58) rotate(-42)">
            {/* Pipa teardrop body */}
            <path
              d="M 0,0 C -12,8 -16,28 0,38 C 16,28 12,8 0,0 Z"
              fill={gold}
              fillOpacity="0.4"
              stroke={bright}
              strokeWidth="1.4"
            />
            {/* Pipa neck & bent pegbox */}
            <line x1="0" y1="0" x2="0" y2="-20" stroke={bright} strokeWidth="1.8" />
            <line x1="-3" y1="-20" x2="3" y2="-20" stroke={gold} strokeWidth="2" />
            <path d="M 0,-20 Q -4,-28 -8,-24" fill="none" stroke={bright} strokeWidth="1.2" />
            {/* Pipa frets & strings */}
            <line x1="-1" y1="-16" x2="-1" y2="30" stroke={cinnabar} strokeWidth="0.8" />
            <line x1="1" y1="-16" x2="1" y2="30" stroke={cinnabar} strokeWidth="0.8" />
            {/* Soundhole crescent */}
            <path d="M -4,16 Q 0,20 4,16" fill="none" stroke={palette.bgDark} strokeWidth="1" />
          </g>

          {/* Lotus petals drifting from the flying ribbons */}
          <path d="M 40,25 Q 46,18 48,26 Q 44,32 40,25 Z" fill={cinnabar} stroke={gold} strokeWidth="0.8" />
          <path d="M 180,35 Q 188,30 190,38 Q 183,42 180,35 Z" fill={bright} stroke={cinnabar} strokeWidth="0.8" />
          <path d="M 195,120 Q 202,112 205,122 Q 198,128 195,120 Z" fill={gold} stroke={bright} strokeWidth="0.8" />
        </g>
      );
    }

    if (type === 'feitian-scatter') {
      // 莫高窟第320窟 散花天女 (Scattering Petals Feitian)
      return (
        <g opacity={opacity} className="feitian-motif">
          {/* Billowing drapery and cloud streamers */}
          <path
            d="M 5,90 C 40,75 70,60 110,68 C 150,75 160,110 135,125 C 105,140 50,115 65,90 C 80,65 130,45 180,52"
            fill="none"
            stroke={gold}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M 15,96 C 45,82 72,70 108,76 C 142,82 148,110 128,120"
            fill="none"
            stroke={cinnabar}
            strokeWidth="1.2"
            opacity="0.8"
          />

          {/* Graceful reclining torso */}
          <path
            d="M 70,75 C 80,65 98,62 112,68 C 122,74 120,86 110,94 C 95,104 80,115 68,112 C 60,110 58,95 70,75 Z"
            fill={cinnabar}
            fillOpacity="0.3"
            stroke={gold}
            strokeWidth="1.4"
          />

          {/* Left scattering arm */}
          <path
            d="M 105,70 C 120,55 138,45 152,48 C 158,50 152,56 142,58 C 130,62 118,68 110,75"
            fill="none"
            stroke={gold}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Right arm offering lotus dish */}
          <path
            d="M 85,78 C 95,85 110,90 125,86 C 132,84 135,80 132,76"
            fill="none"
            stroke={bright}
            strokeWidth="1.4"
          />
          <ellipse cx="134" cy="76" rx="8" ry="3" fill={gold} stroke={bright} strokeWidth="1" />

          {/* Delicate face & high bun */}
          <circle cx="108" cy="62" r="6" fill={palette.bgPaper} stroke={gold} strokeWidth="1" />
          <ellipse cx="105" cy="56" rx="4" ry="5" fill={palette.bgDark} stroke={gold} strokeWidth="0.8" />
          <path d="M 102,52 Q 95,46 92,50" fill="none" stroke={gold} strokeWidth="1" />

          {/* Shower of lotus blossoms and cosmic stars */}
          {[
            { x: 155, y: 38, s: 0.9 },
            { x: 168, y: 52, s: 1.1 },
            { x: 145, y: 30, s: 0.7 },
            { x: 180, y: 42, s: 0.8 },
            { x: 195, y: 60, s: 1.0 },
            { x: 160, y: 68, s: 0.6 },
          ].map((pt, i) => (
            <g key={i} transform={`translate(${pt.x}, ${pt.y}) scale(${pt.s})`}>
              <path
                d="M 0,-6 C 4,-2 6,2 0,6 C -6,2 -4,-2 0,-6 Z"
                fill={i % 2 === 0 ? cinnabar : gold}
                stroke={bright}
                strokeWidth="0.6"
              />
              <circle cx="0" cy="0" r="1.2" fill={bright} />
            </g>
          ))}
        </g>
      );
    }

    // Default: 莫高窟第249窟 乘风凌虚 (Soaring Streamlined Feitian)
    return (
      <g opacity={opacity} className="feitian-motif">
        {/* Streamlined speed ribbon trails */}
        <path
          d="M 5,60 C 45,45 90,40 130,55 C 170,70 190,95 215,85"
          fill="none"
          stroke={gold}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 15,68 C 50,55 92,50 128,62 C 165,75 182,96 205,90"
          fill="none"
          stroke={cinnabar}
          strokeWidth="1.4"
          opacity="0.8"
        />
        <path
          d="M 35,80 C 70,70 110,65 145,78 C 175,88 195,110 220,105"
          fill="none"
          stroke={bright}
          strokeWidth="1.2"
        />

        {/* Dynamic soaring pose with forward reach */}
        <path
          d="M 75,56 C 88,52 108,52 125,58 C 138,64 135,74 122,78 C 105,82 85,85 70,82 C 60,80 62,65 75,56 Z"
          fill={cinnabar}
          fillOpacity="0.32"
          stroke={gold}
          strokeWidth="1.4"
        />

        {/* Forward hands holding celestial lantern/incense flame */}
        <path
          d="M 122,58 C 140,54 158,50 175,54 C 180,56 178,60 170,62 C 155,64 140,68 128,70"
          fill="none"
          stroke={gold}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Sacred Flame / Jewel */}
        <ellipse cx="178" cy="52" rx="4" ry="6" fill={bright} stroke={cinnabar} strokeWidth="1" />
        <circle cx="178" cy="52" r="1.5" fill={palette.bgDark} />

        {/* Slender head in profile */}
        <ellipse cx="118" cy="52" rx="5" ry="6" fill={palette.bgPaper} stroke={gold} strokeWidth="1" />
        <path d="M 112,48 Q 100,42 96,48" fill="none" stroke={gold} strokeWidth="1.4" />
      </g>
    );
  },

  /**
   * Dunhuang Xiangyun Clouds Motif
   */
  renderXiangyun: (
    type: CloudId,
    width: number,
    height: number,
    palette: DunhuangPalette,
    opacity = 0.8
  ) => {
    const gold = palette.gold;
    const bright = palette.goldBright;
    const cinnabar = palette.cinnabar;

    if (type === 'cloud-flowing') {
      // 飘逸流云 (Flowing streamlined ribbon clouds)
      return (
        <g opacity={opacity} className="dunhuang-cloud">
          <path
            d="M 5,25 C 25,12 50,15 70,22 C 90,30 115,28 135,18 C 150,10 170,12 190,20 C 170,26 150,22 130,28 C 105,38 75,34 50,26 C 30,20 15,22 5,25 Z"
            fill={gold}
            fillOpacity="0.25"
            stroke={gold}
            strokeWidth="1.2"
          />
          <path
            d="M 30,22 C 55,18 80,24 105,20 C 130,16 155,22 175,18"
            fill="none"
            stroke={cinnabar}
            strokeWidth="1"
            opacity="0.8"
          />
          {/* Subtle spiral hook at head */}
          <path
            d="M 185,20 C 192,23 194,28 190,31 C 185,34 178,30 180,25"
            fill="none"
            stroke={bright}
            strokeWidth="1.2"
          />
        </g>
      );
    }

    if (type === 'cloud-lingzhi') {
      // 灵芝宝相祥霞 (Three-tier auspicious lingzhi clouds)
      return (
        <g opacity={opacity} className="dunhuang-cloud">
          {/* Base cloud lobe */}
          <path
            d="M 20,40 C 10,40 5,30 15,22 C 22,15 35,18 42,25 C 50,12 70,12 78,24 C 88,14 105,18 108,30 C 115,25 125,28 126,38 C 128,48 115,50 100,48 C 80,52 40,50 20,40 Z"
            fill={cinnabar}
            fillOpacity="0.25"
            stroke={gold}
            strokeWidth="1.4"
          />
          {/* Inner swirling outlines */}
          <path
            d="M 28,34 C 20,32 18,26 24,24 C 30,22 35,28 40,30"
            fill="none"
            stroke={bright}
            strokeWidth="1"
          />
          <path
            d="M 55,24 C 58,18 68,18 72,22 C 76,26 72,32 66,32"
            fill="none"
            stroke={bright}
            strokeWidth="1"
          />
          <path
            d="M 88,26 C 94,22 102,24 103,30"
            fill="none"
            stroke={bright}
            strokeWidth="1"
          />
          {/* Flowing tail ribbons */}
          <path
            d="M 124,36 C 145,38 165,46 185,42 C 165,48 140,46 118,44"
            fill="none"
            stroke={gold}
            strokeWidth="1.4"
          />
        </g>
      );
    }

    if (type === 'cloud-minimal') {
      // 简雅微云 (Subtle elegant line cloud)
      return (
        <g opacity={opacity * 0.7} className="dunhuang-cloud">
          <path
            d="M 10,20 C 25,12 45,14 55,22 C 65,14 85,16 95,24 C 115,22 135,26 150,20"
            fill="none"
            stroke={gold}
            strokeWidth="1.2"
          />
          <circle cx="55" cy="22" r="1.5" fill={bright} />
          <circle cx="95" cy="24" r="1.5" fill={cinnabar} />
        </g>
      );
    }

    // Default: 盛唐如意卷云 (cloud-ruyi)
    return (
      <g opacity={opacity} className="dunhuang-cloud">
        {/* Double spiral Ruyi cloud head */}
        <path
          d="M 15,35 C 5,30 2,18 14,10 C 28,2 42,12 48,22 C 55,8 75,6 85,18 C 98,6 118,10 120,26 C 135,16 152,22 152,36 C 152,48 135,52 115,46 C 90,52 40,54 15,35 Z"
          fill={cinnabar}
          fillOpacity="0.22"
          stroke={gold}
          strokeWidth="1.5"
        />
        {/* Gold fill inner highlights */}
        <path
          d="M 22,28 C 14,24 12,16 20,12 C 28,8 36,15 42,22"
          fill="none"
          stroke={bright}
          strokeWidth="1.2"
        />
        <path
          d="M 60,18 C 65,12 75,12 80,18 C 84,24 78,30 70,28"
          fill="none"
          stroke={bright}
          strokeWidth="1.2"
        />
        <path
          d="M 98,16 C 108,12 116,16 116,24 C 116,30 110,34 102,32"
          fill="none"
          stroke={bright}
          strokeWidth="1.2"
        />
        {/* Elegant undulating tail */}
        <path
          d="M 148,34 C 170,32 195,42 220,36 C 198,44 172,42 145,44"
          fill="none"
          stroke={gold}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M 160,38 C 180,36 198,44 212,40"
          fill="none"
          stroke={cinnabar}
          strokeWidth="1"
          opacity="0.8"
        />
      </g>
    );
  },

  /**
   * Corner Caisson Bracket Ornaments (藻井悬鱼角花)
   */
  renderCornerBracket: (
    corner: 'tl' | 'tr' | 'bl' | 'br',
    size: number,
    palette: DunhuangPalette
  ) => {
    const gold = palette.gold;
    const bright = palette.goldBright;
    const cinnabar = palette.cinnabar;

    const transformMap = {
      tl: 'rotate(0)',
      tr: 'scale(-1, 1)',
      bl: 'scale(1, -1)',
      br: 'scale(-1, -1)',
    };

    return (
      <g transform={transformMap[corner]} className="caisson-corner">
        {/* Main corner bracket triangle */}
        <path
          d={`M 0,0 L ${size},0 C ${size * 0.7},${size * 0.15} ${size * 0.45},${size * 0.45} ${size * 0.15},${size * 0.7} L 0,${size} Z`}
          fill={cinnabar}
          fillOpacity="0.28"
          stroke={gold}
          strokeWidth="1.5"
        />
        {/* Internal honeysuckle / cloud loop */}
        <path
          d={`M 0,0 L ${size * 0.65},0 Q ${size * 0.3},${size * 0.3} 0,${size * 0.65} Z`}
          fill={gold}
          fillOpacity="0.25"
          stroke={bright}
          strokeWidth="1"
        />
        {/* Corner pearl jewel */}
        <circle cx={size * 0.22} cy={size * 0.22} r={size * 0.07} fill={bright} stroke={cinnabar} strokeWidth="1" />
        <circle cx={size * 0.22} cy={size * 0.22} r={size * 0.025} fill={palette.textColor} />
        {/* Fillet lines */}
        <line x1={size * 0.85} y1="0" x2={size * 0.85} y2={size * 0.1} stroke={gold} strokeWidth="1.2" />
        <line x1="0" y1={size * 0.85} x2={size * 0.1} y2={size * 0.85} stroke={gold} strokeWidth="1.2" />
      </g>
    );
  },

  /**
   * Border Pattern Renderer for Scroll / Chart
   */
  renderBorderDef: (type: BorderId, palette: DunhuangPalette) => {
    const gold = palette.gold;
    const cinnabar = palette.cinnabar;
    const bright = palette.goldBright;

    return (
      <pattern
        id={`dunhuang-border-${type}`}
        width={type === 'border-pearl-vine' ? 32 : 24}
        height={16}
        patternUnits="userSpaceOnUse"
      >
        {type === 'border-pearl-vine' && (
          <g>
            {/* Pearl line */}
            <circle cx="8" cy="8" r="3" fill={gold} stroke={cinnabar} strokeWidth="0.8" />
            <circle cx="24" cy="8" r="3" fill={bright} stroke={gold} strokeWidth="0.8" />
            {/* Vine wavy scroll */}
            <path
              d="M 0,8 Q 8,2 16,8 T 32,8"
              fill="none"
              stroke={cinnabar}
              strokeWidth="0.9"
            />
          </g>
        )}
        {type === 'border-meander' && (
          <g>
            {/* Greek key / Thunder meander */}
            <path
              d="M 0,12 L 8,12 L 8,4 L 16,4 L 16,12 L 24,12"
              fill="none"
              stroke={gold}
              strokeWidth="1.4"
            />
          </g>
        )}
        {type === 'border-classical' && (
          <g>
            {/* Dual gold and cinnabar pin-stripes */}
            <line x1="0" y1="5" x2="24" y2="5" stroke={gold} strokeWidth="1.5" />
            <line x1="0" y1="11" x2="24" y2="11" stroke={cinnabar} strokeWidth="1" />
          </g>
        )}
      </pattern>
    );
  },
};
