import React, { useState } from 'react';
import { Mansion28, DunhuangStyleConfig } from '../types';
import { CIRCUMPOLAR_STARS, CIRCUMPOLAR_CONNECTIONS, MANSIONS_28 } from '../utils/dunhuangData';
import {
  DUNHUANG_PALETTES,
  DEFAULT_STYLE_CONFIG,
  DunhuangSvgAssets,
} from '../utils/dunhuangMuralAssets';

interface StarChartSvgProps {
  natalMansion: Mansion28;
  size?: number;
  highlightNatal?: boolean;
  interactive?: boolean;
  styleConfig?: DunhuangStyleConfig;
}

const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const StarChartSvg: React.FC<StarChartSvgProps> = ({
  natalMansion,
  size = 460,
  interactive = true,
  styleConfig = DEFAULT_STYLE_CONFIG,
}) => {
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);

  const palette = DUNHUANG_PALETTES[styleConfig.paletteId] || DUNHUANG_PALETTES['cinnabar-gold'];
  const center = size / 2;
  const radius = size * 0.44;
  const polarRadius = radius * 0.38;
  const equatorialRadius = radius * 0.72;

  // Calculate coordinates on the circle
  const getCoords = (angleDeg: number, r: number) => {
    // Angle in standard radians, start at top (0 deg is -90 deg in Cartesian)
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  return (
    <div className="relative flex items-center justify-center select-none" id="dunhuang-star-chart">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        <defs>
          {/* Cinnabar glow filter */}
          <filter id="cinnabar-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gold glow filter */}
          <filter id="gold-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial mask for parchment texture compatibility */}
          <radialGradient id="celestial-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.gold} stopOpacity="0.14" />
            <stop offset="65%" stopColor={palette.cinnabar} stopOpacity="0.06" />
            <stop offset="100%" stopColor={palette.bgMedium} stopOpacity="0" />
          </radialGradient>

          {/* Border pattern */}
          {DunhuangSvgAssets.renderBorderDef(styleConfig.borderId, palette)}
        </defs>

        {/* Ambient celestial background halo */}
        <circle cx={center} cy={center} r={radius * 1.06} fill="url(#celestial-halo)" />

        {/* Outer Square Wall with Caisson Corner Brackets (藻井四角悬鱼纹) */}
        <g opacity="0.85">
          {/* Top-Left */}
          <g transform="translate(18, 18)">
            {DunhuangSvgAssets.renderCornerBracket('tl', 32, palette)}
          </g>
          {/* Top-Right */}
          <g transform={`translate(${size - 18}, 18)`}>
            {DunhuangSvgAssets.renderCornerBracket('tr', 32, palette)}
          </g>
          {/* Bottom-Left */}
          <g transform={`translate(18, ${size - 18})`}>
            {DunhuangSvgAssets.renderCornerBracket('bl', 32, palette)}
          </g>
          {/* Bottom-Right */}
          <g transform={`translate(${size - 18}, ${size - 18})`}>
            {DunhuangSvgAssets.renderCornerBracket('br', 32, palette)}
          </g>
        </g>

        {/* Central Radiating Baoxianghua Mandala (敦煌藻井宝相花天心暗纹) */}
        <g transform={`translate(${center}, ${center})`}>
          {DunhuangSvgAssets.renderBaoxianghua(
            styleConfig.baoxiangId,
            polarRadius * 2.1,
            palette,
            0.22
          )}
        </g>

        {/* Dunhuang Auspicious Clouds (敦煌祥云衬托) */}
        <g transform={`translate(${center - radius * 0.95}, ${center + radius * 0.45}) scale(0.65)`}>
          {DunhuangSvgAssets.renderXiangyun(styleConfig.cloudId, 220, 50, palette, 0.45)}
        </g>
        <g transform={`translate(${center + radius * 0.05}, ${center - radius * 0.92}) scale(0.55)`}>
          {DunhuangSvgAssets.renderXiangyun(styleConfig.cloudId, 220, 50, palette, 0.4)}
        </g>

        {/* Feitian (Flying Apsara) Soaring along the Ecliptic / Sky Path */}
        {styleConfig.feitianId !== 'feitian-none' && (
          <g
            transform={`translate(${center - radius * 0.45}, ${center - radius * 0.88}) scale(0.68) rotate(12)`}
            className="pointer-events-none"
          >
            {DunhuangSvgAssets.renderFeitian(styleConfig.feitianId, 220, 130, palette, 0.55)}
          </g>
        )}

        {/* Outer Circle: 365.25 traditional degree ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={palette.textColor}
          strokeWidth="1.2"
          strokeOpacity="0.5"
        />

        {/* Outer graduation ticks (360 degrees / 12 branches) */}
        {Array.from({ length: 72 }).map((_, i) => {
          const angle = (i * 360) / 72;
          const isMajor = i % 6 === 0;
          const tickLen = isMajor ? 8 : 4;
          const p1 = getCoords(angle, radius);
          const p2 = getCoords(angle, radius - tickLen);
          return (
            <line
              key={`tick-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={isMajor ? palette.cinnabar : palette.textColor}
              strokeWidth={isMajor ? 1.2 : 0.5}
              strokeOpacity={isMajor ? 0.7 : 0.3}
            />
          );
        })}

        {/* Star Trails: Lotus Petal Accents or Ribbon Waves */}
        {styleConfig.trailId === 'trails-lotus' && (
          <g id="lotus-trail-ticks" opacity="0.6">
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const p = getCoords(angle, equatorialRadius);
              return (
                <g key={`lotus-tick-${i}`} transform={`translate(${p.x}, ${p.y}) rotate(${angle})`}>
                  <path
                    d="M 0,-4 C 2,-1 3,2 0,4 C -3,2 -2,-1 0,-4 Z"
                    fill={palette.gold}
                    stroke={palette.cinnabar}
                    strokeWidth="0.5"
                  />
                </g>
              );
            })}
          </g>
        )}

        {styleConfig.trailId === 'trails-ribbon' && (
          <g id="ribbon-trail-waves" opacity="0.45">
            {Array.from({ length: 12 }).map((_, i) => {
              const angle1 = (i * 360) / 12;
              const angle2 = ((i + 0.6) * 360) / 12;
              const p1 = getCoords(angle1, equatorialRadius - 5);
              const p2 = getCoords(angle2, equatorialRadius + 5);
              return (
                <path
                  key={`ribbon-${i}`}
                  d={`M ${p1.x},${p1.y} Q ${center},${center} ${p2.x},${p2.y}`}
                  fill="none"
                  stroke={palette.goldBright}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              );
            })}
          </g>
        )}

        {/* 12 Earthly Branches (十二地支方位) */}
        {BRANCHES.map((b, i) => {
          const angle = (i * 360) / 12;
          const pos = getCoords(angle, radius - 18);
          return (
            <text
              key={`branch-${b}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={palette.textColor}
              fontSize={10}
              fontWeight="600"
              opacity={0.75}
              className="font-serif-sc"
            >
              {b}
            </text>
          );
        })}

        {/* Equatorial Circle (赤道圈) */}
        <circle
          cx={center}
          cy={center}
          r={equatorialRadius}
          fill="none"
          stroke={palette.textColor}
          strokeWidth="0.8"
          strokeDasharray="4 3"
          strokeOpacity="0.45"
        />

        {/* Ecliptic tilted circle (黄道圈) */}
        <ellipse
          cx={center}
          cy={center - 6}
          rx={equatorialRadius * 0.96}
          ry={equatorialRadius * 0.85}
          fill="none"
          stroke={palette.cinnabar}
          strokeWidth="0.85"
          strokeDasharray="3 4"
          strokeOpacity="0.55"
          transform={`rotate(-18 ${center} ${center})`}
        />

        {/* Circumpolar Enclosure (紫微垣紫微圈) */}
        <circle
          cx={center}
          cy={center}
          r={polarRadius}
          fill="none"
          stroke={palette.gold}
          strokeWidth="1.2"
          strokeDasharray="2 2"
          strokeOpacity="0.6"
        />

        {/* Meridian lines crossing the origin */}
        <line
          x1={center}
          y1={center - radius}
          x2={center}
          y2={center + radius}
          stroke={palette.textColor}
          strokeWidth="0.5"
          strokeOpacity="0.25"
        />
        <line
          x1={center - radius}
          y1={center}
          x2={center + radius}
          y2={center}
          stroke={palette.textColor}
          strokeWidth="0.5"
          strokeOpacity="0.25"
        />

        {/* 28 Mansions sector rays and markers */}
        {MANSIONS_28.map((m) => {
          const pOuter = getCoords(m.startAngle, radius - 28);
          const pInner = getCoords(m.startAngle, polarRadius);
          const isNatal = m.name === natalMansion.name;

          // Label position along perimeter
          const labelPos = getCoords(m.startAngle + m.degrees / 2, radius - 30);

          return (
            <g key={`mansion-sector-${m.name}`}>
              {/* Radial guide line */}
              <line
                x1={pInner.x}
                y1={pInner.y}
                x2={pOuter.x}
                y2={pOuter.y}
                stroke={isNatal ? palette.cinnabar : palette.textColor}
                strokeWidth={isNatal ? 1.6 : 0.4}
                strokeDasharray={isNatal ? 'none' : '1 3'}
                strokeOpacity={isNatal ? 0.9 : 0.25}
              />

              {/* Natal Mansion Golden Halo Badge on Perimeter */}
              {isNatal && (
                <circle
                  cx={labelPos.x}
                  cy={labelPos.y}
                  r={12}
                  fill={palette.cinnabar}
                  fillOpacity="0.18"
                  stroke={palette.gold}
                  strokeWidth="0.8"
                />
              )}

              {/* Mansion Name Label */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isNatal ? palette.cinnabar : palette.textColor}
                fontSize={isNatal ? 11 : 9}
                fontWeight={isNatal ? '700' : '400'}
                opacity={isNatal ? 1 : 0.65}
                className="font-serif-sc cursor-pointer transition-all duration-300"
              >
                {m.name}
              </text>
            </g>
          );
        })}

        {/* Circumpolar Constellation Connection Lines (北斗七星与北极五星) */}
        {CIRCUMPOLAR_CONNECTIONS.map(([idA, idB], idx) => {
          const starA = CIRCUMPOLAR_STARS.find((s) => s.id === idA);
          const starB = CIRCUMPOLAR_STARS.find((s) => s.id === idB);
          if (!starA || !starB) return null;

          const scale = size / 340;
          const x1 = center + starA.x * scale;
          const y1 = center + starA.y * scale;
          const x2 = center + starB.x * scale;
          const y2 = center + starB.y * scale;

          return (
            <line
              key={`circumpolar-line-${idx}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={palette.textColor}
              strokeWidth="0.85"
              strokeDasharray="2 2"
              strokeOpacity="0.45"
            />
          );
        })}

        {/* Circumpolar Stars (Shi Shen: Red; Gan De: Black; Wu Xian: Gold) */}
        {CIRCUMPOLAR_STARS.map((star) => {
          const scale = size / 340;
          const x = center + star.x * scale;
          const y = center + star.y * scale;
          const starRadius = Math.max(1.8, 4.5 - star.mag * 0.6);

          let color = palette.textColor; // Gan De ink
          if (star.school === 'shi') color = palette.cinnabar; // Shi Shen cinnabar red
          if (star.school === 'wu') color = palette.gold; // Wu Xian gold

          return (
            <g
              key={`circumpolar-${star.id}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredStar(star.name)}
              onMouseLeave={() => setHoveredStar(null)}
            >
              <circle
                cx={x}
                cy={y}
                r={starRadius}
                fill={color}
                stroke={color === palette.cinnabar ? palette.goldBright : palette.textColor}
                strokeWidth={0.6}
                opacity={0.9}
              />
            </g>
          );
        })}

        {/* Natal Mansion Asterism Star Plotting & Dunhuang Medallion */}
        {(() => {
          const natalAngle = natalMansion.startAngle;
          // Place constellation near equatorial belt at appropriate angle
          const natalDist = equatorialRadius * 0.88;
          const natalCenter = getCoords(natalAngle + natalMansion.degrees / 2, natalDist);

          return (
            <g id="natal-constellation-group">
              {/* Decorative Baoxianghua Rosette Badge centered at Natal Region */}
              <g transform={`translate(${natalCenter.x}, ${natalCenter.y}) scale(0.62)`}>
                {DunhuangSvgAssets.renderBaoxianghua(
                  styleConfig.baoxiangId,
                  110,
                  palette,
                  0.35
                )}
              </g>

              {/* Constellation Connection Lines */}
              {natalMansion.connections.map(([aIdx, bIdx], i) => {
                const sA = natalMansion.stars[aIdx];
                const sB = natalMansion.stars[bIdx];
                if (!sA || !sB) return null;
                return (
                  <line
                    key={`natal-conn-${i}`}
                    x1={natalCenter.x + sA.x * 0.75}
                    y1={natalCenter.y + sA.y * 0.75}
                    x2={natalCenter.x + sB.x * 0.75}
                    y2={natalCenter.y + sB.y * 0.75}
                    stroke={palette.cinnabar}
                    strokeWidth="1.4"
                    strokeDasharray="2 1"
                    strokeOpacity="0.85"
                  />
                );
              })}

              {/* Constellation Stars */}
              {natalMansion.stars.map((s, i) => {
                const sx = natalCenter.x + s.x * 0.75;
                const sy = natalCenter.y + s.y * 0.75;
                const r = Math.max(2.5, 5 - s.mag * 0.6);
                return (
                  <g
                    key={`natal-star-${i}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredStar(`${natalMansion.name}宿 · ${s.name}`)}
                    onMouseLeave={() => setHoveredStar(null)}
                  >
                    {/* Glowing halo */}
                    <circle
                      cx={sx}
                      cy={sy}
                      r={r + 3.5}
                      fill={palette.cinnabar}
                      opacity="0.3"
                    />
                    {/* Core star */}
                    <circle
                      cx={sx}
                      cy={sy}
                      r={r}
                      fill={palette.cinnabar}
                      stroke={palette.goldBright}
                      strokeWidth="0.85"
                    />
                  </g>
                );
              })}

              {/* Calligraphic Asterism Title & Dunhuang Badge */}
              <text
                x={natalCenter.x}
                y={natalCenter.y + 44}
                textAnchor="middle"
                fill={palette.cinnabar}
                fontSize={12}
                fontWeight="700"
                className="font-serif-sc tracking-widest"
              >
                {natalMansion.fullName}
              </text>
            </g>
          );
        })()}

        {/* Center Pivot: Imperial Celestial Pivot (天极) with Lotus Bud */}
        <circle cx={center} cy={center} r={4.5} fill={palette.textColor} opacity={0.8} />
        <circle cx={center} cy={center} r={2} fill={palette.goldBright} />

        {/* Vintage Seal Stamp in top-right corner of diagram */}
        <g transform={`translate(${size - 48}, 14)`}>
          <rect
            width="32"
            height="32"
            fill={palette.cinnabar}
            fillOpacity="0.15"
            stroke={palette.cinnabar}
            strokeWidth="1"
          />
          <text
            x="16"
            y="17"
            textAnchor="middle"
            dominantBaseline="central"
            fill={palette.cinnabar}
            fontSize="10"
            fontWeight="bold"
            className="font-serif-sc"
          >
            司天
          </text>
        </g>
      </svg>

      {/* Floating Hover Indicator */}
      {hoveredStar && (
        <div
          style={{ backgroundColor: palette.bgDark, color: palette.paperTexture, borderColor: palette.gold }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 border text-xs tracking-widest pointer-events-none rounded-xs font-serif-sc backdrop-blur-xs z-20 shadow-md"
        >
          {hoveredStar}
        </div>
      )}
    </div>
  );
};
