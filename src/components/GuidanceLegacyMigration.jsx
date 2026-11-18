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
  RotateCcw,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import './GuidanceLegacyMigration.css';

export default function GuidanceLegacyMigration({ onBackToGate4, onProceedToGate6 }) {
  // Master Student Dataset (Single Table)
  const [students, setStudents] = useState(INITIAL_MIGRATION_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'without_score', 'scored'

  // Modals state
  const [isDownloadTemplateModalOpen, setIsDownloadTemplateModalOpen] = useState(false);
  const [isUploadCsvModalOpen, setIsUploadCsvModalOpen] = useState(false);
  const [isInputScoreModalOpen, setIsInputScoreModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  // Active Category Breakdown Popover / Drawer
  const [viewBreakdownStudentId, setViewBreakdownStudentId] = useState(null);

  // Version selection for Download Template
  const [templateVersionId, setTemplateVersionId] = useState('v3.0');

  // Version selection for Upload CSV Migration
  const [uploadVersionId, setUploadVersionId] = useState('v2.0');

  // File input ref for CSV upload
  const fileInputRef = useRef(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Form state for Manual Input (for student without score)
  const [selectedExamVersionId, setSelectedExamVersionId] = useState('v3.0');
  const [categoryInputScores, setCategoryInputScores] = useState({});
  const [inputMetaForm, setInputMetaForm] = useState({
    testDate: '2024-07-15',
    evaluator: CURRENT_STAFF_USER.name,
    remarks: 'Transcribed from verified Room 102 archives.',
  });

  // Form state for Manual Correction (for student who already has score)
  const [correctionCategoryScores, setCorrectionCategoryScores] = useState({});
  const [correctionReason, setCorrectionReason] = useState('');

  // Parsed CSV state for preview in Upload CSV modal
  const [csvPreviewData, setCsvPreviewData] = useState(null);
  const [csvFileName, setCsvFileName] = useState('');

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

  // -------------------------------------------------------------
  // Filtered Students
  // -------------------------------------------------------------
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (statusFilter === 'without_score' && s.score !== null) return false;
      if (statusFilter === 'scored' && s.score === null) return false;

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

  const withoutScoreCount = useMemo(() => students.filter((s) => s.score === null).length, [students]);
  const scoredCount = useMemo(() => students.filter((s) => s.score !== null).length, [students]);

  // -------------------------------------------------------------
  // Action 1: Download Template (With Exam Version Option)
  // -------------------------------------------------------------
  const handleExecuteDownloadTemplate = () => {
    const unScoredList = students.filter((s) => s.score === null);
    const version = getVersionById(templateVersionId);

    if (unScoredList.length === 0) {
      showToast('All registered students currently have scores recorded.', 'info');
      setIsDownloadTemplateModalOpen(false);
      return;
    }

    // Build category column headers according to selected version
    const categoryHeaders = version.categories.map((c) => `Score_${c.id}_${c.name.replace(/[^a-zA-Z0-9]/g, '_')}_[Max_${c.maxPoints}]`);
    const headers = [
      'Student ID',
      'Lastname',
      'First',
      'Middle',
      'Exam_Version_ID',
      'Exam_Version_Name',
      ...categoryHeaders,
      'Test_Date',
      'Archival_Remarks'
    ];

    const rows = unScoredList.map((s) => [
      s.studentId,
      `"${s.lastName}"`,
      `"${s.firstName}"`,
      `"${s.middleName}"`,
      version.id,
      `"${version.name}"`,
      ...version.categories.map(() => ''), // empty score cells for categories
      '2024-07-15',
      `"Retroactive migration for ${s.program}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SCMBT_Template_${version.id}_${version.academicYear.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloadTemplateModalOpen(false);
    showToast(`Downloaded template for ${version.name} with ${version.categories.length} category columns.`, 'success');
  };

  // -------------------------------------------------------------
  // Action 2: CSV Upload & Migration
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
      processCsvContent(text, uploadVersionId);
    };
    reader.readAsText(file);
  };

  // Quick 1-Click Sample Ingestion based on selected version
  const handleLoadSampleCsv = () => {
    const version = getVersionById(uploadVersionId);
    setCsvFileName(`SCMBT_Retroactive_Sample_${version.id}.csv`);

    const unScoredList = students.filter((s) => s.score === null);
    const sampleCategoryScorePcts = [0.82, 0.74, 0.88, 0.70, 0.90];

    const preview = unScoredList.map((s, idx) => {
      const pct = sampleCategoryScorePcts[idx % sampleCategoryScorePcts.length];
      const categoryScores = version.categories.map((cat, cIdx) => {
        const catPct = Math.min(1, Math.max(0.4, pct + ((cIdx % 2 === 0 ? 1 : -1) * 0.05)));
        const catScore = Math.round(cat.maxPoints * catPct * 2) / 2; // round to half points
        return {
          categoryId: cat.id,
          name: cat.name,
          score: catScore,
          maxPoints: cat.maxPoints,
        };
      });

      const totalRaw = categoryScores.reduce((acc, curr) => acc + curr.score, 0);
      const scorePct = Math.round((totalRaw / version.totalItems) * 1000) / 10;
      const stanine = calculateStanine(scorePct);

      return {
        studentId: s.studentId,
        lastName: s.lastName,
        firstName: s.firstName,
        middleName: s.middleName,
        examVersionId: version.id,
        examVersionName: version.name,
        categoryScores,
        totalRaw,
        maxPoints: version.totalItems,
        scorePct,
        stanine,
        testDate: '2024-07-15',
        remarks: 'Sample category-wise retroactive import',
      };
    });

    setCsvPreviewData(preview);
  };

  const processCsvContent = (csvText, versionId) => {
    const version = getVersionById(versionId);
    const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      showToast('CSV file is empty or missing data rows.', 'error');
      return;
    }

    const preview = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.replace(/^"|"$/g, '').trim());
      if (parts.length >= 5) {
        const studentId = parts[0];
        const lastName = parts[1];
        const firstName = parts[2];
        const middleName = parts[3];

        // Parse categories (starts at index 6 after student metadata and version name)
        let categoryScores = [];
        let totalRaw = 0;

        version.categories.forEach((cat, cIdx) => {
          const colIdx = 6 + cIdx;
          const scoreVal = parts[colIdx] ? parseFloat(parts[colIdx]) : cat.maxPoints * 0.75;
          const safeScore = isNaN(scoreVal) ? cat.maxPoints * 0.75 : scoreVal;
          totalRaw += safeScore;
          categoryScores.push({
            categoryId: cat.id,
            name: cat.name,
            score: safeScore,
            maxPoints: cat.maxPoints,
          });
        });

        const scorePct = Math.round((totalRaw / version.totalItems) * 1000) / 10;
        const stanine = calculateStanine(scorePct);

        if (studentId) {
          preview.push({
            studentId,
            lastName: lastName || '',
            firstName: firstName || '',
            middleName: middleName || '',
            examVersionId: version.id,
            examVersionName: version.name,
            categoryScores,
            totalRaw,
            maxPoints: version.totalItems,
            scorePct,
            stanine,
            testDate: '2024-07-15',
            remarks: 'Imported via Versioned CSV Migration',
          });
        }
      }
    }

    if (preview.length === 0) {
      showToast('No valid student score rows detected in CSV. Please verify column order.', 'error');
      return;
    }

    setCsvPreviewData(preview);
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
          return {
            ...s,
            examVersionId: match.examVersionId,
            examVersionName: match.examVersionName,
            categoryScores: match.categoryScores,
            totalRaw: match.totalRaw,
            maxPoints: match.maxPoints,
            score: match.scorePct,
            stanine: match.stanine,
            testDate: match.testDate,
            examType: `${match.examVersionName} (CSV Migrated)`,
            status: 'Scored',
            evaluator: CURRENT_STAFF_USER.name,
            updatedAt: nowIso,
          };
        }
        return s;
      })
    );

    setIsUploadCsvModalOpen(false);
    setCsvPreviewData(null);
    setCsvFileName('');
    showToast(`Migration complete! Successfully imported category scores for ${updatedCount} students.`, 'success');
  };

  // -------------------------------------------------------------
  // Action 3: Manual Input Per Student (Only Without Score)
  // -------------------------------------------------------------
  const handleOpenInputScore = (student) => {
    setActiveStudent(student);
    const defaultVer = EXAM_VERSIONS[0];
    setSelectedExamVersionId(defaultVer.id);

    // Initialize category scores with default empty/zeroes
    const initialScores = {};
    defaultVer.categories.forEach((c) => {
      initialScores[c.id] = '';
    });
    setCategoryInputScores(initialScores);

    setInputMetaForm({
      testDate: '2024-07-15',
      evaluator: CURRENT_STAFF_USER.name,
      remarks: 'Transcribed from verified Room 102 archives.',
    });

    setIsInputScoreModalOpen(true);
  };

  // Handle version change in manual input modal
  const handleInputVersionChange = (newVerId) => {
    setSelectedExamVersionId(newVerId);
    const newVer = getVersionById(newVerId);
    const initialScores = {};
    newVer.categories.forEach((c) => {
      initialScores[c.id] = '';
    });
    setCategoryInputScores(initialScores);
  };

  // Real-time calculation of manual score input
  const activeInputVersion = useMemo(() => getVersionById(selectedExamVersionId), [selectedExamVersionId]);

  const manualTally = useMemo(() => {
    let rawSum = 0;
    let anyFilled = false;

    activeInputVersion.categories.forEach((cat) => {
      const val = parseFloat(categoryInputScores[cat.id]);
      if (!isNaN(val)) {
        rawSum += val;
        anyFilled = true;
      }
    });

    const pct = activeInputVersion.totalItems > 0 ? Math.round((rawSum / activeInputVersion.totalItems) * 1000) / 10 : 0;
    const stanine = calculateStanine(pct);

    return { rawSum, pct, stanine, anyFilled };
  }, [activeInputVersion, categoryInputScores]);

  const handleSaveInputScore = (e) => {
    e.preventDefault();
    if (!activeStudent) return;

    // Validate that all categories have valid scores
    for (const cat of activeInputVersion.categories) {
      const val = parseFloat(categoryInputScores[cat.id]);
      if (isNaN(val) || val < 0 || val > cat.maxPoints) {
        showToast(`Please enter a valid score for ${cat.name} (0 to ${cat.maxPoints}).`, 'error');
        return;
      }
    }

    const categoryScoresSnapshot = activeInputVersion.categories.map((cat) => ({
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
              examVersionId: activeInputVersion.id,
              examVersionName: activeInputVersion.name,
              categoryScores: categoryScoresSnapshot,
              totalRaw: manualTally.rawSum,
              maxPoints: activeInputVersion.totalItems,
              score: manualTally.pct,
              stanine: manualTally.stanine,
              testDate: inputMetaForm.testDate,
              examType: activeInputVersion.name,
              evaluator: inputMetaForm.evaluator,
              status: 'Scored',
              updatedAt: nowIso,
            }
          : s
      )
    );

    setIsInputScoreModalOpen(false);
    showToast(`Scores recorded for ${activeStudent.lastName}: ${manualTally.pct}% (${manualTally.rawSum}/${activeInputVersion.totalItems} pts).`, 'success');
  };

  // -------------------------------------------------------------
  // Action 4: Manual Input For Correction (For Students With Score)
  // -------------------------------------------------------------
  const handleOpenCorrection = (student) => {
    setActiveStudent(student);
    const ver = getVersionById(student.examVersionId || 'v2.0');

    // Populate current category scores
    const currentScoresMap = {};
    if (student.categoryScores && Array.isArray(student.categoryScores)) {
      student.categoryScores.forEach((c) => {
        currentScoresMap[c.categoryId] = c.score;
      });
    } else {
      ver.categories.forEach((c) => {
        currentScoresMap[c.id] = Math.round(c.maxPoints * 0.8 * 2) / 2;
      });
    }

    setCorrectionCategoryScores(currentScoresMap);
    setCorrectionReason('');
    setIsCorrectionModalOpen(true);
  };

  const correctionVersion = useMemo(() => {
    if (!activeStudent) return EXAM_VERSIONS[0];
    return getVersionById(activeStudent.examVersionId || 'v2.0');
  }, [activeStudent]);

  const correctionTally = useMemo(() => {
    let rawSum = 0;
    correctionVersion.categories.forEach((cat) => {
      const val = parseFloat(correctionCategoryScores[cat.id]);
      if (!isNaN(val)) rawSum += val;
    });

    const pct = correctionVersion.totalItems > 0 ? Math.round((rawSum / correctionVersion.totalItems) * 1000) / 10 : 0;
    const stanine = calculateStanine(pct);

    return { rawSum, pct, stanine };
  }, [correctionVersion, correctionCategoryScores]);

  const handleSaveCorrection = (e) => {
    e.preventDefault();
    if (!activeStudent) return;

    for (const cat of correctionVersion.categories) {
      const val = parseFloat(correctionCategoryScores[cat.id]);
      if (isNaN(val) || val < 0 || val > cat.maxPoints) {
        showToast(`Please enter a valid score for ${cat.name} (0 to ${cat.maxPoints}).`, 'error');
        return;
      }
    }

    if (!correctionReason.trim()) {
      showToast('Please provide an administrative reason for this score correction.', 'error');
      return;
    }

    const updatedCategoryScores = correctionVersion.categories.map((cat) => ({
      categoryId: cat.id,
      name: cat.name,
      score: parseFloat(correctionCategoryScores[cat.id]),
      maxPoints: cat.maxPoints,
    }));

    const nowIso = new Date().toISOString();
    setStudents((prev) =>
      prev.map((s) =>
        s.id === activeStudent.id
          ? {
              ...s,
              categoryScores: updatedCategoryScores,
              totalRaw: correctionTally.rawSum,
              score: correctionTally.pct,
              stanine: correctionTally.stanine,
              status: 'Corrected',
              correctionReason: correctionReason.trim(),
              updatedAt: nowIso,
            }
          : s
      )
    );

    setIsCorrectionModalOpen(false);
    showToast(`Correction saved for ${activeStudent.lastName}: ${correctionTally.pct}% (Audited).`, 'success');
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
            <span className="gate-pill">Gate 5 Migration</span>
            <span className="version-pill" title="Immutable Version Snapshots active">
              <Layers size={11} />
              <span>Version Control Active</span>
            </span>
          </div>
          <h1 className="header-title">Student Entrance Exam Migration</h1>
          <p className="header-subtitle">
            Upload historical category scores via versioned CSV or manually encode/correct records for registered students with accounts.
          </p>
        </div>

        {/* Primary Header Action Buttons */}
        <div className="header-actions">
          <button
            type="button"
            className="btn-download-template"
            onClick={() => setIsDownloadTemplateModalOpen(true)}
            title="Download CSV containing students who currently do not have scores recorded"
          >
            <Download size={15} />
            <span>Download Template (Select Version)</span>
          </button>

          <button
            type="button"
            className="btn-migration-csv"
            onClick={() => {
              setCsvPreviewData(null);
              setCsvFileName('');
              setIsUploadCsvModalOpen(true);
            }}
            title="Upload CSV to migrate category scores in bulk"
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
            <span className="count-pill">{students.length}</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${statusFilter === 'without_score' ? 'active' : ''}`}
            onClick={() => setStatusFilter('without_score')}
          >
            <span>Without Score</span>
            <span className={`count-pill ${withoutScoreCount > 0 ? 'warning' : ''}`}>
              {withoutScoreCount}
            </span>
          </button>

          <button
            type="button"
            className={`tab-btn ${statusFilter === 'scored' ? 'active' : ''}`}
            onClick={() => setStatusFilter('scored')}
          >
            <span>Scored</span>
            <span className="count-pill success">{scoredCount}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Student ID or Name..."
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
          THE SINGLE UNIFIED TABLE (Exact Columns Requested):
          Student ID | Lastname | First | Middle | Score (action button) | Status
          ========================================================= */}
      <div className="single-table-card">
        <div className="table-responsive">
          <table className="unslop-student-table">
            <thead>
              <tr>
                <th className="th-id">Student ID</th>
                <th className="th-last">Lastname</th>
                <th className="th-first">First</th>
                <th className="th-mid">Middle</th>
                <th className="th-score">Score</th>
                <th className="th-status">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-row">
                    <div className="empty-state">
                      <FileSpreadsheet size={28} className="text-slate-400" />
                      <p>No student accounts found matching your filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const hasScore = s.score !== null;
                  const isBreakdownOpen = viewBreakdownStudentId === s.id;

                  return (
                    <tr key={s.id} className={hasScore ? 'row-scored' : 'row-unscored'}>
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

                      {/* Column 5: Score (with Category Breakdown and Action Buttons) */}
                      <td className="td-score">
                        {!hasScore ? (
                          /* Manual input per student (only without score) */
                          <button
                            type="button"
                            className="btn-input-score"
                            onClick={() => handleOpenInputScore(s)}
                            title={`Manually encode exam score for ${s.lastName}, ${s.firstName}`}
                          >
                            <Plus size={13} />
                            <span>Input Score</span>
                          </button>
                        ) : (
                          /* Score Display + Option for Category Breakdown + Correction */
                          <div className="score-cell-container">
                            <div className="score-with-action">
                              <div className="score-value-group">
                                <span className="score-number tabular-nums">{s.score}%</span>
                                {s.stanine && (
                                  <span className="stanine-pill">S{s.stanine}</span>
                                )}
                              </div>

                              {/* Version Tag */}
                              {s.examVersionId && (
                                <span className="exam-version-badge" title={s.examVersionName}>
                                  {s.examVersionId}
                                </span>
                              )}

                              {/* Toggle Category Breakdown Button */}
                              {s.categoryScores && s.categoryScores.length > 0 && (
                                <button
                                  type="button"
                                  className={`btn-breakdown-toggle ${isBreakdownOpen ? 'active' : ''}`}
                                  onClick={() => setViewBreakdownStudentId(isBreakdownOpen ? null : s.id)}
                                  title="View scores per category"
                                >
                                  <span>Categories</span>
                                  <ChevronDown size={11} className={isBreakdownOpen ? 'rotate-180' : ''} />
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn-correct-score"
                                onClick={() => handleOpenCorrection(s)}
                                title={`Correct category scores for ${s.lastName}`}
                              >
                                <Edit3 size={12} />
                                <span>Correct</span>
                              </button>
                            </div>

                            {/* Collapsible Per-Category Score Breakdown Pill Drawer */}
                            {isBreakdownOpen && s.categoryScores && (
                              <div className="category-breakdown-tray">
                                <div className="tray-header">
                                  <span className="tray-title">
                                    Version: <strong>{s.examVersionName || s.examVersionId}</strong>
                                  </span>
                                  <span className="tray-raw tabular-nums">
                                    Raw Total: <strong>{s.totalRaw}</strong> / {s.maxPoints} pts
                                  </span>
                                </div>
                                <div className="tray-chips-grid">
                                  {s.categoryScores.map((cat, cIdx) => (
                                    <div key={cIdx} className="category-score-chip">
                                      <span className="chip-cat-name">{cat.name}:</span>
                                      <span className="chip-cat-score tabular-nums">
                                        <strong>{cat.score}</strong>/{cat.maxPoints}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Column 6: Status */}
                      <td className="td-status">
                        {!hasScore ? (
                          <span className="status-badge without-score">
                            Without Score
                          </span>
                        ) : s.status === 'Corrected' ? (
                          <span className="status-badge corrected" title={s.correctionReason || 'Score adjusted'}>
                            <RotateCcw size={11} />
                            <span>Corrected</span>
                          </span>
                        ) : (
                          <span className="status-badge scored">
                            <Check size={11} />
                            <span>Scored</span>
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
          MODAL 0: DOWNLOAD TEMPLATE WITH EXAM VERSION OPTION
          ========================================================= */}
      {isDownloadTemplateModalOpen && (
        <div className="unslop-modal-overlay" role="dialog" aria-modal="true">
          <div className="unslop-modal-card template-modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Download size={18} className="text-navy-900" />
                <h3>Download Migration Template &bull; Select Exam Version</h3>
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
                Select which iteration of the exam was administered to the students you wish to migrate. The CSV template will automatically include the exact categories and max point columns for that version.
              </p>

              {/* Version Selector Cards */}
              <div className="version-selector-list">
                {EXAM_VERSIONS.map((ver) => {
                  const isSelected = templateVersionId === ver.id;
                  return (
                    <div
                      key={ver.id}
                      className={`version-card-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => setTemplateVersionId(ver.id)}
                    >
                      <div className="version-card-top">
                        <div className="version-id-badge">{ver.id}</div>
                        <div className="version-title-block">
                          <h4>{ver.name}</h4>
                          <span className="version-meta">{ver.academicYear} &bull; {ver.totalItems} Total Items</span>
                        </div>
                        {ver.isCurrent && <span className="current-flag">Current</span>}
                      </div>

                      {/* Categories Preview */}
                      <div className="version-cat-chips">
                        {ver.categories.map((c) => (
                          <span key={c.id} className="ver-cat-chip">
                            {c.name} ({c.maxPoints} pts)
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Notice */}
              <div className="template-info-box">
                <Info size={16} className="text-navy-800" />
                <span>
                  The downloaded template will be pre-filled with the <strong>{withoutScoreCount}</strong> students currently registered without scores.
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
                <span>Download {templateVersionId} CSV Template</span>
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
                <h3>Migration: Upload from CSV File (Per-Category)</h3>
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
                Select the target exam version and upload your completed CSV file. Category scores will be validated against the version's frozen rubric.
              </p>

              {/* Version Selector for Upload */}
              <div className="form-group">
                <label className="field-label">Target Exam Version for CSV Ingestion *</label>
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
                      {v.name} ({v.categories.length} Categories, {v.totalItems} Items)
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Dropzone */}
              <div className="upload-dropzone" onClick={handleOpenFilePicker}>
                <FileSpreadsheet size={36} className="text-navy-800" />
                <h4>{csvFileName || 'Click to select or drop CSV file'}</h4>
                <p>Accepts standard .csv exports with Student ID and Category Score columns</p>
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
                <span>Want to test retroactive category scoring immediately?</span>
                <button
                  type="button"
                  className="btn-link-sample"
                  onClick={handleLoadSampleCsv}
                >
                  Load Sample {uploadVersionId} Category Data ({withoutScoreCount} students)
                </button>
              </div>

              {/* CSV Preview Table */}
              {csvPreviewData && csvPreviewData.length > 0 && (
                <div className="csv-preview-section">
                  <div className="preview-header">
                    <h4>Preview Validated Category Records ({csvPreviewData.length})</h4>
                    <span className="ready-badge">Version {uploadVersionId} Validated</span>
                  </div>

                  <div className="preview-table-container">
                    <table className="preview-table">
                      <thead>
                        <tr>
                          <th>Student ID</th>
                          <th>Full Name</th>
                          <th>Category Breakdown</th>
                          <th>Raw Total</th>
                          <th>Calculated Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreviewData.map((row, idx) => (
                          <tr key={idx}>
                            <td className="font-mono text-xs">{row.studentId}</td>
                            <td>{row.lastName}, {row.firstName}</td>
                            <td>
                              <div className="preview-categories-cell">
                                {row.categoryScores.map((c, ci) => (
                                  <span key={ci} className="preview-cat-tag">
                                    {c.name}: {c.score}/{c.maxPoints}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="font-bold tabular-nums">{row.totalRaw}/{row.maxPoints}</td>
                            <td className="font-bold tabular-nums text-navy-900">
                              {row.scorePct}% (S{row.stanine})
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
                <span>Confirm Migration ({csvPreviewData ? csvPreviewData.length : 0} Students)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: MANUAL INPUT PER STUDENT (ONLY WITHOUT SCORE)
          ========================================================= */}
      {isInputScoreModalOpen && activeStudent && (
        <div className="unslop-modal-overlay" role="dialog" aria-modal="true">
          <div className="unslop-modal-card single-input-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Plus size={18} className="text-navy-900" />
                <h3>Manual Score Input &bull; {activeStudent.studentId}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsInputScoreModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveInputScore}>
              <div className="modal-body-scroll">
                {/* Student Identity Card */}
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

                {/* Exam Version Selector */}
                <div className="form-group">
                  <label className="field-label">Exam Version Administered *</label>
                  <select
                    value={selectedExamVersionId}
                    onChange={(e) => handleInputVersionChange(e.target.value)}
                    className="select-input"
                  >
                    {EXAM_VERSIONS.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} &bull; {v.totalItems} Items
                      </option>
                    ))}
                  </select>
                  <span className="field-hint">
                    Determines the category fields and maximum points according to the historical test administered.
                  </span>
                </div>

                {/* Dynamic Category Score Fields */}
                <div className="category-scores-section">
                  <h4 className="section-title">
                    Scores Per Category ({activeInputVersion.categories.length} Categories)
                  </h4>

                  <div className="category-inputs-grid">
                    {activeInputVersion.categories.map((cat) => (
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
                          value={categoryInputScores[cat.id] || ''}
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
                      <strong>{manualTally.rawSum}</strong> / {activeInputVersion.totalItems} pts
                    </span>
                  </div>
                  <div className="tally-item">
                    <span className="tally-label">Percentage:</span>
                    <span className="tally-val tabular-nums highlight">
                      {manualTally.pct}%
                    </span>
                  </div>
                  <div className="tally-item">
                    <span className="tally-label">Stanine Equivalent:</span>
                    <span className="tally-val tabular-nums">
                      Stanine <strong>{manualTally.stanine}</strong>
                    </span>
                  </div>
                </div>

                {/* Date & Evaluator */}
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="field-label">Examination Date *</label>
                    <input
                      type="date"
                      value={inputMetaForm.testDate}
                      onChange={(e) => setInputMetaForm({ ...inputMetaForm, testDate: e.target.value })}
                      className="text-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">RPM Evaluator</label>
                    <input
                      type="text"
                      value={inputMetaForm.evaluator}
                      onChange={(e) => setInputMetaForm({ ...inputMetaForm, evaluator: e.target.value })}
                      className="text-input"
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div className="form-group">
                  <label className="field-label">Archival Notes / Justification</label>
                  <textarea
                    rows={2}
                    value={inputMetaForm.remarks}
                    onChange={(e) => setInputMetaForm({ ...inputMetaForm, remarks: e.target.value })}
                    className="textarea-input"
                    placeholder="Physical document reference or Room 102 archive volume..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsInputScoreModalOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-primary-action">
                  <Check size={14} />
                  <span>Save Versioned Scores</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: MANUAL INPUT FOR CORRECTION (FOR STUDENTS WITH SCORE)
          ========================================================= */}
      {isCorrectionModalOpen && activeStudent && (
        <div className="unslop-modal-overlay" role="dialog" aria-modal="true">
          <div className="unslop-modal-card correction-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <RotateCcw size={18} className="text-amber-600" />
                <h3>Manual Score Correction &bull; {activeStudent.studentId}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCorrectionModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCorrection}>
              <div className="modal-body-scroll">
                {/* Existing Record Notice */}
                <div className="current-score-notice">
                  <span className="notice-label">Locked Version Record:</span>
                  <div className="notice-val">
                    <strong>{activeStudent.examVersionName || activeStudent.examVersionId || 'Version 2.0'}</strong>
                    <span>&bull; Recorded Score: <strong>{activeStudent.score}%</strong> (Stanine {activeStudent.stanine})</span>
                  </div>
                </div>

                {/* Category Fields to Adjust */}
                <div className="category-scores-section">
                  <h4 className="section-title">
                    Adjust Category Scores ({correctionVersion.categories.length} Categories)
                  </h4>

                  <div className="category-inputs-grid">
                    {correctionVersion.categories.map((cat) => (
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
                          value={correctionCategoryScores[cat.id] ?? ''}
                          onChange={(e) =>
                            setCorrectionCategoryScores({
                              ...correctionCategoryScores,
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

                {/* Recalculated Banner */}
                <div className="live-tally-banner">
                  <div className="tally-item">
                    <span className="tally-label">Corrected Raw Total:</span>
                    <span className="tally-val tabular-nums">
                      <strong>{correctionTally.rawSum}</strong> / {correctionVersion.totalItems} pts
                    </span>
                  </div>
                  <div className="tally-item">
                    <span className="tally-label">Corrected Percentage:</span>
                    <span className="tally-val tabular-nums highlight">
                      {correctionTally.pct}%
                    </span>
                  </div>
                  <div className="tally-item">
                    <span className="tally-label">Corrected Stanine:</span>
                    <span className="tally-val tabular-nums">
                      Stanine <strong>{correctionTally.stanine}</strong>
                    </span>
                  </div>
                </div>

                {/* Mandatory Audit Reason */}
                <div className="form-group">
                  <label className="field-label">Administrative Reason for Correction *</label>
                  <textarea
                    rows={3}
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    className="textarea-input"
                    placeholder="Explain category discrepancy (e.g. Typographical error during manual transcription from paper archive Form 137, re-scoring approved by Guidance Director)..."
                    required
                  />
                  <span className="field-hint">Required for institutional auditing and transcript verification.</span>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsCorrectionModalOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-primary-action warning">
                  <Check size={14} />
                  <span>Save Score Correction</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
