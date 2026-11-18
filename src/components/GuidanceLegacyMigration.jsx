import React, { useState, useMemo, useRef } from 'react';
import {
  INITIAL_MIGRATION_STUDENTS,
  CURRENT_STAFF_USER
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
  RotateCcw
} from 'lucide-react';
import './GuidanceLegacyMigration.css';

export default function GuidanceLegacyMigration({ onBackToGate4, onProceedToGate6 }) {
  // Master Student Dataset (Single Table)
  const [students, setStudents] = useState(INITIAL_MIGRATION_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'without_score', 'scored'

  // Modals state
  const [isUploadCsvModalOpen, setIsUploadCsvModalOpen] = useState(false);
  const [isInputScoreModalOpen, setIsInputScoreModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  // File input ref for CSV upload
  const fileInputRef = useRef(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Form state for Manual Input (for student without score)
  const [inputScoreForm, setInputScoreForm] = useState({
    score: '',
    stanine: 6,
    testDate: '2026-11-18',
    examType: 'Physical Paper Aptitude Battery',
    evaluator: CURRENT_STAFF_USER.name,
    remarks: 'Encoded from verified physical archives in Room 102.',
  });

  // Form state for Manual Correction (for student who already has score)
  const [correctionForm, setCorrectionForm] = useState({
    newScore: '',
    newStanine: 6,
    reason: '',
  });

  // Parsed CSV state for preview in Upload CSV modal
  const [csvPreviewData, setCsvPreviewData] = useState(null);
  const [csvFileName, setCsvFileName] = useState('');

  // -------------------------------------------------------------
  // Filtered Students
  // -------------------------------------------------------------
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Status filter
      if (statusFilter === 'without_score' && s.score !== null) return false;
      if (statusFilter === 'scored' && s.score === null) return false;

      // Search filter (Student ID, Lastname, First, Middle)
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
  const withoutScoreCount = useMemo(() => students.filter((s) => s.score === null).length, [students]);
  const scoredCount = useMemo(() => students.filter((s) => s.score !== null).length, [students]);

  // -------------------------------------------------------------
  // Action 1: Download Template (Students with account but without score)
  // -------------------------------------------------------------
  const handleDownloadTemplate = () => {
    const unScoredList = students.filter((s) => s.score === null);

    if (unScoredList.length === 0) {
      showToast('All registered students currently have scores recorded.', 'info');
      return;
    }

    // Generate CSV Content
    const headers = ['Student ID', 'Lastname', 'First', 'Middle', 'Score', 'Stanine', 'Test Date', 'Remarks'];
    const rows = unScoredList.map((s) => [
      s.studentId,
      `"${s.lastName}"`,
      `"${s.firstName}"`,
      `"${s.middleName}"`,
      '', // empty score for user to fill
      '', // empty stanine
      '2024-07-15',
      `"Freshman/Transferee ${s.program}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SCMBT_Students_Without_Score_Template_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloaded CSV template with ${unScoredList.length} unscored student accounts.`, 'success');
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
      processCsvContent(text);
    };
    reader.readAsText(file);
  };

  // Helper to load sample CSV instantly for quick review
  const handleLoadSampleCsv = () => {
    setCsvFileName('SCMBT_Historical_Scores_AY2024.csv');
    const unScoredList = students.filter((s) => s.score === null);
    const sampleScores = [79.0, 83.5, 71.0, 88.0, 75.5];
    const sampleStanines = [6, 7, 5, 8, 6];

    const preview = unScoredList.map((s, idx) => ({
      studentId: s.studentId,
      lastName: s.lastName,
      firstName: s.firstName,
      middleName: s.middleName,
      score: sampleScores[idx % sampleScores.length],
      stanine: sampleStanines[idx % sampleStanines.length],
      testDate: '2024-07-15',
      remarks: 'Batch imported from Guidance archive Form 137',
    }));

    setCsvPreviewData(preview);
  };

  const processCsvContent = (csvText) => {
    const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      showToast('CSV file is empty or missing data rows.', 'error');
      return;
    }

    const preview = [];
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.replace(/^"|"$/g, '').trim());
      if (parts.length >= 5) {
        const [studentId, lastName, firstName, middleName, scoreStr, stanineStr, testDate, remarks] = parts;
        const numScore = parseFloat(scoreStr);
        if (studentId && !isNaN(numScore)) {
          preview.push({
            studentId,
            lastName: lastName || '',
            firstName: firstName || '',
            middleName: middleName || '',
            score: numScore,
            stanine: parseInt(stanineStr, 10) || 6,
            testDate: testDate || '2024-07-15',
            remarks: remarks || 'Imported via CSV Migration',
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
            score: match.score,
            stanine: match.stanine,
            testDate: match.testDate,
            examType: 'Physical Paper Aptitude Exam (CSV Migrated)',
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
    showToast(`Migration complete! Successfully updated ${updatedCount} student records from CSV.`, 'success');
  };

  // -------------------------------------------------------------
  // Action 3: Manual Input Per Student (Only Without Score)
  // -------------------------------------------------------------
  const handleOpenInputScore = (student) => {
    setActiveStudent(student);
    setInputScoreForm({
      score: '',
      stanine: 6,
      testDate: '2024-07-15',
      examType: 'Physical Paper Aptitude Battery',
      evaluator: CURRENT_STAFF_USER.name,
      remarks: 'Transcribed from verified archives in Records Room 102.',
    });
    setIsInputScoreModalOpen(true);
  };

  const handleSaveInputScore = (e) => {
    e.preventDefault();
    if (!activeStudent) return;

    const numericScore = parseFloat(inputScoreForm.score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      showToast('Please enter a valid percentage score between 0 and 100.', 'error');
      return;
    }

    const nowIso = new Date().toISOString();
    setStudents((prev) =>
      prev.map((s) =>
        s.id === activeStudent.id
          ? {
              ...s,
              score: numericScore,
              stanine: parseInt(inputScoreForm.stanine, 10),
              testDate: inputScoreForm.testDate,
              examType: inputScoreForm.examType,
              evaluator: inputScoreForm.evaluator,
              status: 'Scored',
              updatedAt: nowIso,
            }
          : s
      )
    );

    setIsInputScoreModalOpen(false);
    showToast(`Score recorded for ${activeStudent.lastName}, ${activeStudent.firstName}: ${numericScore}% (Stanine ${inputScoreForm.stanine}).`, 'success');
  };

  // -------------------------------------------------------------
  // Action 4: Manual Input For Correction (For Students With Score)
  // -------------------------------------------------------------
  const handleOpenCorrection = (student) => {
    setActiveStudent(student);
    setCorrectionForm({
      newScore: student.score !== null ? student.score : '',
      newStanine: student.stanine || 6,
      reason: '',
    });
    setIsCorrectionModalOpen(true);
  };

  const handleSaveCorrection = (e) => {
    e.preventDefault();
    if (!activeStudent) return;

    const numericScore = parseFloat(correctionForm.newScore);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      showToast('Please enter a valid percentage score between 0 and 100.', 'error');
      return;
    }

    if (!correctionForm.reason.trim()) {
      showToast('Please provide an administrative reason for this score correction.', 'error');
      return;
    }

    const nowIso = new Date().toISOString();
    setStudents((prev) =>
      prev.map((s) =>
        s.id === activeStudent.id
          ? {
              ...s,
              score: numericScore,
              stanine: parseInt(correctionForm.newStanine, 10),
              status: 'Corrected',
              correctionReason: correctionForm.reason.trim(),
              updatedAt: nowIso,
            }
          : s
      )
    );

    setIsCorrectionModalOpen(false);
    showToast(`Score correction saved for ${activeStudent.lastName}: ${numericScore}% with audit justification.`, 'success');
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
          </div>
          <h1 className="header-title">Student Entrance Exam Migration</h1>
          <p className="header-subtitle">
            Upload historical aptitude scores via CSV or manually encode/correct records for registered students with accounts.
          </p>
        </div>

        {/* Primary Header Action Buttons */}
        <div className="header-actions">
          <button
            type="button"
            className="btn-download-template"
            onClick={handleDownloadTemplate}
            title="Download CSV containing students who currently do not have scores recorded"
          >
            <Download size={15} />
            <span>Download Template (Students without score)</span>
          </button>

          <button
            type="button"
            className="btn-migration-csv"
            onClick={() => {
              setCsvPreviewData(null);
              setCsvFileName('');
              setIsUploadCsvModalOpen(true);
            }}
            title="Upload CSV to migrate scores in bulk"
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

                      {/* Column 5: Score (with Action Buttons) */}
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
                          /* Score Display + Option for manual input (for correction) */
                          <div className="score-with-action">
                            <div className="score-value-group">
                              <span className="score-number tabular-nums">{s.score}%</span>
                              {s.stanine && (
                                <span className="stanine-pill">S{s.stanine}</span>
                              )}
                            </div>

                            <button
                              type="button"
                              className="btn-correct-score"
                              onClick={() => handleOpenCorrection(s)}
                              title={`Correct or adjust score for ${s.lastName}`}
                            >
                              <Edit3 size={12} />
                              <span>Correct</span>
                            </button>
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
                Upload a completed CSV file matching the SCMBT template. Scores will be automatically linked to student accounts by <strong>Student ID</strong>.
              </p>

              {/* Upload Dropzone */}
              <div className="upload-dropzone" onClick={handleOpenFilePicker}>
                <FileSpreadsheet size={36} className="text-navy-800" />
                <h4>{csvFileName || 'Click to select or drop CSV file'}</h4>
                <p>Accepts standard .csv exports with Student ID and Score columns</p>
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
                  Load Sample Roster Data ({withoutScoreCount} students)
                </button>
              </div>

              {/* CSV Preview Table */}
              {csvPreviewData && csvPreviewData.length > 0 && (
                <div className="csv-preview-section">
                  <div className="preview-header">
                    <h4>Preview Validated Records ({csvPreviewData.length})</h4>
                    <span className="ready-badge">Ready for Migration</span>
                  </div>

                  <div className="preview-table-container">
                    <table className="preview-table">
                      <thead>
                        <tr>
                          <th>Student ID</th>
                          <th>Full Name</th>
                          <th>Score</th>
                          <th>Stanine</th>
                          <th>Test Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreviewData.map((row, idx) => (
                          <tr key={idx}>
                            <td className="font-mono text-xs">{row.studentId}</td>
                            <td>{row.lastName}, {row.firstName}</td>
                            <td className="font-bold tabular-nums">{row.score}%</td>
                            <td className="tabular-nums">Stanine {row.stanine}</td>
                            <td className="tabular-nums text-slate-500">{row.testDate}</td>
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

                <div className="form-grid-2col">
                  {/* Score */}
                  <div className="form-group">
                    <label className="field-label">Percentage Score (0–100%) *</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={inputScoreForm.score}
                      onChange={(e) => setInputScoreForm({ ...inputScoreForm, score: e.target.value })}
                      placeholder="e.g. 82.5"
                      className="text-input-lg tabular-nums"
                      required
                      autoFocus
                    />
                  </div>

                  {/* Stanine */}
                  <div className="form-group">
                    <label className="field-label">Stanine (1 to 9 Standard Nine) *</label>
                    <select
                      value={inputScoreForm.stanine}
                      onChange={(e) => setInputScoreForm({ ...inputScoreForm, stanine: e.target.value })}
                      className="select-input-lg tabular-nums"
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
                </div>

                <div className="form-grid-2col">
                  {/* Test Date */}
                  <div className="form-group">
                    <label className="field-label">Examination Date *</label>
                    <input
                      type="date"
                      value={inputScoreForm.testDate}
                      onChange={(e) => setInputScoreForm({ ...inputScoreForm, testDate: e.target.value })}
                      className="text-input"
                      required
                    />
                  </div>

                  {/* Test Type */}
                  <div className="form-group">
                    <label className="field-label">Test Battery *</label>
                    <select
                      value={inputScoreForm.examType}
                      onChange={(e) => setInputScoreForm({ ...inputScoreForm, examType: e.target.value })}
                      className="select-input"
                    >
                      <option value="Physical Paper Aptitude Battery">Physical Paper Aptitude Battery</option>
                      <option value="SCMBT Freshman Entrance Exam (Legacy 80-Item)">SCMBT Freshman Entrance Exam (Legacy 80-Item)</option>
                      <option value="Transferee Diagnostic Battery">Transferee Diagnostic Battery</option>
                    </select>
                  </div>
                </div>

                {/* Remarks */}
                <div className="form-group">
                  <label className="field-label">Archival Notes / Justification</label>
                  <textarea
                    rows={2}
                    value={inputScoreForm.remarks}
                    onChange={(e) => setInputScoreForm({ ...inputScoreForm, remarks: e.target.value })}
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
                  <span>Save Student Score</span>
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
                  <span className="notice-label">Currently Recorded Score:</span>
                  <div className="notice-val">
                    <strong className="tabular-nums">{activeStudent.score}%</strong>
                    {activeStudent.stanine && <span>(Stanine {activeStudent.stanine})</span>}
                    <span className="record-date">&bull; Recorded on {activeStudent.testDate || 'Prior Session'}</span>
                  </div>
                </div>

                <div className="form-grid-2col">
                  {/* New Score */}
                  <div className="form-group">
                    <label className="field-label">Corrected Score (0–100%) *</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={correctionForm.newScore}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, newScore: e.target.value })}
                      placeholder="e.g. 84.0"
                      className="text-input-lg tabular-nums"
                      required
                      autoFocus
                    />
                  </div>

                  {/* New Stanine */}
                  <div className="form-group">
                    <label className="field-label">Corrected Stanine (1 to 9) *</label>
                    <select
                      value={correctionForm.newStanine}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, newStanine: e.target.value })}
                      className="select-input-lg tabular-nums"
                    >
                      <option value="1">Stanine 1 (Very Low)</option>
                      <option value="2">Stanine 2 (Low)</option>
                      <option value="3">Stanine 3 (Below Average)</option>
                      <option value="4">Stanine 4 (Low Average)</option>
                      <option value="5">Stanine 5 (Average)</option>
                      <option value="6">Stanine 6 (High Average)</option>
                      <option value="7">Stanine 7 (Above Average)</option>
                      <option value="8">Stanine 8 (Superior)</option>
                      <option value="9">Stanine 9 (Very Superior)</option>
                    </select>
                  </div>
                </div>

                {/* Mandatory Audit Reason */}
                <div className="form-group">
                  <label className="field-label">Administrative Reason for Correction *</label>
                  <textarea
                    rows={3}
                    value={correctionForm.reason}
                    onChange={(e) => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
                    className="textarea-input"
                    placeholder="Explain discrepancy (e.g. Typographical error during manual transcription from paper archive Form 137, re-scoring approved by Guidance Director)..."
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
