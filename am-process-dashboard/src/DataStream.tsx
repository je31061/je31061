import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────
export type TeamId = 'marine' | 'dev' | 'spare' | 'mro';
type TargetStore = 'erp' | 'chs';
type Direction = 'toStore' | 'fromStore';

interface Pipeline {
  teamId: TeamId;
  target: TargetStore;
  direction: Direction;
  color: string;
  label: string;
  particleCount: number;
  speed: number; // seconds per full traverse
}

interface DataStreamProps {
  activeTeam: TeamId | null;
}

// ─── Pipeline definitions ────────────────────────────────────
// Each team has 2 pipelines: one sending data TO a store and one receiving FROM
const PIPELINES: Pipeline[] = [
  // 마린서비스 → ERP (계약/정비 데이터)
  { teamId: 'marine', target: 'erp', direction: 'toStore', color: '#22d3ee', label: '클레임 접수', particleCount: 4, speed: 3.2 },
  // 마린서비스 ← CHS (이력 조회)
  { teamId: 'marine', target: 'chs', direction: 'fromStore', color: '#06b6d4', label: '이력 조회', particleCount: 3, speed: 4.0 },
  // AM개발 → CHS (시스템 데이터)
  { teamId: 'dev', target: 'chs', direction: 'toStore', color: '#818cf8', label: '배포 데이터', particleCount: 4, speed: 2.8 },
  // AM개발 ← ERP (연동 데이터)
  { teamId: 'dev', target: 'erp', direction: 'fromStore', color: '#6366f1', label: 'API 연동', particleCount: 3, speed: 3.5 },
  // 스페어 → ERP (구매/재고)
  { teamId: 'spare', target: 'erp', direction: 'toStore', color: '#c084fc', label: '발주 데이터', particleCount: 5, speed: 2.5 },
  // 스페어 ← CHS (부품 이력)
  { teamId: 'spare', target: 'chs', direction: 'fromStore', color: '#a855f7', label: '부품 이력', particleCount: 3, speed: 3.8 },
  // MRO → CHS (정비 기록)
  { teamId: 'mro', target: 'chs', direction: 'toStore', color: '#f472b6', label: '정비 기록', particleCount: 4, speed: 3.0 },
  // MRO ← ERP (작업지시)
  { teamId: 'mro', target: 'erp', direction: 'fromStore', color: '#ec4899', label: '작업 지시', particleCount: 3, speed: 3.6 },
];

// ─── Anchor positions (percentage-based within the SVG viewBox) ──
// The SVG overlays the entire dashboard-main area.
// Teams are on the left (2×2 grid), stores are center.
// ViewBox: 0 0 1000 600

interface Point { x: number; y: number; }

const TEAM_ANCHORS: Record<TeamId, Point> = {
  marine: { x: 280, y: 155 },   // top-left quadrant right edge
  dev:    { x: 280, y: 310 },   // top-right → actually second row left
  spare:  { x: 280, y: 460 },   // bottom-left quadrant right edge
  mro:    { x: 280, y: 560 },   // bottom-right
};

const STORE_ANCHORS: Record<TargetStore, Point> = {
  erp: { x: 500, y: 200 },
  chs: { x: 500, y: 460 },
};

// ─── Generate smooth cubic bezier path ───────────────────────
function buildCurvePath(
  from: Point,
  to: Point,
  curveOffset: number = 0
): string {
  const midX = (from.x + to.x) / 2;
  // Offset the control points vertically for a nice curve
  const cp1 = { x: midX + curveOffset * 0.3, y: from.y };
  const cp2 = { x: midX - curveOffset * 0.3, y: to.y };
  return `M ${from.x} ${from.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${to.x} ${to.y}`;
}

// ─── Single animated particle ────────────────────────────────
interface ParticleProps {
  path: string;
  color: string;
  duration: number;
  delay: number;
  size: number;
  glowIntensity: number;
  isActive: boolean;
  dimmed: boolean;
}

const Particle: React.FC<ParticleProps> = ({
  path, color, duration, delay, size, glowIntensity, isActive, dimmed,
}) => {
  return (
    <motion.circle
      r={size}
      fill={color}
      filter={`drop-shadow(0 0 ${glowIntensity}px ${color})`}
      opacity={dimmed ? 0.08 : isActive ? 1 : 0.5}
      initial={{ offsetDistance: '0%' }}
      animate={{ offsetDistance: '100%' }}
      style={{
        offsetPath: `path("${path}")`,
        offsetRotate: '0deg',
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

// ─── Animated path stroke (the trail line) ───────────────────
interface TrailProps {
  path: string;
  color: string;
  isActive: boolean;
  dimmed: boolean;
}

const Trail: React.FC<TrailProps> = ({ path, color, isActive, dimmed }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [path]);

  return (
    <>
      {/* Base static line */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={dimmed ? 0.5 : isActive ? 2 : 1}
        strokeOpacity={dimmed ? 0.04 : isActive ? 0.35 : 0.12}
        strokeLinecap="round"
      />
      {/* Animated flowing stroke */}
      {!dimmed && (
        <motion.path
          ref={pathRef}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={isActive ? 2.5 : 1.5}
          strokeOpacity={isActive ? 0.6 : 0.2}
          strokeLinecap="round"
          strokeDasharray={pathLength ? `${pathLength * 0.15} ${pathLength * 0.85}` : '0'}
          initial={{ strokeDashoffset: pathLength }}
          animate={{ strokeDashoffset: -pathLength }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </>
  );
};

// ─── Event burst animation ──────────────────────────────────
interface BurstParticle {
  id: number;
  pipeline: Pipeline;
}

const EventBurst: React.FC<{
  pipeline: Pipeline;
  path: string;
  onComplete: () => void;
}> = ({ pipeline, path, onComplete }) => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.circle
          key={i}
          r={3.5 - i * 0.3}
          fill={pipeline.color}
          filter={`drop-shadow(0 0 8px ${pipeline.color})`}
          style={{
            offsetPath: `path("${path}")`,
            offsetRotate: '0deg',
          }}
          initial={{ offsetDistance: '0%', opacity: 1 }}
          animate={{ offsetDistance: '100%', opacity: 0 }}
          transition={{
            duration: 1.2,
            delay: i * 0.08,
            ease: [0.4, 0, 0.2, 1],
          }}
          onAnimationComplete={i === 5 ? onComplete : undefined}
        />
      ))}
    </>
  );
};

// ─── Pipeline label tooltip ─────────────────────────────────
const PipelineLabel: React.FC<{
  pipeline: Pipeline;
  midPoint: Point;
  isActive: boolean;
  dimmed: boolean;
}> = ({ pipeline, midPoint, isActive, dimmed }) => {
  if (dimmed || !isActive) return null;

  return (
    <motion.g
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.3 }}
    >
      <rect
        x={midPoint.x - 40}
        y={midPoint.y - 22}
        width={80}
        height={20}
        rx={6}
        fill="rgba(15,23,42,0.9)"
        stroke={pipeline.color}
        strokeWidth={1}
        strokeOpacity={0.5}
      />
      <text
        x={midPoint.x}
        y={midPoint.y - 9}
        textAnchor="middle"
        fill={pipeline.color}
        fontSize={9}
        fontWeight={600}
        fontFamily="Inter, system-ui, sans-serif"
      >
        {pipeline.label}
      </text>
      {/* Direction arrow */}
      <text
        x={midPoint.x + 35}
        y={midPoint.y - 9}
        textAnchor="middle"
        fill={pipeline.color}
        fontSize={8}
        opacity={0.7}
      >
        {pipeline.direction === 'toStore' ? '→' : '←'}
      </text>
    </motion.g>
  );
};

// ─── Main DataStream Component ───────────────────────────────
const DataStream: React.FC<DataStreamProps> = ({ activeTeam }) => {
  const [bursts, setBursts] = useState<BurstParticle[]>([]);
  const burstIdRef = useRef(0);

  // Periodically trigger event bursts for visual interest
  useEffect(() => {
    const interval = setInterval(() => {
      const candidates = activeTeam
        ? PIPELINES.filter(p => p.teamId === activeTeam)
        : PIPELINES.filter(p => p.direction === 'toStore');
      const pipeline = candidates[Math.floor(Math.random() * candidates.length)];
      if (pipeline) {
        const id = burstIdRef.current++;
        setBursts(prev => [...prev, { id, pipeline }]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeTeam]);

  const removeBurst = (id: number) => {
    setBursts(prev => prev.filter(b => b.id !== id));
  };

  // Pre-compute paths for all pipelines
  const pipelinePaths = useMemo(() => {
    return PIPELINES.map((pipeline, idx) => {
      const teamPos = TEAM_ANCHORS[pipeline.teamId];
      const storePos = STORE_ANCHORS[pipeline.target];
      const from = pipeline.direction === 'toStore' ? teamPos : storePos;
      const to = pipeline.direction === 'toStore' ? storePos : teamPos;

      // Slight vertical offset per pipeline to avoid overlap
      const offsetMap: Record<TeamId, number> = { marine: -20, dev: -8, spare: 8, mro: 20 };
      const curveOffset = offsetMap[pipeline.teamId] + (pipeline.direction === 'fromStore' ? 15 : -15);

      const path = buildCurvePath(
        { x: from.x, y: from.y + curveOffset * 0.4 },
        { x: to.x, y: to.y + curveOffset * 0.4 },
        curveOffset
      );

      const midPoint: Point = {
        x: (from.x + to.x) / 2,
        y: ((from.y + to.y) / 2) + curveOffset * 0.2 - 15,
      };

      return { pipeline, path, midPoint };
    });
  }, []);

  return (
    <svg
      className="data-stream-overlay"
      viewBox="0 0 1000 700"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glow filters per team color */}
        <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-indigo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Render trails and particles for each pipeline */}
      {pipelinePaths.map(({ pipeline, path, midPoint }, idx) => {
        const isActive = activeTeam === null || activeTeam === pipeline.teamId;
        const dimmed = activeTeam !== null && activeTeam !== pipeline.teamId;

        return (
          <g key={`pipeline-${idx}`}>
            {/* Trail line */}
            <Trail
              path={path}
              color={pipeline.color}
              isActive={isActive && activeTeam !== null}
              dimmed={dimmed}
            />

            {/* Continuous flowing particles */}
            {!dimmed && Array.from({ length: pipeline.particleCount }).map((_, pIdx) => (
              <Particle
                key={`p-${idx}-${pIdx}`}
                path={path}
                color={pipeline.color}
                duration={pipeline.speed}
                delay={(pipeline.speed / pipeline.particleCount) * pIdx}
                size={isActive && activeTeam !== null ? 3 : 2}
                glowIntensity={isActive && activeTeam !== null ? 8 : 4}
                isActive={isActive && activeTeam !== null}
                dimmed={dimmed}
              />
            ))}

            {/* Label for active team's pipelines */}
            <PipelineLabel
              pipeline={pipeline}
              midPoint={midPoint}
              isActive={isActive && activeTeam !== null}
              dimmed={dimmed}
            />
          </g>
        );
      })}

      {/* Event bursts */}
      {bursts.map(({ id, pipeline }) => {
        const entry = pipelinePaths.find(p => p.pipeline === pipeline);
        if (!entry) return null;
        return (
          <EventBurst
            key={`burst-${id}`}
            pipeline={pipeline}
            path={entry.path}
            onComplete={() => removeBurst(id)}
          />
        );
      })}

      {/* Store connection nodes (small glowing dots at store anchors) */}
      {Object.entries(STORE_ANCHORS).map(([key, pos]) => (
        <g key={`store-anchor-${key}`}>
          <motion.circle
            cx={pos.x}
            cy={pos.y}
            r={5}
            fill={key === 'erp' ? '#22d3ee' : '#818cf8'}
            opacity={0.6}
            animate={{
              r: [5, 7, 5],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <circle
            cx={pos.x}
            cy={pos.y}
            r={12}
            fill="none"
            stroke={key === 'erp' ? '#22d3ee' : '#818cf8'}
            strokeWidth={1}
            strokeOpacity={0.15}
          />
        </g>
      ))}

      {/* Team anchor dots */}
      {Object.entries(TEAM_ANCHORS).map(([key, pos]) => {
        const teamColors: Record<string, string> = {
          marine: '#22d3ee', dev: '#818cf8', spare: '#c084fc', mro: '#f472b6'
        };
        const isActive = activeTeam === null || activeTeam === key;
        return (
          <motion.circle
            key={`team-anchor-${key}`}
            cx={pos.x}
            cy={pos.y}
            r={4}
            fill={teamColors[key]}
            opacity={isActive ? 0.7 : 0.1}
            animate={isActive ? {
              r: [4, 5.5, 4],
              opacity: [0.7, 1, 0.7],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </svg>
  );
};

export default DataStream;
