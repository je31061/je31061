import { TeamId } from './DataStream';

// ─── Status types ──────────────────────────────────────────
export type TaskStatus = 'idle' | 'in_progress' | 'completed' | 'delayed';

export interface DetailField {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface TaskDetail {
  teamId: TeamId;
  cardIndex: number;       // index within the team's functions array
  title: string;
  description: string;
  status: TaskStatus;
  target: 'erp' | 'chs';  // which store it connects to
  fields: DetailField[];
}

// ─── Simulation step definition ────────────────────────────
export interface SimulationStep {
  id: number;
  teamId: TeamId;
  cardIndex: number;
  title: string;
  description: string;
  target: 'erp' | 'chs';
  durationMs: number;      // how long this step takes in demo
  status: TaskStatus;
}

// ─── Detailed business data for every card ─────────────────
export const TASK_DETAILS: TaskDetail[] = [
  // ═══════════ 마린서비스 (marine) ═══════════
  {
    teamId: 'marine', cardIndex: 0,
    title: '선박 관리', description: '등록 선박의 기본 정보 및 제원 관리',
    status: 'completed', target: 'erp',
    fields: [
      { label: '선명 (Vessel Name)', value: 'HMM ALGECIRAS', highlight: true },
      { label: '선박 코드', value: 'VES-2024-0847' },
      { label: 'IMO No.', value: '9863297' },
      { label: '선종', value: 'Container Ship (24,000 TEU)' },
      { label: '건조 연도', value: '2020' },
      { label: '선급 (Class)', value: 'KR (한국선급)' },
      { label: '관리 상태', value: '운항중' },
      { label: '최종 검사일', value: '2025-11-15' },
    ],
  },
  {
    teamId: 'marine', cardIndex: 1,
    title: '운항 지원', description: '선박 운항 스케줄 및 항만 입출항 관리',
    status: 'in_progress', target: 'erp',
    fields: [
      { label: '항차 번호', value: 'VOY-2026-FE032', highlight: true },
      { label: '출발항', value: 'Busan, KR (KRPUS)' },
      { label: '도착항', value: 'Rotterdam, NL (NLRTM)' },
      { label: 'ETD', value: '2026-02-10 14:00' },
      { label: 'ETA', value: '2026-03-05 08:00' },
      { label: '적재율', value: '94.2%' },
      { label: '연료 잔량', value: '3,450 MT (VLSFO)' },
      { label: '운항 상태', value: '정상 운항' },
    ],
  },
  {
    teamId: 'marine', cardIndex: 2,
    title: '계약 관리', description: '용선 계약 및 서비스 계약 관리',
    status: 'completed', target: 'erp',
    fields: [
      { label: '계약 번호', value: 'CON-2025-M-1204', highlight: true },
      { label: '계약 유형', value: '기간 용선 (T/C)' },
      { label: '용선료 (일)', value: 'USD 45,000/day' },
      { label: '계약 기간', value: '2025-06-01 ~ 2027-05-31' },
      { label: '선주사', value: 'Korea Shipping Corp.' },
      { label: '잔여 기간', value: '480일' },
      { label: '갱신 옵션', value: '+1년 (2027-06)' },
      { label: '보험 상태', value: 'P&I / H&M 유효' },
    ],
  },
  {
    teamId: 'marine', cardIndex: 3,
    title: '정비 이력', description: '선박 정비 및 수리 기록 이력 관리',
    status: 'in_progress', target: 'chs',
    fields: [
      { label: '정비 번호', value: 'MNT-2026-0198', highlight: true },
      { label: '선명', value: 'HMM ALGECIRAS' },
      { label: '정비 유형', value: '정기 점검 (Scheduled)' },
      { label: '작업 구분', value: 'Main Engine Overhaul' },
      { label: '착수일', value: '2026-01-20' },
      { label: '완료 예정일', value: '2026-02-15' },
      { label: '담당 업체', value: 'HHI Engine Service' },
      { label: '작업 진척', value: '78%' },
      { label: '비용 (누적)', value: 'KRW 1,250,000,000' },
    ],
  },
  {
    teamId: 'marine', cardIndex: 4,
    title: '안전 점검', description: 'ISM/ISPS 기반 선박 안전 점검 관리',
    status: 'completed', target: 'chs',
    fields: [
      { label: '점검 번호', value: 'SAF-2026-0052', highlight: true },
      { label: '점검 유형', value: 'PSC (Port State Control)' },
      { label: '점검 항', value: 'Singapore (SGSIN)' },
      { label: '점검일', value: '2026-01-28' },
      { label: '결함 건수', value: '0건 (Clear)' },
      { label: '억류 여부', value: 'No Detention' },
      { label: 'ISM 인증', value: '유효 (2027-08 만료)' },
      { label: '차기 점검', value: '2026-04-15 (Annual)' },
    ],
  },
  {
    teamId: 'marine', cardIndex: 5,
    title: '성과 분석', description: '선박 운영 성과 및 KPI 분석',
    status: 'idle', target: 'erp',
    fields: [
      { label: '분석 기간', value: '2026년 1월', highlight: true },
      { label: '가동률', value: '96.8%' },
      { label: '평균 항차일', value: '22.4일' },
      { label: '연료 효율', value: '32.1 MT/day (목표: 33)' },
      { label: 'CII Rating', value: 'B (목표: B 이상)' },
      { label: '클레임 건수', value: '2건 (전월대비 -1)' },
      { label: '수익률 (ROI)', value: '12.4%' },
    ],
  },

  // ═══════════ AM개발 (dev) ═══════════
  {
    teamId: 'dev', cardIndex: 0,
    title: '시스템 개발', description: 'AM 플랫폼 시스템 개발 및 유지보수',
    status: 'in_progress', target: 'chs',
    fields: [
      { label: '프로젝트 코드', value: 'PRJ-AM-2026-004', highlight: true },
      { label: '프로젝트명', value: 'CHS v3.2 마이그레이션' },
      { label: '스프린트', value: 'Sprint 14 (2/3 ~ 2/14)' },
      { label: '진행률', value: '64%' },
      { label: '담당 개발자', value: '김민수 외 4명' },
      { label: '백로그 잔여', value: '23 Story Points' },
      { label: '기술 스택', value: 'React / Spring Boot / K8s' },
      { label: '배포 예정일', value: '2026-02-28' },
    ],
  },
  {
    teamId: 'dev', cardIndex: 1,
    title: '형상 관리', description: '소스 코드 및 릴리스 형상 관리',
    status: 'completed', target: 'chs',
    fields: [
      { label: '릴리스 버전', value: 'v3.1.7', highlight: true },
      { label: 'Git Branch', value: 'release/3.1.7' },
      { label: '커밋 수', value: '142 commits' },
      { label: 'Merge 상태', value: 'Approved & Merged' },
      { label: '변경 파일', value: '87 files changed' },
      { label: '코드 리뷰', value: '완료 (Reviewer: 이정훈)' },
      { label: '배포 환경', value: 'Production' },
      { label: '롤백 가능', value: 'v3.1.6 (Snapshot 보존)' },
    ],
  },
  {
    teamId: 'dev', cardIndex: 2,
    title: '테스트/QA', description: '통합 테스트 및 품질 보증 프로세스',
    status: 'in_progress', target: 'chs',
    fields: [
      { label: '테스트 ID', value: 'QA-2026-CHS-032', highlight: true },
      { label: '테스트 유형', value: '통합 테스트 (E2E)' },
      { label: '전체 케이스', value: '384건' },
      { label: 'Pass', value: '341건 (88.8%)' },
      { label: 'Fail', value: '12건' },
      { label: 'Blocked', value: '31건' },
      { label: '심각도 High', value: '3건 (수정중)' },
      { label: '완료 예정', value: '2026-02-12' },
    ],
  },
  {
    teamId: 'dev', cardIndex: 3,
    title: 'API 연동', description: 'ERP/CHS 간 API 연동 및 데이터 파이프라인',
    status: 'completed', target: 'erp',
    fields: [
      { label: 'API 버전', value: 'v2.4.1', highlight: true },
      { label: '엔드포인트 수', value: '47개' },
      { label: '일 호출량', value: '1,240,000건' },
      { label: '평균 응답', value: '142ms (SLA: 200ms)' },
      { label: '에러율', value: '0.02%' },
      { label: '인증 방식', value: 'OAuth 2.0 + JWT' },
      { label: '최종 동기화', value: '2026-02-09 14:23' },
      { label: 'Rate Limit', value: '5,000 req/min' },
    ],
  },
  {
    teamId: 'dev', cardIndex: 4,
    title: '모니터링', description: '시스템 성능 및 장애 실시간 모니터링',
    status: 'idle', target: 'chs',
    fields: [
      { label: '대시보드', value: 'Grafana / Prometheus', highlight: true },
      { label: 'CPU 사용률', value: '42% (avg)' },
      { label: 'Memory', value: '67% (12.8/19.2 GB)' },
      { label: 'Disk I/O', value: '230 MB/s' },
      { label: 'Active Users', value: '847명 (현재)' },
      { label: '장애 건수 (월)', value: '1건 (P3 복구완료)' },
      { label: 'Uptime (30일)', value: '99.97%' },
    ],
  },
  {
    teamId: 'dev', cardIndex: 5,
    title: '인프라 관리', description: '클라우드 인프라 및 DevOps 파이프라인',
    status: 'completed', target: 'erp',
    fields: [
      { label: '클라우드', value: 'AWS ap-northeast-2', highlight: true },
      { label: 'K8s 클러스터', value: 'EKS (3 Node Group)' },
      { label: 'Pod 수', value: '124개 Running' },
      { label: 'CI/CD', value: 'Jenkins + ArgoCD' },
      { label: '최근 배포', value: '2026-02-08 16:45' },
      { label: '월 비용', value: 'USD 8,420' },
      { label: 'DR 상태', value: 'Active-Standby (정상)' },
    ],
  },

  // ═══════════ 스페어 (spare) ═══════════
  {
    teamId: 'spare', cardIndex: 0,
    title: '부품 조회', description: 'Spare Part BOM 조회 및 카탈로그 검색',
    status: 'idle', target: 'erp',
    fields: [
      { label: '자재 코드', value: 'SP-ENG-MAN-0847', highlight: true },
      { label: '자재명', value: 'Cylinder Liner (Main Engine)' },
      { label: 'Maker', value: 'MAN Energy Solutions' },
      { label: 'Drawing No.', value: 'DWG-51/60DF-CL-003' },
      { label: '적용 엔진', value: 'MAN 51/60DF' },
      { label: '단가', value: 'EUR 12,400' },
      { label: '재고 수량', value: '3 EA (안전재고: 2)' },
      { label: '리드 타임', value: '12주' },
    ],
  },
  {
    teamId: 'spare', cardIndex: 1,
    title: '구매 발주', description: '스페어 파트 구매 요청 및 발주 관리',
    status: 'in_progress', target: 'erp',
    fields: [
      { label: '발주 번호', value: 'PO-2026-SP-0423', highlight: true },
      { label: '수주 번호', value: 'SO-2026-0198' },
      { label: '발주 품목', value: 'Turbocharger Rotor Blade Set' },
      { label: '수량', value: '2 SET' },
      { label: '공급사', value: 'ABB Turbo Systems' },
      { label: '발주 금액', value: 'EUR 34,800' },
      { label: '납기일', value: '2026-04-20' },
      { label: '승인 상태', value: '부서장 승인 대기', highlight: true },
      { label: '결재 단계', value: '2/3 (팀장 승인 완료)' },
    ],
  },
  {
    teamId: 'spare', cardIndex: 2,
    title: '재고 관리', description: '스페어 파트 창고 재고 및 입출고 관리',
    status: 'completed', target: 'erp',
    fields: [
      { label: '창고 코드', value: 'WH-BUSAN-01', highlight: true },
      { label: '총 SKU', value: '14,823 품목' },
      { label: '재고 금액', value: 'KRW 48.2억원' },
      { label: '금월 입고', value: '342건' },
      { label: '금월 출고', value: '287건' },
      { label: '회전율', value: '4.2회/년' },
      { label: '부족 경보', value: '12품목 (발주 진행중)' },
      { label: '과잉 재고', value: '8품목 (처분 검토)' },
    ],
  },
  {
    teamId: 'spare', cardIndex: 3,
    title: '물류 배송', description: '스페어 파트 국제 물류 및 배송 추적',
    status: 'in_progress', target: 'chs',
    fields: [
      { label: '배송 번호', value: 'SHP-2026-0567', highlight: true },
      { label: 'Tracking No.', value: 'FDX-7892341560' },
      { label: '출발지', value: 'Hamburg, DE' },
      { label: '도착지', value: 'Busan, KR (직배송)' },
      { label: '운송 수단', value: 'Air Freight (긴급)' },
      { label: '예상 도착', value: '2026-02-11 (D+2)' },
      { label: '현재 위치', value: 'Incheon Airport (통관중)' },
      { label: '운송비', value: 'USD 2,840' },
    ],
  },
  {
    teamId: 'spare', cardIndex: 4,
    title: '수요 예측', description: 'AI 기반 스페어 파트 수요 예측 분석',
    status: 'idle', target: 'erp',
    fields: [
      { label: '예측 모델', value: 'LSTM + XGBoost Ensemble', highlight: true },
      { label: '예측 기간', value: '2026 Q2' },
      { label: '대상 품목', value: 'A-class 847품목' },
      { label: '예측 정확도', value: '91.3% (MAPE: 8.7%)' },
      { label: '발주 제안', value: '124건 생성' },
      { label: '예상 절감', value: 'KRW 3.2억원 (재고 최적화)' },
      { label: '최종 학습일', value: '2026-02-01' },
    ],
  },
  {
    teamId: 'spare', cardIndex: 5,
    title: '품질 검수', description: '입고 부품 품질 검사 및 성적서 관리',
    status: 'completed', target: 'chs',
    fields: [
      { label: '검수 번호', value: 'QI-2026-0891', highlight: true },
      { label: '대상 부품', value: 'Fuel Injection Valve Assy' },
      { label: '공급사', value: 'Wärtsilä Parts' },
      { label: '검수 항목', value: '외관/치수/기능 (12항목)' },
      { label: '합격 여부', value: 'PASS (전 항목 적합)' },
      { label: '성적서 번호', value: 'CERT-WAR-2026-445' },
      { label: '검수일', value: '2026-02-07' },
      { label: '입고 창고', value: 'WH-BUSAN-01 (A-3-12)' },
    ],
  },

  // ═══════════ MRO (mro) ═══════════
  {
    teamId: 'mro', cardIndex: 0,
    title: '장비 관리', description: '선박 주요 장비 등록 및 현황 관리',
    status: 'completed', target: 'erp',
    fields: [
      { label: '장비 코드', value: 'EQ-ME-001', highlight: true },
      { label: '장비명', value: 'Main Engine (No.1)' },
      { label: '제조사', value: 'MAN Energy Solutions' },
      { label: '모델', value: 'MAN B&W 11G95ME-C10.5' },
      { label: '설치일', value: '2020-03-15' },
      { label: '운전 시간', value: '42,150 hrs' },
      { label: '상태 등급', value: 'A (양호)' },
      { label: '센서 검교정', value: '2026-01-15 (유효)' },
    ],
  },
  {
    teamId: 'mro', cardIndex: 1,
    title: '정비 계획', description: 'PMS 기반 예방 정비 계획 수립',
    status: 'in_progress', target: 'chs',
    fields: [
      { label: '계획 번호', value: 'PMS-2026-Q1-042', highlight: true },
      { label: '대상 선박', value: 'HMM ALGECIRAS' },
      { label: '정비 유형', value: '정기 정비 (4,000hr)' },
      { label: '대상 장비', value: 'M/E, G/E, Boiler, Purifier' },
      { label: '계획 작업수', value: '28건' },
      { label: '완료 작업', value: '19건 (67.8%)' },
      { label: '다음 입거', value: '2027-06 (중간 검사)' },
      { label: '예산', value: 'KRW 2,100,000,000' },
    ],
  },
  {
    teamId: 'mro', cardIndex: 2,
    title: '작업 지시', description: '정비 작업 지시서 생성 및 관리',
    status: 'in_progress', target: 'erp',
    fields: [
      { label: '작업지시 번호', value: 'WO-2026-0347', highlight: true },
      { label: '작업명', value: 'M/E Cylinder Liner 교체', highlight: true },
      { label: '긴급도', value: 'HIGH (계획 정비)' },
      { label: '대상 장비', value: 'Main Engine Cyl. #5' },
      { label: '착수일', value: '2026-02-08' },
      { label: '완료 예정', value: '2026-02-12' },
      { label: '소요 부품', value: 'SP-ENG-MAN-0847 x1' },
      { label: '작업자', value: '박정현 (기관사) 외 2명' },
      { label: '기 실적', value: '실린더 #3 교체 (2025-08)' },
    ],
  },
  {
    teamId: 'mro', cardIndex: 3,
    title: '고장 분석', description: 'FMEA/RCA 기반 장비 고장 분석',
    status: 'delayed', target: 'chs',
    fields: [
      { label: '분석 번호', value: 'FA-2026-0023', highlight: true },
      { label: '고장 장비', value: 'G/E #2 (Turbocharger)' },
      { label: '고장 일시', value: '2026-01-25 04:32' },
      { label: '고장 유형', value: 'Bearing Failure' },
      { label: 'RCA 결과', value: '윤활유 오염 (수분 혼입)' },
      { label: '심각도', value: 'Critical (운전 불가)' },
      { label: '재발 방지', value: '윤활유 분석 주기 단축 (3M→1M)' },
      { label: '복구 비용', value: 'EUR 68,000' },
      { label: '분석 상태', value: '보고서 작성중 (지연)' },
    ],
  },
  {
    teamId: 'mro', cardIndex: 4,
    title: '수리 이력', description: '장비 수리 및 교체 이력 데이터베이스',
    status: 'completed', target: 'chs',
    fields: [
      { label: '이력 번호', value: 'RPR-2026-0189', highlight: true },
      { label: '장비', value: 'Ballast Water Mgmt System' },
      { label: '수리 유형', value: 'UV Lamp 모듈 교체' },
      { label: '수리일', value: '2026-02-03' },
      { label: '소요 시간', value: '4.5시간' },
      { label: '사용 부품', value: 'UV-LAMP-MOD-12 x4' },
      { label: '수리 비용', value: 'USD 8,200' },
      { label: '다음 교체 예정', value: '2026-08 (6개월 주기)' },
    ],
  },
  {
    teamId: 'mro', cardIndex: 5,
    title: '비용 분석', description: '정비 비용 실적 분석 및 예산 관리',
    status: 'idle', target: 'erp',
    fields: [
      { label: '분석 기간', value: '2026년 1월', highlight: true },
      { label: '총 정비비', value: 'KRW 3,420,000,000' },
      { label: '예산 대비', value: '92.3% (절감 7.7%)' },
      { label: '예방 정비', value: '68% (목표: 70%)' },
      { label: '긴급 수리', value: '32% (목표: 30% 이하)' },
      { label: '선대 평균', value: 'KRW 2,840,000,000' },
      { label: 'OPEX/선박', value: 'USD 6,800/day' },
    ],
  },
];

// ─── Simulation scenario: 클레임 발생 → 정산 전체 프로세스 ───
export const SIMULATION_STEPS: SimulationStep[] = [
  {
    id: 1, teamId: 'marine', cardIndex: 4,
    title: '1. 클레임 접수',
    description: '마린서비스팀에서 선박 클레임 발생을 접수하고 초기 조사를 시작합니다.',
    target: 'chs', durationMs: 2500, status: 'idle',
  },
  {
    id: 2, teamId: 'marine', cardIndex: 3,
    title: '2. 정비 이력 확인',
    description: 'CHS에서 해당 선박의 과거 정비 이력 및 관련 장비 기록을 조회합니다.',
    target: 'chs', durationMs: 2000, status: 'idle',
  },
  {
    id: 3, teamId: 'mro', cardIndex: 3,
    title: '3. 고장 분석 (FMEA/RCA)',
    description: 'MRO팀에서 고장 원인을 분석하고 Root Cause Analysis를 수행합니다.',
    target: 'chs', durationMs: 3000, status: 'idle',
  },
  {
    id: 4, teamId: 'mro', cardIndex: 2,
    title: '4. 작업 지시 생성',
    description: '분석 결과를 바탕으로 정비 작업 지시서를 생성하고 ERP에 등록합니다.',
    target: 'erp', durationMs: 2000, status: 'idle',
  },
  {
    id: 5, teamId: 'spare', cardIndex: 0,
    title: '5. 소요 부품 조회',
    description: '작업에 필요한 스페어 파트를 ERP BOM에서 조회합니다.',
    target: 'erp', durationMs: 1500, status: 'idle',
  },
  {
    id: 6, teamId: 'spare', cardIndex: 1,
    title: '6. 구매 발주',
    description: '재고 부족 부품에 대해 긴급 구매 발주를 진행합니다.',
    target: 'erp', durationMs: 2500, status: 'idle',
  },
  {
    id: 7, teamId: 'spare', cardIndex: 3,
    title: '7. 물류 배송 추적',
    description: '발주된 부품의 국제 물류 배송을 실시간 추적합니다.',
    target: 'chs', durationMs: 2000, status: 'idle',
  },
  {
    id: 8, teamId: 'spare', cardIndex: 5,
    title: '8. 품질 검수',
    description: '입고된 부품의 품질 검사를 수행하고 성적서를 등록합니다.',
    target: 'chs', durationMs: 1500, status: 'idle',
  },
  {
    id: 9, teamId: 'mro', cardIndex: 1,
    title: '9. 정비 실시',
    description: 'MRO팀에서 정비 계획에 따라 실제 수리/교체 작업을 수행합니다.',
    target: 'chs', durationMs: 3000, status: 'idle',
  },
  {
    id: 10, teamId: 'dev', cardIndex: 3,
    title: '10. 데이터 동기화',
    description: 'AM개발팀의 API를 통해 ERP ↔ CHS 간 정비 결과 데이터를 동기화합니다.',
    target: 'erp', durationMs: 1500, status: 'idle',
  },
  {
    id: 11, teamId: 'marine', cardIndex: 2,
    title: '11. 비용 정산',
    description: '마린서비스팀에서 계약 조건에 따라 클레임 비용을 정산 처리합니다.',
    target: 'erp', durationMs: 2500, status: 'idle',
  },
  {
    id: 12, teamId: 'mro', cardIndex: 5,
    title: '12. 최종 보고',
    description: '전체 프로세스 결과를 종합하여 비용 분석 보고서를 작성합니다.',
    target: 'erp', durationMs: 2000, status: 'idle',
  },
];
