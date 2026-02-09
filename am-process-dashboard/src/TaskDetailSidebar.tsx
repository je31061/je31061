import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Clock, CheckCircle2, AlertTriangle, Minus } from 'lucide-react';
import { TaskDetail, TaskStatus } from './taskData';
import { TeamId } from './DataStream';

interface TaskDetailSidebarProps {
  task: TaskDetail | null;
  onClose: () => void;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; labelKo: string; color: string; bg: string; icon: React.ReactNode }> = {
  idle: {
    label: 'Idle', labelKo: '대기', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',
    icon: <Minus size={12} />,
  },
  in_progress: {
    label: 'In Progress', labelKo: '진행중', color: '#facc15', bg: 'rgba(250,204,21,0.1)',
    icon: <Clock size={12} />,
  },
  completed: {
    label: 'Completed', labelKo: '완료', color: '#4ade80', bg: 'rgba(74,222,128,0.1)',
    icon: <CheckCircle2 size={12} />,
  },
  delayed: {
    label: 'Delayed', labelKo: '지연', color: '#f87171', bg: 'rgba(248,113,113,0.1)',
    icon: <AlertTriangle size={12} />,
  },
};

const TEAM_COLORS: Record<TeamId, { primary: string; bg: string; border: string }> = {
  marine: { primary: '#22d3ee', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.25)' },
  dev: { primary: '#818cf8', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
  spare: { primary: '#c084fc', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.25)' },
  mro: { primary: '#f472b6', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)' },
};

const TEAM_NAMES: Record<TeamId, string> = {
  marine: '마린서비스', dev: 'AM개발', spare: '스페어', mro: 'MRO',
};

const TaskDetailSidebar: React.FC<TaskDetailSidebarProps> = ({ task, onClose }) => {
  return (
    <AnimatePresence>
      {task && (
        <>
          {/* Backdrop */}
          <motion.div
            className="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {/* Sidebar */}
          <motion.div
            className="sidebar-panel"
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sidebar-header">
              <div className="sidebar-header-top">
                <div
                  className="sidebar-team-badge"
                  style={{
                    background: TEAM_COLORS[task.teamId].bg,
                    border: `1px solid ${TEAM_COLORS[task.teamId].border}`,
                    color: TEAM_COLORS[task.teamId].primary,
                  }}
                >
                  {TEAM_NAMES[task.teamId]}
                </div>
                <button className="sidebar-close" onClick={onClose} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <h2 className="sidebar-title">{task.title}</h2>
              <p className="sidebar-desc">{task.description}</p>

              {/* Status + Target */}
              <div className="sidebar-meta">
                <div
                  className="sidebar-status"
                  style={{
                    background: STATUS_CONFIG[task.status].bg,
                    borderColor: STATUS_CONFIG[task.status].color,
                    color: STATUS_CONFIG[task.status].color,
                  }}
                >
                  {STATUS_CONFIG[task.status].icon}
                  <span>{STATUS_CONFIG[task.status].labelKo}</span>
                </div>
                <div className="sidebar-target">
                  <ArrowRight size={12} style={{ color: '#64748b' }} />
                  <span
                    className="sidebar-target-name"
                    style={{
                      color: task.target === 'erp' ? '#22d3ee' : '#818cf8',
                    }}
                  >
                    {task.target.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              className="sidebar-divider"
              style={{
                background: `linear-gradient(90deg, ${TEAM_COLORS[task.teamId].primary}40, transparent)`,
              }}
            />

            {/* Fields */}
            <div className="sidebar-fields">
              <div className="sidebar-fields-title">상세 데이터 항목</div>
              {task.fields.map((field, idx) => (
                <motion.div
                  key={idx}
                  className={`sidebar-field ${field.highlight ? 'sidebar-field-highlight' : ''}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                >
                  <span className="field-label">{field.label}</span>
                  <span
                    className="field-value"
                    style={field.highlight ? { color: TEAM_COLORS[task.teamId].primary } : {}}
                  >
                    {field.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="sidebar-footer">
              <div className="sidebar-footer-note">
                데이터 연동: {task.target.toUpperCase()} &middot; 실시간 동기화
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailSidebar;
export { STATUS_CONFIG };
