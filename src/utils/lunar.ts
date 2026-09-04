/**
 * Lunar & Stems-and-Branches (干支) calculation for Dunhuang Star Chart
 */
import { LunarDateInfo } from '../types';

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

const SOLAR_TERMS = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
];

const NA_YIN: Record<string, string> = {
  '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水', '甲午': '沙中金', '乙未': '沙中金',
  '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
};

const SHICHEN_MAP: Record<string, string> = {
  '23-1': '子时 (夜半)',
  '1-3': '丑时 (鸡鸣)',
  '3-5': '寅时 (平旦)',
  '5-7': '卯时 (日出)',
  '7-9': '辰时 (食时)',
  '9-11': '巳时 (隅中)',
  '11-13': '午时 (日中)',
  '13-15': '未时 (日昳)',
  '15-17': '申时 (晡时)',
  '17-19': '酉时 (日入)',
  '19-21': '戌时 (黄昏)',
  '21-23': '亥时 (人定)'
};

/**
 * Approximate calculation of Lunar date & Ganzhi from Gregorian date
 */
export function calculateLunarInfo(dateStr: string, hour = 12): LunarDateInfo {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d, hour);

  // Year Gan-Zhi
  // 1984 is 甲子 (0, 0)
  const offsetYear = (y - 1984) % 60;
  const yearIdx = offsetYear >= 0 ? offsetYear : offsetYear + 60;
  const stemYear = HEAVENLY_STEMS[yearIdx % 10];
  const branchYear = EARTHLY_BRANCHES[yearIdx % 12];
  const cyclicalYear = `${stemYear}${branchYear}`;
  const zodiac = ZODIAC_ANIMALS[yearIdx % 12];

  // Month Gan-Zhi
  // Formula based on Heavenly Stem of Year
  const yearStemIdx = yearIdx % 10;
  const monthStemBase = (yearStemIdx % 5) * 2 + 2; // Jia/Ji -> Bing
  const monthStemIdx = (monthStemBase + (m - 1)) % 10;
  const monthBranchIdx = (m + 1) % 12; // 1月 is 寅 (2)
  const cyclicalMonth = `${HEAVENLY_STEMS[monthStemIdx]}${EARTHLY_BRANCHES[monthBranchIdx]}`;

  // Day Gan-Zhi
  // Standard astronomical formula using Julian Day Number
  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;
  const jdn = d + Math.floor((153 * mo + 2) / 5) + 365 * yr + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
  
  // 11 is offset for stems/branches
  const dayIdx = (jdn + 49) % 60;
  const stemDay = HEAVENLY_STEMS[dayIdx % 10];
  const branchDay = EARTHLY_BRANCHES[dayIdx % 12];
  const cyclicalDay = `${stemDay}${branchDay}`;

  // Solar Term estimate (approximate)
  const dayOfYear = Math.floor((date.getTime() - new Date(y, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const termIdx = Math.floor((dayOfYear / 365.25) * 24) % 24;
  const solarTerm = SOLAR_TERMS[termIdx];

  // Na-Yin five element
  const naYin = NA_YIN[cyclicalYear] || '天上火';

  // Chinese Shichen string
  let shichenStr = '午时 (日中)';
  if (hour >= 23 || hour < 1) shichenStr = SHICHEN_MAP['23-1'];
  else if (hour < 3) shichenStr = SHICHEN_MAP['1-3'];
  else if (hour < 5) shichenStr = SHICHEN_MAP['3-5'];
  else if (hour < 7) shichenStr = SHICHEN_MAP['5-7'];
  else if (hour < 9) shichenStr = SHICHEN_MAP['7-9'];
  else if (hour < 11) shichenStr = SHICHEN_MAP['9-11'];
  else if (hour < 13) shichenStr = SHICHEN_MAP['11-13'];
  else if (hour < 15) shichenStr = SHICHEN_MAP['13-15'];
  else if (hour < 17) shichenStr = SHICHEN_MAP['15-17'];
  else if (hour < 19) shichenStr = SHICHEN_MAP['17-19'];
  else if (hour < 21) shichenStr = SHICHEN_MAP['19-21'];
  else shichenStr = SHICHEN_MAP['21-23'];

  // Approximate Lunar month & day
  // Offset from solar: typically lunar is 20-50 days behind solar
  let lunarMonth = ((m - 1 + 11) % 12) + 1;
  let lunarDay = ((d + 11) % 29) + 1;

  return {
    year: y,
    month: lunarMonth,
    day: lunarDay,
    isLeapMonth: false,
    cyclicalYear,
    cyclicalMonth,
    cyclicalDay,
    zodiac,
    solarTerm,
    naYin,
    shichen: shichenStr
  };
}
