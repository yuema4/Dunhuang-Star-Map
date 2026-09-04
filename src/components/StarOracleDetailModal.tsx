import React, { useState, useEffect } from 'react';
import { Mansion28, LunarDateInfo, StarOracleResult, PaletteId } from '../types';
import { DUNHUANG_PALETTES } from '../utils/dunhuangMuralAssets';
import { CLASSICAL_MANSION_ALLUSIONS, ClassicalMansionAllusion } from '../utils/mansionAllusions';
import {
  X,
  Compass,
  BookOpen,
  Sparkles,
  Scroll,
  ShieldCheck,
  Feather,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Sun,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StarOracleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mansion: Mansion28;
  lunarInfo: LunarDateInfo;
  oracle: StarOracleResult;
  userName?: string;
  paletteId?: PaletteId;
}

export const StarOracleDetailModal: React.FC<StarOracleDetailModalProps> = ({
  isOpen,
  onClose,
  mansion,
  lunarInfo,
  oracle,
  userName = '敦煌行客',
  paletteId = 'cinnabar-gold',
}) => {
  const [activeTab, setActiveTab] = useState<'shiji' | 'yisi' | 'mural' | 'guide'>('shiji');
  const [copied, setCopied] = useState(false);

  const palette = DUNHUANG_PALETTES[paletteId] || DUNHUANG_PALETTES['cinnabar-gold'];
  const allusion: ClassicalMansionAllusion = CLASSICAL_MANSION_ALLUSIONS[mansion.name] || {
    mansionName: mansion.name,
    fullName: mansion.fullName,
    sourceShiji: `《史记·天官书》载：“${mansion.name}宿${mansion.starsCount}星，属于${mansion.symbol}，主天象节律与农政吉凶。”`,
    sourceYisizhan: `李淳风《乙巳占》：“${mansion.name}宿光润，天下安和；${mansion.tangText}”`,
    feiyeTerritory: `大唐二十八宿分野属${mansion.symbol}中宫分野之地。`,
    deityTitle: `道藏封号：${mansion.symbol}${mansion.fullName}元神真君`,
    muralIconography: `莫高窟炽盛光佛图中，${mansion.fullName}作星官护法相，以朱砂泥金点染。`,
    astronomicalFunction: `周天度数广延${mansion.degrees}度，为司天监测度中天昏旦之法度。`,
    deepPrognosis: {
      fortuneInsight: mansion.temperament,
      cultivationGuidance: '顺天应时，刚柔相济，心存至善则万吉咸备。',
      talismanShield: `宜佩${mansion.auspiciousMineral}饰件以调顺星曜之气。`,
    },
  };

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCopyAllusion = () => {
    const text = `【大唐司天监 · ${mansion.fullName}星曜深层谶语汇考】\n求占者：${userName}\n本命值宿：${mansion.fullName}（广延 ${mansion.degrees}°，属相：${mansion.animal}）\n干支纳音：${lunarInfo.naYin}\n\n【史记·天官书】：\n${allusion.sourceShiji}\n\n【唐·李淳风《乙巳占》】：\n${allusion.sourceYisizhan}\n\n【分野地望】：${allusion.feiyeTerritory}\n【道藏神位】：${allusion.deityTitle}\n\n【深层气象剖析】：\n${allusion.deepPrognosis.fortuneInsight}\n【修持进退之机】：\n${allusion.deepPrognosis.cultivationGuidance}\n【避凶化吉】：\n${allusion.deepPrognosis.talismanShield}\n\n—— 敦煌遗书 S.3326 / 莫高窟第61窟炽盛光佛图`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="star-oracle-detail-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: palette.bgDark,
            borderColor: palette.gold,
            boxShadow: `0 25px 60px -15px ${palette.bgDark}, 0 0 35px ${palette.gold}25`,
          }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-xs border-2 text-[#E2DCC8] overflow-hidden font-serif-sc"
        >
          {/* Top Aged Paper & Plaster Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#C5A059_0.6px,transparent_0.6px)] [background-size:20px_20px]" />

          {/* Modal Header */}
          <div
            style={{
              backgroundColor: palette.bgPaper + '15',
              borderBottomColor: palette.gold + '35',
            }}
            className="px-6 py-4 border-b flex items-center justify-between relative z-10 shrink-0"
          >
            <div className="flex items-center gap-3.5">
              <div
                style={{
                  backgroundColor: palette.cinnabar + '25',
                  borderColor: palette.gold,
                  color: palette.goldBright,
                }}
                className="w-10 h-10 border rounded-xs flex items-center justify-center shadow-inner shrink-0"
              >
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold tracking-widest text-[#E2DCC8]">
                    星曜详细谶语 · 古籍典故汇考
                  </h2>
                  <span
                    style={{
                      backgroundColor: palette.cinnabar + '25',
                      borderColor: palette.cinnabar,
                      color: palette.cinnabarLight,
                    }}
                    className="text-xs px-2.5 py-0.5 border rounded-xs font-bold"
                  >
                    {mansion.fullName}
                  </span>
                  <span className="text-xs text-[#C5A059] font-cinzel">
                    {mansion.degrees}° / {mansion.symbol}
                  </span>
                </div>
                <p className="text-xs text-[#E2DCC8]/70 mt-0.5">
                  司天监密卷 ·《史记·天官书》· 唐李淳风《乙巳占》· 敦煌遗书 S.3326 原典详析
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAllusion}
                style={{
                  borderColor: palette.gold + '40',
                  color: palette.goldBright,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border rounded-xs text-xs hover:bg-white/10 transition-colors cursor-pointer"
                title="复制整套古籍谶语考释"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已复制考释' : '复制考释'}</span>
              </button>

              <button
                onClick={onClose}
                style={{
                  borderColor: palette.gold + '40',
                  color: palette.goldBright,
                }}
                className="w-8 h-8 border rounded-xs flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                title="关闭弹窗 (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-tabs */}
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderBottomColor: palette.gold + '20',
            }}
            className="px-6 border-b flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none"
          >
            <button
              onClick={() => setActiveTab('shiji')}
              style={{
                color: activeTab === 'shiji' ? palette.goldBright : '#E2DCC8',
                borderBottomColor: activeTab === 'shiji' ? palette.gold : 'transparent',
              }}
              className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'shiji' ? 'bg-white/[0.04]' : 'opacity-65 hover:opacity-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>《天官书》史籍典故</span>
            </button>

            <button
              onClick={() => setActiveTab('yisi')}
              style={{
                color: activeTab === 'yisi' ? palette.goldBright : '#E2DCC8',
                borderBottomColor: activeTab === 'yisi' ? palette.gold : 'transparent',
              }}
              className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'yisi' ? 'bg-white/[0.04]' : 'opacity-65 hover:opacity-100'
              }`}
            >
              <Scroll className="w-4 h-4" />
              <span>李淳风《乙巳占》密谶</span>
            </button>

            <button
              onClick={() => setActiveTab('mural')}
              style={{
                color: activeTab === 'mural' ? palette.goldBright : '#E2DCC8',
                borderBottomColor: activeTab === 'mural' ? palette.gold : 'transparent',
              }}
              className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'mural' ? 'bg-white/[0.04]' : 'opacity-65 hover:opacity-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>莫高窟61窟炽盛光造像</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              style={{
                color: activeTab === 'guide' ? palette.goldBright : '#E2DCC8',
                borderBottomColor: activeTab === 'guide' ? palette.gold : 'transparent',
              }}
              className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'guide' ? 'bg-white/[0.04]' : 'opacity-65 hover:opacity-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>本命气运 · 趋吉避凶</span>
            </button>
          </div>

          {/* Modal Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-white/10">
            {activeTab === 'shiji' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Historical Canonical Excerpt Banner */}
                <div className="p-5 bg-[#151412] border-l-4 border-[#C5A059] border-y border-r border-white/10 rounded-xs shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#C5A059] font-bold">
                      SIJI / TIAN GUAN SHU CANON
                    </span>
                    <span className="text-xs text-[#A64B3E] font-bold">
                      司马迁《史记·天官书》原典
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-[#E2DCC8] leading-relaxed tracking-wide italic font-serif-sc my-2">
                    “{allusion.sourceShiji}”
                  </p>
                  <p className="text-xs text-[#E2DCC8]/70 leading-relaxed mt-2 border-t border-white/5 pt-2">
                    【典籍校注】：在先秦至两汉天文学中，二十八宿为天体经纬不可移易之恒度。太史公以五行阴阳为经、以治国用兵为纬，将【{mansion.name}宿】视作天朝法度、物候节序之枢轴。
                  </p>
                </div>

                {/* Grid: Celestial Territory & S.3326 Astronomy Function */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Territory 分野地望 */}
                  <div className="p-4 bg-white/[0.02] border border-[#C5A059]/25 rounded-xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059]">
                      <MapPin className="w-4 h-4 text-[#A64B3E]" />
                      <span>大唐星分野地望 (Astrological Territory)</span>
                    </div>
                    <p className="text-sm font-bold text-[#E2DCC8]">
                      {allusion.feiyeTerritory}
                    </p>
                    <p className="text-xs text-[#E2DCC8]/70 leading-relaxed">
                      古制“星宿分野”，天之星野直对九州山川大地。行客受此宿分野灵秀钟聚，多与中原及河陇地理山川有莫大宿缘。
                    </p>
                  </div>

                  {/* Meridian & Degree 司天监古测度 */}
                  <div className="p-4 bg-white/[0.02] border border-[#C5A059]/25 rounded-xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059]">
                      <Compass className="w-4 h-4 text-[#C5A059]" />
                      <span>司天监经纬测度 (Celestial Astrometry)</span>
                    </div>
                    <p className="text-sm font-bold text-[#E2DCC8]">
                      {allusion.astronomicalFunction}
                    </p>
                    <p className="text-xs text-[#E2DCC8]/70 leading-relaxed">
                      敦煌写本 S.3326 中，以精纯朱墨分画三家星经（石氏赤、甘氏黑、巫咸黄），此宿距星标度历千年而度数极准。
                    </p>
                  </div>
                </div>

                {/* S.3326 Tang Text Deep Dive */}
                <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#A64B3E]">
                      敦煌藏经洞 S.3326 经卷题记
                    </span>
                    <span className="text-[11px] text-[#E2DCC8]/50">
                      英藏 Or.8210 / 法藏 P.2508 对勘
                    </span>
                  </div>
                  <p className="text-sm text-[#E2DCC8] leading-relaxed italic bg-black/30 p-3.5 border border-white/5 rounded-xs">
                    “{mansion.tangText}”
                  </p>
                  <div className="mt-3 text-xs text-[#E2DCC8]/75 space-y-1">
                    <div>• 宿度广延：{mansion.degrees}度（古制周天365.25度）</div>
                    <div>• 主星总数：正星 {mansion.starsCount} 颗，辅星若干</div>
                    <div>• 宿象主星：{mansion.planet}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'yisi' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Li Chunfeng Yisi Zhan Canon */}
                <div className="p-5 bg-[#151412] border-l-4 border-[#A64B3E] border-y border-r border-white/10 rounded-xs shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#A64B3E] font-bold">
                      TANG DYNASTY MASTER LI CHUNFENG / YI SI ZHAN
                    </span>
                    <span className="text-xs text-[#C5A059] font-bold">
                      唐太史令李淳风撰《乙巳占》
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-[#E2DCC8] leading-relaxed tracking-wide font-serif-sc my-2 italic">
                    “{allusion.sourceYisizhan}”
                  </p>
                  <p className="text-xs text-[#E2DCC8]/70 leading-relaxed mt-2 border-t border-white/5 pt-2">
                    【太史监断语】：大唐初年，太史令李淳风参究浑天仪之度，著《乙巳占》。以二十八宿之明润、角芒、隐现，上应人君政令，下察黎庶修德。
                  </p>
                </div>

                {/* Imperial Title & Quatrain Reading */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.02] border border-[#C5A059]/20 rounded-xs">
                    <span className="text-[10px] tracking-widest uppercase text-[#C5A059] block mb-1">
                      IMPERIAL ENTHRONED TITLE / 敕赐星尊
                    </span>
                    <h4 className="text-base font-bold text-[#E2DCC8]">
                      {oracle.imperialTitle || allusion.deityTitle}
                    </h4>
                    <p className="text-xs text-[#E2DCC8]/70 mt-2 leading-relaxed">
                      司天监定品：此本命星位为【{mansion.fullName}】正度，纳音配{lunarInfo.naYin}之气，得七曜玄光拂照。
                    </p>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-[#C5A059]/20 rounded-xs">
                    <span className="text-[10px] tracking-widest uppercase text-[#A64B3E] block mb-1">
                      AUSPICIOUS QUATRAIN / 司天七绝
                    </span>
                    <p className="font-calligraphy text-base text-[#E2DCC8] whitespace-pre-line leading-relaxed">
                      {oracle.tangPoem}
                    </p>
                  </div>
                </div>

                {/* Omen Reading from S.3326 Divination */}
                <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xs space-y-2">
                  <h4 className="text-xs font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-[#A64B3E]" />
                    <span>大唐司天监详占谶断 (Complete Prognostication)</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#E2DCC8]/85 leading-relaxed whitespace-pre-line text-justify">
                    {oracle.omenReading}
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'mural' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Cave 61 Mural Iconography Deep Excerpt */}
                <div className="p-5 bg-[#151412] border-l-4 border-[#C5A059] border-y border-r border-white/10 rounded-xs shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#C5A059] font-bold">
                      MOGAO CAVE 61 / TEJAPRABHA MANDALA
                    </span>
                    <span className="text-xs text-[#A64B3E] font-bold">
                      莫高窟第61窟五代炽盛光佛图考
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#E2DCC8] mb-2">
                    {allusion.deityTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#E2DCC8]/85 leading-relaxed text-justify">
                    {allusion.muralIconography}
                  </p>
                  <p className="text-xs text-[#E2DCC8]/60 mt-3 border-t border-white/5 pt-2">
                    【艺术考古】：莫高窟第61窟（五代炽盛光佛窟）甬道顶壁所绘《炽盛光佛及二十八宿黄道十二宫图》，将华夏二十八宿拟人化为侍臣法像，身着中原大袖礼冠，兼融梵唐星历之精粹，为世界美术史之瑰宝。
                  </p>
                </div>

                {/* Deity & Pigment Attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xs">
                    <span className="text-[10px] text-[#C5A059] block uppercase tracking-wider mb-1 font-cinzel">
                      DEITY ATTIRE / 神真冠服
                    </span>
                    <p className="text-xs text-[#E2DCC8] font-bold">
                      唐式远游冠 · {mansion.animal}首法像
                    </p>
                    <p className="text-[11px] text-[#E2DCC8]/60 mt-1">
                      执笏佩带，端居云端，护佑人间命度安泰。
                    </p>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xs">
                    <span className="text-[10px] text-[#A64B3E] block uppercase tracking-wider mb-1 font-cinzel">
                      MINERAL PIGMENT / 绘写矿彩
                    </span>
                    <p className="text-xs text-[#E2DCC8] font-bold">
                      {mansion.auspiciousMineral}
                    </p>
                    <p className="text-[11px] text-[#E2DCC8]/60 mt-1">
                      采莫高壁画天然金石，经千年风沙色泽不腐。
                    </p>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xs">
                    <span className="text-[10px] text-[#C5A059] block uppercase tracking-wider mb-1 font-cinzel">
                      SACRED SCRIPTURE / 传世道藏
                    </span>
                    <p className="text-xs text-[#E2DCC8] font-bold">
                      《太上洞神二十八宿经》
                    </p>
                    <p className="text-[11px] text-[#E2DCC8]/60 mt-1">
                      大唐崇道礼佛，诵持本命宿真言可消灾解厄。
                    </p>
                  </div>
                </div>

                {/* S.3326 & P.2508 Comparative Charting */}
                <div className="p-4 bg-white/[0.02] border border-[#C5A059]/30 rounded-xs flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-[10px] text-[#C5A059] uppercase tracking-wider block">
                      ARCHIVAL REPOSITORY / 藏经洞入藏号
                    </span>
                    <h5 className="text-sm font-bold text-[#E2DCC8]">
                      英国国家图书馆 Or.8210/S.3326《全天星图》
                    </h5>
                    <p className="text-xs text-[#E2DCC8]/60 mt-0.5">
                      世界现存最早、记录恒星数最多之科学手绘星图（共1339星）。
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-[#A64B3E]/20 border border-[#A64B3E]/40 text-[#A64B3E] rounded-xs font-bold">
                    开元长庆年间制
                  </span>
                </div>
              </motion.div>
            )}

            {activeTab === 'guide' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Seeker's Natal Destiny Insights */}
                <div className="p-5 bg-[#151412] border border-[#C5A059]/30 rounded-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-[#C5A059]" />
                      <h4 className="text-sm font-bold text-[#E2DCC8]">
                        求占行客【{userName}】本命气象精析
                      </h4>
                    </div>
                    <span className="text-xs text-[#C5A059] font-cinzel">
                      {lunarInfo.cyclicalYear}年 · {lunarInfo.naYin}
                    </span>
                  </div>

                  <p className="text-sm text-[#E2DCC8] leading-relaxed text-justify">
                    {allusion.deepPrognosis.fortuneInsight}
                  </p>
                </div>

                {/* Cultivation Guidance & Shielding Tactics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.02] border border-[#416B58]/30 rounded-xs space-y-2">
                    <span className="text-[10px] text-[#416B58] uppercase font-bold tracking-widest block font-cinzel">
                      CULTIVATION PATH / 修持进退之机
                    </span>
                    <h5 className="text-xs font-bold text-[#E2DCC8]">
                      顺天应物 · 固守本真
                    </h5>
                    <p className="text-xs text-[#E2DCC8]/80 leading-relaxed">
                      {allusion.deepPrognosis.cultivationGuidance}
                    </p>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-[#A64B3E]/30 rounded-xs space-y-2">
                    <span className="text-[10px] text-[#A64B3E] uppercase font-bold tracking-widest block font-cinzel">
                      TALISMAN SHIELD / 避凶禳解之法
                    </span>
                    <h5 className="text-xs font-bold text-[#E2DCC8]">
                      矿彩调和 · 吉曜随身
                    </h5>
                    <p className="text-xs text-[#E2DCC8]/80 leading-relaxed">
                      {allusion.deepPrognosis.talismanShield}
                    </p>
                  </div>
                </div>

                {/* Talisman Advice from Oracle */}
                <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xs flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-[10px] text-[#C5A059] uppercase tracking-wider block">
                      TANG IMPERIAL AMULET / 司天监辟邪吉谶
                    </span>
                    <h5 className="text-sm font-bold text-[#E2DCC8]">
                      {oracle.talismanAdvice || '曜灵护体 · 莫高千佛护佑长宁'}
                    </h5>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#E2DCC8]/50 block">契合敦煌壁画矿色</span>
                    <span style={{ color: palette.goldBright }} className="text-xs font-bold">
                      {palette.name} ({palette.cave})
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer */}
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderTopColor: palette.gold + '25',
            }}
            className="px-6 py-3 border-t flex flex-wrap items-center justify-between text-xs text-[#E2DCC8]/60 shrink-0 gap-2"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>大唐司天监经卷典藏 · 依敦煌写本 S.3326 推阐</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">按 ESC 键即可关闭</span>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: palette.gold,
                  color: palette.bgDark,
                }}
                className="px-4 py-1.5 rounded-xs font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-sm"
              >
                领受谶语 · 闭卷
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
