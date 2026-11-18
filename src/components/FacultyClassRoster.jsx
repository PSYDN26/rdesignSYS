import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Printer,
  ShieldCheck,
  FileSpreadsheet,
  X,
  TrendingUp,
  Brain,
  FileText,
  ChevronRight
} from 'lucide-react';
import './FacultyClassRoster.css';

const TODAY_DATE = new Date().toISOString().split('T')[0];

// Initial Cadets Enrolled in NAV 101 (Section BSMT 1-Alpha)
// Cross-referenced from Guidance Exam Bank (Gate 1), Runner (Gate 2), Encoding (Gate 4), Migration (Gate 5)
const INITIAL_ROSTER_CADETS = [
  {
    id: 'roster-001',
    studentId: '2024-00102',
    lastName: 'Dela Cruz',
    firstName: 'Juan',
    middleName: 'Santos',
    program: 'BSMT 1-Alpha',
    gender: 'Male',
    // Admissions Baseline (from Gates 2 & 5)
    entranceScore: 81.9,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 17, max: 20 },
      { name: 'English Nautical Terminology', score: 16, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 16, max: 20 },
      { name: 'Abstract Logic', score: 16.5, max: 20 },
    ],
    // Guidance Aptitude Clearance (from Gates 4 & 5 - RA 10029)
    aptitudeMode: 'mode_a',
    stanine: 7,
    percentileRank: 82.5,
    iqEquivalent: '115 (Above Average)',
    clinicalReport: 'Candidate demonstrates strong spatial orientation and situational readiness for deck watchkeeping duties.',
    evaluator: 'Maria Elena Santos, RPM (PRC #0012489)',
    testDate: '2024-07-15',
    status: 'Official / Enrolled',
  },
  {
    id: 'roster-002',
    studentId: '2024-00205',
    lastName: 'Magbanua',
    firstName: 'Joshua Caleb',
    middleName: 'Guinto',
    program: 'BSMT 1-Alpha',
    gender: 'Male',
    entranceScore: 69.0,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 13, max: 20 },
      { name: 'English Nautical Terminology', score: 14, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 14.2, max: 20 },
      { name: 'Abstract Logic', score: 14, max: 20 },
    ],
    aptitudeMode: 'pending',
    stanine: null,
    percentileRank: null,
    iqEquivalent: null,
    clinicalReport: 'Pending Guidance proctored assessment.',
    evaluator: 'A. Guinto, RPM',
    testDate: '2024-07-14',
    status: 'Official / Enrolled',
  },
  {
    id: 'roster-003',
    studentId: '2024-00312',
    lastName: 'Dizon',
    firstName: 'Camille Rose',
    middleName: 'Mendoza',
    program: 'BSMT 1-Alpha',
    gender: 'Female',
    entranceScore: 73.8,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 14.5, max: 20 },
      { name: 'English Nautical Terminology', score: 15, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 15, max: 20 },
      { name: 'Abstract Logic', score: 14.5, max: 20 },
    ],
    aptitudeMode: 'mode_b',
    stanine: null,
    percentileRank: null,
    iqEquivalent: null,
    clinicalReport: 'Psychometric endorsement: Candidate exhibits elevated stress during high-pressure timed navigation simulations. Endorsed for deck watchkeeping drills.',
    evaluator: 'Maria Elena Santos, RPM (PRC #0012489)',
    testDate: '2024-07-11',
    status: 'Official / Enrolled',
  },
  {
    id: 'roster-004',
    studentId: '2024-00389',
    lastName: 'Mercado',
    firstName: 'Angelo James',
    middleName: 'Torres',
    program: 'BSMT 1-Alpha',
    gender: 'Male',
    entranceScore: 84.5,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 18, max: 20 },
      { name: 'English Nautical Terminology', score: 17, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 16.5, max: 20 },
      { name: 'Abstract Logic', score: 16, max: 20 },
    ],
    aptitudeMode: 'mode_a',
    stanine: 8,
    percentileRank: 89.0,
    iqEquivalent: '120 (Superior)',
    clinicalReport: 'High cognitive aptitude across spatial mathematics and radar plotting exercises.',
    evaluator: 'Maria Elena Santos, RPM (PRC #0012489)',
    testDate: '2024-07-18',
    status: 'Official / Enrolled',
  },
  {
    id: 'roster-005',
    studentId: '2024-00411',
    lastName: 'Soriano',
    firstName: 'Ezekiel',
    middleName: 'David',
    program: 'BSMT 1-Alpha',
    gender: 'Male',
    entranceScore: 78.0,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 15.5, max: 20 },
      { name: 'English Nautical Terminology', score: 16, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 15.5, max: 20 },
      { name: 'Abstract Logic', score: 15, max: 20 },
    ],
    aptitudeMode: 'mode_a',
    stanine: 6,
    percentileRank: 65.0,
    iqEquivalent: '107 (Average)',
    clinicalReport: 'Steady cognitive performance suitable for standard watchkeeping training modules.',
    evaluator: 'A. Guinto, RPM',
    testDate: '2024-07-19',
    status: 'Official / Enrolled',
  },
  {
    id: 'roster-006',
    studentId: '2024-00455',
    lastName: 'Reyes',
    firstName: 'Bea Camille',
    middleName: 'Aquino',
    program: 'BSMT 1-Alpha',
    gender: 'Female',
    entranceScore: null,
    entranceCategories: [],
    aptitudeMode: 'mode_a',
    stanine: 5,
    percentileRank: 54.0,
    iqEquivalent: '101 (Average)',
    clinicalReport: 'Satisfactory baseline cognitive evaluation. Recommended for bridge watchkeeping simulator drill.',
    evaluator: 'Maria Elena Santos, RPM (PRC #0012489)',
    testDate: '2024-07-22',
    status: 'Official / Enrolled',
  },
  {
    id: 'roster-007',
    studentId: '2024-00492',
    lastName: 'Tan',
    firstName: 'Alexander Miguel',
    middleName: 'Lim',
    program: 'BSMT 1-Alpha',
    gender: 'Male',
    entranceScore: 87.5,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 18, max: 20 },
      { name: 'English Nautical Terminology', score: 17, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 17.5, max: 20 },
    ],
    aptitudeMode: 'mode_a',
    stanine: 8,
    percentileRank: 91.0,
    iqEquivalent: '122 (Superior)',
    clinicalReport: 'Exemplary cognitive processing speed and administrative comprehension.',
    evaluator: 'R. Ramos, RPM',
    testDate: '2023-08-11',
    status: 'Official / Enrolled',
  },
  {
    id: 'roster-008',
    studentId: '2024-00520',
    lastName: 'Alvarez',
    firstName: 'Danielle John',
    middleName: 'Perez',
    program: 'BSMT 1-Alpha',
    gender: 'Male',
    entranceScore: 71.5,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 13.5, max: 20 },
      { name: 'English Nautical Terminology', score: 15, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 14, max: 20 },
      { name: 'Abstract Logic', score: 14.5, max: 20 },
    ],
    aptitudeMode: 'mode_a',
    stanine: 5,
    percentileRank: 58.0,
    iqEquivalent: '103 (Average)',
    clinicalReport: 'Standard psychometric evaluation on file. Ready for basic nautical curriculum.',
    evaluator: 'Maria Elena Santos, RPM',
    testDate: '2024-07-23',
    status: 'Official / Enrolled',
  },
  {
    id: 'roster-009',
    studentId: '2024-00561',
    lastName: 'Villanueva',
    firstName: 'Paolo Marco',
    middleName: 'Fernandez',
    program: 'BSMT 1-Alpha',
    gender: 'Male',
    entranceScore: 81.3,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 16.5, max: 20 },
      { name: 'English Nautical Terminology', score: 16, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 16, max: 20 },
      { name: 'Abstract Logic', score: 16.5, max: 20 },
    ],
    aptitudeMode: 'mode_a',
    stanine: 7,
    percentileRank: 78.0,
    iqEquivalent: '112 (High Average)',
    clinicalReport: 'Strong aptitude for nautical calculations and chartwork exercises.',
    evaluator: 'Maria Elena Santos, RPM',
    testDate: '2024-07-24',
    status: 'Official / Enrolled',
  },
  {
    id: 'roster-010',
    studentId: '2024-00608',
    lastName: 'Castillo',
    firstName: 'Princess Sarah',
    middleName: 'Bautista',
    program: 'BSMT 1-Alpha',
    gender: 'Female',
    entranceScore: 79.5,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 16, max: 20 },
      { name: 'English Nautical Terminology', score: 16.5, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 15, max: 20 },
      { name: 'Abstract Logic', score: 16, max: 20 },
    ],
    aptitudeMode: 'pending',
    stanine: null,
    percentileRank: null,
    iqEquivalent: null,
    clinicalReport: 'Assessment session scheduled with Guidance Directorate.',
    evaluator: 'A. Guinto, RPM',
    testDate: '2024-07-25',
    status: 'Official / Enrolled',
  },
];

export default function FacultyClassRoster() {
  const [cadets] = useState(INITIAL_ROSTER_CADETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeDossierCadet, setActiveDossierCadet] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Section Details Header
  const courseInfo = {
    courseCode: 'NAV 101',
    courseTitle: 'Terrestrial Navigation 1',
    section: 'BSMT 1-Alpha',
    creditUnits: '4.0 Units (3 Lec / 1 Lab)',
    schedule: 'MWF 08:00 - 09:30 AM | Simulator Hall B',
    term: '1st Semester, AY 2024–2025',
    instructor: 'Capt. Eduardo Morales, MM',
    prcLicense: 'PRC Lic. #0045812',
    dean: 'Capt. Rogelio S. De Guzman, PhD',
  };

  // Filtered Cadets
  const filteredCadets = useMemo(() => {
    return cadets.filter((cadet) => {
      // 1. Text Search Filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cadet.studentId.toLowerCase().includes(q) ||
        cadet.lastName.toLowerCase().includes(q) ||
        cadet.firstName.toLowerCase().includes(q) ||
        (cadet.middleName && cadet.middleName.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // 2. Status Filter
      if (activeFilter === 'ENTRANCE_DONE') {
        return cadet.entranceScore !== null;
      }
      if (activeFilter === 'APTITUDE_DONE') {
        return cadet.aptitudeMode !== 'pending';
      }
      if (activeFilter === 'PENDING') {
        return cadet.entranceScore === null || cadet.aptitudeMode === 'pending';
      }

      return true;
    });
  }, [cadets, searchQuery, activeFilter]);

  // Section Statistics
  const metrics = useMemo(() => {
    const total = cadets.length;
    const entranceDone = cadets.filter((c) => c.entranceScore !== null).length;
    const aptitudeDone = cadets.filter((c) => c.aptitudeMode !== 'pending').length;
    const pendingTotal = cadets.filter((c) => c.entranceScore === null || c.aptitudeMode === 'pending').length;

    const evaluatedEntrance = cadets.filter((c) => c.entranceScore !== null);
    const avgEntrance =
      evaluatedEntrance.reduce((acc, curr) => acc + curr.entranceScore, 0) / (evaluatedEntrance.length || 1);

    return {
      total,
      entranceDone,
      aptitudeDone,
      pendingTotal,
      avgEntrance: avgEntrance.toFixed(1),
    };
  }, [cadets]);

  return (
    <div className="faculty-roster-container">
      {/* Roster Header Banner (Clean & Minimal) */}
      <header className="roster-header-card">
        <div className="header-meta-left">
          <h1 className="course-code-heading font-mono">{courseInfo.courseCode}: {courseInfo.courseTitle}</h1>
          <p className="course-sub-line">
            Section <strong>{courseInfo.section}</strong> &bull; {courseInfo.instructor}
          </p>
        </div>

        <div className="header-actions-right">
          <button
            type="button"
            className="btn-print-official"
            onClick={() => setIsPrintModalOpen(true)}
            title="Print Official Section Roster"
          >
            <Printer size={15} />
            <span>Print Roster</span>
          </button>
        </div>
      </header>

      {/* Summary KPI Strip */}
      <section className="roster-metrics-strip" aria-label="Section Summary Metrics">
        <div className="metric-card">
          <div className="metric-icon-box navy">
            <Users size={18} />
          </div>
          <div className="metric-content">
            <span className="metric-caption">Enrolled Cadets</span>
            <span className="metric-number tabular-nums">{metrics.total}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box blue">
            <FileText size={18} />
          </div>
          <div className="metric-content">
            <span className="metric-caption">Entrance Evaluated</span>
            <span className="metric-number tabular-nums">{metrics.entranceDone} / {metrics.total}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box green">
            <ShieldCheck size={18} />
          </div>
          <div className="metric-content">
            <span className="metric-caption">Guidance Evaluated</span>
            <span className="metric-number tabular-nums">{metrics.aptitudeDone} / {metrics.total}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box purple">
            <TrendingUp size={18} />
          </div>
          <div className="metric-content">
            <span className="metric-caption">Avg Entrance Baseline</span>
            <span className="metric-number tabular-nums">{metrics.avgEntrance}%</span>
          </div>
        </div>
      </section>

      {/* Table Control Filters & Search */}
      <div className="table-controls-card">
        <div className="controls-left">
          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ALL')}
            >
              All Cadets ({metrics.total})
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${activeFilter === 'ENTRANCE_DONE' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ENTRANCE_DONE')}
            >
              Entrance Evaluated ({metrics.entranceDone})
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${activeFilter === 'APTITUDE_DONE' ? 'active' : ''}`}
              onClick={() => setActiveFilter('APTITUDE_DONE')}
            >
              Aptitude Evaluated ({metrics.aptitudeDone})
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${activeFilter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setActiveFilter('PENDING')}
            >
              Pending Assessment ({metrics.pendingTotal})
            </button>
          </div>
        </div>

        <div className="controls-right">
          <div className="search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Filter by Student ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="search-clear">
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Roster Table (Pure % and Input/Details only - Zero Grading or Advisory Clutter) */}
      <div className="roster-table-wrapper">
        <table className="roster-table">
          <thead>
            <tr>
              <th className="th-num">#</th>
              <th className="th-id">Student ID</th>
              <th className="th-name">Cadet Full Name</th>
              <th className="th-gender">Sex</th>
              <th className="th-section">Section</th>
              <th className="th-entrance" title="Academic Entrance Examination (Gates 2 & 5)">
                Entrance Exam
              </th>
              <th className="th-aptitude" title="Guidance RPM Aptitude Level (Gates 4 & 5 - RA 10029)">
                Aptitude Test
              </th>
              <th className="th-action text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCadets.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-roster-row">
                  <div className="empty-state-box">
                    <FileSpreadsheet size={32} className="text-slate-400" />
                    <p>No enrolled cadets match your active filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCadets.map((cadet, idx) => {
                return (
                  <tr key={cadet.id}>
                    {/* Index */}
                    <td className="td-num tabular-nums">{idx + 1}</td>

                    {/* Student ID */}
                    <td className="td-id font-mono tabular-nums">{cadet.studentId}</td>

                    {/* Cadet Name */}
                    <td className="td-name">
                      <div className="cadet-name-block">
                        <strong className="name-primary">
                          {cadet.lastName}, {cadet.firstName}
                        </strong>
                        <span className="name-sub text-slate-500">
                          {cadet.middleName || '—'}
                        </span>
                      </div>
                    </td>

                    {/* Sex */}
                    <td className="td-gender text-slate-600">
                      {cadet.gender}
                    </td>

                    {/* Section */}
                    <td className="td-section">
                      <span className="section-badge font-mono">{cadet.program}</span>
                    </td>

                    {/* Entrance Exam (Score % or No Result) */}
                    <td className="td-entrance">
                      {cadet.entranceScore != null ? (
                        <span className="score-val tabular-nums">{cadet.entranceScore}%</span>
                      ) : (
                        <span className="empty-val text-slate-400">No Result</span>
                      )}
                    </td>

                    {/* Aptitude Test (Encoded or No Result) */}
                    <td className="td-aptitude">
                      {cadet.aptitudeMode != null || cadet.percentileRank != null ? (
                        <span className="status-pill-encoded">Encoded</span>
                      ) : (
                        <span className="empty-val text-slate-400">No Result</span>
                      )}
                    </td>

                    {/* Action Button: Details */}
                    <td className="td-action text-center">
                      <button
                        type="button"
                        className="btn-details-action"
                        onClick={() => setActiveDossierCadet(cadet)}
                        title={`View Assessment Dossier for ${cadet.lastName}`}
                      >
                        <span>Details</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Roster Footer Bar */}
      <footer className="roster-footer-bar">
        <div className="footer-left-info text-slate-500 text-xs">
          Displaying <strong>{filteredCadets.length}</strong> of <strong>{cadets.length}</strong> official cadets enrolled in Section <strong>{courseInfo.section}</strong> &bull; SCMBT College of Maritime Education.
        </div>
        <div className="footer-right-buttons">
          <button
            type="button"
            className="btn-print-official"
            onClick={() => setIsPrintModalOpen(true)}
          >
            <Printer size={14} />
            <span>Print Official Class Roster</span>
          </button>
        </div>
      </footer>

      {/* =========================================================
          MODAL 1: CADET ASSESSMENT DOSSIER (RA 10029 COMPLIANT)
          ========================================================= */}
      {activeDossierCadet && (
        <div className="roster-modal-overlay" role="dialog" aria-modal="true">
          <div className="roster-modal-card dossier-modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <ShieldCheck size={20} className="text-navy-900" />
                <div>
                  <h3 className="modal-title-text">
                    {activeDossierCadet.lastName}, {activeDossierCadet.firstName} {activeDossierCadet.middleName}
                  </h3>
                  <span className="modal-subtitle-text font-mono">
                    {activeDossierCadet.studentId} &bull; Section {activeDossierCadet.program} &bull; NAV 101
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveDossierCadet(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll">
              {/* Compliance & Privacy Banner (RA 10029 & RA 10173) */}
              <div className="privacy-compliance-box">
                <ShieldCheck size={18} className="text-navy-900 flex-shrink-0" />
                <div>
                  <strong>Official Admissions &amp; Psychometric Assessment Dossier</strong>
                  <p>
                    Confidential psychological records compiled under PRC RA 10029 for faculty instructional baseline.
                  </p>
                </div>
              </div>

              {/* CARD 1: Academic Entrance Examination Category Competencies */}
              <div className="brief-card">
                <div className="brief-card-header">
                  <FileText size={16} className="text-navy-900" />
                  <h4>
                    Academic Entrance Examination Diagnostic{' '}
                    {activeDossierCadet.entranceScore != null && (
                      <span className="header-score-tag tabular-nums font-mono font-bold">
                        Score: {activeDossierCadet.entranceScore}%
                      </span>
                    )}
                  </h4>
                </div>
                <div className="brief-card-body">
                  {activeDossierCadet.entranceCategories.length > 0 ? (
                    <div className="competency-grid">
                      {activeDossierCadet.entranceCategories.map((cat, i) => {
                        const pct = Math.round((cat.score / cat.max) * 100);

                        return (
                          <div key={i} className="competency-chip">
                            <div className="chip-top">
                              <span className="chip-name">{cat.name}</span>
                              <span className="chip-score tabular-nums font-mono font-bold">
                                {cat.score} / {cat.max} pts ({pct}%)
                              </span>
                            </div>
                            <div className="chip-progress-track">
                              <div
                                className="chip-progress-fill"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="empty-brief-note">No entrance exam category breakdown recorded for this cadet.</p>
                  )}
                </div>
              </div>

              {/* CARD 2: Psychometric Aptitude Level */}
              <div className="brief-card">
                <div className="brief-card-header">
                  <Brain size={16} className="text-purple-700" />
                  <h4>Psychometric Mental Ability &amp; Cognitive Profile (RA 10029)</h4>
                </div>
                <div className="brief-card-body">
                  {activeDossierCadet.aptitudeMode === 'mode_a' ? (
                    <>
                      <div className="aptitude-stat-grid">
                        <div className="stat-cell">
                          <span className="stat-label">Stanine Rating</span>
                          <span className="stat-value text-purple-800 font-bold">
                            Stanine {activeDossierCadet.stanine}
                          </span>
                        </div>
                        <div className="stat-cell">
                          <span className="stat-label">Percentile Rank</span>
                          <span className="stat-value tabular-nums">{activeDossierCadet.percentileRank}% PR</span>
                        </div>
                        <div className="stat-cell">
                          <span className="stat-label">IQ Equivalent</span>
                          <span className="stat-value">{activeDossierCadet.iqEquivalent || '—'}</span>
                        </div>
                      </div>

                      <div className="clinical-text-strip">
                        <span className="report-label">Psychometrician Clinical Evaluation:</span>
                        <p className="report-text">{activeDossierCadet.clinicalReport}</p>
                      </div>

                      <div className="evaluator-signature-strip">
                        <span>Administered by: <strong>{activeDossierCadet.evaluator}</strong></span>
                        <span className="tabular-nums font-mono">Date: {activeDossierCadet.testDate}</span>
                      </div>
                    </>
                  ) : activeDossierCadet.aptitudeMode === 'mode_b' ? (
                    <>
                      <div className="clinical-text-strip">
                        <span className="report-label">Mode B Clinical Narrative Report:</span>
                        <p className="report-text">{activeDossierCadet.clinicalReport}</p>
                      </div>

                      <div className="evaluator-signature-strip">
                        <span>Administered by: <strong>{activeDossierCadet.evaluator}</strong></span>
                        <span className="tabular-nums font-mono">Date: {activeDossierCadet.testDate}</span>
                      </div>
                    </>
                  ) : (
                    <p className="empty-brief-note">Pending Guidance proctored aptitude assessment.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setActiveDossierCadet(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: PRINT OFFICIAL SECTION ROSTER (BOND PAPER)
          ========================================================= */}
      {isPrintModalOpen && (
        <div className="roster-modal-overlay" role="dialog" aria-modal="true">
          <div className="roster-modal-card print-modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Printer size={18} className="text-navy-900" />
                <h3>Official SCMBT Section Roster Sheet</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsPrintModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll">
              {/* Formal Bond Paper Document Container */}
              <div className="official-bond-sheet" id="printable-grading-sheet">
                {/* Official SCMBT Header */}
                <div className="bond-sheet-header">
                  <div className="header-seal-block">
                    <img
                      src="/src/assets/SCMBT_Crest.png"
                      alt="SCMBT Official Crest"
                      className="sheet-crest-img"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="header-text-block">
                    <h2 className="inst-title">SUBIC BAY COLLEGES, INC. (SCMBT)</h2>
                    <h3 className="inst-college">COLLEGE OF MARITIME EDUCATION &bull; DECK DEPARTMENT</h3>
                    <p className="inst-address">Subic Bay Gateway Park, Subic Bay Freeport Zone, Philippines</p>
                    <div className="doc-title-box">
                      <span className="doc-type-title">OFFICIAL CLASS ENROLLMENT &amp; ASSESSMENT ROSTER</span>
                    </div>
                  </div>
                </div>

                {/* Section & Course Details Grid */}
                <div className="sheet-meta-grid">
                  <div className="meta-col">
                    <div><strong>Course Code:</strong> <span className="font-mono">{courseInfo.courseCode}</span></div>
                    <div><strong>Descriptive Title:</strong> {courseInfo.courseTitle}</div>
                    <div><strong>Units:</strong> {courseInfo.creditUnits}</div>
                  </div>
                  <div className="meta-col">
                    <div><strong>Class Section:</strong> {courseInfo.section}</div>
                    <div><strong>Academic Term:</strong> {courseInfo.term}</div>
                    <div><strong>Class Schedule:</strong> {courseInfo.schedule}</div>
                  </div>
                  <div className="meta-col">
                    <div><strong>Faculty In-Charge:</strong> {courseInfo.instructor}</div>
                    <div><strong>PRC License:</strong> <span className="font-mono">{courseInfo.prcLicense}</span></div>
                    <div><strong>Date Generated:</strong> <span className="font-mono tabular-nums">{TODAY_DATE}</span></div>
                  </div>
                </div>

                {/* Official Sheet Table */}
                <table className="sheet-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th style={{ width: '120px' }}>Student ID</th>
                      <th>Cadet Full Name (Last, First, Middle)</th>
                      <th style={{ width: '70px' }}>Sex</th>
                      <th style={{ width: '130px' }}>Section</th>
                      <th style={{ width: '120px' }}>Entrance Exam</th>
                      <th style={{ width: '130px' }}>Aptitude Test</th>
                      <th style={{ width: '120px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cadets.map((c, i) => {
                      return (
                        <tr key={c.id}>
                          <td className="text-center font-mono tabular-nums">{i + 1}</td>
                          <td className="font-mono tabular-nums">{c.studentId}</td>
                          <td>
                            <strong>{c.lastName}</strong>, {c.firstName} {c.middleName || ''}
                          </td>
                          <td className="text-center">{c.gender}</td>
                          <td className="text-center font-mono">{c.program}</td>
                          <td className="text-center font-bold font-mono">
                            {c.entranceScore != null ? `${c.entranceScore}%` : 'Pending'}
                          </td>
                          <td className="text-center font-bold font-mono">
                            {c.aptitudeMode === 'mode_a' && c.percentileRank != null
                              ? `${c.percentileRank}%`
                              : c.aptitudeMode === 'mode_b'
                              ? 'Letter'
                              : 'Pending'}
                          </td>
                          <td className="text-center">
                            <span className="sheet-official-badge">Enrolled</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Sign-Off Signature Blocks */}
                <div className="sheet-signature-strip">
                  <div className="sig-block">
                    <span className="sig-label">Prepared and Certified by:</span>
                    <div className="sig-line" />
                    <strong className="sig-name">{courseInfo.instructor}</strong>
                    <span className="sig-title">Subject Professor &bull; Master Mariner</span>
                  </div>

                  <div className="sig-block">
                    <span className="sig-label">Reviewed and Verified by:</span>
                    <div className="sig-line" />
                    <strong className="sig-name">{courseInfo.dean}</strong>
                    <span className="sig-title">Dean, College of Maritime Education</span>
                  </div>

                  <div className="sig-block">
                    <span className="sig-label">Received and Recorded by:</span>
                    <div className="sig-line" />
                    <strong className="sig-name">Atty. Carmela R. Mendoza</strong>
                    <span className="sig-title">College Registrar &bull; Subic Bay Colleges</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsPrintModalOpen(false)}
              >
                Close Preview
              </button>
              <button
                type="button"
                className="btn-primary-action"
                onClick={() => window.print()}
              >
                <Printer size={15} />
                <span>Print Official Roster (Ctrl+P)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
