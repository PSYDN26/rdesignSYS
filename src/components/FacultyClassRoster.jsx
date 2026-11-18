import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Printer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Compass,
  FileSpreadsheet,
  Calendar,
  X,
  Save,
  Check,
  TrendingUp,
  Brain,
  FileText
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
    recommendation: 'recommended',
    advisoryStatus: 'cleared',
    advisoryNote: 'Baseline aptitude exceeds deck watchkeeping standard. No academic restrictions.',
    evaluator: 'Maria Elena Santos, RPM (PRC #0012489)',
    testDate: '2024-07-15',
    // Faculty Grade Records
    prelimGrade: 88,
    midtermGrade: 85,
    finalGrade: 86,
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
    recommendation: 'conditional',
    advisoryStatus: 'needs_math_review',
    advisoryNote: 'Entrance Math is 65% (13/20). Recommend supplementary plotting exercises for celestial & coastal navigation drills.',
    evaluator: 'A. Guinto, RPM',
    testDate: '2024-07-14',
    prelimGrade: 76,
    midtermGrade: 78,
    finalGrade: 75,
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
    recommendation: 'conditional',
    advisoryStatus: 'faculty_mentoring',
    advisoryNote: 'Psychometric endorsement: Candidate exhibits elevated stress during high-pressure timed navigation simulations. Endorsed for faculty mentoring during simulator watchkeeping exercises.',
    evaluator: 'Maria Elena Santos, RPM (PRC #0012489)',
    testDate: '2024-07-11',
    prelimGrade: 80,
    midtermGrade: 82,
    finalGrade: 83,
  },
  {
    id: 'roster-004',
    studentId: '2024-00389',
    lastName: 'Mercado',
    firstName: 'Angelo James',
    middleName: 'Torres',
    program: 'BSMT 1-Alpha',
    gender: 'Male',
    entranceScore: 76.2,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 15, max: 20 },
      { name: 'English Nautical Terminology', score: 16, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 15.5, max: 20 },
      { name: 'Abstract Logic', score: 14.5, max: 20 },
    ],
    aptitudeMode: 'mode_a',
    stanine: 6,
    percentileRank: 62.0,
    iqEquivalent: '107 (Average)',
    recommendation: 'recommended',
    advisoryStatus: 'cleared',
    advisoryNote: 'Balanced aptitude indicators. Cleared for standard practical and sea-duty laboratory components.',
    evaluator: 'Maria Elena Santos, RPM (PRC #0012489)',
    testDate: '2024-07-18',
    prelimGrade: 84,
    midtermGrade: 86,
    finalGrade: 85,
  },
  {
    id: 'roster-005',
    studentId: '2023-00912',
    lastName: 'Alcantara',
    firstName: 'Dominic Jose',
    middleName: 'Villanueva',
    program: 'BSMT 1-Alpha',
    gender: 'Male',
    entranceScore: 84.1,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 17.5, max: 20 },
      { name: 'English Nautical Terminology', score: 17, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 16.5, max: 20 },
      { name: 'Abstract Logic', score: 16.5, max: 20 },
    ],
    aptitudeMode: 'mode_a',
    stanine: 7,
    percentileRank: 79.0,
    iqEquivalent: '113 (High Average)',
    recommendation: 'recommended',
    advisoryStatus: 'cleared',
    advisoryNote: 'Strong cognitive orientation; recommended as Class Watch Officer or simulator group peer leader.',
    evaluator: 'R. Ramos, RPM',
    testDate: '2023-08-10',
    prelimGrade: 91,
    midtermGrade: 89,
    finalGrade: 90,
  },
  {
    id: 'roster-006',
    studentId: '2024-00455',
    lastName: 'Reyes',
    firstName: 'Bea Camille',
    middleName: 'Aquino',
    program: 'BSMT 1-Alpha',
    gender: 'Female',
    entranceScore: 78.5,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 15.5, max: 20 },
      { name: 'English Nautical Terminology', score: 16.5, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 15, max: 20 },
      { name: 'Abstract Logic', score: 16, max: 20 },
    ],
    aptitudeMode: 'mode_a',
    stanine: 5,
    percentileRank: 54.0,
    iqEquivalent: '101 (Average)',
    recommendation: 'recommended',
    advisoryStatus: 'cleared',
    advisoryNote: 'Satisfactory baseline cognitive evaluation. Cleared for bridge watchkeeping simulator drills.',
    evaluator: 'Maria Elena Santos, RPM (PRC #0012489)',
    testDate: '2024-07-22',
    prelimGrade: 82,
    midtermGrade: 81,
    finalGrade: 84,
  },
  {
    id: 'roster-007',
    studentId: '2024-00299',
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
    stanine: 6,
    percentileRank: 71.0,
    iqEquivalent: '109 (Average)',
    recommendation: 'recommended',
    advisoryStatus: 'cleared',
    advisoryNote: 'Demonstrates consistent spatial visualization requisite for ECDIS electronic chart reading.',
    evaluator: 'A. Guinto, RPM',
    testDate: '2024-07-29',
    prelimGrade: 85,
    midtermGrade: 87,
    finalGrade: 86,
  },
  {
    id: 'roster-008',
    studentId: '2024-00142',
    lastName: 'Soriano',
    firstName: 'Christian Mark',
    middleName: 'Balagtas',
    program: 'BSMT 1-Alpha',
    gender: 'Male',
    entranceScore: 71.0,
    entranceCategories: [
      { name: 'Mathematics & Navigation Arithmetic', score: 13.5, max: 20 },
      { name: 'English Nautical Terminology', score: 14.5, max: 20 },
      { name: 'Spatial & Mechanical Reasoning', score: 14, max: 20 },
      { name: 'Abstract Logic', score: 15, max: 20 },
    ],
    aptitudeMode: 'mode_a',
    stanine: 4,
    percentileRank: 38.0,
    iqEquivalent: '96 (Average)',
    recommendation: 'conditional',
    advisoryStatus: 'needs_math_review',
    advisoryNote: 'Low-average stanine rating. Requires close supervision during terrestrial plotting exercises and chart compass corrections.',
    evaluator: 'Maria Elena Santos, RPM (PRC #0012489)',
    testDate: '2024-08-01',
    prelimGrade: 74,
    midtermGrade: 73,
    finalGrade: 72,
  },
];

export default function FacultyClassRoster({ onBackToGate5 }) {
  const [cadets, setCadets] = useState(INITIAL_ROSTER_CADETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [advisoryFilter, setAdvisoryFilter] = useState('ALL'); // ALL, CLEARED, MENTORING, MATH_REVIEW
  const [activeDossierCadet, setActiveDossierCadet] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Active section metadata (Institutional Context: SCMBT College of Maritime Education)
  const courseInfo = {
    courseCode: 'NAV 101',
    courseTitle: 'Terrestrial and Coastal Navigation 1',
    creditUnits: '3.0 Units (2 Lec / 1 Lab)',
    section: 'BSMT 1-Alpha',
    schedule: 'MWF 08:00 AM – 10:00 AM (Bridge Simulator Rm 204)',
    term: 'First Semester, AY 2024–2025',
    instructor: 'Capt. Edgardo Morales, MM',
    prcLicense: 'Master Mariner Lic. #0045192',
    dean: 'Capt. Rodolfo M. Sioson, PhD, MM',
  };

  // Toast Helper
  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered cadets
  const filteredCadets = useMemo(() => {
    return cadets.filter((c) => {
      const matchSearch =
        c.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.firstName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (advisoryFilter === 'CLEARED') return c.advisoryStatus === 'cleared';
      if (advisoryFilter === 'MENTORING') return c.advisoryStatus === 'faculty_mentoring';
      if (advisoryFilter === 'MATH_REVIEW') return c.advisoryStatus === 'needs_math_review';

      return true;
    });
  }, [cadets, searchQuery, advisoryFilter]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = cadets.length;
    const cleared = cadets.filter((c) => c.advisoryStatus === 'cleared').length;
    const mentoring = cadets.filter((c) => c.advisoryStatus === 'faculty_mentoring').length;
    const mathReview = cadets.filter((c) => c.advisoryStatus === 'needs_math_review').length;

    const avgEntrance =
      cadets.reduce((acc, curr) => acc + (curr.entranceScore || 0), 0) / (total || 1);

    const passingCount = cadets.filter((c) => {
      const fg = computeWeightedFinal(c.prelimGrade, c.midtermGrade, c.finalGrade);
      return fg >= 75;
    }).length;

    return {
      total,
      cleared,
      mentoring,
      mathReview,
      avgEntrance: avgEntrance.toFixed(1),
      passingPct: ((passingCount / total) * 100).toFixed(0),
    };
  }, [cadets]);

  // Grade Computation (Standard Philippine Collegiate Metric: Prelim 30%, Midterm 30%, Final 40%)
  function computeWeightedFinal(prelim, midterm, finalExam) {
    if (prelim == null || midterm == null || finalExam == null) return null;
    const p = parseFloat(prelim) || 0;
    const m = parseFloat(midterm) || 0;
    const f = parseFloat(finalExam) || 0;
    return Math.round(p * 0.3 + m * 0.3 + f * 0.4);
  }

  // Grade change handler
  const handleGradeChange = (id, field, value) => {
    const numVal = value === '' ? '' : Math.min(100, Math.max(0, parseFloat(value) || 0));
    setCadets((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: numVal } : c))
    );
  };

  // Save Grades Action
  const handleSaveAllGrades = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Faculty Class Roster grades successfully committed to SCMBT Registrar database!');
    }, 450);
  };

  return (
    <div className="faculty-roster-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`roster-toast ${toastMessage.type}`} role="status">
          <CheckCircle size={16} />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Roster Header Banner */}
      <header className="roster-header-card">
        <div className="header-meta-left">
          <div className="institutional-kicker">
            <span className="inst-badge">SCMBT College of Maritime Education</span>
            <span className="gate-pill">Gate 6 &bull; Faculty Class Roster</span>
            <span className="accreditation-pill">CHED / MARINA CMO 67 Compliant</span>
          </div>

          <div className="course-title-lockup">
            <h1 className="course-code-heading font-mono">{courseInfo.courseCode}: {courseInfo.courseTitle}</h1>
            <p className="course-sub-line">
              Section <strong>{courseInfo.section}</strong> &bull; {courseInfo.creditUnits} &bull; {courseInfo.schedule}
            </p>
          </div>

          <div className="instructor-badge-row">
            <span className="instructor-chip">
              <Compass size={13} className="text-amber-500" />
              <span>Assigned Faculty: <strong>{courseInfo.instructor}</strong></span>
              <span className="font-mono text-slate-400">({courseInfo.prcLicense})</span>
            </span>
            <span className="term-chip">
              <Calendar size={13} className="text-slate-500" />
              <span>{courseInfo.term}</span>
            </span>
          </div>
        </div>

        <div className="header-actions-right">
          <button
            type="button"
            className="btn-print-official"
            onClick={() => setIsPrintModalOpen(true)}
            title="Generate Official CHED / MARINA Grading Sheet"
          >
            <Printer size={15} />
            <span>Official Grade Sheet</span>
          </button>

          <button
            type="button"
            className="btn-save-grades"
            onClick={handleSaveAllGrades}
            disabled={isSaving}
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : 'Commit Grades'}</span>
          </button>
        </div>
      </header>

      {/* Summary KPI Strip */}
      <section className="roster-metrics-strip" aria-label="Section Readiness Metrics">
        <div className="metric-card">
          <div className="metric-icon-box navy">
            <Users size={18} />
          </div>
          <div className="metric-content">
            <span className="metric-caption">Enrolled Cadets</span>
            <span className="metric-number tabular-nums">{metrics.total}</span>
            <span className="metric-foot">Official Section Roster</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box green">
            <ShieldCheck size={18} />
          </div>
          <div className="metric-content">
            <span className="metric-caption">Guidance Cleared</span>
            <span className="metric-number tabular-nums">{metrics.cleared}</span>
            <span className="metric-foot">Unconditional Readiness</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box amber">
            <AlertTriangle size={18} />
          </div>
          <div className="metric-content">
            <span className="metric-caption">Faculty Mentoring Flags</span>
            <span className="metric-number tabular-nums highlight-amber">
              {metrics.mentoring + metrics.mathReview}
            </span>
            <span className="metric-foot">
              {metrics.mentoring} Simulator &bull; {metrics.mathReview} Math Review
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box purple">
            <TrendingUp size={18} />
          </div>
          <div className="metric-content">
            <span className="metric-caption">Avg Entrance Baseline</span>
            <span className="metric-number tabular-nums">{metrics.avgEntrance}%</span>
            <span className="metric-foot">Passing Threshold: 75%</span>
          </div>
        </div>
      </section>

      {/* Table Control Filters & Search */}
      <div className="table-controls-card">
        <div className="controls-left">
          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill-btn ${advisoryFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setAdvisoryFilter('ALL')}
            >
              All Cadets ({metrics.total})
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${advisoryFilter === 'CLEARED' ? 'active' : ''}`}
              onClick={() => setAdvisoryFilter('CLEARED')}
            >
              Cleared ({metrics.cleared})
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${advisoryFilter === 'MENTORING' ? 'active' : ''}`}
              onClick={() => setAdvisoryFilter('MENTORING')}
            >
              Simulator Mentoring ({metrics.mentoring})
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${advisoryFilter === 'MATH_REVIEW' ? 'active' : ''}`}
              onClick={() => setAdvisoryFilter('MATH_REVIEW')}
            >
              Math Review ({metrics.mathReview})
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

      {/* Main Roster Table */}
      <div className="roster-table-wrapper">
        <table className="roster-table">
          <thead>
            <tr>
              <th className="th-num">#</th>
              <th className="th-id">Student ID</th>
              <th className="th-name">Cadet Full Name</th>
              <th className="th-entrance" title="Academic Entrance Examination (Gates 2 & 5)">
                Entrance %
              </th>
              <th className="th-aptitude" title="Guidance RPM Aptitude Level (Gates 4 & 5 - RA 10029)">
                Guidance Aptitude
              </th>
              <th className="th-advisory">Advisory &amp; Mentoring Status</th>
              <th className="th-grade" title="Preliminary Exam (30%)">Prelim</th>
              <th className="th-grade" title="Midterm Exam (30%)">Midterm</th>
              <th className="th-grade" title="Final Exam (40%)">Final</th>
              <th className="th-weighted" title="Weighted Final Grade (30% Prelim + 30% Midterm + 40% Final)">
                Computed
              </th>
              <th className="th-remarks">Remarks</th>
              <th className="th-action text-center">Advisory</th>
            </tr>
          </thead>
          <tbody>
            {filteredCadets.length === 0 ? (
              <tr>
                <td colSpan={12} className="empty-roster-row">
                  <div className="empty-state-box">
                    <FileSpreadsheet size={32} className="text-slate-400" />
                    <p>No enrolled cadets match your active filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCadets.map((cadet, idx) => {
                const weighted = computeWeightedFinal(cadet.prelimGrade, cadet.midtermGrade, cadet.finalGrade);
                const isPassed = weighted !== null && weighted >= 75;
                const isFailed = weighted !== null && weighted < 75;

                return (
                  <tr key={cadet.id} className={cadet.advisoryStatus !== 'cleared' ? 'row-advisory-alert' : ''}>
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
                          {cadet.middleName ? `${cadet.middleName.charAt(0)}.` : '—'} &bull; {cadet.gender}
                        </span>
                      </div>
                    </td>

                    {/* Entrance % */}
                    <td className="td-entrance tabular-nums font-semibold text-navy-900">
                      {cadet.entranceScore != null ? `${cadet.entranceScore}%` : '—'}
                    </td>

                    {/* Guidance Aptitude */}
                    <td className="td-aptitude">
                      {cadet.aptitudeMode === 'mode_a' ? (
                        <div className="aptitude-tag-pill font-mono">
                          <span className="stanine-part">Stanine {cadet.stanine}</span>
                          <span className="pr-part tabular-nums">{cadet.percentileRank}% PR</span>
                        </div>
                      ) : cadet.aptitudeMode === 'mode_b' ? (
                        <span className="modeb-faculty-tag">Clinical Letter</span>
                      ) : (
                        <span className="pending-apt-tag">Pending Guidance</span>
                      )}
                    </td>

                    {/* Advisory & Mentoring Status */}
                    <td className="td-advisory">
                      {cadet.advisoryStatus === 'cleared' ? (
                        <span className="advisory-pill cleared">
                          <CheckCircle size={12} />
                          <span>Cleared / Standard</span>
                        </span>
                      ) : cadet.advisoryStatus === 'faculty_mentoring' ? (
                        <span className="advisory-pill mentoring" title={cadet.advisoryNote}>
                          <AlertTriangle size={12} />
                          <span>Bridge Simulator Mentoring</span>
                        </span>
                      ) : (
                        <span className="advisory-pill math-review" title={cadet.advisoryNote}>
                          <AlertTriangle size={12} />
                          <span>Math Plotting Review</span>
                        </span>
                      )}
                    </td>

                    {/* Prelim Grade Input */}
                    <td className="td-grade">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={cadet.prelimGrade ?? ''}
                        onChange={(e) => handleGradeChange(cadet.id, 'prelimGrade', e.target.value)}
                        className="grade-input tabular-nums"
                        placeholder="0–100"
                      />
                    </td>

                    {/* Midterm Grade Input */}
                    <td className="td-grade">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={cadet.midtermGrade ?? ''}
                        onChange={(e) => handleGradeChange(cadet.id, 'midtermGrade', e.target.value)}
                        className="grade-input tabular-nums"
                        placeholder="0–100"
                      />
                    </td>

                    {/* Final Grade Input */}
                    <td className="td-grade">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={cadet.finalGrade ?? ''}
                        onChange={(e) => handleGradeChange(cadet.id, 'finalGrade', e.target.value)}
                        className="grade-input tabular-nums"
                        placeholder="0–100"
                      />
                    </td>

                    {/* Computed Weighted Grade */}
                    <td className="td-weighted">
                      <span className={`computed-grade-pill tabular-nums ${isPassed ? 'passed' : isFailed ? 'failed' : ''}`}>
                        {weighted !== null ? weighted : '—'}
                      </span>
                    </td>

                    {/* Remarks */}
                    <td className="td-remarks">
                      {isPassed ? (
                        <span className="remark-tag passed">Passed</span>
                      ) : isFailed ? (
                        <span className="remark-tag failed">At Risk</span>
                      ) : (
                        <span className="remark-tag ongoing">In Progress</span>
                      )}
                    </td>

                    {/* Advisory Action Button */}
                    <td className="td-action text-center">
                      <button
                        type="button"
                        className="btn-advisory-open"
                        onClick={() => setActiveDossierCadet(cadet)}
                        title="View Guidance Advisory & Prerequisites Breakdown"
                      >
                        <HelpCircle size={14} />
                        <span>Brief</span>
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
          Displaying <strong>{filteredCadets.length}</strong> of <strong>{cadets.length}</strong> official cadets enrolled in Section <strong>{courseInfo.section}</strong> &bull; Grading formula: 30% Prelim + 30% Midterm + 40% Final Exam.
        </div>
        <div className="footer-right-buttons">
          <button
            type="button"
            className="btn-back-gate5"
            onClick={onBackToGate5}
          >
            &larr; Back to Gate 5 (Migration)
          </button>
          <button
            type="button"
            className="btn-footer-save"
            onClick={handleSaveAllGrades}
          >
            <Check size={14} />
            <span>Submit Official Section Grades</span>
          </button>
        </div>
      </footer>

      {/* =========================================================
          MODAL 1: FACULTY ADVISORY & BASELINE DOSSIER (RA 10029 COMPLIANT)
          ========================================================= */}
      {activeDossierCadet && (
        <div className="roster-modal-overlay" role="dialog" aria-modal="true">
          <div className="roster-modal-card advisory-modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Compass size={20} className="text-amber-500" />
                <div>
                  <h3 className="modal-title-text">
                    Instructional Readiness Briefing &bull; {activeDossierCadet.lastName}, {activeDossierCadet.firstName}
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
                  <strong>Faculty Instructional Guidance Summary (RA 10029 / RA 10173 Compliant)</strong>
                  <p>
                    Confidential clinical therapy notes are restricted to Licensed Psychometricians. This briefing summarizes academic competencies and instructional advisories authorized by the Guidance Directorate for course instructors.
                  </p>
                </div>
              </div>

              {/* Advisory Flag Callout */}
              <div className={`advisory-callout-card ${activeDossierCadet.advisoryStatus}`}>
                <div className="callout-header">
                  <span className="callout-label">Instructional Guidance Status:</span>
                  <span className={`advisory-pill ${activeDossierCadet.advisoryStatus}`}>
                    {activeDossierCadet.advisoryStatus === 'cleared' && 'Cleared / Standard Readiness'}
                    {activeDossierCadet.advisoryStatus === 'faculty_mentoring' && 'Bridge Simulator Mentoring Endorsement'}
                    {activeDossierCadet.advisoryStatus === 'needs_math_review' && 'Navigation Mathematics Remedial Review'}
                  </span>
                </div>
                <p className="callout-text">{activeDossierCadet.advisoryNote}</p>
                <div className="callout-signoff font-mono text-xs text-slate-500">
                  Authorized Officer: {activeDossierCadet.evaluator} &bull; Test Date: {activeDossierCadet.testDate}
                </div>
              </div>

              {/* CARD 1: Academic Entrance Exam Category Competencies */}
              <div className="brief-card">
                <div className="brief-card-header">
                  <FileText size={16} className="text-navy-900" />
                  <h4>Academic Entrance Examination Diagnostic (Score: {activeDossierCadet.entranceScore}%)</h4>
                </div>
                <div className="brief-card-body">
                  <div className="competency-grid">
                    {activeDossierCadet.entranceCategories.map((cat, i) => {
                      const pct = Math.round((cat.score / cat.max) * 100);
                      const isLow = pct < 70;

                      return (
                        <div key={i} className={`competency-chip ${isLow ? 'low' : ''}`}>
                          <div className="chip-top">
                            <span className="chip-name">{cat.name}</span>
                            <span className="chip-score tabular-nums font-mono font-bold">
                              {cat.score} / {cat.max} pts ({pct}%)
                            </span>
                          </div>
                          <div className="chip-progress-track">
                            <div
                              className={`chip-progress-fill ${isLow ? 'low' : ''}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CARD 2: Psychometric Aptitude Level */}
              <div className="brief-card">
                <div className="brief-card-header">
                  <Brain size={16} className="text-purple-700" />
                  <h4>Psychometric Mental Ability &amp; Cognitive Profile</h4>
                </div>
                <div className="brief-card-body">
                  {activeDossierCadet.aptitudeMode === 'mode_a' ? (
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
                        <span className="stat-value">{activeDossierCadet.iqEquivalent || '105 (Average)'}</span>
                      </div>
                      <div className="stat-cell">
                        <span className="stat-label">Recommendation</span>
                        <span className={`recommend-chip ${activeDossierCadet.recommendation}`}>
                          {activeDossierCadet.recommendation}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mode-b-note-box">
                      <strong>Clinical Narrative Assessment on File</strong>
                      <p>
                        Candidate admitted under clinical psychological endorsement with requirement for ongoing mentor supervision in Deck watchkeeping exercises.
                      </p>
                    </div>
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
                Close Briefing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: OFFICIAL CHED / MARINA GRADING SHEET PRINT VIEW
          ========================================================= */}
      {isPrintModalOpen && (
        <div className="roster-modal-overlay" role="dialog" aria-modal="true">
          <div className="roster-modal-card print-preview-modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Printer size={20} className="text-navy-900" />
                <div>
                  <h3 className="modal-title-text">Official CHED / MARINA Grading Sheet</h3>
                  <span className="modal-subtitle-text font-mono">
                    SCMBT Form ME-04 &bull; Standard Institutional Bond Paper Layout
                  </span>
                </div>
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
                      <span className="doc-type-title">OFFICIAL REPORT OF GRADES &bull; CHED/MARINA CMO 67</span>
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
                      <th style={{ width: '36px' }}>#</th>
                      <th style={{ width: '110px' }}>Student ID</th>
                      <th>Cadet Name (Last, First, Middle)</th>
                      <th style={{ width: '60px' }}>Sex</th>
                      <th style={{ width: '60px' }}>Prelim</th>
                      <th style={{ width: '60px' }}>Midterm</th>
                      <th style={{ width: '60px' }}>Final</th>
                      <th style={{ width: '70px' }}>Final Grade</th>
                      <th style={{ width: '80px' }}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cadets.map((c, i) => {
                      const wf = computeWeightedFinal(c.prelimGrade, c.midtermGrade, c.finalGrade);
                      const isP = wf !== null && wf >= 75;

                      return (
                        <tr key={c.id}>
                          <td className="text-center font-mono tabular-nums">{i + 1}</td>
                          <td className="font-mono tabular-nums">{c.studentId}</td>
                          <td>
                            <strong>{c.lastName}</strong>, {c.firstName} {c.middleName || ''}
                          </td>
                          <td className="text-center">{c.gender.charAt(0)}</td>
                          <td className="text-center font-mono tabular-nums">{c.prelimGrade ?? '—'}</td>
                          <td className="text-center font-mono tabular-nums">{c.midtermGrade ?? '—'}</td>
                          <td className="text-center font-mono tabular-nums">{c.finalGrade ?? '—'}</td>
                          <td className="text-center font-mono tabular-nums font-bold">
                            {wf !== null ? wf : '—'}
                          </td>
                          <td className="text-center">
                            <span className={`sheet-remark ${isP ? 'p' : 'f'}`}>
                              {isP ? 'PASSED' : 'INCOMPLETE'}
                            </span>
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
                <span>Print Physical Sheet (Ctrl+P)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
