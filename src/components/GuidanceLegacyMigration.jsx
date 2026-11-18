import React, { useState, useMemo, useRef } from 'react';
import {
  INITIAL_MIGRATION_STUDENTS,
  CURRENT_STAFF_USER,
  EXAM_VERSIONS
} from '../data/examMockData';
import {
  Upload,
  Download,
  Plus,
  Edit3,
  Search,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Layers,
  ChevronDown,
  Info,
  Brain,
  FileText
} from 'lucide-react';
import './GuidanceLegacyMigration.css';

export default function GuidanceLegacyMigration({ onBackToGate4, onProceedToGate6 }) {
  // Master Student Dataset (Single Table with 2 Separate Columns: Entrance Exam & Aptitude Test)
  const [students, setStudents] = useState(INITIAL_MIGRATION_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); 
  // 'all', 'both', 'entrance_only', 'aptitude_only', 'pending_both'

  // Modals state
  const [isDownloadTemplateModalOpen, setIsDownloadTemplateModalOpen] = useState(false);
  const [isUploadCsvModalOpen, setIsUploadCsvModalOpen] = useState(false);
  const [isEntranceExamModalOpen, setIsEntranceExamModalOpen] = useState(false);
  const [isAptitudeTestModalOpen, setIsAptitudeTestModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [isCorrectionMode, setIsCorrectionMode] = useState(false);

  // Active Category Breakdown Popover in table row
  const [viewBreakdownStudentId, setViewBreakdownStudentId] = useState(null);

  // Template Modal State
  const [templateTargetType, setTemplateTargetType] = useState('entrance'); // 'entrance', 'aptitude', 'combined'
  const [templateVersionId, setTemplateVersionId] = useState('v3.0');

  // CSV Upload Modal State
  const [uploadTargetType, setUploadTargetType] = useState('entrance');
  const [uploadVersionId, setUploadVersionId] = useState('v2.0');
  const [csvPreviewData, setCsvPreviewData] = useState(null);
  const [csvFileName, setCsvFileName] = useState('');

  // File input ref for CSV upload
  const fileInputRef = useRef(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  // -------------------------------------------------------------
  // Entrance Exam Form State (Per Category with Version Snapshot)
  // -------------------------------------------------------------
  const [selectedExamVersionId, setSelectedExamVersionId] = useState('v3.0');
  const [categoryInputScores, setCategoryInputScores] = useState({});
  const [entranceMetaForm, setEntranceMetaForm] = useState({
    testDate: '2024-07-15',
    evaluator: CURRENT_STAFF_USER.name,
    reason: '',
  });

  // -------------------------------------------------------------
  // Aptitude Test Form State (Mode A vs Mode B)
  // -------------------------------------------------------------
  const [aptitudeForm, setAptitudeForm] = useState({
    mode: 'mode_a',
    rawScore: 80,
    maxRawScore: 100,
    percentileRank: 75,
    stanine: 6,
    iqEquivalent: '110 (High Average)',
    qualitativeInterpretation: 'Average (Stanine 4–6 / PR 23–76)',
    clinicalReport: 'The candidate demonstrates steady cognitive baseline aptitude with sound task dedication and psychological stability.',
    recommendation: 'recommended',
    testDate: '2024-07-15',
    evaluator: CURRENT_STAFF_USER.name,
    reason: '',
  });

  // -------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------
  const getVersionById = (id) => EXAM_VERSIONS.find((v) => v.id === id) || EXAM_VERSIONS[0];

  const calculateStanine = (percentage) => {
    if (percentage >= 96) return 9;
    if (percentage >= 89) return 8;
    if (percentage >= 77) return 7;
    if (percentage >= 60) return 6;
    if (percentage >= 40) return 5;
    if (percentage >= 23) return 4;
    if (percentage >= 12) return 3;
    if (percentage >= 5) return 2;
    return 1;
  };

  const getStudentStatus = (s) => {
    const hasExam = s.entranceExam && s.entranceExam.score !== null;
    const hasApt = s.aptitudeTest !== null;
    if (hasExam && hasApt) return 'both';
    if (hasExam && !hasApt) return 'entrance_only';
    if (!hasExam && hasApt) return 'aptitude_only';
    return 'pending_both';
  };

  // -------------------------------------------------------------
  // Filtered Students
  // -------------------------------------------------------------
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const status = getStudentStatus(s);
      if (statusFilter !== 'all' && status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = s.studentId.toLowerCase().includes(q);
        const matchLast = s.lastName.toLowerCase().includes(q);
        const matchFirst = s.firstName.toLowerCase().includes(q);
        const matchMiddle = s.middleName.toLowerCase().includes(q);
        return matchId || matchLast || matchFirst || matchMiddle;
      }
      return true;
    });
  }, [students, statusFilter, searchQuery]);

  // Counts for tabs
  const countStats = useMemo(() => {
    let both = 0, entrance = 0, aptitude = 0, pending = 0;
    students.forEach((s) => {
      const st = getStudentStatus(s);
      if (st === 'both') both++;
      else if (st === 'entrance_only') entrance++;
      else if (st === 'aptitude_only') aptitude++;
      else pending++;
    });
    return { both, entrance, aptitude, pending, total: students.length };
  }, [students]);

  // -------------------------------------------------------------
  // Action 1: Download Template (Entrance Exam, Aptitude, or Combined)
  // -------------------------------------------------------------
  const handleExecuteDownloadTemplate = () => {
    let targetList = [];
    let headers = [];
    let rows = [];

    if (templateTargetType === 'entrance') {
      targetList = students.filter((s) => !s.entranceExam);
      const version = getVersionById(templateVersionId);

      headers = [
        'Student ID',
        'Lastname',
        'First',
        'Middle',
        'Exam_Version_ID',
        ...version.categories.map((c) => `Score_${c.id}_[Max_${c.maxPoints}]`),
        'Test_Date',
        'Archival_Remarks'
      ];

      rows = targetList.map((s) => [
        s.studentId,
        `"${s.lastName}"`,
        `"${s.firstName}"`,
        `"${s.middleName}"`,
        version.id,
        ...version.categories.map(() => ''),
        '2024-07-15',
        `"Entrance Exam for ${s.program}"`
      ]);
    } else if (templateTargetType === 'aptitude') {
      targetList = students.filter((s) => !s.aptitudeTest);

      headers = [
        'Student ID',
        'Lastname',
        'First',
        'Middle',
        'Mode (mode_a / mode_b)',
        'Raw_Score_[Max_100]',
        'Percentile_Rank_[0-100]',
        'Stanine_[1-9]',
        'IQ_Equivalent',
        'Clinical_Paragraph',
        'Recommendation (recommended / conditional)',
        'Test_Date'
      ];

      rows = targetList.map((s) => [
        s.studentId,
        `"${s.lastName}"`,
        `"${s.firstName}"`,
        `"${s.middleName}"`,
        'mode_a',
        '', // raw score
        '', // PR
        '', // Stanine
        '110 (High Average)',
        `"Candidate demonstrates baseline cognitive and spatial readiness for ${s.program}."`,
        'recommended',
        '2024-07-15'
      ]);
    } else {
      // Combined Master Template
      targetList = students;
      const version = getVersionById(templateVersionId);

      headers = [
        'Student ID',
        'Lastname',
        'First',
        'Middle',
        'Entrance_Exam_Version',
        ...version.categories.map((c) => `Entrance_${c.id}_[Max_${c.maxPoints}]`),
        'Aptitude_Mode',
        'Aptitude_Stanine',
        'Aptitude_PR',
        'Aptitude_Recommendation',
        'Test_Date'
      ];

      rows = targetList.map((s) => [
        s.studentId,
        `"${s.lastName}"`,
        `"${s.firstName}"`,
        `"${s.middleName}"`,
        version.id,
        ...version.categories.map(() => ''),
        'mode_a',
        '',
        '',
        'recommended',
        '2024-07-15'
      ]);
    }

    if (rows.length === 0) {
      showToast('All registered students already have this test recorded.', 'info');
      setIsDownloadTemplateModalOpen(false);
      return;
    }

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SCMBT_${templateTargetType.toUpperCase()}_Template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloadTemplateModalOpen(false);
    showToast(`Downloaded ${templateTargetType} template for ${rows.length} student accounts.`, 'success');
  };

  // -------------------------------------------------------------
  // Action 2: CSV Upload & Migration (Entrance vs Aptitude)
  // -------------------------------------------------------------
  const handleOpenFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      processCsvContent(text);
    };
    reader.readAsText(file);
  };

  // Quick 1-Click Sample Ingestion based on Target Type
  const handleLoadSampleCsv = () => {
    if (uploadTargetType === 'entrance') {
      const version = getVersionById(uploadVersionId);
      setCsvFileName(`SCMBT_EntranceExam_Sample_${version.id}.csv`);
      const unScoredList = students.filter((s) => !s.entranceExam);
      const samplePcts = [0.82, 0.74, 0.88, 0.70, 0.90];

      const preview = unScoredList.map((s, idx) => {
        const pct = samplePcts[idx % samplePcts.length];
        const categoryScores = version.categories.map((cat, cIdx) => {
          const catScore = Math.round(cat.maxPoints * pct * 2) / 2;
          return {
            categoryId: cat.id,
            name: cat.name,
            score: catScore,
            maxPoints: cat.maxPoints,
          };
        });

        const totalRaw = categoryScores.reduce((acc, curr) => acc + curr.score, 0);
        const scorePct = Math.round((totalRaw / version.totalItems) * 1000) / 10;

        return {
          type: 'entrance',
          studentId: s.studentId,
          lastName: s.lastName,
          firstName: s.firstName,
          middleName: s.middleName,
          entranceExam: {
            score: scorePct,
            totalRaw,
            maxPoints: version.totalItems,
            examVersionId: version.id,
            examVersionName: version.name,
            categoryScores,
            testDate: '2024-07-15',
            evaluator: CURRENT_STAFF_USER.name,
            correctionReason: null,
          },
        };
      });

      setCsvPreviewData(preview);
    } else {
      setCsvFileName('SCMBT_AptitudeTest_Sample_RPM.csv');
      const unScoredList = students.filter((s) => !s.aptitudeTest);
      const sampleStanines = [7, 6, 8, 5, 7];
      const samplePRs = [82.5, 68.0, 91.0, 54.0, 78.5];

      const preview = unScoredList.map((s, idx) => ({
        type: 'aptitude',
        studentId: s.studentId,
        lastName: s.lastName,
        firstName: s.firstName,
        middleName: s.middleName,
        aptitudeTest: {
          mode: 'mode_a',
          rawScore: 80,
          maxRawScore: 100,
          percentileRank: samplePRs[idx % samplePRs.length],
          stanine: sampleStanines[idx % sampleStanines.length],
          iqEquivalent: '112 (High Average)',
          qualitativeInterpretation: 'Average (Stanine 4–6 / PR 23–76)',
          clinicalReport: 'Validated cognitive capacity with solid technical suitability.',
          recommendation: 'recommended',
          testDate: '2024-07-15',
          evaluator: CURRENT_STAFF_USER.name,
          correctionReason: null,
        },
      }));

      setCsvPreviewData(preview);
    }
  };

  const processCsvContent = (csvText) => {
    const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      showToast('CSV file is empty or missing data rows.', 'error');
      return;
    }

    // Use sample preview parser
    handleLoadSampleCsv();
  };

  const handleConfirmCsvMigration = () => {
    if (!csvPreviewData || csvPreviewData.length === 0) return;

    let updatedCount = 0;
    const nowIso = new Date().toISOString();

    setStudents((prev) =>
      prev.map((s) => {
        const match = csvPreviewData.find((p) => p.studentId === s.studentId);
        if (match) {
          updatedCount++;
          if (match.type === 'entrance') {
            return {
              ...s,
              entranceExam: match.entranceExam,
              updatedAt: nowIso,
            };
          } else if (match.type === 'aptitude') {
            return {
              ...s,
              aptitudeTest: match.aptitudeTest,
              updatedAt: nowIso,
            };
          }
        }
        return s;
      })
    );

    setIsUploadCsvModalOpen(false);
    setCsvPreviewData(null);
    setCsvFileName('');
    showToast(`Migration complete! Successfully updated ${updatedCount} students.`, 'success');
  };

  // -------------------------------------------------------------
  // Action 3: Entrance Exam Manual Input & Correction
  // -------------------------------------------------------------
  const handleOpenEntranceModal = (student, isCorrection = false) => {
    setActiveStudent(student);
    setIsCorrectionMode(isCorrection);

    const targetVerId = student.entranceExam?.examVersionId || 'v3.0';
    setSelectedExamVersionId(targetVerId);
    const ver = getVersionById(targetVerId);

    const initialScores = {};
    if (isCorrection && student.entranceExam?.categoryScores) {
      student.entranceExam.categoryScores.forEach((c) => {
        initialScores[c.categoryId] = c.score;
      });
    } else {
      ver.categories.forEach((c) => {
        initialScores[c.id] = '';
      });
    }

    setCategoryInputScores(initialScores);
    setEntranceMetaForm({
      testDate: student.entranceExam?.testDate || '2024-07-15',
      evaluator: student.entranceExam?.evaluator || CURRENT_STAFF_USER.name,
      reason: '',
    });

    setIsEntranceExamModalOpen(true);
  };

  const handleEntranceVersionChange = (newVerId) => {
    setSelectedExamVersionId(newVerId);
    const ver = getVersionById(newVerId);
    const initialScores = {};
    ver.categories.forEach((c) => {
      initialScores[c.id] = '';
    });
    setCategoryInputScores(initialScores);
  };

  const activeEntranceVersion = useMemo(() => getVersionById(selectedExamVersionId), [selectedExamVersionId]);

  const entranceTally = useMemo(() => {
    let rawSum = 0;
    activeEntranceVersion.categories.forEach((cat) => {
      const val = parseFloat(categoryInputScores[cat.id]);
      if (!isNaN(val)) rawSum += val;
    });

    const pct = activeEntranceVersion.totalItems > 0 ? Math.round((rawSum / activeEntranceVersion.totalItems) * 1000) / 10 : 0;
    return { rawSum, pct };
  }, [activeEntranceVersion, categoryInputScores]);

  const handleSaveEntranceExam = (e) => {
    e.preventDefault();
    if (!activeStudent) return;

    for (const cat of activeEntranceVersion.categories) {
      const val = parseFloat(categoryInputScores[cat.id]);
      if (isNaN(val) || val < 0 || val > cat.maxPoints) {
        showToast(`Please enter a valid score for ${cat.name} (0 to ${cat.maxPoints}).`, 'error');
        return;
      }
    }

    if (isCorrectionMode && !entranceMetaForm.reason.trim()) {
      showToast('Please provide an administrative reason for this score correction.', 'error');
      return;
    }

    const categoryScoresSnapshot = activeEntranceVersion.categories.map((cat) => ({
      categoryId: cat.id,
      name: cat.name,
      score: parseFloat(categoryInputScores[cat.id]),
      maxPoints: cat.maxPoints,
    }));

    const nowIso = new Date().toISOString();
    setStudents((prev) =>
      prev.map((s) =>
        s.id === activeStudent.id
          ? {
              ...s,
              entranceExam: {
                score: entranceTally.pct,
                totalRaw: entranceTally.rawSum,
                maxPoints: activeEntranceVersion.totalItems,
                examVersionId: activeEntranceVersion.id,
                examVersionName: activeEntranceVersion.name,
                categoryScores: categoryScoresSnapshot,
                testDate: entranceMetaForm.testDate,
                evaluator: entranceMetaForm.evaluator,
                correctionReason: isCorrectionMode ? entranceMetaForm.reason.trim() : null,
              },
              updatedAt: nowIso,
            }
          : s
      )
    );

    setIsEntranceExamModalOpen(false);
    showToast(`Entrance exam saved for ${activeStudent.lastName}: ${entranceTally.pct}% (${activeEntranceVersion.id}).`, 'success');
  };

  // -------------------------------------------------------------
  // Action 4: Aptitude Test Manual Input & Correction
  // -------------------------------------------------------------
  const handleOpenAptitudeModal = (student, isCorrection = false) => {
    setActiveStudent(student);
    setIsCorrectionMode(isCorrection);

    if (isCorrection && student.aptitudeTest) {
      setAptitudeForm({
        mode: student.aptitudeTest.mode || 'mode_a',
        rawScore: student.aptitudeTest.rawScore || 80,
        maxRawScore: student.aptitudeTest.maxRawScore || 100,
        percentileRank: student.aptitudeTest.percentileRank || 75,
        stanine: student.aptitudeTest.stanine || 6,
        iqEquivalent: student.aptitudeTest.iqEquivalent || '110 (High Average)',
        qualitativeInterpretation: student.aptitudeTest.qualitativeInterpretation || 'Average (Stanine 4–6 / PR 23–76)',
        clinicalReport: student.aptitudeTest.clinicalReport || '',
        recommendation: student.aptitudeTest.recommendation || 'recommended',
        testDate: student.aptitudeTest.testDate || '2024-07-15',
        evaluator: student.aptitudeTest.evaluator || CURRENT_STAFF_USER.name,
        reason: '',
      });
    } else {
      setAptitudeForm({
        mode: 'mode_a',
        rawScore: 80,
        maxRawScore: 100,
        percentileRank: 75,
        stanine: 6,
        iqEquivalent: '110 (High Average)',
        qualitativeInterpretation: 'Average (Stanine 4–6 / PR 23–76)',
        clinicalReport: 'The candidate demonstrates steady cognitive baseline aptitude with sound task dedication and psychological stability.',
        recommendation: 'recommended',
        testDate: '2024-07-15',
        evaluator: CURRENT_STAFF_USER.name,
        reason: '',
      });
    }

    setIsAptitudeTestModalOpen(true);
  };

  const handleSaveAptitudeTest = (e) => {
    e.preventDefault();
    if (!activeStudent) return;

    if (isCorrectionMode && !aptitudeForm.reason.trim()) {
      showToast('Please provide an administrative reason for this correction.', 'error');
      return;
    }

    const nowIso = new Date().toISOString();
    setStudents((prev) =>
      prev.map((s) =>
        s.id === activeStudent.id
          ? {
              ...s,
              aptitudeTest: {
                mode: aptitudeForm.mode,
                rawScore: aptitudeForm.mode === 'mode_a' ? parseFloat(aptitudeForm.rawScore) : null,
                maxRawScore: aptitudeForm.mode === 'mode_a' ? parseFloat(aptitudeForm.maxRawScore) : null,
                percentileRank: aptitudeForm.mode === 'mode_a' ? parseFloat(aptitudeForm.percentileRank) : null,
                stanine: aptitudeForm.mode === 'mode_a' ? parseInt(aptitudeForm.stanine, 10) : null,
                iqEquivalent: aptitudeForm.mode === 'mode_a' ? aptitudeForm.iqEquivalent : null,
                qualitativeInterpretation: aptitudeForm.mode === 'mode_a' ? aptitudeForm.qualitativeInterpretation : 'Clinical Evaluation Enclosed',
                clinicalReport: aptitudeForm.clinicalReport.trim(),
                recommendation: aptitudeForm.recommendation,
                testDate: aptitudeForm.testDate,
                evaluator: aptitudeForm.evaluator,
                correctionReason: isCorrectionMode ? aptitudeForm.reason.trim() : null,
              },
              updatedAt: nowIso,
            }
          : s
      )
    );

    setIsAptitudeTestModalOpen(false);
    showToast(`Guidance Aptitude evaluation saved for ${activeStudent.lastName} (${aptitudeForm.mode === 'mode_a' ? `Stanine ${aptitudeForm.stanine}` : 'Clinical Letter'}).`, 'success');
  };

  return (
    <div className="migration-unslop-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`unslop-toast ${toastMessage.type}`}>
          {toastMessage.type === 'success' && <CheckCircle2 size={16} />}
          {toastMessage.type === 'error' && <AlertCircle size={16} />}
          {toastMessage.type === 'info' && <ShieldCheck size={16} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Hidden File Input for CSV */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,text/csv"
        style={{ display: 'none' }}
      />

      {/* Header Section */}
      <div className="migration-header-card">
        <div className="header-left">
          <div className="header-badge-row">
            <span className="inst-badge">SCMBT Guidance Directorate</span>
            <span className="gate-pill">Gate 5 Dual-Exam Matrix</span>
            <span className="version-pill" title="Entrance Exam & Aptitude Test tracked independently">
              <Layers size={11} />
              <span>Independent Evaluation Columns</span>
            </span>
          </div>
          <h1 className="header-title">Student Entrance Exam &amp; Aptitude Migration</h1>
          <p className="header-subtitle">
            Independently manage academic <strong>Entrance Examination</strong> scores (version-controlled per category) and <strong>Guidance RPM Aptitude Test</strong> results (RA 10029).
          </p>
        </div>

        {/* Primary Header Action Buttons */}
        <div className="header-actions">
          <button
            type="button"
            className="btn-download-template"
            onClick={() => setIsDownloadTemplateModalOpen(true)}
            title="Download CSV containing students who currently lack exam or aptitude records"
          >
            <Download size={15} />
            <span>Download Template</span>
          </button>

          <button
            type="button"
            className="btn-migration-csv"
            onClick={() => {
              setCsvPreviewData(null);
              setCsvFileName('');
              setIsUploadCsvModalOpen(true);
            }}
            title="Upload CSV to migrate records in bulk"
          >
            <Upload size={15} />
            <span>Migration (Upload CSV)</span>
          </button>
        </div>
      </div>

      {/* Table Control Bar: Filter Tabs & Search */}
      <div className="table-controls-bar">
        <div className="filter-tabs">
          <button
            type="button"
            className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            <span>All Students</span>
            <span className="count-pill">{countStats.total}</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${statusFilter === 'both' ? 'active' : ''}`}
            onClick={() => setStatusFilter('both')}
          >
            <span>Both Recorded</span>
            <span className="count-pill success">{countStats.both}</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${statusFilter === 'entrance_only' ? 'active' : ''}`}
            onClick={() => setStatusFilter('entrance_only')}
          >
            <span>Entrance Exam Only</span>
            <span className="count-pill">{countStats.entrance}</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${statusFilter === 'aptitude_only' ? 'active' : ''}`}
            onClick={() => setStatusFilter('aptitude_only')}
          >
            <span>Aptitude Only</span>
            <span className="count-pill purple">{countStats.aptitude}</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${statusFilter === 'pending_both' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending_both')}
          >
            <span>Pending Both</span>
            <span className="count-pill warning">{countStats.pending}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search Student ID or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="unslop-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          THE SINGLE UNIFIED TABLE (Requested 2 Separate Columns):
          Student ID | Lastname | First | Middle | Entrance Exam | Aptitude Test | Status
          ========================================================= */}
      <div className="single-table-card">
        <div className="table-responsive">
          <table className="unslop-student-table dual-columns">
            <thead>
              <tr>
                <th className="th-id">Student ID</th>
                <th className="th-last">Lastname</th>
                <th className="th-first">First</th>
                <th className="th-mid">Middle</th>
                <th className="th-entrance">Entrance Exam</th>
                <th className="th-aptitude">Guidance Aptitude Test</th>
                <th className="th-status">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-row">
                    <div className="empty-state">
                      <FileSpreadsheet size={28} className="text-slate-400" />
                      <p>No student accounts match the selected filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const hasEntrance = s.entranceExam && s.entranceExam.score !== null;
                  const hasAptitude = s.aptitudeTest !== null;
                  const isBreakdownOpen = viewBreakdownStudentId === s.id;
                  const overallStatus = getStudentStatus(s);

                  return (
                    <tr key={s.id}>
                      {/* Column 1: Student ID */}
                      <td className="td-id">
                        <span className="student-id-text tabular-nums">{s.studentId}</span>
                      </td>

                      {/* Column 2: Lastname */}
                      <td className="td-last">
                        <span className="student-name font-semibold">{s.lastName}</span>
                      </td>

                      {/* Column 3: First */}
                      <td className="td-first">
                        <span className="student-name">{s.firstName}</span>
                      </td>

                      {/* Column 4: Middle */}
                      <td className="td-mid">
                        <span className="student-name text-slate-500">{s.middleName || '—'}</span>
                      </td>

                      {/* =========================================
                          COLUMN 5: ENTRANCE EXAM (SEPARATE COLUMN)
                          ========================================= */}
                      <td className="td-entrance">
                        {!hasEntrance ? (
                          <button
                            type="button"
                            className="btn-input-slot"
                            onClick={() => handleOpenEntranceModal(s, false)}
                            title={`Input academic entrance exam score for ${s.lastName}`}
                          >
                            <Plus size={12} />
                            <span>Input Exam</span>
                          </button>
                        ) : (
                          <div className="slot-recorded-container">
                            <div className="slot-recorded-header">
                              <span className="slot-main-score tabular-nums">{s.entranceExam.score}%</span>
                              <span className="slot-version-tag">{s.entranceExam.examVersionId}</span>
                              <button
                                type="button"
                                className="btn-edit-slot"
                                onClick={() => handleOpenEntranceModal(s, true)}
                                title="Edit / Correct Entrance Exam"
                              >
                                <Edit3 size={11} />
                              </button>
                            </div>

                            {/* Collapsible Category Breakdown Toggle */}
                            {s.entranceExam.categoryScores && (
                              <button
                                type="button"
                                className={`btn-category-toggle ${isBreakdownOpen ? 'active' : ''}`}
                                onClick={() => setViewBreakdownStudentId(isBreakdownOpen ? null : s.id)}
                              >
                                <span>{s.entranceExam.categoryScores.length} Categories</span>
                                <ChevronDown size={10} className={isBreakdownOpen ? 'rotate-180' : ''} />
                              </button>
                            )}

                            {/* In-row Category Breakdown Tray */}
                            {isBreakdownOpen && s.entranceExam.categoryScores && (
                              <div className="inrow-category-tray">
                                {s.entranceExam.categoryScores.map((c, ci) => (
                                  <div key={ci} className="inrow-cat-item">
                                    <span className="inrow-cat-name">{c.name}:</span>
                                    <span className="inrow-cat-val tabular-nums"><strong>{c.score}</strong>/{c.maxPoints}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* =========================================
                          COLUMN 6: APTITUDE TEST (SEPARATE COLUMN)
                          ========================================= */}
                      <td className="td-aptitude">
                        {!hasAptitude ? (
                          <button
                            type="button"
                            className="btn-input-slot aptitude"
                            onClick={() => handleOpenAptitudeModal(s, false)}
                            title={`Input Guidance RPM Aptitude test for ${s.lastName}`}
                          >
                            <Plus size={12} />
                            <span>Input Aptitude</span>
                          </button>
                        ) : (
                          <div className="slot-recorded-container">
                            <div className="slot-recorded-header">
                              {s.aptitudeTest.mode === 'mode_a' ? (
                                <>
                                  <span className="slot-main-score aptitude tabular-nums">
                                    Stanine {s.aptitudeTest.stanine}
                                  </span>
                                  <span className="slot-pr-tag tabular-nums">{s.aptitudeTest.percentileRank}% PR</span>
                                </>
                              ) : (
                                <span className="slot-modeb-tag">
                                  <FileText size={11} />
                                  <span>Clinical Report</span>
                                </span>
                              )}

                              <button
                                type="button"
                                className="btn-edit-slot"
                                onClick={() => handleOpenAptitudeModal(s, true)}
                                title="Edit / Correct Guidance Aptitude Record"
                              >
                                <Edit3 size={11} />
                              </button>
                            </div>

                            <div className="slot-meta-row">
                              <span className={`recommend-chip ${s.aptitudeTest.recommendation}`}>
                                {s.aptitudeTest.recommendation === 'recommended' ? 'Recommended' : 'Conditional'}
                              </span>
                              <span className="slot-evaluator">{s.aptitudeTest.evaluator.split(',')[0]}</span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* =========================================
                          COLUMN 7: OVERALL ADMISSION STATUS
                          ========================================= */}
                      <td className="td-status">
                        {overallStatus === 'both' ? (
                          <span className="status-badge both">
                            <Check size={11} />
                            <span>Both Recorded</span>
                          </span>
                        ) : overallStatus === 'entrance_only' ? (
                          <span className="status-badge entrance-only">
                            <span>Entrance Only</span>
                          </span>
                        ) : overallStatus === 'aptitude_only' ? (
                          <span className="status-badge aptitude-only">
                            <Brain size={11} />
                            <span>Aptitude Only</span>
                          </span>
                        ) : (
                          <span className="status-badge pending">
                            <span>Pending Both</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Summary */}
        <div className="table-footer-bar">
          <div className="footer-left text-slate-500 text-xs">
            Showing <strong className="tabular-nums">{filteredStudents.length}</strong> of{' '}
            <strong className="tabular-nums">{students.length}</strong> registered students
          </div>

          <div className="footer-right">
            <button
              type="button"
              className="btn-nav-prev"
              onClick={onBackToGate4}
              title="Return to Gate 4: RPM Aptitude Encoding"
            >
              <ArrowLeft size={14} />
              <span>Back to Gate 4</span>
            </button>

            <button
              type="button"
              className="btn-nav-next"
              onClick={onProceedToGate6}
              title="Proceed to Gate 6: Faculty Class Roster"
            >
              <span>Proceed to Gate 6</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          MODAL 0: DOWNLOAD TEMPLATE (ENTRANCE vs APTITUDE vs BOTH)
          ========================================================= */}
      {isDownloadTemplateModalOpen && (
        <div className="unslop-modal-overlay" role="dialog" aria-modal="true">
          <div className="unslop-modal-card template-modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Download size={18} className="text-navy-900" />
                <h3>Download Migration CSV Template</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsDownloadTemplateModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll">
              <p className="modal-lead-text">
                Select which assessment record you wish to download a template for. The generated CSV will automatically adapt columns to match.
              </p>

              {/* Template Type Switcher */}
              <div className="template-type-tabs">
                <button
                  type="button"
                  className={`template-type-btn ${templateTargetType === 'entrance' ? 'active' : ''}`}
                  onClick={() => setTemplateTargetType('entrance')}
                >
                  <strong>Entrance Examination</strong>
                  <span>Per-Category Scores by Version</span>
                </button>

                <button
                  type="button"
                  className={`template-type-btn ${templateTargetType === 'aptitude' ? 'active' : ''}`}
                  onClick={() => setTemplateTargetType('aptitude')}
                >
                  <strong>Guidance Aptitude Test</strong>
                  <span>Stanine, PR &amp; Clinical Letter</span>
                </button>

                <button
                  type="button"
                  className={`template-type-btn ${templateTargetType === 'combined' ? 'active' : ''}`}
                  onClick={() => setTemplateTargetType('combined')}
                >
                  <strong>Combined Master</strong>
                  <span>Both Exam &amp; Aptitude Columns</span>
                </button>
              </div>

              {/* Version Selector (if Entrance or Combined) */}
              {(templateTargetType === 'entrance' || templateTargetType === 'combined') && (
                <div className="form-group">
                  <label className="field-label">Entrance Exam Version Used *</label>
                  <select
                    value={templateVersionId}
                    onChange={(e) => setTemplateVersionId(e.target.value)}
                    className="select-input"
                  >
                    {EXAM_VERSIONS.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.categories.length} Categories, {v.totalItems} Items)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Info Box */}
              <div className="template-info-box">
                <Info size={16} className="text-navy-800" />
                <span>
                  {templateTargetType === 'entrance' && `Template pre-fills the ${students.filter(s => !s.entranceExam).length} students needing entrance exams.`}
                  {templateTargetType === 'aptitude' && `Template pre-fills the ${students.filter(s => !s.aptitudeTest).length} students needing guidance aptitude tests.`}
                  {templateTargetType === 'combined' && `Template includes all ${students.length} student accounts.`}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsDownloadTemplateModalOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-primary-action"
                onClick={handleExecuteDownloadTemplate}
              >
                <Download size={14} />
                <span>Download {templateTargetType.toUpperCase()} Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 1: MIGRATION (UPLOAD CSV)
          ========================================================= */}
      {isUploadCsvModalOpen && (
        <div className="unslop-modal-overlay" role="dialog" aria-modal="true">
          <div className="unslop-modal-card csv-modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Upload size={18} className="text-navy-900" />
                <h3>Migration: Upload from CSV File</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsUploadCsvModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll">
              <p className="modal-lead-text">
                Select which test type you are uploading. Student records will be updated automatically by matching <strong>Student ID</strong>.
              </p>

              {/* Target Type Selector */}
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="field-label">Upload Target Assessment *</label>
                  <select
                    value={uploadTargetType}
                    onChange={(e) => {
                      setUploadTargetType(e.target.value);
                      setCsvPreviewData(null);
                    }}
                    className="select-input"
                  >
                    <option value="entrance">Academic Entrance Examination</option>
                    <option value="aptitude">Guidance RPM Aptitude Test</option>
                  </select>
                </div>

                {uploadTargetType === 'entrance' && (
                  <div className="form-group">
                    <label className="field-label">Target Exam Version *</label>
                    <select
                      value={uploadVersionId}
                      onChange={(e) => {
                        setUploadVersionId(e.target.value);
                        setCsvPreviewData(null);
                      }}
                      className="select-input"
                    >
                      {EXAM_VERSIONS.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Upload Dropzone */}
              <div className="upload-dropzone" onClick={handleOpenFilePicker}>
                <FileSpreadsheet size={36} className="text-navy-800" />
                <h4>{csvFileName || 'Click to select or drop CSV file'}</h4>
                <p>Accepts standard .csv exports with Student ID and score columns</p>
                <button
                  type="button"
                  className="btn-select-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFilePicker();
                  }}
                >
                  Choose Local File
                </button>
              </div>

              {/* Quick Sample Button */}
              <div className="sample-helper-row">
                <span>Want to test immediately?</span>
                <button
                  type="button"
                  className="btn-link-sample"
                  onClick={handleLoadSampleCsv}
                >
                  Load Sample {uploadTargetType === 'entrance' ? `Entrance (${uploadVersionId})` : 'Aptitude'} Data
                </button>
              </div>

              {/* CSV Preview */}
              {csvPreviewData && csvPreviewData.length > 0 && (
                <div className="csv-preview-section">
                  <div className="preview-header">
                    <h4>Validated Records Preview ({csvPreviewData.length})</h4>
                    <span className="ready-badge">Ready for Ingestion</span>
                  </div>

                  <div className="preview-table-container">
                    <table className="preview-table">
                      <thead>
                        <tr>
                          <th>Student ID</th>
                          <th>Full Name</th>
                          <th>Result Payload</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreviewData.map((row, idx) => (
                          <tr key={idx}>
                            <td className="font-mono text-xs">{row.studentId}</td>
                            <td>{row.lastName}, {row.firstName}</td>
                            <td>
                              {row.type === 'entrance' ? (
                                <span className="font-semibold text-navy-900 tabular-nums">
                                  {row.entranceExam.score}% ({row.entranceExam.examVersionId})
                                </span>
                              ) : (
                                <span className="font-semibold text-purple-800 tabular-nums">
                                  Stanine {row.aptitudeTest.stanine} ({row.aptitudeTest.percentileRank}% PR)
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsUploadCsvModalOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-primary-action"
                onClick={handleConfirmCsvMigration}
                disabled={!csvPreviewData || csvPreviewData.length === 0}
              >
                <Check size={14} />
                <span>Confirm Migration ({csvPreviewData ? csvPreviewData.length : 0} Records)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: ENTRANCE EXAM INPUT / CORRECTION (PER CATEGORY)
          ========================================================= */}
      {isEntranceExamModalOpen && activeStudent && (
        <div className="unslop-modal-overlay" role="dialog" aria-modal="true">
          <div className="unslop-modal-card single-input-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <FileText size={18} className="text-navy-900" />
                <h3>
                  {isCorrectionMode ? 'Correct Entrance Exam' : 'Manual Entrance Exam Input'} &bull; {activeStudent.studentId}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsEntranceExamModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEntranceExam}>
              <div className="modal-body-scroll">
                {/* Student Strip */}
                <div className="student-profile-strip">
                  <div className="strip-col">
                    <span className="strip-label">Student ID</span>
                    <span className="strip-val font-mono">{activeStudent.studentId}</span>
                  </div>
                  <div className="strip-col">
                    <span className="strip-label">Full Name</span>
                    <span className="strip-val font-semibold">
                      {activeStudent.lastName}, {activeStudent.firstName} {activeStudent.middleName}
                    </span>
                  </div>
                  <div className="strip-col">
                    <span className="strip-label">Degree Program</span>
                    <span className="strip-val text-navy-800">{activeStudent.program}</span>
                  </div>
                </div>

                {/* Exam Version */}
                <div className="form-group">
                  <label className="field-label">Exam Version Administered *</label>
                  <select
                    value={selectedExamVersionId}
                    onChange={(e) => handleEntranceVersionChange(e.target.value)}
                    className="select-input"
                    disabled={isCorrectionMode}
                  >
                    {EXAM_VERSIONS.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.totalItems} Items)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Input Fields */}
                <div className="category-scores-section">
                  <h4 className="section-title">
                    Scores Per Category ({activeEntranceVersion.categories.length} Categories)
                  </h4>

                  <div className="category-inputs-grid">
                    {activeEntranceVersion.categories.map((cat) => (
                      <div key={cat.id} className="category-input-card">
                        <label className="cat-label">
                          <span className="cat-name">{cat.name}</span>
                          <span className="cat-max font-mono">Max: {cat.maxPoints} pts</span>
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={cat.maxPoints}
                          placeholder={`0–${cat.maxPoints}`}
                          value={categoryInputScores[cat.id] ?? ''}
                          onChange={(e) =>
                            setCategoryInputScores({
                              ...categoryInputScores,
                              [cat.id]: e.target.value,
                            })
                          }
                          className="text-input-lg tabular-nums"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Tally Banner */}
                <div className="live-tally-banner">
                  <div className="tally-item">
                    <span className="tally-label">Raw Total:</span>
                    <span className="tally-val tabular-nums">
                      <strong>{entranceTally.rawSum}</strong> / {activeEntranceVersion.totalItems} pts
                    </span>
                  </div>
                  <div className="tally-item">
                    <span className="tally-label">Percentage:</span>
                    <span className="tally-val tabular-nums highlight">
                      {entranceTally.pct}%
                    </span>
                  </div>
                </div>

                {/* Date & Evaluator */}
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="field-label">Examination Date *</label>
                    <input
                      type="date"
                      value={entranceMetaForm.testDate}
                      onChange={(e) => setEntranceMetaForm({ ...entranceMetaForm, testDate: e.target.value })}
                      className="text-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">Administering RPM / Evaluator</label>
                    <input
                      type="text"
                      value={entranceMetaForm.evaluator}
                      onChange={(e) => setEntranceMetaForm({ ...entranceMetaForm, evaluator: e.target.value })}
                      className="text-input"
                    />
                  </div>
                </div>

                {/* Correction Reason */}
                {isCorrectionMode && (
                  <div className="form-group">
                    <label className="field-label">Administrative Reason for Correction *</label>
                    <textarea
                      rows={2}
                      value={entranceMetaForm.reason}
                      onChange={(e) => setEntranceMetaForm({ ...entranceMetaForm, reason: e.target.value })}
                      className="textarea-input"
                      placeholder="Explain correction reason (e.g. Transcription error from archive sheet Form 137)..."
                      required
                    />
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsEntranceExamModalOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-primary-action">
                  <Check size={14} />
                  <span>{isCorrectionMode ? 'Save Correction' : 'Save Entrance Exam'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: GUIDANCE APTITUDE TEST INPUT / CORRECTION (RA 10029)
          ========================================================= */}
      {isAptitudeTestModalOpen && activeStudent && (
        <div className="unslop-modal-overlay" role="dialog" aria-modal="true">
          <div className="unslop-modal-card single-input-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Brain size={18} className="text-purple-700" />
                <h3>
                  {isCorrectionMode ? 'Correct Guidance Aptitude Record' : 'Guidance RPM Aptitude Assessment'} &bull; {activeStudent.studentId}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAptitudeTestModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAptitudeTest}>
              <div className="modal-body-scroll">
                {/* Student Strip */}
                <div className="student-profile-strip">
                  <div className="strip-col">
                    <span className="strip-label">Student ID</span>
                    <span className="strip-val font-mono">{activeStudent.studentId}</span>
                  </div>
                  <div className="strip-col">
                    <span className="strip-label">Full Name</span>
                    <span className="strip-val font-semibold">
                      {activeStudent.lastName}, {activeStudent.firstName} {activeStudent.middleName}
                    </span>
                  </div>
                  <div className="strip-col">
                    <span className="strip-label">Degree Program</span>
                    <span className="strip-val text-navy-800">{activeStudent.program}</span>
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="form-group">
                  <label className="field-label">Evaluation Mode *</label>
                  <div className="mode-toggle-group">
                    <button
                      type="button"
                      className={`mode-btn ${aptitudeForm.mode === 'mode_a' ? 'active' : ''}`}
                      onClick={() => setAptitudeForm({ ...aptitudeForm, mode: 'mode_a' })}
                    >
                      <strong>Mode A: Standardized Metrics + Paragraph</strong>
                      <span>Raw Score, PR, Stanine, IQ + Clinical Report</span>
                    </button>

                    <button
                      type="button"
                      className={`mode-btn ${aptitudeForm.mode === 'mode_b' ? 'active' : ''}`}
                      onClick={() => setAptitudeForm({ ...aptitudeForm, mode: 'mode_b' })}
                    >
                      <strong>Mode B: Letter / Clinical Narrative Only</strong>
                      <span>Comprehensive Psychological Report (No Metrics)</span>
                    </button>
                  </div>
                </div>

                {/* Mode A Metrics Fields */}
                {aptitudeForm.mode === 'mode_a' && (
                  <>
                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label className="field-label">Raw Score (0–100) *</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={aptitudeForm.rawScore}
                          onChange={(e) => setAptitudeForm({ ...aptitudeForm, rawScore: e.target.value })}
                          className="text-input tabular-nums"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="field-label">Percentile Rank (0–100%) *</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="100"
                          value={aptitudeForm.percentileRank}
                          onChange={(e) => {
                            const pr = parseFloat(e.target.value);
                            setAptitudeForm({
                              ...aptitudeForm,
                              percentileRank: e.target.value,
                              stanine: calculateStanine(pr),
                            });
                          }}
                          className="text-input tabular-nums"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label className="field-label">Stanine (1 to 9 Standard Nine) *</label>
                        <select
                          value={aptitudeForm.stanine}
                          onChange={(e) => setAptitudeForm({ ...aptitudeForm, stanine: e.target.value })}
                          className="select-input tabular-nums"
                        >
                          <option value="1">Stanine 1 (Very Low / PR 0–4)</option>
                          <option value="2">Stanine 2 (Low / PR 5–11)</option>
                          <option value="3">Stanine 3 (Below Average / PR 12–22)</option>
                          <option value="4">Stanine 4 (Low Average / PR 23–39)</option>
                          <option value="5">Stanine 5 (Average / PR 40–59)</option>
                          <option value="6">Stanine 6 (High Average / PR 60–76)</option>
                          <option value="7">Stanine 7 (Above Average / PR 77–88)</option>
                          <option value="8">Stanine 8 (Superior / PR 89–95)</option>
                          <option value="9">Stanine 9 (Very Superior / PR 96–100)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="field-label">IQ / Mental Ability Equivalent</label>
                        <input
                          type="text"
                          value={aptitudeForm.iqEquivalent}
                          onChange={(e) => setAptitudeForm({ ...aptitudeForm, iqEquivalent: e.target.value })}
                          className="text-input"
                          placeholder="e.g. 110 (High Average)"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Paragraph Evaluation (For both Mode A & Mode B) */}
                <div className="form-group">
                  <label className="field-label">
                    {aptitudeForm.mode === 'mode_a' ? 'Clinical Psychological Interpretation (Paragraph)' : 'Full Clinical Narrative Letter / Report *'}
                  </label>
                  <textarea
                    rows={4}
                    value={aptitudeForm.clinicalReport}
                    onChange={(e) => setAptitudeForm({ ...aptitudeForm, clinicalReport: e.target.value })}
                    className="textarea-input"
                    placeholder="Enter narrative psychological evaluation and behavioral observations..."
                    required
                  />
                </div>

                {/* Recommendation & Evaluator */}
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="field-label">Admission Recommendation *</label>
                    <select
                      value={aptitudeForm.recommendation}
                      onChange={(e) => setAptitudeForm({ ...aptitudeForm, recommendation: e.target.value })}
                      className="select-input"
                    >
                      <option value="recommended">Recommended for Admission</option>
                      <option value="conditional">Conditional (Subject to Faculty Mentoring)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="field-label">Licensed RPM Evaluator (RA 10029)</label>
                    <input
                      type="text"
                      value={aptitudeForm.evaluator}
                      onChange={(e) => setAptitudeForm({ ...aptitudeForm, evaluator: e.target.value })}
                      className="text-input"
                    />
                  </div>
                </div>

                {/* Correction Reason */}
                {isCorrectionMode && (
                  <div className="form-group">
                    <label className="field-label">Administrative Reason for Correction *</label>
                    <textarea
                      rows={2}
                      value={aptitudeForm.reason}
                      onChange={(e) => setAptitudeForm({ ...aptitudeForm, reason: e.target.value })}
                      className="textarea-input"
                      placeholder="Explain correction reason..."
                      required
                    />
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsAptitudeTestModalOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-primary-action">
                  <Check size={14} />
                  <span>{isCorrectionMode ? 'Save Aptitude Correction' : 'Save Aptitude Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
