import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import './App.css';

interface FunctionCard {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
}

interface TeamData {
  id: string;
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

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });
  };

  return (
    <div className="dashboard">
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
      <main className="dashboard-main">
        {/* Left Panel - 4 Team Areas */}
        <div className="teams-panel">
          {teamsData.map((team) => (
            <div key={team.id} className={`team-section ${team.className}`}>
              <div className="team-header">
                <div className="team-header-left">
                  <div className="team-icon-wrap">{team.icon}</div>
                  <div className="team-name">{team.name}</div>
                </div>
                <span className="team-badge">{team.badge}</span>
              </div>
              <div className="cards-grid">
                {team.functions.map((func, idx) => (
                  <div key={idx} className="func-card">
                    <div className="card-icon">{func.icon}</div>
                    <div className="card-label">{func.label}</div>
                    <div className="card-sublabel">{func.sublabel}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Center Panel - ERP & CHS */}
        <div className="center-panel">
          {/* Flow arrows */}
          <div className="flow-arrows flow-arrows-left">
            <div className="flow-arrow">
              <div className="flow-dot" />
              <div className="flow-dot" />
              <div className="flow-dot" />
            </div>
            <div className="flow-arrow">
              <div className="flow-dot" />
              <div className="flow-dot" />
              <div className="flow-dot" />
            </div>
            <div className="flow-arrow">
              <div className="flow-dot" />
              <div className="flow-dot" />
              <div className="flow-dot" />
            </div>
          </div>

          {/* ERP Node */}
          <div className="data-store data-store-erp">
            <div className="store-icon-wrap">
              <Database size={28} />
            </div>
            <div className="store-name">ERP</div>
            <div className="store-desc">
              전사 자원 관리 시스템
              <br />
              Enterprise Resource Planning
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
          </div>

          {/* Connector between ERP and CHS */}
          <div className="store-connector">
            <div className="connector-line" />
            <div className="connector-dot" />
            <div className="connector-line" />
            <ArrowRightLeft size={16} style={{ color: '#64748b', transform: 'rotate(90deg)' }} />
            <div className="connector-line" />
            <div className="connector-dot" />
            <div className="connector-line" />
          </div>

          {/* CHS Node */}
          <div className="data-store data-store-chs">
            <div className="store-icon-wrap">
              <Server size={28} />
            </div>
            <div className="store-name">CHS</div>
            <div className="store-desc">
              통합 이력 관리 시스템
              <br />
              Consolidated History System
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
          </div>
        </div>

        {/* Right Panel - Legend & Info */}
        <div className="right-panel">
          {/* Legend */}
          <div className="info-card">
            <div className="info-card-title">Teams</div>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#06b6d4' }} />
                <span className="legend-label">마린서비스</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#6366f1' }} />
                <span className="legend-label">AM개발</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#a855f7' }} />
                <span className="legend-label">스페어</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#ec4899' }} />
                <span className="legend-label">MRO</span>
              </div>
            </div>
          </div>

          {/* Data Flow */}
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

          {/* Activity */}
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
              <div className="activity-item">
                <div className="activity-dot" style={{ background: '#22d3ee' }} />
                <div>
                  <div className="activity-text">ERP 데이터 동기화</div>
                  <div className="activity-time">30분 전</div>
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="info-card">
            <div className="info-card-title">System</div>
            <div className="flow-stats">
              <div className="flow-stat-item">
                <span className="flow-stat-name">CPU</span>
                <div className="flow-stat-bar">
                  <div
                    className="flow-stat-fill"
                    style={{ width: '42%', background: 'linear-gradient(90deg, #22d3ee, #06b6d4)' }}
                  />
                </div>
              </div>
              <div className="flow-stat-item">
                <span className="flow-stat-name">Memory</span>
                <div className="flow-stat-bar">
                  <div
                    className="flow-stat-fill"
                    style={{ width: '67%', background: 'linear-gradient(90deg, #818cf8, #6366f1)' }}
                  />
                </div>
              </div>
              <div className="flow-stat-item">
                <span className="flow-stat-name">Network</span>
                <div className="flow-stat-bar">
                  <div
                    className="flow-stat-fill"
                    style={{ width: '31%', background: 'linear-gradient(90deg, #c084fc, #a855f7)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
