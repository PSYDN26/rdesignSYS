import React, { useState, useMemo } from 'react';
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
  ClipboardList
} from 'lucide-react';
import './GuidanceAptitudeResults.css';

export default function GuidanceAptitudeResults({ onBackToReferralSlip, onProceedToMigration }) {
  // Referrals dataset
  const [referrals, setReferrals] = useState(INITIAL_APTITUDE_REFERRALS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected referral for encoding or view
  const [activeReferral, setActiveReferral] = useState(null);
  const [isEncodingModalOpen, setIsEncodingModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Form State for RPM Encoding
  const [encodingForm, setEncodingForm] = useState({
    evaluationMode: 'structured', // 'structured' | 'narrative'
    rawScore: 80,
    totalItems: 100,
    percentileRank: 75.0,
    stanine: 6,
    iqEquivalent: '110 (High Average)',
    qualitativeInterpretation: 'Average',
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

  // Filtered Referrals
  const filteredReferrals = useMemo(() => {
    return referrals.filter((item) => {
      const matchStatus = statusFilter === 'all' || item.referralStatus === statusFilter;
      const matchSearch =
        item.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.referralCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.targetProgram.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [referrals, statusFilter, searchQuery]);

  // Open Schedule Modal
  const handleOpenScheduleModal = (referral) => {
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
    setEncodingForm({
      evaluationMode: referral.evaluationMode || 'structured',
      rawScore: referral.rawScore ?? 80,
      totalItems: referral.totalItems ?? 100,
      percentileRank: referral.percentileRank ?? 75.0,
      stanine: referral.stanine ?? 6,
      iqEquivalent: referral.iqEquivalent || '110 (High Average)',
      qualitativeInterpretation: referral.qualitativeInterpretation || 'Average',
      narrativeEvaluationHtml:
        referral.narrativeEvaluationHtml ||
        `<p>Candidate demonstrated strong cognitive composure and systematic problem-solving during the proctored battery. Spatial and inductive aptitude meet institutional standards for collegiate nautical instruction.</p>`,
      admissionRecommendation: referral.admissionRecommendation || 'recommended',
      conditionalEndorsementBy: referral.conditionalEndorsementBy || '',
      conditionalRemarks: referral.conditionalRemarks || '',
    });
    setIsEncodingModalOpen(true);
  };

  // Save RPM Results
  const handleSaveEncoding = (e) => {
    e.preventDefault();

    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id !== activeReferral.id) return r;
        return {
          ...r,
          evaluationMode: encodingForm.evaluationMode,
          rawScore: encodingForm.evaluationMode === 'structured' ? parseInt(encodingForm.rawScore, 10) : null,
          totalItems: encodingForm.totalItems,
          percentileRank: encodingForm.evaluationMode === 'structured' ? parseFloat(encodingForm.percentileRank) : null,
          stanine: encodingForm.evaluationMode === 'structured' ? parseInt(encodingForm.stanine, 10) : null,
          iqEquivalent: encodingForm.evaluationMode === 'structured' ? encodingForm.iqEquivalent : '',
          qualitativeInterpretation:
            encodingForm.evaluationMode === 'structured' ? encodingForm.qualitativeInterpretation : '',
          narrativeEvaluationHtml:
            encodingForm.evaluationMode === 'narrative' ? encodingForm.narrativeEvaluationHtml : '',
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

      {/* Header Banner */}
      {/* Header Banner - Unsloped, Crisp & Direct */}
      <header className="aptitude-page-header">
        <div className="header-meta">
          <h1 className="header-title">Written Aptitude Test Results</h1>
          <p className="header-subtitle">
            Review psychometric referrals, record standardized battery or narrative evaluations, and manage faculty visibility.
          </p>
        </div>

        {/* Current Officer Badge - Sleek & Compact */}
        <div className="officer-identity-pill">
          <ShieldCheck size={18} className="officer-pill-icon" />
          <div className="officer-pill-text">
            <span className="officer-name">{CURRENT_STAFF_USER.name}</span>
            <span className="officer-license tabular-nums">PRC Lic. {CURRENT_STAFF_USER.rpmLicenseNumber}</span>
          </div>
        </div>
      </header>

      {/* Unsloped Summary Counter Bar (Replaces 4 chunky cards) */}
      <div className="aptitude-summary-bar">
        <div className="summary-item">
          <span className="summary-count tabular-nums">{referrals.length}</span>
          <span className="summary-label">Total Referrals</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-count tabular-nums count-amber">
            {referrals.filter((r) => r.referralStatus === 'pending_visit').length}
          </span>
          <span className="summary-label">Pending Intake</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-count tabular-nums count-blue">
            {referrals.filter((r) => r.referralStatus === 'scheduled').length}
          </span>
          <span className="summary-label">Scheduled</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-count tabular-nums count-emerald">
            {referrals.filter((r) => r.referralStatus === 'released').length}
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
                placeholder="Search applicant or REF code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="filter-dropdown-sm">
              <Filter size={13} className="filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select-sm"
              >
                <option value="all">All Statuses ({referrals.length})</option>
                <option value="pending_visit">Pending Visit</option>
                <option value="scheduled">Scheduled</option>
                <option value="encoded">Encoded (Restricted)</option>
                <option value="released">Released to Faculty</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-body no-padding">
          <div className="aptitude-table-container">
            <table className="aptitude-intake-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Applicant</th>
                  <th style={{ width: '20%' }}>Degree Program</th>
                  <th style={{ width: '15%' }}>Schedule</th>
                  <th style={{ width: '16%' }}>Evaluation</th>
                  <th style={{ width: '12%' }}>Recommendation</th>
                  <th style={{ width: '10%' }}>Faculty</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-table-cell">
                      <FileText size={28} className="text-slate-300" />
                      <p>No referrals found matching the selected filter criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredReferrals.map((item) => {
                    const isEncoded = item.referralStatus === 'encoded' || item.referralStatus === 'released';
                    return (
                      <tr key={item.id} className={`table-row-${item.referralStatus}`}>
                        {/* Applicant */}
                        <td className="candidate-cell">
                          <span className="cand-name">{item.applicantName}</span>
                          <span className="cand-ref tabular-nums">{item.referralCode}</span>
                        </td>

                        {/* Program */}
                        <td className="program-cell">
                          <span className="prog-title">{item.targetProgram}</span>
                          <span className="prog-strand">{item.shsStrand}</span>
                        </td>

                        {/* Schedule */}
                        <td className="schedule-cell">
                          {item.scheduledTestDate ? (
                            <div className="sched-info">
                              <span className="sched-date tabular-nums">{item.scheduledTestDate}</span>
                              <span className="sched-session">
                                {item.scheduledSession ? item.scheduledSession.split('(')[0].trim() : 'Testing Hall'}
                              </span>
                            </div>
                          ) : (
                            <span className="status-chip chip-amber">Pending Visit</span>
                          )}
                        </td>

                        {/* Evaluation Mode & Metrics */}
                        <td className="metrics-cell">
                          {isEncoded ? (
                            item.evaluationMode === 'structured' ? (
                              <div className="metric-preview-structured">
                                <span className="metric-primary tabular-nums">
                                  <strong>{item.percentileRank}%</strong> PR
                                </span>
                                <span className="metric-secondary tabular-nums">
                                  Stanine {item.stanine} &bull; {item.qualitativeInterpretation}
                                </span>
                              </div>
                            ) : (
                              <div className="metric-preview-narrative">
                                <span className="narrative-tag">Narrative Letter</span>
                                <span className="narrative-sub">Clinical Report Encoded</span>
                              </div>
                            )
                          ) : (
                            <span className="empty-dash">&mdash;</span>
                          )}
                        </td>

                        {/* Admission Recommendation */}
                        <td className="recommendation-cell">
                          {item.admissionRecommendation ? (
                            <span className={`recommend-badge ${item.admissionRecommendation}`}>
                              {item.admissionRecommendation === 'recommended'
                                ? 'Recommended'
                                : item.admissionRecommendation === 'conditional'
                                ? 'Conditional'
                                : 'Not Recommended'}
                            </span>
                          ) : (
                            <span className="empty-dash">&mdash;</span>
                          )}
                        </td>

                        {/* Faculty Release Toggle */}
                        <td className="release-cell">
                          {isEncoded ? (
                            <button
                              type="button"
                              className={`btn-faculty-toggle ${item.isReleasedToFaculty ? 'released' : 'restricted'}`}
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
                          ) : (
                            <span className="empty-dash">&mdash;</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="actions-cell" style={{ textAlign: 'right' }}>
                          <div className="action-buttons-group">
                            {isEncoded ? (
                              <>
                                <button
                                  type="button"
                                  className="btn-action-primary edit"
                                  onClick={() => handleOpenEncodingModal(item)}
                                  title="Edit Psychological Evaluation"
                                >
                                  <Edit3 size={13} />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  className="btn-action-icon"
                                  onClick={() => handleOpenScheduleModal(item)}
                                  title="Reschedule Paper Test"
                                >
                                  <Calendar size={13} />
                                </button>

                                <button
                                  type="button"
                                  className="btn-action-icon"
                                  onClick={() => handleOpenViewModal(item)}
                                  title="View Official Evaluation Sheet"
                                >
                                  <Eye size={13} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="btn-action-primary encode"
                                  onClick={() => handleOpenEncodingModal(item)}
                                  title="Encode Psychological & Aptitude Results"
                                >
                                  <Edit3 size={13} />
                                  <span>Encode</span>
                                </button>

                                <button
                                  type="button"
                                  className="btn-action-ghost"
                                  onClick={() => handleOpenScheduleModal(item)}
                                  title="Schedule Proctored Paper Test"
                                >
                                  <Calendar size={13} />
                                  <span>Schedule</span>
                                </button>
                              </>
                            )}
                          </div>
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

                {/* DUAL-MODE TOGGLE (Requested by user) */}
                <div className="encoding-mode-selector-group">
                  <label className="field-label">Psychometric Evaluation Format Mode</label>
                  <div className="segmented-toggle">
                    <button
                      type="button"
                      className={`toggle-option ${encodingForm.evaluationMode === 'structured' ? 'active' : ''}`}
                      onClick={() => setEncodingForm({ ...encodingForm, evaluationMode: 'structured' })}
                    >
                      Mode A: Structured Psychometric Metrics (Raw, PR, Stanine, IQ)
                    </button>
                    <button
                      type="button"
                      className={`toggle-option ${encodingForm.evaluationMode === 'narrative' ? 'active' : ''}`}
                      onClick={() => setEncodingForm({ ...encodingForm, evaluationMode: 'narrative' })}
                    >
                      Mode B: Narrative Evaluation (Rich Text / Letter-Type Paragraph)
                    </button>
                  </div>
                </div>

                {/* MODE A: STRUCTURED PSYCHOMETRIC METRICS */}
                {encodingForm.evaluationMode === 'structured' && (
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
                        placeholder="e.g. 115 (Above Average)"
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
                        <option value="Superior">Superior (Stanine 9 / PR 96+)</option>
                        <option value="Above Average">Above Average (Stanine 7–8 / PR 77–95)</option>
                        <option value="Average">Average (Stanine 4–6 / PR 23–76)</option>
                        <option value="Below Average">Below Average (Stanine 2–3 / PR 4–22)</option>
                        <option value="Low">Low / Deficit (Stanine 1 / PR 1–3)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* MODE B: NARRATIVE RICH TEXT LETTER-TYPE EVALUATION */}
                {encodingForm.evaluationMode === 'narrative' && (
                  <div className="narrative-editor-wrapper">
                    <div className="editor-lead-note">
                      <Info size={15} />
                      <span>
                        Enter the psychological evaluation report in narrative letter format. This is suited for comprehensive clinical write-ups or paragraph-style psychometric evaluations.
                      </span>
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">Narrative Psychological Evaluation &amp; Clinical Impression *</label>
                      <textarea
                        rows={10}
                        value={encodingForm.narrativeEvaluationHtml}
                        onChange={(e) => setEncodingForm({ ...encodingForm, narrativeEvaluationHtml: e.target.value })}
                        placeholder="Write the full psychological assessment letter, clinical observations, cognitive aptitude analysis, and programmatic suitability..."
                        className="textarea-input narrative-textarea"
                        required
                      />
                      <span className="field-hint">
                        Formatted in standard clinical reporting structure. Will be printed on official Guidance letterhead.
                      </span>
                    </div>
                  </div>
                )}

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

                {/* Evaluation Content */}
                {activeReferral.evaluationMode === 'structured' ? (
                  <div className="cert-metrics-box">
                    <h5>Standardized Battery Test Results</h5>
                    <div className="cert-scores-row">
                      <div className="score-box">
                        <span className="s-lbl">Raw Score</span>
                        <span className="s-val tabular-nums">{activeReferral.rawScore} / {activeReferral.totalItems}</span>
                      </div>
                      <div className="score-box">
                        <span className="s-lbl">Percentile Rank</span>
                        <span className="s-val tabular-nums">{activeReferral.percentileRank}%</span>
                      </div>
                      <div className="score-box">
                        <span className="s-lbl">Stanine</span>
                        <span className="s-val tabular-nums">{activeReferral.stanine}</span>
                      </div>
                      <div className="score-box">
                        <span className="s-lbl">IQ Equivalent</span>
                        <span className="s-val">{activeReferral.iqEquivalent}</span>
                      </div>
                      <div className="score-box">
                        <span className="s-lbl">Interpretation</span>
                        <span className="s-val">{activeReferral.qualitativeInterpretation}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="cert-narrative-box">
                    <div
                      className="narrative-content-rendered"
                      dangerouslySetInnerHTML={{ __html: activeReferral.narrativeEvaluationHtml }}
                    />
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

function Info({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  );
}
