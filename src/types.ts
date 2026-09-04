/**
 * Types for Dunhuang Star Chart (S.3326) Personal Atlas Generator
 */

export type CelestialSymbol = '东方苍龙' | '北方玄武' | '西方白虎' | '南方朱雀';

export type FiveElement = '金' | '木' | '水' | '火' | '土';

export interface StarPoint {
  id: string;
  name: string;
  pinyin?: string;
  ra: number; // Right Ascension or angle in degrees (0 - 360)
  dec: number; // Declination (-90 to +90) or radial distance
  mag: number; // Brightness magnitude
  school: 'shi' | 'gan' | 'wu'; // Shi Shen (red), Gan De (black), Wu Xian (yellow/gold)
  constellation: string;
  enclosure?: '紫微垣' | '太微垣' | '天市垣' | '二十八宿';
  description?: string;
}

export interface ConstellationLine {
  from: string;
  to: string;
  school?: 'shi' | 'gan' | 'wu';
}

export interface Mansion28 {
  name: string; // e.g. "角", "亢", "房", "心"
  fullName: string; // e.g. "角木蛟", "心月狐"
  symbol: CelestialSymbol;
  animal: string; // 蛟, 龙, 狐, 兔, etc.
  element: FiveElement;
  planet: string; // 木, 金, 土, 日, 月, 火, 水
  degrees: number; // Mansion width in traditional Chinese degrees
  startAngle: number; // 0-360 mapped angle
  starsCount: number;
  tangText: string; // S.3326 text excerpt: "初昏...旦..."
  temperament: string; // Soul essence / character omen
  fortuneKeywords: string[];
  auspiciousMineral: string; // Mineral pigment: 朱砂, 石青, 孔雀绿, 雄黄
  stars: { name: string; x: number; y: number; mag: number }[];
  connections: [number, number][];
}

export interface LunarDateInfo {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
  cyclicalYear: string; // e.g. 甲子
  cyclicalMonth: string; // e.g. 丙寅
  cyclicalDay: string; // e.g. 戊辰
  zodiac: string; // 鼠, 牛, 虎, etc.
  solarTerm: string; // 节气
  naYin: string; // 纳音五行 (e.g. 海中金, 炉中火)
  shichen?: string; // 时辰
}

export interface StarOracleResult {
  poemTitle: string;
  tangPoem: string;
  imperialTitle: string;
  omenReading: string;
  auspiciousColor: string;
  talismanAdvice: string;
  isAiGenerated?: boolean;
}

export type PaletteId = 'cinnabar-gold' | 'lapis-azure' | 'malachite-spring' | 'orpiment-ochre' | 'obsidian-gilded';
export type FeitianId = 'feitian-pipa' | 'feitian-scatter' | 'feitian-soaring' | 'feitian-none';
export type CloudId = 'cloud-ruyi' | 'cloud-flowing' | 'cloud-lingzhi' | 'cloud-minimal';
export type BaoxiangId = 'baoxiang-lotus' | 'baoxiang-arabesque' | 'baoxiang-beaded';
export type BorderId = 'border-pearl-vine' | 'border-meander' | 'border-classical';
export type StarTrailId = 'trails-lotus' | 'trails-ribbon' | 'trails-celestial';

export interface DunhuangStyleConfig {
  paletteId: PaletteId;
  feitianId: FeitianId;
  cloudId: CloudId;
  baoxiangId: BaoxiangId;
  borderId: BorderId;
  trailId: StarTrailId;
}

export interface UserAstralProfile {
  name: string;
  solarDate: string; // YYYY-MM-DD
  birthHour?: string;
  lunarInfo: LunarDateInfo;
  mansion: Mansion28;
  natalStarName: string;
  natalStarTitle: string;
  oracle: StarOracleResult;
  generatedAt: string;
  styleConfig?: DunhuangStyleConfig;
}
