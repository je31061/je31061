import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Ship,
  Anchor,
  Navigation,
  FileText,
  ClipboardList,
  Settings,
  Code2,
  Cpu,
  GitBranch,
  TestTube2,
  Layers,
  Monitor,
  Package,
  Truck,
  BarChart3,
  Search,
  ShoppingCart,
  Warehouse,
  Wrench,
  HardDrive,
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Database,
  Server,
  Activity,
  ArrowRightLeft,
  Play,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import DataStream, { TeamId } from './DataStream';
import TaskDetailSidebar from './TaskDetailSidebar';
import SimulationPanel from './SimulationPanel';
import { TASK_DETAILS, SIMULATION_STEPS, TaskDetail, SimulationStep, TaskStatus } from './taskData';
import './App.css';

interface FunctionCard {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
}

interface TeamData {
  id: TeamId;
  name: string;
  nameEn: string;
  className: string;
  icon: React.ReactNode;
  badge: string;
  functions: FunctionCard[];
}

const teamsData: TeamData[] = [
  {
    id: 'marine',
    name: '마린서비스',
    nameEn: 'Marine Service',
    className: 'team-marine',
    icon: <Ship size={20} />,
    badge: 'MARINE',
    functions: [
      { icon: <Anchor size={16} />, label: '선박 관리', sublabel: 'Vessel Mgmt' },
      { icon: <Navigation size={16} />, label: '운항 지원', sublabel: 'Operation Support' },
      { icon: <FileText size={16} />, label: '계약 관리', sublabel: 'Contract Mgmt' },
      { icon: <ClipboardList size={16} />, label: '정비 이력', sublabel: 'Maintenance Log' },
      { icon: <AlertTriangle size={16} />, label: '안전 점검', sublabel: 'Safety Check' },
      { icon: <BarChart3 size={16} />, label: '성과 분석', sublabel: 'Performance' },
    ],
  },
  {
    id: 'dev',
    name: 'AM개발',
    nameEn: 'AM Development',
    className: 'team-dev',
    icon: <Code2 size={20} />,
    badge: 'DEV',
    functions: [
      { icon: <Cpu size={16} />, label: '시스템 개발', sublabel: 'System Dev' },
      { icon: <GitBranch size={16} />, label: '형상 관리', sublabel: 'Version Control' },
      { icon: <TestTube2 size={16} />, label: '테스트/QA', sublabel: 'Testing & QA' },
      { icon: <Layers size={16} />, label: 'API 연동', sublabel: 'API Integration' },
      { icon: <Monitor size={16} />, label: '모니터링', sublabel: 'Monitoring' },
      { icon: <Settings size={16} />, label: '인프라 관리', sublabel: 'Infrastructure' },
    ],
  },
  {
    id: 'spare',
    name: '스페어',
    nameEn: 'Spare Parts',
    className: 'team-spare',
    icon: <Package size={20} />,
    badge: 'SPARE',
    functions: [
      { icon: <Search size={16} />, label: '부품 조회', sublabel: 'Parts Search' },
      { icon: <ShoppingCart size={16} />, label: '구매 발주', sublabel: 'Procurement' },
      { icon: <Warehouse size={16} />, label: '재고 관리', sublabel: 'Inventory' },
      { icon: <Truck size={16} />, label: '물류 배송', sublabel: 'Logistics' },
      { icon: <BarChart3 size={16} />, label: '수요 예측', sublabel: 'Demand Forecast' },
      { icon: <CheckCircle2 size={16} />, label: '품질 검수', sublabel: 'Quality Check' },
    ],
  },
  {
    id: 'mro',
    name: 'MRO',
    nameEn: 'Maintenance, Repair & Overhaul',
    className: 'team-mro',
    icon: <Wrench size={20} />,
    badge: 'MRO',
    functions: [
      { icon: <HardDrive size={16} />, label: '장비 관리', sublabel: 'Equipment Mgmt' },
      { icon: <CalendarCheck size={16} />, label: '정비 계획', sublabel: 'Maintenance Plan' },
      { icon: <ClipboardList size={16} />, label: '작업 지시', sublabel: 'Work Order' },
      { icon: <AlertTriangle size={16} />, label: '고장 분석', sublabel: 'Failure Analysis' },
      { icon: <Wrench size={16} />, label: '수리 이력', sublabel: 'Repair History' },
      { icon: <BarChart3 size={16} />, label: '비용 분석', sublabel: 'Cost Analysis' },
    ],
  },
];

// ─── Get task status from TASK_DETAILS or simulation state ──
function getCardStatus(
  teamId: TeamId,
  cardIndex: number,
  simSteps: SimulationStep[],
  simRunning: boolean,
): TaskStatus {
  // If simulation is running, use simulation step status
  if (simRunning) {
    const simStep = simSteps.find(s => s.teamId === teamId && s.cardIndex === cardIndex);
    if (simStep && simStep.status !== 'idle') return simStep.status;
  }
  // Otherwise use static task data status
  const task = TASK_DETAILS.find(t => t.teamId === teamId && t.cardIndex === cardIndex);
  return task?.status || 'idle';
}

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTeam, setActiveTeam] = useState<TeamId | null>(null);

  // Detail sidebar
  const [selectedTask, setSelectedTask] = useState<TaskDetail | null>(null);

  // Simulation
  const [showSimPanel, setShowSimPanel] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simSteps, setSimSteps] = useState<SimulationStep[]>(
    SIMULATION_STEPS.map(s => ({ ...s }))
  );
  const [currentSimStepId, setCurrentSimStepId] = useState(0);
  const simTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track which card is being highlighted by simulation
  const [simHighlight, setSimHighlight] = useState<{ teamId: TeamId; cardIndex: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });

  // ─── Team click ───────────────────────────────────
  const handleTeamClick = useCallback((teamId: TeamId) => {
    setActiveTeam(prev => (prev === teamId ? null : teamId));
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('dashboard-main')) {
      setActiveTeam(null);
    }
  }, []);

  // ─── Card click → open detail sidebar ─────────────
  const handleCardClick = useCallback((e: React.MouseEvent, teamId: TeamId, cardIndex: number) => {
    e.stopPropagation(); // prevent team click from firing
    const task = TASK_DETAILS.find(t => t.teamId === teamId && t.cardIndex === cardIndex);
    if (task) setSelectedTask(task);
  }, []);

  // ─── Simulation engine ────────────────────────────
  const runSimStep = useCallback((stepIndex: number, steps: SimulationStep[]) => {
    if (stepIndex >= steps.length) {
      setSimRunning(false);
      setSimHighlight(null);
      return;
    }

    const step = steps[stepIndex];

    // Mark current step as in_progress
    setSimSteps(prev => prev.map(s =>
      s.id === step.id ? { ...s, status: 'in_progress' as TaskStatus } : s
    ));
    setCurrentSimStepId(step.id);
    setActiveTeam(step.teamId);
    setSimHighlight({ teamId: step.teamId, cardIndex: step.cardIndex });

    // After duration, mark completed and proceed
    simTimerRef.current = setTimeout(() => {
      // Step 3 (고장 분석) is intentionally delayed for demo
      const finalStatus: TaskStatus = step.id === 3 ? 'delayed' : 'completed';

      setSimSteps(prev => prev.map(s =>
        s.id === step.id ? { ...s, status: finalStatus } : s
      ));

      // Small gap before next step
      simTimerRef.current = setTimeout(() => {
        runSimStep(stepIndex + 1, steps);
      }, 400);
    }, step.durationMs);
  }, []);

  const handleSimStart = useCallback(() => {
    // Reset steps
    const freshSteps = SIMULATION_STEPS.map(s => ({ ...s, status: 'idle' as TaskStatus }));
    setSimSteps(freshSteps);
    setCurrentSimStepId(0);
    setSimRunning(true);
    setShowSimPanel(true);

    // Start from step 0
    setTimeout(() => runSimStep(0, freshSteps), 500);
  }, [runSimStep]);

  const handleSimStop = useCallback(() => {
    if (simTimerRef.current) clearTimeout(simTimerRef.current);
    setSimRunning(false);
    setSimHighlight(null);
  }, []);

  const handleSimReset = useCallback(() => {
    if (simTimerRef.current) clearTimeout(simTimerRef.current);
    setSimRunning(false);
    setSimSteps(SIMULATION_STEPS.map(s => ({ ...s, status: 'idle' as TaskStatus })));
    setCurrentSimStepId(0);
    setSimHighlight(null);
    setActiveTeam(null);
  }, []);

  const handleSimStepHighlight = useCallback((teamId: TeamId, cardIndex: number) => {
    setActiveTeam(teamId);
    const task = TASK_DETAILS.find(t => t.teamId === teamId && t.cardIndex === cardIndex);
    if (task) setSelectedTask(task);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearTimeout(simTimerRef.current);
    };
  }, []);

  return (
    <div className={`dashboard ${showSimPanel ? 'sim-active' : ''}`}>
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="header-logo">
            <Activity size={24} color="#fff" />
          </div>
          <div>
            <div className="header-title">AM 사업본부 프로세스 대시보드</div>
            <div className="header-subtitle">AM Division Process Dashboard</div>
          </div>
        </div>
        <div className="header-right">
          {/* Simulation toggle */}
          <button
            className={`sim-toggle-btn ${simRunning ? 'sim-running' : ''}`}
            onClick={() => {
              if (!showSimPanel) {
                setShowSimPanel(true);
              } else if (!simRunning) {
                handleSimStart();
              }
            }}
          >
            {simRunning ? <Zap size={14} /> : <Play size={14} />}
            <span>{simRunning ? '시뮬레이션 진행중' : '시뮬레이션 시작'}</span>
          </button>

          {/* Active team indicator */}
          <AnimatePresence>
            {activeTeam && (
              <motion.div
                className="active-team-indicator"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="indicator-label">Pipeline:</span>
                <span className={`indicator-team indicator-${activeTeam}`}>
                  {teamsData.find(t => t.id === activeTeam)?.name}
                </span>
                <button
                  className="indicator-clear"
                  onClick={() => setActiveTeam(null)}
                  aria-label="Clear filter"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="status-badge">
            <span className="status-dot" />
            System Online
          </div>
          <div className="time-display">
            <div>{formatDate(currentTime)}</div>
            <div style={{ textAlign: 'right', fontWeight: 600 }}>{formatTime(currentTime)}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main" onClick={handleBackdropClick}>
        {/* Data Stream SVG overlay */}
        <DataStream activeTeam={activeTeam} />

        {/* Left Panel - 4 Team Areas */}
        <div className="teams-panel">
          {teamsData.map((team) => {
            const isActive = activeTeam === null || activeTeam === team.id;
            const isSelected = activeTeam === team.id;
            return (
              <motion.div
                key={team.id}
                className={`team-section ${team.className} ${isSelected ? 'team-selected' : ''} ${!isActive ? 'team-dimmed' : ''}`}
                onClick={() => handleTeamClick(team.id)}
                animate={{
                  opacity: isActive ? 1 : 0.35,
                  scale: isSelected ? 1.01 : isActive ? 1 : 0.98,
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                whileHover={{ scale: isActive ? 1.02 : 0.98 }}
              >
                <div className="team-header">
                  <div className="team-header-left">
                    <div className="team-icon-wrap">{team.icon}</div>
                    <div className="team-name">{team.name}</div>
                  </div>
                  <span className="team-badge">{team.badge}</span>
                </div>
                <div className="cards-grid">
                  {team.functions.map((func, idx) => {
                    const cardStatus = getCardStatus(team.id, idx, simSteps, simRunning);
                    const isSimActive = simHighlight?.teamId === team.id && simHighlight?.cardIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`func-card ${isSimActive ? 'sim-active-card' : ''}`}
                        onClick={(e) => handleCardClick(e, team.id, idx)}
                      >
                        {/* Status dot */}
                        {cardStatus !== 'idle' && (
                          <div className={`card-status-dot status-${cardStatus}`} />
                        )}
                        <div className="card-icon">{func.icon}</div>
                        <div className="card-label">{func.label}</div>
                        <div className="card-sublabel">{func.sublabel}</div>
                      </div>
                    );
                  })}
                </div>
                {isSelected && (
                  <motion.div
                    className="selected-ring"
                    layoutId="selectedRing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Center Panel - ERP & CHS */}
        <div className="center-panel">
          <motion.div
            className="data-store data-store-erp"
            animate={{
              boxShadow: activeTeam
                ? (activeTeam === 'marine' || activeTeam === 'spare'
                  ? '0 0 40px rgba(6, 182, 212, 0.25), 0 0 80px rgba(6, 182, 212, 0.1)'
                  : '0 0 30px rgba(6, 182, 212, 0.08), 0 0 60px rgba(6, 182, 212, 0.03)')
                : '0 0 30px rgba(6, 182, 212, 0.1), 0 0 60px rgba(6, 182, 212, 0.05)',
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="store-icon-wrap">
              <Database size={28} />
            </div>
            <div className="store-name">ERP</div>
            <div className="store-desc">
              전사 자원 관리 시스템<br />Enterprise Resource Planning
            </div>
            <div className="store-stats">
              <div className="store-stat">
                <span className="store-stat-value">24</span>
                <span className="store-stat-label">Modules</span>
              </div>
              <div className="store-stat">
                <span className="store-stat-value">99.9%</span>
                <span className="store-stat-label">Uptime</span>
              </div>
            </div>
          </motion.div>

          <div className="store-connector">
            <div className="connector-line" />
            <div className="connector-dot" />
            <div className="connector-line" />
            <ArrowRightLeft size={16} style={{ color: '#64748b', transform: 'rotate(90deg)' }} />
            <div className="connector-line" />
            <div className="connector-dot" />
            <div className="connector-line" />
          </div>

          <motion.div
            className="data-store data-store-chs"
            animate={{
              boxShadow: activeTeam
                ? (activeTeam === 'dev' || activeTeam === 'mro'
                  ? '0 0 40px rgba(99, 102, 241, 0.25), 0 0 80px rgba(99, 102, 241, 0.1)'
                  : '0 0 30px rgba(99, 102, 241, 0.08), 0 0 60px rgba(99, 102, 241, 0.03)')
                : '0 0 30px rgba(99, 102, 241, 0.1), 0 0 60px rgba(99, 102, 241, 0.05)',
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="store-icon-wrap">
              <Server size={28} />
            </div>
            <div className="store-name">CHS</div>
            <div className="store-desc">
              통합 이력 관리 시스템<br />Consolidated History System
            </div>
            <div className="store-stats">
              <div className="store-stat">
                <span className="store-stat-value">1.2M</span>
                <span className="store-stat-label">Records</span>
              </div>
              <div className="store-stat">
                <span className="store-stat-value">12</span>
                <span className="store-stat-label">APIs</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Panel - Legend & Info */}
        <div className="right-panel">
          <div className="info-card">
            <div className="info-card-title">Teams</div>
            <div className="legend-items">
              {teamsData.map((team) => (
                <div
                  key={team.id}
                  className={`legend-item legend-clickable ${activeTeam === team.id ? 'legend-active' : ''}`}
                  onClick={() => handleTeamClick(team.id)}
                >
                  <div
                    className="legend-color"
                    style={{
                      background:
                        team.id === 'marine' ? '#06b6d4' :
                        team.id === 'dev' ? '#6366f1' :
                        team.id === 'spare' ? '#a855f7' : '#ec4899',
                    }}
                  />
                  <span className="legend-label">{team.name}</span>
                  {activeTeam === team.id && (
                    <motion.span
                      className="legend-active-dot"
                      layoutId="legendDot"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        background:
                          team.id === 'marine' ? '#22d3ee' :
                          team.id === 'dev' ? '#818cf8' :
                          team.id === 'spare' ? '#c084fc' : '#f472b6',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status Legend */}
          <div className="info-card">
            <div className="info-card-title">Status</div>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#facc15', width: 7, height: 7, borderRadius: '50%' }} />
                <span className="legend-label">진행중 (In Progress)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#4ade80', width: 7, height: 7, borderRadius: '50%' }} />
                <span className="legend-label">완료 (Completed)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#f87171', width: 7, height: 7, borderRadius: '50%' }} />
                <span className="legend-label">지연 (Delayed)</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card-title">Data Flow</div>
            <div className="flow-stats">
              <div className="flow-stat-item">
                <span className="flow-stat-name">마린 → ERP</span>
                <div className="flow-stat-bar">
                  <div className="flow-stat-fill" style={{ width: '85%', background: '#06b6d4' }} />
                </div>
              </div>
              <div className="flow-stat-item">
                <span className="flow-stat-name">AM개발 → CHS</span>
                <div className="flow-stat-bar">
                  <div className="flow-stat-fill" style={{ width: '72%', background: '#6366f1' }} />
                </div>
              </div>
              <div className="flow-stat-item">
                <span className="flow-stat-name">스페어 → ERP</span>
                <div className="flow-stat-bar">
                  <div className="flow-stat-fill" style={{ width: '90%', background: '#a855f7' }} />
                </div>
              </div>
              <div className="flow-stat-item">
                <span className="flow-stat-name">MRO → CHS</span>
                <div className="flow-stat-bar">
                  <div className="flow-stat-fill" style={{ width: '68%', background: '#ec4899' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card-title">Recent Activity</div>
            <div className="activity-feed">
              <div className="activity-item">
                <div className="activity-dot" style={{ background: '#06b6d4' }} />
                <div>
                  <div className="activity-text">선박 정기 점검 완료</div>
                  <div className="activity-time">2분 전</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot" style={{ background: '#a855f7' }} />
                <div>
                  <div className="activity-text">부품 발주 승인 대기</div>
                  <div className="activity-time">8분 전</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot" style={{ background: '#6366f1' }} />
                <div>
                  <div className="activity-text">API v2.4 배포 완료</div>
                  <div className="activity-time">15분 전</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot" style={{ background: '#ec4899' }} />
                <div>
                  <div className="activity-text">MRO 작업 지시 생성</div>
                  <div className="activity-time">23분 전</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Task Detail Sidebar */}
      <TaskDetailSidebar
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      {/* Simulation Panel */}
      <AnimatePresence>
        {showSimPanel && (
          <motion.div
            initial={{ y: 320 }}
            animate={{ y: 0 }}
            exit={{ y: 320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            <SimulationPanel
              isRunning={simRunning}
              onStart={handleSimStart}
              onStop={handleSimStop}
              onReset={handleSimReset}
              currentStepId={currentSimStepId}
              steps={simSteps}
              onStepHighlight={handleSimStepHighlight}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
