import React, { useState, useMemo } from 'react';
import {
  INITIAL_LEGACY_MIGRATIONS,
  CURRENT_STAFF_USER,
  EVP_STAFF_USER
} from '../data/examMockData';
import {
  FileText,
  Upload,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ShieldCheck,
  Edit3,
  X,
  Award,
  Printer,
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  Key,
  BadgeCheck,
  Search,
  Filter
} from 'lucide-react';
import './GuidanceLegacyMigration.css';

export default function GuidanceLegacyMigration({ onBackToGate4, onProceedToGate6 }) {
  // Perspective Role Tab: 'guidance' (Admissions/Guidance Desk) vs 'evp' (Executive VP Desk)
  const [activeRoleView, setActiveRoleView] = useState('guidance');

  // Batches dataset
  const [batches, setBatches] = useState(INITIAL_LEGACY_MIGRATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isEvpReviewModalOpen, setIsEvpReviewModalOpen] = useState(false);
  const [isViewCertificateModalOpen, setIsViewCertificateModalOpen] = useState(false);
  const [activeBatch, setActiveBatch] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Form State for New Batch
  const [newBatchForm, setNewBatchForm] = useState({
    batchReference: `MIG-BATCH-2026-00${batches.length + 1}`,
    sourceDescription: 'AY 2024–2025 Transferee & Returnee Paper Records',
    submissionNotes: 'Transcribed from physical archives in Room 102. Transferee admission clearances verified.',
  });

  // Form State for Single Manual Student Entry
  const [studentForm, setStudentForm] = useState({
    studentNumber: 'SCMBT-2024-00299',
    fullName: 'Villanueva, Paolo Marco',
    programCode: 'BS Marine Transportation (BSMT)',
    academicYear: 'AY 2024–2025',
    testType: 'Written Aptitude Battery (Physical Paper)',
    testDate: '2026-11-18',
    scorePct: 81.5,
    stanine: 7,
    recommendation: 'recommended',
    originalRpmName: 'L. Santos, RPM',
    remarks: 'Transferee clearance verified from registrar.',
  });

  // EVP Sign-off Form
  const [evpSignForm, setEvpSignForm] = useState({
    evpPin: '',
    evpRemarks: 'Verified against stamped Form 137 archives and Registrar cross-referencing. Transferee credit equivalence authorized.',
  });

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchSearch =
        b.batchReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.sourceDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.createdByName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [batches, statusFilter, searchQuery]);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalBatches = batches.length;
    const pendingEvp = batches.filter((b) => b.status === 'pending_evp').length;
    const approved = batches.filter((b) => b.status === 'evp_approved').length;
    const totalStudents = batches.reduce((sum, b) => sum + (b.records ? b.records.length : 0), 0);
    return { totalBatches, pendingEvp, approved, totalStudents };
  }, [batches]);

  // Handle Create New Batch
  const handleCreateBatch = (e) => {
    e.preventDefault();
    const newBatch = {
      id: `mig-batch-00${batches.length + 1}`,
      batchReference: newBatchForm.batchReference,
      sourceDescription: newBatchForm.sourceDescription,
      createdByStaffId: CURRENT_STAFF_USER.id,
      createdByName: CURRENT_STAFF_USER.name,
      createdAt: new Date().toISOString(),
      status: 'draft',
      submissionNotes: newBatchForm.submissionNotes,
      totalRecordsCount: 0,
      approvedByEvpId: null,
      approvedByEvpName: null,
      evpDecisionAt: null,
      evpRemarks: null,
      evpDigitalSignatureHash: null,
      records: [],
    };

    setBatches([newBatch, ...batches]);
    setActiveBatch(newBatch);
    setIsCreateBatchModalOpen(false);
    showToast(`Batch ${newBatch.batchReference} created. You can now add student records.`, 'success');
  };

  // Handle Add Single Student to Active Batch
  const handleAddStudentToBatch = (e) => {
    e.preventDefault();
    if (!activeBatch) return;

    const newRecord = {
      id: `rec-mig-${Date.now()}`,
      studentNumber: studentForm.studentNumber,
      fullName: studentForm.fullName,
      programCode: studentForm.programCode,
      academicYear: studentForm.academicYear,
      testType: studentForm.testType,
      testDate: studentForm.testDate,
      scorePct: parseFloat(studentForm.scorePct),
      stanine: parseInt(studentForm.stanine, 10),
      recommendation: studentForm.recommendation,
      originalRpmName: studentForm.originalRpmName,
      remarks: studentForm.remarks,
    };

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== activeBatch.id) return b;
        const updatedRecords = [...b.records, newRecord];
        return {
          ...b,
          records: updatedRecords,
          totalRecordsCount: updatedRecords.length,
        };
      })
    );

    // Update activeBatch in state
    setActiveBatch((prev) => ({
      ...prev,
      records: [...prev.records, newRecord],
      totalRecordsCount: prev.records.length + 1,
    }));

    setIsAddStudentModalOpen(false);
    showToast(`Added ${newRecord.fullName} to batch ${activeBatch.batchReference}.`, 'success');
  };

  // Mock CSV Sample Load
  const handleLoadSampleCsv = () => {
    if (!activeBatch) return;

    const mockCsvRecords = [
      {
        id: `rec-mig-csv-1`,
        studentNumber: 'SCMBT-2024-00401',
        fullName: 'Gonzales, Juan Carlo',
        programCode: 'BS Marine Transportation (BSMT)',
        academicYear: 'AY 2024–2025',
        testType: 'Written Aptitude Battery (Physical Paper)',
        testDate: '2024-06-20',
        scorePct: 83.5,
        stanine: 7,
        recommendation: 'recommended',
        originalRpmName: 'A. Guinto, RPM',
        remarks: 'CSV Bulk Import: Transferee transcript verified.',
      },
      {
        id: `rec-mig-csv-2`,
        studentNumber: 'SCMBT-2024-00402',
        fullName: 'Soriano, Maria Angela',
        programCode: 'BS Marine Engineering (BSMarE)',
        academicYear: 'AY 2024–2025',
        testType: 'SCMBT Freshman Entrance Exam (Legacy 80-Item)',
        testDate: '2024-06-22',
        scorePct: 78.0,
        stanine: 6,
        recommendation: 'recommended',
        originalRpmName: 'A. Guinto, RPM',
        remarks: 'CSV Bulk Import: Returnee reactivated.',
      },
      {
        id: `rec-mig-csv-3`,
        studentNumber: 'SCMBT-2024-00403',
        fullName: 'Valdez, Sean Kendrick',
        programCode: 'BS Customs Administration (BSCA)',
        academicYear: 'AY 2024–2025',
        testType: 'Entrance Exam & IQ Diagnostic',
        testDate: '2024-06-25',
        scorePct: 71.0,
        stanine: 5,
        recommendation: 'conditional',
        originalRpmName: 'L. Santos, RPM',
        remarks: 'CSV Bulk Import: Conditional endorsement by Dean.',
      },
    ];

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== activeBatch.id) return b;
        const updatedRecords = [...b.records, ...mockCsvRecords];
        return {
          ...b,
          records: updatedRecords,
          totalRecordsCount: updatedRecords.length,
        };
      })
    );

    setActiveBatch((prev) => ({
      ...prev,
      records: [...prev.records, ...mockCsvRecords],
      totalRecordsCount: prev.records.length + mockCsvRecords.length,
    }));

    showToast(`Imported 3 legacy records from CSV into ${activeBatch.batchReference}.`, 'success');
  };

  // Submit Batch for EVP Approval (Guidance Action)
  const handleSubmitToEvp = (batchId) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          status: 'pending_evp',
        };
      })
    );
    const target = batches.find((b) => b.id === batchId);
    showToast(`Batch ${target.batchReference} submitted to Executive VP for formal sign-off.`, 'info');
  };

  // Open EVP Review Modal
  const handleOpenEvpReview = (batch) => {
    setActiveBatch(batch);
    setEvpSignForm({
      evpPin: '',
      evpRemarks:
        batch.evpRemarks ||
        'Verified against historical paper archives and certified student records. Transferee credit equivalence authorized.',
    });
    setIsEvpReviewModalOpen(true);
  };

  // EVP Sign and Authorize
  const handleEvpAuthorize = (e) => {
    e.preventDefault();
    if (!activeBatch) return;

    const signatureHash = `SHA256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== activeBatch.id) return b;
        return {
          ...b,
          status: 'evp_approved',
          approvedByEvpId: EVP_STAFF_USER.id,
          approvedByEvpName: EVP_STAFF_USER.name,
          evpDecisionAt: new Date().toISOString(),
          evpRemarks: evpSignForm.evpRemarks,
          evpDigitalSignatureHash: signatureHash,
        };
      })
    );

    setIsEvpReviewModalOpen(false);
    showToast(`Batch ${activeBatch.batchReference} digitally signed & authorized by Executive VP.`, 'success');
  };

  // EVP Reject / Return for Correction
  const handleEvpReject = () => {
    if (!activeBatch) return;
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== activeBatch.id) return b;
        return {
          ...b,
          status: 'evp_rejected',
          evpRemarks: evpSignForm.evpRemarks || 'Returned for missing registrar transcript seals.',
          evpDecisionAt: new Date().toISOString(),
        };
      })
    );
    setIsEvpReviewModalOpen(false);
    showToast(`Batch ${activeBatch.batchReference} returned for revision.`, 'error');
  };

  // Open View Certificate Sheet Modal
  const handleOpenCertificate = (batch) => {
    setActiveBatch(batch);
    setIsViewCertificateModalOpen(true);
  };

  return (
    <div className="guidance-migration-canvas">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`guidance-toast ${toastMessage.type}`}>
          {toastMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header Banner - Unsloped & Crisp */}
      <header className="migration-header">
        <div className="header-meta">
          <h1 className="header-title">Legacy Student Exam Migration &amp; EVP Approval</h1>
          <p className="header-subtitle">
            Transcribe historical entrance scores for transferees and returnees. Manual and CSV bulk uploads require formal digital authorization by the Executive Vice President.
          </p>
        </div>

        {/* Dual-Perspective Desk Switcher */}
        <div className="perspective-toggle-card">
          <span className="perspective-label">Signed-in Perspective:</span>
          <div className="segmented-perspective">
            <button
              type="button"
              className={`btn-persp ${activeRoleView === 'guidance' ? 'active' : ''}`}
              onClick={() => setActiveRoleView('guidance')}
            >
              <ShieldCheck size={14} />
              <span>Guidance Desk (M. Santos, RPM)</span>
            </button>
            <button
              type="button"
              className={`btn-persp ${activeRoleView === 'evp' ? 'active evp' : ''}`}
              onClick={() => setActiveRoleView('evp')}
            >
              <BadgeCheck size={14} />
              <span>Executive VP Desk (Dr. Villanueva)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Summary Counter Ribbon */}
      <div className="migration-summary-bar">
        <div className="summary-item">
          <span className="summary-count tabular-nums">{stats.totalBatches}</span>
          <span className="summary-label">Total Batches</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-count tabular-nums count-amber">{stats.pendingEvp}</span>
          <span className="summary-label">Pending EVP Sign-off</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-count tabular-nums count-emerald">{stats.approved}</span>
          <span className="summary-label">EVP Approved</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-count tabular-nums count-blue">{stats.totalStudents}</span>
          <span className="summary-label">Migrated Students</span>
        </div>
      </div>

      {/* Main Migration Batches Card */}
      <div className="guidance-card migration-table-card">
        <div className="card-header-bar">
          <div className="bar-title">
            <FileSpreadsheet size={17} className="text-navy-900" />
            <h2>
              {activeRoleView === 'guidance'
                ? 'Guidance Transcription Batches'
                : 'Executive VP Approval Queue'}
            </h2>
            <span className="queue-count-badge tabular-nums">{filteredBatches.length}</span>
          </div>

          <div className="table-header-controls">
            {/* Search Box */}
            <div className="search-box-sm">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Search batch or description..."
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
                <option value="all">All Batches ({batches.length})</option>
                <option value="draft">Draft (Guidance)</option>
                <option value="pending_evp">Pending EVP Approval</option>
                <option value="evp_approved">EVP Approved</option>
                <option value="evp_rejected">Returned / Rejected</option>
              </select>
            </div>

            {/* Create Batch Button (Guidance Desk) */}
            {activeRoleView === 'guidance' && (
              <button
                type="button"
                className="btn-create-batch"
                onClick={() => setIsCreateBatchModalOpen(true)}
              >
                <Plus size={14} />
                <span>New Batch</span>
              </button>
            )}
          </div>
        </div>

        <div className="card-body no-padding">
          <div className="migration-table-container">
            <table className="migration-intake-table">
              <thead>
                <tr>
                  <th style={{ width: '18%' }}>Batch Reference</th>
                  <th style={{ width: '28%' }}>Source Description</th>
                  <th style={{ width: '12%' }}>Records</th>
                  <th style={{ width: '14%' }}>Status</th>
                  <th style={{ width: '14%' }}>Sign-off Stamp</th>
                  <th style={{ width: '14%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-table-cell">
                      <FileText size={28} className="text-slate-300" />
                      <p>No migration batches found matching the filter criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map((batch) => {
                    return (
                      <tr key={batch.id} className={`batch-row-${batch.status}`}>
                        {/* Batch Reference */}
                        <td className="batch-cell">
                          <span className="batch-code tabular-nums">{batch.batchReference}</span>
                          <span className="batch-date tabular-nums">
                            {new Date(batch.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="desc-cell">
                          <span className="batch-desc">{batch.sourceDescription}</span>
                          <span className="batch-creator">Encoder: {batch.createdByName}</span>
                        </td>

                        {/* Records Count */}
                        <td className="records-cell">
                          <span className="record-count-pill tabular-nums">
                            {batch.records ? batch.records.length : 0} Students
                          </span>
                        </td>

                        {/* Status */}
                        <td className="status-cell">
                          <span className={`status-badge-mig ${batch.status}`}>
                            {batch.status === 'draft'
                              ? 'Draft (Guidance)'
                              : batch.status === 'pending_evp'
                              ? 'Pending EVP Sign-off'
                              : batch.status === 'evp_approved'
                              ? 'EVP Approved'
                              : 'Returned'}
                          </span>
                        </td>

                        {/* Sign-off Stamp */}
                        <td className="sign-cell">
                          {batch.status === 'evp_approved' ? (
                            <div className="signed-stamp-info">
                              <span className="sign-evp-name font-semibold">{batch.approvedByEvpName}</span>
                              <span className="sign-hash-mini tabular-nums" title={batch.evpDigitalSignatureHash}>
                                {batch.evpDigitalSignatureHash?.substring(0, 16)}...
                              </span>
                            </div>
                          ) : batch.status === 'pending_evp' ? (
                            <span className="text-amber-600 text-xs font-semibold">Awaiting EVP Sign-off</span>
                          ) : (
                            <span className="empty-dash">&mdash;</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="actions-cell" style={{ textAlign: 'right' }}>
                          <div className="action-buttons-group">
                            {/* EVP Perspective Action */}
                            {activeRoleView === 'evp' ? (
                              batch.status === 'pending_evp' ? (
                                <button
                                  type="button"
                                  className="btn-action-primary evp-sign"
                                  onClick={() => handleOpenEvpReview(batch)}
                                >
                                  <BadgeCheck size={13} />
                                  <span>Review &amp; Authorize</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-action-ghost"
                                  onClick={() => handleOpenCertificate(batch)}
                                  title="View Official EVP Certificate"
                                >
                                  <Eye size={13} />
                                  <span>View Audit Slip</span>
                                </button>
                              )
                            ) : (
                              /* Guidance Perspective Actions */
                              <>
                                {batch.status === 'draft' && (
                                  <>
                                    <button
                                      type="button"
                                      className="btn-action-ghost"
                                      onClick={() => {
                                        setActiveBatch(batch);
                                        setIsAddStudentModalOpen(true);
                                      }}
                                      title="Add manual record"
                                    >
                                      <Plus size={13} />
                                      <span>Add Record</span>
                                    </button>

                                    <button
                                      type="button"
                                      className="btn-action-primary submit-evp"
                                      onClick={() => handleSubmitToEvp(batch.id)}
                                      disabled={!batch.records || batch.records.length === 0}
                                      title={
                                        !batch.records || batch.records.length === 0
                                          ? 'Add at least one record before submitting'
                                          : 'Submit batch to Executive VP for approval'
                                      }
                                    >
                                      <span>Submit to EVP</span>
                                    </button>
                                  </>
                                )}

                                {batch.status === 'pending_evp' && (
                                  <span className="text-slate-500 text-xs italic">Submitted to EVP</span>
                                )}

                                {batch.status === 'evp_approved' && (
                                  <button
                                    type="button"
                                    className="btn-action-ghost"
                                    onClick={() => handleOpenCertificate(batch)}
                                    title="View Official EVP Certified Audit Slip"
                                  >
                                    <Award size={13} />
                                    <span>Audit Slip</span>
                                  </button>
                                )}
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

      {/* Selected Batch Records Detail Table (When a batch is active or open) */}
      {activeBatch && (
        <div className="guidance-card batch-detail-card">
          <div className="card-header-bar detail-bar">
            <div>
              <h3>
                Batch Records: <strong>{activeBatch.batchReference}</strong>
              </h3>
              <p className="detail-sub">{activeBatch.sourceDescription}</p>
            </div>

            <div className="detail-controls">
              {activeBatch.status === 'draft' && activeRoleView === 'guidance' && (
                <>
                  <button
                    type="button"
                    className="btn-sub-action"
                    onClick={handleLoadSampleCsv}
                  >
                    <Upload size={13} />
                    <span>Upload / Import Sample CSV</span>
                  </button>

                  <button
                    type="button"
                    className="btn-sub-action primary"
                    onClick={() => setIsAddStudentModalOpen(true)}
                  >
                    <Plus size={13} />
                    <span>Encode Single Record</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="card-body no-padding">
            <div className="migration-table-container">
              <table className="migration-intake-table inner">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Full Name</th>
                    <th>Degree Program</th>
                    <th>Academic Year</th>
                    <th>Test Type &amp; Date</th>
                    <th>Score / Stanine</th>
                    <th>Recommendation</th>
                    <th>Archival Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {!activeBatch.records || activeBatch.records.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="empty-table-cell">
                        <p>No student records added to this batch yet. Click "Encode Single Record" or "Upload CSV".</p>
                      </td>
                    </tr>
                  ) : (
                    activeBatch.records.map((r) => (
                      <tr key={r.id}>
                        <td className="font-mono text-xs">{r.studentNumber}</td>
                        <td className="font-semibold text-navy-900">{r.fullName}</td>
                        <td>{r.programCode}</td>
                        <td className="text-slate-500 tabular-nums">{r.academicYear}</td>
                        <td>
                          <div className="test-meta-cell">
                            <span>{r.testType}</span>
                            <span className="text-slate-400 text-xs tabular-nums">{r.testDate}</span>
                          </div>
                        </td>
                        <td className="tabular-nums font-semibold">
                          {r.scorePct}% (Stanine {r.stanine})
                        </td>
                        <td>
                          <span className={`recommend-badge ${r.recommendation}`}>
                            {r.recommendation === 'recommended' ? 'Recommended' : 'Conditional'}
                          </span>
                        </td>
                        <td className="text-slate-500 text-xs">{r.remarks}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 1: CREATE NEW MIGRATION BATCH
          ========================================================= */}
      {isCreateBatchModalOpen && (
        <div className="guidance-modal-overlay" role="dialog" aria-modal="true">
          <div className="guidance-modal-card schedule-modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <FileSpreadsheet size={18} className="text-navy-900" />
                <h3>Create Legacy Exam Migration Batch</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCreateBatchModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBatch}>
              <div className="modal-body-scroll">
                <div className="form-field-group">
                  <label className="field-label">Batch Reference Code *</label>
                  <input
                    type="text"
                    value={newBatchForm.batchReference}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, batchReference: e.target.value })}
                    className="text-input font-mono"
                    required
                  />
                  <span className="field-hint">Unique institutional tracking identifier.</span>
                </div>

                <div className="form-field-group">
                  <label className="field-label">Source Document Description *</label>
                  <input
                    type="text"
                    value={newBatchForm.sourceDescription}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, sourceDescription: e.target.value })}
                    placeholder="e.g. AY 2024-2025 Transferees & Returnees Paper Archive"
                    className="text-input"
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="field-label">Auditing &amp; Submission Justification *</label>
                  <textarea
                    rows={3}
                    value={newBatchForm.submissionNotes}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, submissionNotes: e.target.value })}
                    className="textarea-input"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsCreateBatchModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-publish">
                  <span>Create Batch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: ADD SINGLE STUDENT RECORD (MANUAL INGESTION)
          ========================================================= */}
      {isAddStudentModalOpen && activeBatch && (
        <div className="guidance-modal-overlay" role="dialog" aria-modal="true">
          <div className="guidance-modal-card rpm-encoding-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Edit3 size={18} className="text-navy-900" />
                <h3>Encode Historical Student Exam &bull; {activeBatch.batchReference}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddStudentModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStudentToBatch}>
              <div className="modal-body-scroll">
                <div className="structured-fields-grid">
                  <div className="form-field-group">
                    <label className="field-label">Student ID Number *</label>
                    <input
                      type="text"
                      value={studentForm.studentNumber}
                      onChange={(e) => setStudentForm({ ...studentForm, studentNumber: e.target.value })}
                      className="text-input font-mono"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Full Name (Last, First Middle) *</label>
                    <input
                      type="text"
                      value={studentForm.fullName}
                      onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                      className="text-input"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Degree Program *</label>
                    <select
                      value={studentForm.programCode}
                      onChange={(e) => setStudentForm({ ...studentForm, programCode: e.target.value })}
                      className="text-input"
                      required
                    >
                      <option value="BS Marine Transportation (BSMT)">BS Marine Transportation (BSMT)</option>
                      <option value="BS Marine Engineering (BSMarE)">BS Marine Engineering (BSMarE)</option>
                      <option value="BS Customs Administration (BSCA)">BS Customs Administration (BSCA)</option>
                      <option value="BS Business Administration (BSBA)">BS Business Administration (BSBA)</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Academic Year Taken *</label>
                    <input
                      type="text"
                      value={studentForm.academicYear}
                      onChange={(e) => setStudentForm({ ...studentForm, academicYear: e.target.value })}
                      className="text-input"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Historical Test Type *</label>
                    <input
                      type="text"
                      value={studentForm.testType}
                      onChange={(e) => setStudentForm({ ...studentForm, testType: e.target.value })}
                      className="text-input"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Original Test Administration Date *</label>
                    <input
                      type="date"
                      value={studentForm.testDate}
                      onChange={(e) => setStudentForm({ ...studentForm, testDate: e.target.value })}
                      className="text-input"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Historical Score Percentage (%) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={studentForm.scorePct}
                      onChange={(e) => setStudentForm({ ...studentForm, scorePct: e.target.value })}
                      className="text-input tabular-nums"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Stanine (1 to 9)</label>
                    <select
                      value={studentForm.stanine}
                      onChange={(e) => setStudentForm({ ...studentForm, stanine: e.target.value })}
                      className="text-input"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
                        <option key={s} value={s}>Stanine {s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Admissions Recommendation *</label>
                    <select
                      value={studentForm.recommendation}
                      onChange={(e) => setStudentForm({ ...studentForm, recommendation: e.target.value })}
                      className="text-input"
                      required
                    >
                      <option value="recommended">Recommended (Full Admission)</option>
                      <option value="conditional">Conditional (Under Probation)</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Original Psychometrician / Examiner *</label>
                    <input
                      type="text"
                      value={studentForm.originalRpmName}
                      onChange={(e) => setStudentForm({ ...studentForm, originalRpmName: e.target.value })}
                      className="text-input"
                      required
                    />
                  </div>

                  <div className="form-field-group full-width">
                    <label className="field-label">Archival Notes &amp; Equivalency Justification *</label>
                    <textarea
                      rows={3}
                      value={studentForm.remarks}
                      onChange={(e) => setStudentForm({ ...studentForm, remarks: e.target.value })}
                      className="textarea-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsAddStudentModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-publish">
                  <span>Save Student Record to Batch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: EXECUTIVE VP DIGITAL APPROVAL & SIGN-OFF MODAL
          ========================================================= */}
      {isEvpReviewModalOpen && activeBatch && (
        <div className="guidance-modal-overlay" role="dialog" aria-modal="true">
          <div className="guidance-modal-card rpm-encoding-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <BadgeCheck size={20} className="text-navy-900" />
                <div>
                  <h3>Executive Vice President Digital Authorization</h3>
                  <span className="modal-sub">
                    Authorized Officer: {EVP_STAFF_USER.name} &bull; {EVP_STAFF_USER.title}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsEvpReviewModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEvpAuthorize}>
              <div className="modal-body-scroll">
                {/* Batch Overview Strip */}
                <div className="candidate-brief-strip">
                  <div>
                    <strong>{activeBatch.batchReference}</strong>
                    <p>{activeBatch.sourceDescription}</p>
                  </div>
                  <span className="ref-tag tabular-nums">{activeBatch.records?.length || 0} Records</span>
                </div>

                {/* Candidate Records Roster Preview */}
                <div className="evp-review-records-box">
                  <h4 className="box-title">Records To Be Certified for Enrollment</h4>
                  <table className="mini-roster-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Student Full Name</th>
                        <th>Target Program</th>
                        <th>Historical Score</th>
                        <th>Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBatch.records?.map((r) => (
                        <tr key={r.id}>
                          <td className="font-mono text-xs">{r.studentNumber}</td>
                          <td className="font-semibold">{r.fullName}</td>
                          <td>{r.programCode}</td>
                          <td className="tabular-nums">{r.scorePct}% (Stanine {r.stanine})</td>
                          <td>
                            <span className={`recommend-badge ${r.recommendation}`}>
                              {r.recommendation}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* EVP Authorization Credentials */}
                <div className="evp-auth-box">
                  <div className="form-field-group">
                    <label className="field-label">Executive Vice President Authorization Passcode *</label>
                    <div className="pin-input-group">
                      <Key size={15} className="pin-icon" />
                      <input
                        type="password"
                        placeholder="Enter EVP Authorization PIN (demo: EVP-2026)"
                        value={evpSignForm.evpPin}
                        onChange={(e) => setEvpSignForm({ ...evpSignForm, evpPin: e.target.value })}
                        className="text-input pin-field"
                        required
                      />
                    </div>
                    <span className="field-hint">
                      Requires Executive Vice President credentials. Signs audit ledger with SHA-256 seal.
                    </span>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Executive Approval Remarks &amp; Certification Statement *</label>
                    <textarea
                      rows={3}
                      value={evpSignForm.evpRemarks}
                      onChange={(e) => setEvpSignForm({ ...evpSignForm, evpRemarks: e.target.value })}
                      className="textarea-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel text-red-600"
                  onClick={handleEvpReject}
                >
                  Return for Correction
                </button>
                <button type="submit" className="btn-confirm-publish evp-seal-btn">
                  <BadgeCheck size={16} />
                  <span>Authorize &amp; Digitally Sign Batch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: VIEW OFFICIAL EVP CERTIFICATE & AUDIT SLIP
          ========================================================= */}
      {isViewCertificateModalOpen && activeBatch && (
        <div className="guidance-modal-overlay" role="dialog" aria-modal="true">
          <div className="guidance-modal-card view-cert-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Award size={18} className="text-navy-900" />
                <h3>Official EVP Migration Certification Slip &bull; {activeBatch.batchReference}</h3>
              </div>
              <div className="header-controls-group">
                <button
                  type="button"
                  className="btn-print-mini"
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                  <span>Print Audit Slip</span>
                </button>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsViewCertificateModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="modal-body-scroll cert-body">
              <div className="cert-sheet">
                <div className="cert-header">
                  <h4>SOUTHWESTERN COLLEGE OF MARITIME, BUSINESS AND TECHNOLOGY</h4>
                  <p>Office of the Executive Vice President &bull; Institutional Admissions Directorate</p>
                  <h3>CERTIFICATE OF HISTORICAL EXAM MIGRATION &amp; ADMISSION EQUIVALENCY</h3>
                  <span className="cert-code tabular-nums">Ref: {activeBatch.batchReference}</span>
                </div>

                <div className="cert-meta-grid">
                  <div>
                    <span>Batch Reference:</span>
                    <strong>{activeBatch.batchReference}</strong>
                  </div>
                  <div>
                    <span>Archival Source:</span>
                    <strong>{activeBatch.sourceDescription}</strong>
                  </div>
                  <div>
                    <span>Transcribed By:</span>
                    <strong>{activeBatch.createdByName}</strong>
                  </div>
                  <div>
                    <span>EVP Decision Date:</span>
                    <strong>{activeBatch.evpDecisionAt ? new Date(activeBatch.evpDecisionAt).toLocaleDateString() : 'Pending'}</strong>
                  </div>
                </div>

                {/* Migrated Students List */}
                <div className="cert-records-table-wrapper">
                  <h5>Certified Student Records</h5>
                  <table className="cert-records-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Program</th>
                        <th>AY</th>
                        <th>Score</th>
                        <th>Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBatch.records?.map((r) => (
                        <tr key={r.id}>
                          <td className="font-mono">{r.studentNumber}</td>
                          <td><strong>{r.fullName}</strong></td>
                          <td>{r.programCode}</td>
                          <td>{r.academicYear}</td>
                          <td>{r.scorePct}% (Stanine {r.stanine})</td>
                          <td>{r.recommendation?.toUpperCase()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* EVP Certification Seal Block */}
                <div className="cert-recommendation-block evp-block">
                  <span className="rec-lbl">Executive VP Authorization:</span>
                  <span className="rec-val approved">OFFICIALLY AUTHORIZED FOR ENROLLMENT</span>
                  <p className="rec-remarks">
                    <strong>Certification Remarks:</strong> {activeBatch.evpRemarks}
                  </p>
                  <p className="evp-hash-line font-mono tabular-nums">
                    Digital Signature Cryptographic Hash: {activeBatch.evpDigitalSignatureHash}
                  </p>
                </div>

                {/* Dual Signatures */}
                <div className="cert-sig-row">
                  <div className="sig-item">
                    <span className="sig-name">{activeBatch.createdByName}</span>
                    <span className="sig-title">Guidance Admissions Officer</span>
                    <span className="sig-lic">Transcriber</span>
                  </div>
                  <div className="sig-item seal">
                    <div className="mini-seal">OFFICIAL EVP SEAL</div>
                  </div>
                  <div className="sig-item">
                    <span className="sig-name">{activeBatch.approvedByEvpName || EVP_STAFF_USER.name}</span>
                    <span className="sig-title">Executive Vice President</span>
                    <span className="sig-lic">Academic &amp; Institutional Affairs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <span className="footer-release-status">
                Status: <strong>EVP Digitally Certified</strong>
              </span>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsViewCertificateModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviewer Navigation Bar */}
      <div className="reviewer-nav-bar no-print">
        <div className="nav-info">
          <span className="nav-step-badge">Gate 5 Deliverable</span>
          <span className="nav-step-text">
            Guidance &amp; EVP Legacy Student Migration is active. Next in the roadmap is Gate 6: Faculty Class Roster Sheet.
          </span>
        </div>

        <div className="reviewer-bar-actions" style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-jump-gate"
            onClick={onBackToGate4}
            title="Return to Gate 4 Aptitude Results"
          >
            <ArrowLeft size={16} />
            <span>Back to Gate 4 RPM</span>
          </button>

          <button
            type="button"
            className="btn-jump-gate"
            onClick={onProceedToGate6}
          >
            <span>Proceed to Gate 6 Faculty Roster</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
