import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, RotateCcw, Clock, CheckCircle2, AlertTriangle, Minus, Zap } from 'lucide-react';
import { SimulationStep, TaskStatus } from './taskData';
import { TeamId } from './DataStream';

interface SimulationPanelProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  currentStepId: number;
  steps: SimulationStep[];
  onStepHighlight: (teamId: TeamId, cardIndex: number) => void;
}

const TEAM_COLORS: Record<TeamId, string> = {
  marine: '#22d3ee', dev: '#818cf8', spare: '#c084fc', mro: '#f472b6',
};

const TEAM_NAMES: Record<TeamId, string> = {
  marine: '마린서비스', dev: 'AM개발', spare: '스페어', mro: 'MRO',
};

const STATUS_STYLES: Record<TaskStatus, { color: string; icon: React.ReactNode }> = {
  idle: { color: '#64748b', icon: <Minus size={14} /> },
  in_progress: { color: '#facc15', icon: <Clock size={14} /> },
  completed: { color: '#4ade80', icon: <CheckCircle2 size={14} /> },
  delayed: { color: '#f87171', icon: <AlertTriangle size={14} /> },
};

const SimulationPanel: React.FC<SimulationPanelProps> = ({
  isRunning, onStart, onStop, onReset, currentStepId, steps, onStepHighlight,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current step
  useEffect(() => {
    if (scrollRef.current && currentStepId > 0) {
      const el = scrollRef.current.querySelector(`[data-step-id="${currentStepId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentStepId]);

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  return (
    <div className="sim-panel">
      {/* Panel Header */}
      <div className="sim-header">
        <div className="sim-header-left">
          <Zap size={16} style={{ color: '#facc15' }} />
          <span className="sim-header-title">프로세스 시뮬레이션</span>
        </div>
        <div className="sim-header-subtitle">클레임 접수 → 비용 정산</div>
      </div>

      {/* Controls */}
      <div className="sim-controls">
        {!isRunning ? (
          <button className="sim-btn sim-btn-start" onClick={onStart}>
            <Play size={14} />
            <span>시뮬레이션 시작</span>
          </button>
        ) : (
          <button className="sim-btn sim-btn-stop" onClick={onStop}>
            <Square size={14} />
            <span>정지</span>
          </button>
        )}
        <button className="sim-btn sim-btn-reset" onClick={onReset}>
          <RotateCcw size={14} />
          <span>초기화</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="sim-progress">
        <div className="sim-progress-bar">
          <motion.div
            className="sim-progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="sim-progress-text">{completedCount}/{steps.length}</span>
      </div>

      {/* Steps timeline */}
      <div className="sim-steps" ref={scrollRef}>
        {steps.map((step, idx) => {
          const isCurrent = step.id === currentStepId;
          const statusStyle = STATUS_STYLES[step.status];
          return (
            <motion.div
              key={step.id}
              data-step-id={step.id}
              className={`sim-step ${isCurrent ? 'sim-step-current' : ''} ${step.status === 'completed' ? 'sim-step-done' : ''}`}
              initial={false}
              animate={{
                opacity: step.status === 'idle' && !isCurrent ? 0.5 : 1,
              }}
              onClick={() => onStepHighlight(step.teamId, step.cardIndex)}
            >
              {/* Timeline connector */}
              <div className="sim-step-timeline">
                <motion.div
                  className="sim-step-dot"
                  style={{
                    borderColor: isCurrent ? TEAM_COLORS[step.teamId] : statusStyle.color,
                    background: step.status === 'completed' ? statusStyle.color : 'transparent',
                  }}
                  animate={isCurrent ? {
                    boxShadow: [
                      `0 0 0 0 ${TEAM_COLORS[step.teamId]}40`,
                      `0 0 0 6px ${TEAM_COLORS[step.teamId]}00`,
                    ],
                  } : {}}
                  transition={isCurrent ? { duration: 1.5, repeat: Infinity } : {}}
                >
                  {step.status === 'completed' && <CheckCircle2 size={10} color="#0f172a" />}
                  {step.status === 'in_progress' && <Clock size={10} color="#facc15" />}
                  {step.status === 'delayed' && <AlertTriangle size={10} color="#f87171" />}
                </motion.div>
                {idx < steps.length - 1 && (
                  <div
                    className="sim-step-line"
                    style={{
                      background: step.status === 'completed'
                        ? `linear-gradient(180deg, ${TEAM_COLORS[step.teamId]}, ${TEAM_COLORS[steps[idx + 1].teamId]})`
                        : 'rgba(71,85,105,0.3)',
                    }}
                  />
                )}
              </div>

              {/* Step content */}
              <div className="sim-step-content">
                <div className="sim-step-top">
                  <span
                    className="sim-step-team"
                    style={{ color: TEAM_COLORS[step.teamId] }}
                  >
                    {TEAM_NAMES[step.teamId]}
                  </span>
                  <span className="sim-step-target">
                    → {step.target.toUpperCase()}
                  </span>
                </div>
                <div className="sim-step-title">{step.title}</div>
                {(isCurrent || step.status !== 'idle') && (
                  <motion.div
                    className="sim-step-desc"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.description}
                  </motion.div>
                )}
                {/* Status indicator */}
                {step.status !== 'idle' && (
                  <div className="sim-step-status" style={{ color: statusStyle.color }}>
                    {statusStyle.icon}
                    <span>
                      {step.status === 'in_progress' ? '진행중' :
                       step.status === 'completed' ? '완료' :
                       step.status === 'delayed' ? '지연' : '대기'}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SimulationPanel;
