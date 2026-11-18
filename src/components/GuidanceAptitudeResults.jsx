import React, { useState, useMemo, useRef } from 'react';
import { 
  INITIAL_APTITUDE_REFERRALS, 
  CURRENT_STAFF_USER 
} from '../data/examMockData';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Calendar,
  Eye,
  ShieldCheck,
  Edit3,
  X,
  Lock,
  Unlock,
  Check,
  Award,
  Printer,
  ArrowRight,
  ArrowLeft,
  ClipboardList,
  GraduationCap,
  Upload,
  Download,
  UploadCloud
} from 'lucide-react';
import './GuidanceAptitudeResults.css';

const INITIAL_REFERRALS_WITH_DOCS = INITIAL_APTITUDE_REFERRALS.map((r) => ({
  ...r,
  uploadedDocument:
    r.id === 'ref-003'
      ? 'aptitude_battery_eval_tan.pdf'
      : r.id === 'ref-004'
      ? 'rpm_clinical_report_dizon.pdf'
      : null,
}));

export default function GuidanceAptitudeResults({ onBackToReferralSlip, onProceedToMigration }) {
  // Referrals dataset
  const [referrals, setReferrals] = useState(INITIAL_REFERRALS_WITH_DOCS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Batch Upload Modal State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchFileName, setBatchFileName] = useState('');
  const [batchPreviewData, setBatchPreviewData] = useState(null);
  const batchFileInputRef = useRef(null);

  // Selected referral for encoding or view
  const [activeReferral, setActiveReferral] = useState(null);
  const [isEncodingModalOpen, setIsEncodingModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Form State for RPM Encoding: Mode A (Metrics + Paragraph) and Mode B (Paragraph Only)
  const [encodingForm, setEncodingForm] = useState({
    evaluationMode: 'mode_a', // 'mode_a' = Metrics + Paragraph | 'mode_b' = Paragraph Only
    rawScore: 80,
    totalItems: 100,
    percentileRank: 75,
    stanine: 6,
    iqEquivalent: '110 (High Average)',
    qualitativeInterpretation: 'Average (Stanine 4–6 / PR 23–76)',
    narrativeEvaluationHtml: '',
    admissionRecommendation: 'recommended',
    conditionalEndorsementBy: '',
    conditionalRemarks: '',
  });

  // Scheduling Form
  const [scheduleForm, setScheduleForm] = useState({
    scheduledTestDate: '',
    scheduledSession: 'Morning Session (09:00 AM - 11:30 AM)',
    testingRoom: 'Guidance Testing Hall Room 204',
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Distinct Degree Programs for Filter Dropdown
  const availablePrograms = useMemo(() => {
    const progs = new Set(referrals.map((r) => r.targetProgram).filter(Boolean));
    return Array.from(progs);
  }, [referrals]);

  // Filtered Referrals (Filtered by Status [Completed/Missing], Program, and Search Text)
  const filteredReferrals = useMemo(() => {
    return referrals.filter((item) => {
      const isCompleted = item.referralStatus === 'encoded' || item.referralStatus === 'released' || item.percentileRank !== null || item.evaluationMode === 'mode_b';
      
      let matchStatus = true;
      if (statusFilter === 'completed') matchStatus = isCompleted;
      else if (statusFilter === 'missing') matchStatus = !isCompleted;
      else if (statusFilter === 'released') matchStatus = item.isReleasedToFaculty;
      else if (statusFilter === 'restricted') matchStatus = !item.isReleasedToFaculty;

      const matchProgram = programFilter === 'all' || item.targetProgram === programFilter;
      const matchSearch =
        item.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.referralCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.targetProgram.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchProgram && matchSearch;
    });
  }, [referrals, statusFilter, programFilter, searchQuery]);

  // Download Aptitude CSV Template
  const handleDownloadTemplate = () => {
    const missingStudents = referrals.filter((r) => r.referralStatus !== 'encoded' && r.referralStatus !== 'released');
    const headers = ['Applicant Name', 'Referral Code', 'Application Number', 'Degree Program', 'Evaluation Mode', 'Percentile Rank', 'Stanine', 'Recommendation'];
    const rows = missingStudents.map((s) => [
      `"${s.applicantName}"`,
      `"${s.referralCode}"`,
      `"${s.applicationNumber}"`,
      `"${s.targetProgram}"`,
      'mode_a',
      '80.0',
      '7',
      'recommended',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SCMBT_Aptitude_Results_Template_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Aptitude batch template downloaded.', 'success');
  };

  // Handle Batch CSV File Selection
  const handleBatchFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBatchFileName(file.name);
      // Simulate reading and parsing records
      const missingStudents = referrals.filter((r) => r.referralStatus !== 'encoded' && r.referralStatus !== 'released');
      const simulatedParsed = missingStudents.map((s, idx) => ({
        id: s.id,
        applicantName: s.applicantName,
        referralCode: s.referralCode,
        percentileRank: idx === 0 ? 82.5 : 79.0,
        stanine: idx === 0 ? 7 : 6,
        recommendation: 'recommended',
        evaluationMode: 'mode_a',
      }));
      setBatchPreviewData(simulatedParsed);
      showToast(`Loaded ${file.name} for preview.`, 'info');
      e.target.value = '';
    }
  };

  // Confirm Batch Upload and Update Status to Completed
  const handleConfirmBatchUpload = () => {
    if (!batchPreviewData || batchPreviewData.length === 0) {
      alert('No preview records to import.');
      return;
    }
    const count = batchPreviewData.length;
    setReferrals((prev) =>
      prev.map((r) => {
        const match = batchPreviewData.find((p) => p.id === r.id);
        if (match) {
          return {
            ...r,
            referralStatus: 'encoded',
            evaluationMode: match.evaluationMode,
            percentileRank: match.percentileRank,
            stanine: match.stanine,
            admissionRecommendation: match.recommendation,
            encodedAt: new Date().toISOString(),
            encodedByRpmName: CURRENT_STAFF_USER.name,
          };
        }
        return r;
      })
    );
    setIsBatchModalOpen(false);
    setBatchPreviewData(null);
    setBatchFileName('');
    showToast(`Successfully imported ${count} aptitude records! Status updated to Completed.`, 'success');
  };

  // Open Schedule Modal
  const _handleOpenScheduleModal = (referral) => {
    setActiveReferral(referral);
    setScheduleForm({
      scheduledTestDate: referral.scheduledTestDate || new Date().toISOString().split('T')[0],
      scheduledSession: referral.scheduledSession || 'Morning Session (09:00 AM - 11:30 AM)',
      testingRoom: referral.testingRoom || 'Guidance Testing Hall Room 204',
    });
    setIsScheduleModalOpen(true);
  };

  // Save Schedule
  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!scheduleForm.scheduledTestDate) {
      alert('Please specify a scheduled testing date.');
      return;
    }

    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id !== activeReferral.id) return r;
        return {
          ...r,
          scheduledTestDate: scheduleForm.scheduledTestDate,
          scheduledSession: scheduleForm.scheduledSession,
          testingRoom: scheduleForm.testingRoom,
          referralStatus: r.referralStatus === 'pending_visit' ? 'scheduled' : r.referralStatus,
        };
      })
    );

    setIsScheduleModalOpen(false);
    showToast(`Paper testing schedule confirmed for ${activeReferral.applicantName}.`, 'success');
  };

  // Open Encoding Modal
  const handleOpenEncodingModal = (referral) => {
    setActiveReferral(referral);
    const mode = referral.evaluationMode === 'mode_b' || referral.evaluationMode === 'narrative' ? 'mode_b' : 'mode_a';
    setEncodingForm({
      evaluationMode: mode,
      rawScore: referral.rawScore ?? 80,
      totalItems: referral.totalItems ?? 100,
      percentileRank: referral.percentileRank ?? 75,
      stanine: referral.stanine ?? 6,
      iqEquivalent: referral.iqEquivalent || '110 (High Average)',
      qualitativeInterpretation: referral.qualitativeInterpretation || 'Average (Stanine 4–6 / PR 23–76)',
      narrativeEvaluationHtml:
        referral.narrativeEvaluationHtml ||
        `PSYCHOLOGICAL ASSESSMENT & APTITUDE REPORT\n\nCandidate completed the proctored battery under Republic Act 10029 standards. Observation indicates steady cognitive pacing, consistent visual-spatial orientation, and analytical readiness suitable for collegiate maritime instruction.\n\nAdmissions Recommendation: Recommended for enrollment without reservation.`,
      admissionRecommendation: referral.admissionRecommendation || 'recommended',
      conditionalEndorsementBy: referral.conditionalEndorsementBy || '',
      conditionalRemarks: referral.conditionalRemarks || '',
    });
    setIsEncodingModalOpen(true);
  };

  // Insert standard templates into narrative paragraph editor
  const handleInsertTemplate = (type) => {
    if (type === 'standard') {
      setEncodingForm((prev) => ({
        ...prev,
        narrativeEvaluationHtml: `PSYCHOLOGICAL ASSESSMENT REPORT & EVALUATION\n\nCandidate: ${activeReferral?.applicantName || 'Applicant'}\nTarget Program: ${activeReferral?.targetProgram || 'Collegiate Degree'}\nControl Ref: ${activeReferral?.referralCode || 'REF-2026'}\n\n1. CLINICAL OBSERVATIONS:\nCandidate demonstrated high cognitive composure and systematic problem-solving during proctored testing. Maintained sustained attention across all timed paper sections.\n\n2. PSYCHOMETRIC IMPRESSION:\nSpatial reasoning and deductive aptitude meet institutional benchmarks for collegiate nautical instruction. No psychological contraindications observed.\n\n3. ADMISSIONS RECOMMENDATION:\nCandidate is recommended for unconditional admission and program course selection.`,
      }));
    } else if (type === 'conditional') {
      setEncodingForm((prev) => ({
        ...prev,
        narrativeEvaluationHtml: `PSYCHOLOGICAL ASSESSMENT REPORT (CONDITIONAL ENDORSEMENT)\n\nCandidate: ${activeReferral?.applicantName || 'Applicant'}\nTarget Program: ${activeReferral?.targetProgram || 'Collegiate Degree'}\nControl Ref: ${activeReferral?.referralCode || 'REF-2026'}\n\n1. CLINICAL OBSERVATIONS:\nCandidate exhibited minor cognitive fatigue during numeric battery items but compensated with strong abstract reasoning.\n\n2. PSYCHOMETRIC IMPRESSION:\nFoundational aptitude is adequate; academic tutorial monitoring is advised during the 1st semester.\n\n3. ADMISSIONS RECOMMENDATION:\nConditional admission granted under Dean / Guidance monitoring endorsement.`,
        admissionRecommendation: 'conditional',
      }));
    }
  };

  // Formatting tools (Bold, Italic, Bullet)
  const handleFormatText = (tag) => {
    const textarea = document.getElementById('narrative-evaluation-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = encodingForm.narrativeEvaluationHtml;
    const selected = text.substring(start, end) || 'text';
    let formatted = '';
    if (tag === 'bold') formatted = `**${selected}**`;
    else if (tag === 'italic') formatted = `*${selected}*`;
    else if (tag === 'bullet') formatted = `\n• ${selected}`;

    const newText = text.substring(0, start) + formatted + text.substring(end);
    setEncodingForm((prev) => ({ ...prev, narrativeEvaluationHtml: newText }));
  };

  // Save RPM Results
  const handleSaveEncoding = (e) => {
    e.preventDefault();

    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id !== activeReferral.id) return r;
        const isModeA = encodingForm.evaluationMode === 'mode_a';
        return {
          ...r,
          evaluationMode: encodingForm.evaluationMode,
          rawScore: isModeA ? parseInt(encodingForm.rawScore, 10) : null,
          totalItems: isModeA ? encodingForm.totalItems : 100,
          percentileRank: isModeA ? parseFloat(encodingForm.percentileRank) : null,
          stanine: isModeA ? parseInt(encodingForm.stanine, 10) : null,
          iqEquivalent: isModeA ? encodingForm.iqEquivalent : '',
          qualitativeInterpretation: isModeA ? encodingForm.qualitativeInterpretation : '',
          narrativeEvaluationHtml: encodingForm.narrativeEvaluationHtml || '',
          admissionRecommendation: encodingForm.admissionRecommendation,
          conditionalEndorsementBy:
            encodingForm.admissionRecommendation === 'conditional'
              ? encodingForm.conditionalEndorsementBy
              : '',
          conditionalRemarks:
            encodingForm.admissionRecommendation === 'conditional'
              ? encodingForm.conditionalRemarks
              : '',
          referralStatus: r.referralStatus === 'released' ? 'released' : 'encoded',
          encodedByRpmName: CURRENT_STAFF_USER.name,
          rpmLicenseSnapshot: CURRENT_STAFF_USER.rpmLicenseNumber,
          encodedAt: new Date().toISOString(),
        };
      })
    );

    setIsEncodingModalOpen(false);
    showToast(`Psychological evaluation encoded by ${CURRENT_STAFF_USER.name}.`, 'success');
  };

  // Toggle Faculty Visibility Release
  const handleToggleFacultyRelease = (referralId) => {
    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id !== referralId) return r;
        const nextState = !r.isReleasedToFaculty;
        return {
          ...r,
          isReleasedToFaculty: nextState,
          referralStatus: nextState ? 'released' : (r.encodedAt ? 'encoded' : r.referralStatus),
        };
      })
    );

    const target = referrals.find((r) => r.id === referralId);
    const nextState = !target.isReleasedToFaculty;
    showToast(
      nextState
        ? `Evaluation released to Faculty class roster for ${target.applicantName}.`
        : `Faculty visibility retracted for ${target.applicantName}.`,
      nextState ? 'success' : 'info'
    );
  };

  // Open Full Evaluation Certificate Preview
  const handleOpenViewModal = (referral) => {
    setActiveReferral(referral);
    setIsViewModalOpen(true);
  };

  return (
    <div className="guidance-aptitude-canvas">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`guidance-toast ${toastMessage.type}`}>
          {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header Banner - Unsloped, Crisp & Direct */}
      <header className="aptitude-page-header">
        <div className="header-meta">
          <h1 className="header-title">Written Aptitude Test Results</h1>
          <p className="header-subtitle">
            Psychometric evaluation encoding and faculty visibility management
          </p>
        </div>

        <div className="header-actions-right">
          <button
            type="button"
            className="btn-batch-upload"
            onClick={() => setIsBatchModalOpen(true)}
            title="Batch upload written aptitude test results via CSV"
          >
            <Upload size={14} />
            <span>Batch Upload</span>
          </button>

          {/* Current Officer Badge - Sleek & Compact */}
          <div className="officer-identity-pill">
            <ShieldCheck size={18} className="officer-pill-icon" />
            <div className="officer-pill-text">
              <span className="officer-name">{CURRENT_STAFF_USER.name}</span>
              <span className="officer-license tabular-nums">PRC Lic. {CURRENT_STAFF_USER.rpmLicenseNumber}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Unsloped Summary Counter Bar (Replaces 4 chunky cards) */}
      <div className="aptitude-summary-bar">
        <div className="summary-item">
          <span className="summary-count tabular-nums">{referrals.length}</span>
          <span className="summary-label">Total Candidates</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-count tabular-nums count-emerald">
            {referrals.filter((r) => r.referralStatus === 'encoded' || r.referralStatus === 'released').length}
          </span>
          <span className="summary-label">Completed</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-count tabular-nums count-amber">
            {referrals.filter((r) => r.referralStatus !== 'encoded' && r.referralStatus !== 'released').length}
          </span>
          <span className="summary-label">Missing</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-count tabular-nums count-blue">
            {referrals.filter((r) => r.isReleasedToFaculty).length}
          </span>
          <span className="summary-label">Released to Faculty</span>
        </div>
      </div>

      {/* Referral Intake Table Card */}
      <div className="guidance-card aptitude-table-card">
        <div className="card-header-bar">
          <div className="bar-title">
            <ClipboardList size={17} className="text-navy-900" />
            <h2>Applicant Referrals Queue</h2>
            <span className="queue-count-badge tabular-nums">{filteredReferrals.length}</span>
          </div>

          <div className="table-header-controls">
            {/* Search Box */}
            <div className="search-box-sm">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Search applicant name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-sm"
              />
            </div>

            {/* Degree Program Filter (Moved from table to filters) */}
            <div className="filter-dropdown-sm">
              <GraduationCap size={13} className="filter-icon" />
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="filter-select-sm"
                aria-label="Filter by Degree Program"
              >
                <option value="all">All Degree Programs</option>
                {availablePrograms.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter: Completed / Missing / Released / Restricted */}
            <div className="filter-dropdown-sm">
              <Filter size={13} className="filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select-sm"
              >
                <option value="all">All Statuses ({referrals.length})</option>
                <option value="completed">Completed ({referrals.filter((r) => r.referralStatus === 'encoded' || r.referralStatus === 'released').length})</option>
                <option value="missing">Missing ({referrals.filter((r) => r.referralStatus !== 'encoded' && r.referralStatus !== 'released').length})</option>
                <option value="released">Released to Faculty</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-body no-padding">
          <div className="aptitude-table-container">
            <table className="aptitude-intake-table">
              <thead>
                <tr>
                  <th style={{ width: '36%' }}>Name</th>
                  <th style={{ width: '22%' }}>Status Of Result</th>
                  <th style={{ width: '22%' }}>Released / Restricted</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-table-cell">
                      <FileText size={28} className="text-slate-300" />
                      <p>No referrals found matching the selected filter criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredReferrals.map((item) => {
                    const isCompleted = item.referralStatus === 'encoded' || item.referralStatus === 'released' || item.percentileRank !== null || item.evaluationMode === 'mode_b';
                    return (
                      <tr key={item.id} className={`table-row-${item.referralStatus}`}>
                        {/* 1. Name - RETAIN ONLY NAME */}
                        <td className="candidate-cell">
                          <span className="cand-name">{item.applicantName}</span>
                        </td>

                        {/* 2. Status Of Result - Strictly Encoded / No Result */}
                        <td className="result-status-cell">
                          {isCompleted ? (
                            <span className="status-pill-completed">
                              <CheckCircle2 size={13} />
                              <span>Encoded</span>
                            </span>
                          ) : (
                            <span className="status-pill-missing">
                              <AlertCircle size={13} />
                              <span>No Result</span>
                            </span>
                          )}
                        </td>

                        {/* 3. Released / Restricted */}
                        <td className="release-cell">
                          <button
                            type="button"
                            className={`btn-release-pill ${item.isReleasedToFaculty ? 'released' : 'restricted'}`}
                            onClick={() => handleToggleFacultyRelease(item.id)}
                            title={
                              item.isReleasedToFaculty
                                ? 'Click to restrict from faculty class roster'
                                : 'Click to release to assigned faculty class roster'
                            }
                          >
                            {item.isReleasedToFaculty ? (
                              <>
                                <Unlock size={12} />
                                <span>Released</span>
                              </>
                            ) : (
                              <>
                                <Lock size={12} />
                                <span>Restricted</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* 4. Actions: Strictly 1 Action Button 1 Col */}
                        <td className="actions-cell" style={{ textAlign: 'right' }}>
                          {isCompleted ? (
                            <button
                              type="button"
                              className="btn-action-primary view"
                              onClick={() => handleOpenViewModal(item)}
                              title="View Official Evaluation Sheet"
                            >
                              <Eye size={13} />
                              <span>View Report</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-action-primary encode"
                              onClick={() => handleOpenEncodingModal(item)}
                              title="Encode Psychological & Aptitude Results"
                            >
                              <Edit3 size={13} />
                              <span>Encode Result</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================================
          MODAL 1: SCHEDULE PAPER TEST MODAL
          ========================================================= */}
      {isScheduleModalOpen && activeReferral && (
        <div className="guidance-modal-overlay" role="dialog" aria-modal="true">
          <div className="guidance-modal-card schedule-modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Calendar size={20} className="text-amber-500" />
                <h3>Schedule Proctored Paper Aptitude Test</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsScheduleModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule}>
              <div className="modal-body-scroll">
                <div className="candidate-brief-strip">
                  <div>
                    <strong>{activeReferral.applicantName}</strong>
                    <p>{activeReferral.targetProgram}</p>
                  </div>
                  <span className="ref-tag tabular-nums">{activeReferral.referralCode}</span>
                </div>

                <div className="form-field-group">
                  <label className="field-label">Scheduled Testing Date *</label>
                  <input
                    type="date"
                    value={scheduleForm.scheduledTestDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTestDate: e.target.value })}
                    className="text-input"
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="field-label">Testing Session Slot</label>
                  <select
                    value={scheduleForm.scheduledSession}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledSession: e.target.value })}
                    className="text-input"
                  >
                    <option value="Morning Session (09:00 AM - 11:30 AM)">
                      Morning Session (09:00 AM - 11:30 AM)
                    </option>
                    <option value="Afternoon Session (01:30 PM - 04:00 PM)">
                      Afternoon Session (01:30 PM - 04:00 PM)
                    </option>
                    <option value="Saturday Special Batch (08:30 AM - 11:00 AM)">
                      Saturday Special Batch (08:30 AM - 11:00 AM)
                    </option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label className="field-label">Assigned Venue / Testing Hall</label>
                  <input
                    type="text"
                    value={scheduleForm.testingRoom}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, testingRoom: e.target.value })}
                    className="text-input"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-publish">
                  Confirm Schedule Seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: DUAL-MODE RPM APTITUDE ENCODING MODAL
          ========================================================= */}
      {isEncodingModalOpen && activeReferral && (
        <div className="guidance-modal-overlay" role="dialog" aria-modal="true">
          <div className="guidance-modal-card rpm-encoding-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <ShieldCheck size={22} className="text-navy-900" />
                <div>
                  <h3>RPM Psychological &amp; Aptitude Results Encoding</h3>
                  <span className="modal-sub">
                    Authorized Officer: {CURRENT_STAFF_USER.name} &bull; PRC Lic. {CURRENT_STAFF_USER.rpmLicenseNumber}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsEncodingModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEncoding}>
              <div className="modal-body-scroll">
                {/* Candidate Overview Pill */}
                <div className="candidate-brief-strip">
                  <div>
                    <strong>{activeReferral.applicantName}</strong>
                    <p>{activeReferral.applicationNumber} &bull; {activeReferral.targetProgram}</p>
                  </div>
                  <span className="ref-tag tabular-nums">{activeReferral.referralCode}</span>
                </div>

                {/* 2 FORMAT MODES: MODE A (METRICS + PARAGRAPH) vs MODE B (PARAGRAPH ONLY) */}
                <div className="encoding-mode-selector-group">
                  <div className="mode-selector-header">
                    <label className="field-label">Psychometric Evaluation Format</label>
                    <span className="mode-selector-hint">Select Mode A (Metrics + Paragraph) or Mode B (Paragraph Only)</span>
                  </div>
                  <div className="segmented-toggle">
                    <button
                      type="button"
                      className={`toggle-option ${encodingForm.evaluationMode === 'mode_a' ? 'active' : ''}`}
                      onClick={() => setEncodingForm({ ...encodingForm, evaluationMode: 'mode_a' })}
                    >
                      📊 Mode A: Standardized Metrics + Paragraph (Rich Text)
                    </button>
                    <button
                      type="button"
                      className={`toggle-option ${encodingForm.evaluationMode === 'mode_b' ? 'active' : ''}`}
                      onClick={() => setEncodingForm({ ...encodingForm, evaluationMode: 'mode_b' })}
                    >
                      ✍️ Mode B: Paragraph Only (Rich Text Only)
                    </button>
                  </div>
                </div>

                {/* MODE A ONLY: STANDARDIZED PSYCHOMETRIC METRICS BATTERY */}
                {encodingForm.evaluationMode === 'mode_a' && (
                  <div className="structured-fields-grid">
                    <div className="form-field-group">
                      <label className="field-label">Raw Score</label>
                      <div className="inline-score-inputs">
                        <input
                          type="number"
                          min="0"
                          max={encodingForm.totalItems}
                          value={encodingForm.rawScore}
                          onChange={(e) => setEncodingForm({ ...encodingForm, rawScore: parseInt(e.target.value, 10) || 0 })}
                          className="text-input"
                          required
                        />
                        <span className="score-divider">/</span>
                        <input
                          type="number"
                          value={encodingForm.totalItems}
                          disabled
                          className="text-input denom"
                        />
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">Percentile Rank (0–100%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={encodingForm.percentileRank}
                        onChange={(e) => setEncodingForm({ ...encodingForm, percentileRank: parseFloat(e.target.value) || 0 })}
                        className="text-input"
                        required
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">Stanine (1 to 9 Standard Nine)</label>
                      <select
                        value={encodingForm.stanine}
                        onChange={(e) => setEncodingForm({ ...encodingForm, stanine: parseInt(e.target.value, 10) })}
                        className="text-input"
                        required
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
                          <option key={s} value={s}>Stanine {s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">IQ / Mental Ability Equivalent</label>
                      <input
                        type="text"
                        value={encodingForm.iqEquivalent}
                        onChange={(e) => setEncodingForm({ ...encodingForm, iqEquivalent: e.target.value })}
                        placeholder="e.g. 110 (High Average)"
                        className="text-input"
                        required
                      />
                    </div>

                    <div className="form-field-group full-width">
                      <label className="field-label">Qualitative Psychometric Interpretation</label>
                      <select
                        value={encodingForm.qualitativeInterpretation}
                        onChange={(e) => setEncodingForm({ ...encodingForm, qualitativeInterpretation: e.target.value })}
                        className="text-input"
                        required
                      >
                        <option value="Superior (Stanine 9 / PR 96+)">Superior (Stanine 9 / PR 96+)</option>
                        <option value="Above Average (Stanine 7–8 / PR 77–95)">Above Average (Stanine 7–8 / PR 77–95)</option>
                        <option value="Average (Stanine 4–6 / PR 23–76)">Average (Stanine 4–6 / PR 23–76)</option>
                        <option value="Below Average (Stanine 2–3 / PR 4–22)">Below Average (Stanine 2–3 / PR 4–22)</option>
                        <option value="Low / Deficit (Stanine 1 / PR 1–3)">Low / Deficit (Stanine 1 / PR 1–3)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* PARAGRAPH (RICH TEXT ONLY) - SHOWN IN BOTH MODE A (AS REQUESTED) AND MODE B (ALONE) */}
                <div className="narrative-editor-wrapper">
                  <div className="editor-top-bar">
                    <div className="editor-title-group">
                      <label className="field-label">
                        {encodingForm.evaluationMode === 'mode_a'
                          ? 'Clinical Evaluation & Qualitative Remarks (Paragraph Rich Text)'
                          : 'Narrative Psychological Evaluation & Letter-Type Report (Paragraph Rich Text Only) *'}
                      </label>
                      <span className="editor-subtext">
                        {encodingForm.evaluationMode === 'mode_a'
                          ? 'Narrative impression supplementing the standardized metrics battery'
                          : 'Official clinical evaluation letter (no numeric fields required)'}
                      </span>
                    </div>

                    {/* Formatting & Template Quick Tools */}
                    <div className="editor-toolbar-actions">
                      <div className="format-btn-group">
                        <button
                          type="button"
                          className="toolbar-btn"
                          onClick={() => handleFormatText('bold')}
                          title="Bold text (**text**)"
                        >
                          <strong>B</strong>
                        </button>
                        <button
                          type="button"
                          className="toolbar-btn"
                          onClick={() => handleFormatText('italic')}
                          title="Italic text (*text*)"
                        >
                          <em>I</em>
                        </button>
                        <button
                          type="button"
                          className="toolbar-btn"
                          onClick={() => handleFormatText('bullet')}
                          title="Bullet point (• item)"
                        >
                          &bull; List
                        </button>
                      </div>

                      <div className="template-btn-group">
                        <button
                          type="button"
                          className="btn-template-insert"
                          onClick={() => handleInsertTemplate('standard')}
                          title="Load Standard Official Assessment Template"
                        >
                          <span>Insert Assessment Template</span>
                        </button>
                        <button
                          type="button"
                          className="btn-template-insert"
                          onClick={() => handleInsertTemplate('conditional')}
                          title="Load Conditional Endorsement Letter Template"
                        >
                          <span>Insert Conditional Template</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="form-field-group no-margin">
                    <textarea
                      id="narrative-evaluation-textarea"
                      rows={encodingForm.evaluationMode === 'mode_a' ? 8 : 12}
                      value={encodingForm.narrativeEvaluationHtml}
                      onChange={(e) => setEncodingForm({ ...encodingForm, narrativeEvaluationHtml: e.target.value })}
                      placeholder={
                        encodingForm.evaluationMode === 'mode_a'
                          ? 'Enter clinical qualitative remarks and cognitive observations supplementing the scores above...'
                          : 'Write the full narrative psychological assessment letter, clinical observations, cognitive aptitude analysis, and programmatic suitability...'
                      }
                      className="textarea-input narrative-textarea"
                      required={encodingForm.evaluationMode === 'mode_b'}
                    />
                    <div className="editor-footer-stats">
                      <span className="editor-count tabular-nums">
                        {encodingForm.narrativeEvaluationHtml.length} characters &bull;{' '}
                        {encodingForm.narrativeEvaluationHtml.trim() ? encodingForm.narrativeEvaluationHtml.trim().split(/\s+/).length : 0} words
                      </span>
                      <span className="editor-cert-note">Official format for Guidance letterhead release</span>
                    </div>
                  </div>
                </div>

                {/* ADMISSION RECOMMENDATION & CONDITIONAL ENDORSEMENT */}
                <div className="admissions-recommendation-section">
                  <h4 className="section-title">Admissions Outcome Recommendation</h4>

                  <div className="recommendation-radio-grid">
                    <label className={`rec-radio-card ${encodingForm.admissionRecommendation === 'recommended' ? 'selected green' : ''}`}>
                      <input
                        type="radio"
                        name="admissionRecommendation"
                        value="recommended"
                        checked={encodingForm.admissionRecommendation === 'recommended'}
                        onChange={(e) => setEncodingForm({ ...encodingForm, admissionRecommendation: e.target.value })}
                      />
                      <div className="radio-text">
                        <strong>Recommended for Admission</strong>
                        <span>Permits full registration &amp; unlocks program course selection</span>
                      </div>
                    </label>

                    <label className={`rec-radio-card ${encodingForm.admissionRecommendation === 'conditional' ? 'selected amber' : ''}`}>
                      <input
                        type="radio"
                        name="admissionRecommendation"
                        value="conditional"
                        checked={encodingForm.admissionRecommendation === 'conditional'}
                        onChange={(e) => setEncodingForm({ ...encodingForm, admissionRecommendation: e.target.value })}
                      />
                      <div className="radio-text">
                        <strong>Conditional / Under Probation</strong>
                        <span>Requires Dean or Guidance Counselor endorsement notes before unlocking</span>
                      </div>
                    </label>

                    <label className={`rec-radio-card ${encodingForm.admissionRecommendation === 'not_recommended' ? 'selected red' : ''}`}>
                      <input
                        type="radio"
                        name="admissionRecommendation"
                        value="not_recommended"
                        checked={encodingForm.admissionRecommendation === 'not_recommended'}
                        onChange={(e) => setEncodingForm({ ...encodingForm, admissionRecommendation: e.target.value })}
                      />
                      <div className="radio-text">
                        <strong>Not Recommended</strong>
                        <span>Candidate does not meet psychological/aptitude threshold for program</span>
                      </div>
                    </label>
                  </div>

                  {/* Conditional Endorsement fields if Conditional selected */}
                  {encodingForm.admissionRecommendation === 'conditional' && (
                    <div className="conditional-details-box">
                      <div className="form-field-group">
                        <label className="field-label">Endorsed By (Dean / Guidance Center Head) *</label>
                        <input
                          type="text"
                          value={encodingForm.conditionalEndorsementBy}
                          onChange={(e) => setEncodingForm({ ...encodingForm, conditionalEndorsementBy: e.target.value })}
                          placeholder="e.g. Capt. E. Morales (Dean, College of Maritime Education)"
                          className="text-input"
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Probationary Terms &amp; Academic Monitoring Conditions *</label>
                        <textarea
                          rows={3}
                          value={encodingForm.conditionalRemarks}
                          onChange={(e) => setEncodingForm({ ...encodingForm, conditionalRemarks: e.target.value })}
                          placeholder="Specify academic monitoring terms, required tutorials, or probationary conditions for 1st semester..."
                          className="textarea-input"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsEncodingModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-publish">
                  <Check size={16} />
                  <span>Save &amp; Sign Official RPM Evaluation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: VIEW FULL PSYCHOLOGICAL EVALUATION SHEET
          ========================================================= */}
      {isViewModalOpen && activeReferral && (
        <div className="guidance-modal-overlay" role="dialog" aria-modal="true">
          <div className="guidance-modal-card view-cert-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Award size={20} className="text-navy-900" />
                <h3>Official Psychological Assessment Record &bull; {activeReferral.applicantName}</h3>
              </div>
              <div className="header-controls-group">
                <button
                  type="button"
                  className="btn-print-mini"
                  onClick={() => window.print()}
                >
                  <Printer size={15} />
                  <span>Print Record</span>
                </button>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="modal-body-scroll cert-body">
              <div className="cert-sheet">
                <div className="cert-header">
                  <h4>SOUTHWESTERN COLLEGE OF MARITIME, BUSINESS AND TECHNOLOGY</h4>
                  <p>Admissions Office &bull; Guidance Testing Directorate</p>
                  <h3>PSYCHOLOGICAL &amp; WRITTEN APTITUDE EVALUATION SHEET</h3>
                  <span className="cert-code tabular-nums">Ref: {activeReferral.referralCode}</span>
                </div>

                <div className="cert-meta-grid">
                  <div>
                    <span>Candidate Name:</span>
                    <strong>{activeReferral.applicantName}</strong>
                  </div>
                  <div>
                    <span>Application Number:</span>
                    <strong>{activeReferral.applicationNumber}</strong>
                  </div>
                  <div>
                    <span>Target Program:</span>
                    <strong>{activeReferral.targetProgram}</strong>
                  </div>
                  <div>
                    <span>Test Administration Date:</span>
                    <strong>{activeReferral.scheduledTestDate || 'Recorded'}</strong>
                  </div>
                </div>

                {/* Evaluation Content: Mode A shows Metrics + Paragraph; Mode B shows Paragraph Only */}
                {(activeReferral.evaluationMode === 'mode_a' || activeReferral.evaluationMode === 'structured' || activeReferral.evaluationMode === 'comprehensive') && (
                  <div className="cert-metrics-box">
                    <h5>Standardized Battery Test Results</h5>
                    <div className="cert-scores-row">
                      <div className="score-box">
                        <span className="s-lbl">Raw Score</span>
                        <span className="s-val tabular-nums">{activeReferral.rawScore ?? 80} / {activeReferral.totalItems ?? 100}</span>
                      </div>
                      <div className="score-box">
                        <span className="s-lbl">Percentile Rank</span>
                        <span className="s-val tabular-nums">{activeReferral.percentileRank ?? 75}%</span>
                      </div>
                      <div className="score-box">
                        <span className="s-lbl">Stanine</span>
                        <span className="s-val tabular-nums">{activeReferral.stanine ?? 6}</span>
                      </div>
                      <div className="score-box">
                        <span className="s-lbl">IQ Equivalent</span>
                        <span className="s-val">{activeReferral.iqEquivalent || '110 (High Average)'}</span>
                      </div>
                      <div className="score-box">
                        <span className="s-lbl">Interpretation</span>
                        <span className="s-val">{activeReferral.qualitativeInterpretation || 'Average (Stanine 4–6 / PR 23–76)'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeReferral.narrativeEvaluationHtml && (
                  <div className="cert-narrative-box">
                    <h5>
                      {activeReferral.evaluationMode === 'mode_b'
                        ? 'Official Psychological Assessment Letter (Mode B)'
                        : 'Clinical Evaluation & Qualitative Remarks'}
                    </h5>
                    <div
                      className="narrative-content-rendered"
                      style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}
                    >
                      {activeReferral.narrativeEvaluationHtml}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div className="cert-recommendation-block">
                  <span className="rec-lbl">Admissions Recommendation:</span>
                  <span className={`rec-val ${activeReferral.admissionRecommendation}`}>
                    {activeReferral.admissionRecommendation?.toUpperCase()}
                  </span>
                  {activeReferral.conditionalRemarks && (
                    <p className="rec-remarks">
                      <strong>Endorsement Terms:</strong> {activeReferral.conditionalRemarks} ({activeReferral.conditionalEndorsementBy})
                    </p>
                  )}
                </div>

                {/* Signatures */}
                <div className="cert-sig-row">
                  <div className="sig-item">
                    <span className="sig-name">{activeReferral.encodedByRpmName || CURRENT_STAFF_USER.name}</span>
                    <span className="sig-title">Registered Psychometrician</span>
                    <span className="sig-lic tabular-nums">{activeReferral.rpmLicenseSnapshot || CURRENT_STAFF_USER.rpmLicenseNumber}</span>
                  </div>
                  <div className="sig-item seal">
                    <div className="mini-seal">OFFICIAL RPM SEAL</div>
                  </div>
                  <div className="sig-item">
                    <span className="sig-name">Guidance Center Head</span>
                    <span className="sig-title">SCMBT Testing Directorate</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <span className="footer-release-status">
                Faculty Visibility:{' '}
                <strong>
                  {activeReferral.isReleasedToFaculty ? 'Released to Class Roster' : 'Restricted to Guidance'}
                </strong>
              </span>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          BATCH UPLOAD MODAL (Bulk CSV Import for Missing Records)
          ========================================================= */}
      {isBatchModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog batch-modal-dialog">
            <div className="modal-header">
              <div className="modal-title-lockup">
                <Upload size={18} className="text-navy-900" />
                <h3 className="modal-title">Batch Upload Aptitude Test Records</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setIsBatchModalOpen(false);
                  setBatchPreviewData(null);
                  setBatchFileName('');
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll">
              <div className="batch-step-card">
                <span className="step-tag">Step 1: Download Official Template</span>
                <p className="step-desc">
                  Download a pre-formatted CSV containing candidates who currently lack encoded aptitude records.
                </p>
                <button
                  type="button"
                  className="btn-download-tpl"
                  onClick={handleDownloadTemplate}
                >
                  <Download size={14} />
                  <span>Download Aptitude CSV Template</span>
                </button>
              </div>

              <div className="batch-step-card">
                <span className="step-tag">Step 2: Upload Completed CSV</span>
                <p className="step-desc">
                  Upload the completed file to bulk encode results and update candidate status to <strong>Completed</strong>.
                </p>
                <input
                  type="file"
                  ref={batchFileInputRef}
                  onChange={handleBatchFileChange}
                  accept=".csv,text/csv"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn-browse-file"
                  onClick={() => batchFileInputRef.current?.click()}
                >
                  <UploadCloud size={16} />
                  <span>{batchFileName ? `Selected: ${batchFileName}` : 'Select Completed CSV File'}</span>
                </button>
              </div>

              {batchPreviewData && (
                <div className="batch-preview-box">
                  <span className="preview-heading">Preview Parsed Records ({batchPreviewData.length})</span>
                  <table className="batch-preview-table">
                    <thead>
                      <tr>
                        <th>Candidate Name</th>
                        <th>Ref Code</th>
                        <th>Percentile</th>
                        <th>Stanine</th>
                        <th>Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchPreviewData.map((row) => (
                        <tr key={row.id}>
                          <td className="font-bold">{row.applicantName}</td>
                          <td className="font-mono text-slate-500">{row.referralCode}</td>
                          <td className="tabular-nums font-bold text-navy-900">{row.percentileRank}%</td>
                          <td className="tabular-nums">Stanine {row.stanine}</td>
                          <td><span className="badge-preview-rec">{row.recommendation}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setIsBatchModalOpen(false);
                  setBatchPreviewData(null);
                  setBatchFileName('');
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn-save-confirm ${!batchPreviewData ? 'disabled' : ''}`}
                onClick={handleConfirmBatchUpload}
                disabled={!batchPreviewData}
              >
                Import Batch Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviewer Bottom Action Bar */}
      <div className="reviewer-nav-bar no-print">
        <div className="nav-info">
          <span className="nav-step-badge">Gate 4 Deliverable</span>
          <span className="nav-step-text">
            Guidance RPM Aptitude Results Encoding is active. Next in the roadmap is Gate 5: Guidance &amp; EVP Legacy Student Exam Migration.
          </span>
        </div>

        <div className="reviewer-bar-actions" style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-jump-gate"
            onClick={onBackToReferralSlip}
            title="Return to Gate 3 Referral Slip"
          >
            <ArrowLeft size={16} />
            <span>Back to Gate 3 Slip</span>
          </button>

          <button
            type="button"
            className="btn-jump-gate"
            onClick={onProceedToMigration}
          >
            <span>Preview Guidance &amp; EVP Migration (Gate 5)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
