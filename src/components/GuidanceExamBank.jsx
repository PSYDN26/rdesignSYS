import React, { useState, useMemo } from 'react';
import { 
  INITIAL_EXAM_CONFIG, 
  INITIAL_QUESTION_BANK, 
  INITIAL_PUBLISHED_REVISION, 
  CURRENT_STAFF_USER 
} from '../data/examMockData';
import {
  FileText,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Eye,
  Send,
  BookOpen,
  Search,
  Filter,
  Check,
  X,
  ShieldCheck,
  Award,
  Layers
} from 'lucide-react';
import './GuidanceExamBank.css';

export default function GuidanceExamBank() {
  // State for exam policy configuration
  const [examType, setExamType] = useState('demo_10'); // 'official_100' | 'demo_10'
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(90);
  const [overallPassingScore, setOverallPassingScore] = useState(50.0);
  const [categories, setCategories] = useState(INITIAL_EXAM_CONFIG.categories);
  
  // State for question bank
  const [questions, setQuestions] = useState(INITIAL_QUESTION_BANK);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for published revisions
  const [publishedRevision, setPublishedRevision] = useState(INITIAL_PUBLISHED_REVISION);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewShowKeys, setPreviewShowKeys] = useState(false);

  // State for new/edit question modal
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  
  // Notification toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Target item quota based on exam type
  const targetTotalQuota = examType === 'official_100' ? 100 : 10;

  // Calculate current quota sum
  const currentAllocatedQuota = useMemo(() => {
    return categories.reduce((sum, cat) => {
      const q = examType === 'official_100' ? cat.officialQuota : cat.demoQuota;
      return sum + (Number(q) || 0);
    }, 0);
  }, [categories, examType]);

  const isQuotaBalanced = currentAllocatedQuota === targetTotalQuota;
  const quotaDifference = targetTotalQuota - currentAllocatedQuota;

  // Calculate question inventory per category
  const categoryInventory = useMemo(() => {
    const counts = {};
    categories.forEach(c => { counts[c.id] = 0; });
    questions.forEach(q => {
      if (counts[q.categoryId] !== undefined) {
        counts[q.categoryId] += 1;
      }
    });
    return counts;
  }, [categories, questions]);

  // Check if bank has enough questions to cover the quota
  const isInventorySufficient = useMemo(() => {
    return categories.every(cat => {
      const required = examType === 'official_100' ? cat.officialQuota : cat.demoQuota;
      const available = categoryInventory[cat.id] || 0;
      return available >= required;
    });
  }, [categories, examType, categoryInventory]);

  // Handle category quota change
  const handleQuotaChange = (categoryId, newQuota) => {
    const val = Math.max(0, parseInt(newQuota, 10) || 0);
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        return examType === 'official_100'
          ? { ...cat, officialQuota: val }
          : { ...cat, demoQuota: val };
      })
    );
  };

  // Handle category min passing score change
  const handleCategoryMinPassChange = (categoryId, newScore) => {
    const val = Math.min(100, Math.max(0, parseFloat(newScore) || 0));
    setCategories(prev =>
      prev.map(cat => (cat.id === categoryId ? { ...cat, minPassScore: val } : cat))
    );
  };

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchCat = selectedCategoryFilter === 'all' || q.categoryId === selectedCategoryFilter;
      const matchSearch =
        q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.choices.some(c => c.text.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [questions, selectedCategoryFilter, searchQuery]);

  // Open question modal for create or edit
  const handleOpenQuestionModal = (question = null) => {
    if (question) {
      setEditingQuestion(JSON.parse(JSON.stringify(question)));
    } else {
      setEditingQuestion({
        id: `q-${Date.now().toString().slice(-6)}`,
        categoryId: categories[0]?.id || 'num',
        prompt: '',
        choices: [
          { id: 'a', text: '' },
          { id: 'b', text: '' },
          { id: 'c', text: '' },
          { id: 'd', text: '' },
        ],
        correctChoiceId: 'a',
        points: 1,
        difficulty: 'Medium',
      });
    }
    setIsQuestionModalOpen(true);
  };

  // Save question
  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!editingQuestion.prompt.trim()) {
      alert('Please enter a question prompt.');
      return;
    }
    if (editingQuestion.choices.some(c => !c.text.trim())) {
      alert('Please fill out all 4 answer choices.');
      return;
    }

    setQuestions(prev => {
      const idx = prev.findIndex(q => q.id === editingQuestion.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = editingQuestion;
        return updated;
      }
      return [editingQuestion, ...prev];
    });

    setIsQuestionModalOpen(false);
    setEditingQuestion(null);
    showToast('Question saved successfully into bank.', 'success');
  };

  // Delete question
  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question from the bank?')) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      showToast('Question deleted from bank.', 'info');
    }
  };

  // Execute publication
  const handlePublishRevision = () => {
    if (!isQuotaBalanced) {
      alert(`Cannot publish: Total category quotas must equal exactly ${targetTotalQuota} items.`);
      return;
    }

    const newRevNumber = (publishedRevision?.revisionNumber || 0) + 1;
    const newPublished = {
      revisionNumber: newRevNumber,
      examType,
      status: 'published',
      publishedBy: `${CURRENT_STAFF_USER.name} (${CURRENT_STAFF_USER.department})`,
      publishedAt: new Date().toISOString(),
      timeLimitMinutes,
      overallPassingScore,
      totalItems: targetTotalQuota,
      categorySummary: categories.map(c => ({
        id: c.id,
        name: c.name,
        quota: examType === 'official_100' ? c.officialQuota : c.demoQuota,
        minPassScore: c.minPassScore,
      })),
    };

    setPublishedRevision(newPublished);
    setIsPublishModalOpen(false);
    showToast(`Revision #${newRevNumber} published and activated for applicant sessions!`, 'success');
  };

  return (
    <div className="guidance-bank-canvas">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`guidance-toast ${toastMessage.type}`}>
          {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Page Header Banner */}
      <header className="guidance-bank-header">
        <div className="header-meta">
          <div className="dept-tag">
            <span className="dept-dot"></span>
            <span>SCMBT Guidance Testing Office &bull; Admissions Directorate</span>
          </div>
          <h1 className="header-title">Entrance Examination Bank &amp; Setup</h1>
          <p className="header-subtitle">
            Configure standardized item distribution, timed session rules, category passing thresholds, and publish version-controlled test revisions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="header-actions">
          <button
            type="button"
            className="btn-outline-preview"
            onClick={() => setIsPreviewModalOpen(true)}
            title="Preview Exam Paper"
          >
            <Eye size={17} />
            <span>Preview Paper</span>
          </button>

          <button
            type="button"
            className={`btn-primary-publish ${!isQuotaBalanced ? 'disabled' : ''}`}
            onClick={() => {
              if (!isQuotaBalanced) {
                alert(`Cannot publish: Category quotas must add up to ${targetTotalQuota} items.`);
                return;
              }
              setIsPublishModalOpen(true);
            }}
            title={isQuotaBalanced ? 'Publish this configuration' : 'Adjust category quotas to balance'}
          >
            <Send size={17} />
            <span>Publish Revision</span>
          </button>
        </div>
      </header>

      {/* Live Status & Revision Status Strip */}
      <div className="revision-status-strip">
        <div className="status-item">
          <span className="status-label">Active Published Revision</span>
          <div className="status-value-group">
            <span className="status-badge-published">Revision #{publishedRevision.revisionNumber}</span>
            <span className="status-timestamp">
              {new Date(publishedRevision.publishedAt).toLocaleDateString('en-PH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        <div className="status-item">
          <span className="status-label">Authorized Officer</span>
          <span className="status-officer">{CURRENT_STAFF_USER.name}</span>
          <span className="status-subtext">PRC License: {CURRENT_STAFF_USER.rpmLicenseNumber}</span>
        </div>

        <div className="status-item">
          <span className="status-label">Item Target &amp; Timing</span>
          <span className="status-number-tag">{targetTotalQuota} Items &bull; {timeLimitMinutes} Mins</span>
          <span className="status-subtext">1 Initial + 2 Retakes = 3 Attempts</span>
        </div>

        <div className="status-item">
          <span className="status-label">Overall Passing Cutoff</span>
          <span className="status-cutoff-pill">{overallPassingScore.toFixed(1)}%</span>
          <span className="status-subtext">Configurable per regulatory review</span>
        </div>
      </div>

      {/* Grid: 2 Ergonomic Main Columns */}
      <div className="bank-workspace-grid">
        {/* LEFT COLUMN: EXAM CONFIGURATION & CATEGORY QUOTAS (40% width) */}
        <section className="config-column" aria-label="Exam Parameters and Category Quotas">
          {/* Card 1: Exam Type & Global Parameters */}
          <div className="guidance-card">
            <div className="card-header-bar">
              <div className="bar-title">
                <Sliders size={18} className="text-amber-500" />
                <h2>Global Parameters &amp; Thresholds</h2>
              </div>
              <span className="mode-indicator">{examType === 'official_100' ? 'Official Format' : 'Demo Mode'}</span>
            </div>

            <div className="card-body">
              {/* Exam Format Toggle */}
              <div className="form-field-group">
                <label className="field-label">Exam Delivery Mode</label>
                <div className="segmented-toggle">
                  <button
                    type="button"
                    className={`toggle-option ${examType === 'demo_10' ? 'active' : ''}`}
                    onClick={() => setExamType('demo_10')}
                  >
                    Demo Mode (10 Items)
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${examType === 'official_100' ? 'active' : ''}`}
                    onClick={() => setExamType('official_100')}
                  >
                    Official Exam (100 Items)
                  </button>
                </div>
                <p className="field-hint">
                  Demo mode tests the full applicant workflow with 10 sample items. Official requires 100 scored items.
                </p>
              </div>

              {/* Time Limit & Passing Cutoff */}
              <div className="grid-2-cols">
                <div className="form-field-group">
                  <label className="field-label" htmlFor="time-limit-input">
                    Time Limit (Minutes)
                  </label>
                  <div className="input-with-icon">
                    <Clock size={16} className="input-icon" />
                    <input
                      id="time-limit-input"
                      type="number"
                      min="15"
                      max="240"
                      step="5"
                      value={timeLimitMinutes}
                      onChange={(e) => setTimeLimitMinutes(Math.max(15, parseInt(e.target.value, 10) || 90))}
                      className="text-input"
                    />
                  </div>
                  <span className="field-hint">Standard: 90 mins (1 hr 30 min)</span>
                </div>

                <div className="form-field-group">
                  <label className="field-label" htmlFor="overall-pass-input">
                    Target Passing Score (%)
                  </label>
                  <div className="input-with-icon">
                    <Award size={16} className="input-icon" />
                    <input
                      id="overall-pass-input"
                      type="number"
                      min="10"
                      max="100"
                      step="1"
                      value={overallPassingScore}
                      onChange={(e) => setOverallPassingScore(Math.min(100, Math.max(10, parseFloat(e.target.value) || 50)))}
                      className="text-input"
                    />
                  </div>
                  <span className="field-hint">Target passing is 50% default</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Category Quota Balancer & Minimum Thresholds */}
          <div className="guidance-card">
            <div className="card-header-bar">
              <div className="bar-title">
                <Layers size={18} className="text-navy-900" />
                <h2>Category Item Distribution</h2>
              </div>
              <div className={`quota-sum-badge ${isQuotaBalanced ? 'balanced' : 'unbalanced'}`}>
                {isQuotaBalanced ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Allocated: {currentAllocatedQuota} / {targetTotalQuota} items</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={14} />
                    <span>
                      {quotaDifference > 0 
                        ? `${quotaDifference} items remaining` 
                        : `${Math.abs(quotaDifference)} items excess`}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="card-body">
              <p className="section-note">
                Publishing requires the sum of all category quotas to equal exactly <strong>{targetTotalQuota}</strong>.
              </p>

              <div className="category-quota-table">
                <div className="quota-table-head">
                  <span className="col-cat">Category</span>
                  <span className="col-quota">Item Quota</span>
                  <span className="col-min">Min Pass %</span>
                  <span className="col-inv">In Bank</span>
                </div>

                <div className="quota-table-body">
                  {categories.map((cat) => {
                    const quotaVal = examType === 'official_100' ? cat.officialQuota : cat.demoQuota;
                    const inBank = categoryInventory[cat.id] || 0;
                    const isDeficit = inBank < quotaVal;

                    return (
                      <div key={cat.id} className="quota-row">
                        <div className="col-cat">
                          <span className="cat-title">{cat.name}</span>
                          <span className="cat-desc">{cat.description}</span>
                        </div>

                        <div className="col-quota">
                          <input
                            type="number"
                            min="0"
                            max={targetTotalQuota}
                            value={quotaVal}
                            onChange={(e) => handleQuotaChange(cat.id, e.target.value)}
                            className="quota-num-input"
                          />
                        </div>

                        <div className="col-min">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="5"
                            value={cat.minPassScore}
                            onChange={(e) => handleCategoryMinPassChange(cat.id, e.target.value)}
                            className="quota-num-input"
                          />
                          <span className="pct-symbol">%</span>
                        </div>

                        <div className="col-inv">
                          <span className={`inventory-pill ${isDeficit ? 'deficit' : 'sufficient'}`}>
                            {inBank}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quota Progress Bar */}
              <div className="quota-progress-container">
                <div className="quota-progress-meta">
                  <span>Distribution Completion</span>
                  <span className="tabular-nums font-semibold">
                    {Math.round((currentAllocatedQuota / targetTotalQuota) * 100)}%
                  </span>
                </div>
                <div className="quota-progress-track">
                  <div
                    className={`quota-progress-fill ${isQuotaBalanced ? 'bg-amber' : 'bg-red'}`}
                    style={{ width: `${Math.min(100, (currentAllocatedQuota / targetTotalQuota) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {!isQuotaBalanced && (
                <div className="validation-alert-box">
                  <AlertTriangle size={16} />
                  <span>
                    Category counts must sum to exactly {targetTotalQuota} before publishing. (Current sum: {currentAllocatedQuota})
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: QUESTION BANK REPOSITORY & AUTHORING (60% width) */}
        <section className="bank-column" aria-label="Question Bank Authoring">
          <div className="guidance-card">
            <div className="card-header-bar">
              <div className="bar-title">
                <BookOpen size={18} className="text-navy-900" />
                <h2>Question Repository ({questions.length} Items Available)</h2>
              </div>
              <button
                type="button"
                className="btn-add-item"
                onClick={() => handleOpenQuestionModal()}
              >
                <Plus size={16} />
                <span>Author Question</span>
              </button>
            </div>

            <div className="card-body">
              {/* Filters & Search Toolbar */}
              <div className="bank-toolbar">
                <div className="search-box">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search prompts or choices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="clear-search-btn">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="filter-dropdown-wrapper">
                  <Filter size={15} className="filter-icon" />
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="category-filter-select"
                  >
                    <option value="all">All Categories ({questions.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({categoryInventory[c.id] || 0})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Question Items List */}
              <div className="question-items-list">
                {filteredQuestions.length === 0 ? (
                  <div className="empty-bank-state">
                    <BookOpen size={36} className="text-slate-300" />
                    <p className="empty-title">No questions found</p>
                    <p className="empty-subtitle">Try adjusting your category filter or search query, or author a new question.</p>
                  </div>
                ) : (
                  filteredQuestions.map((q, index) => {
                    const catObj = categories.find(c => c.id === q.categoryId);
                    return (
                      <article key={q.id} className="question-item-card">
                        <div className="question-card-top">
                          <div className="question-tags">
                            <span className="question-seq-badge">#{index + 1}</span>
                            <span className="category-pill">{catObj?.name || q.categoryId}</span>
                            <span className={`difficulty-badge ${q.difficulty.toLowerCase()}`}>
                              {q.difficulty}
                            </span>
                            <span className="points-badge">{q.points} Point</span>
                          </div>

                          <div className="question-item-actions">
                            <button
                              type="button"
                              className="btn-icon-action"
                              title="Edit Question"
                              onClick={() => handleOpenQuestionModal(q)}
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              className="btn-icon-action delete"
                              title="Delete Question"
                              onClick={() => handleDeleteQuestion(q.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Prompt */}
                        <p className="question-prompt-text">{q.prompt}</p>

                        {/* Choices Grid */}
                        <div className="question-choices-preview-grid">
                          {q.choices.map((c) => {
                            const isCorrect = c.id === q.correctChoiceId;
                            return (
                              <div
                                key={c.id}
                                className={`choice-preview-pill ${isCorrect ? 'correct-key' : ''}`}
                              >
                                <span className="choice-label">{c.id.toUpperCase()}</span>
                                <span className="choice-text">{c.text}</span>
                                {isCorrect && (
                                  <span className="key-tag" title="Correct Server-Side Answer Key">
                                    <Check size={12} strokeWidth={3} />
                                    Key
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* MODAL 1: QUESTION AUTHORING / EDITING DIALOG */}
      {isQuestionModalOpen && editingQuestion && (
        <div className="guidance-modal-overlay" role="dialog" aria-modal="true">
          <div className="guidance-modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <FileText size={20} className="text-amber-500" />
                <h3>{editingQuestion.prompt ? 'Edit Question Item' : 'Author New Question Item'}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setIsQuestionModalOpen(false);
                  setEditingQuestion(null);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion}>
              <div className="modal-body-scroll">
                {/* Category and Difficulty row */}
                <div className="grid-3-cols">
                  <div className="form-field-group">
                    <label className="field-label">Assigned Category *</label>
                    <select
                      value={editingQuestion.categoryId}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, categoryId: e.target.value })}
                      className="text-input"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Difficulty Rating</label>
                    <select
                      value={editingQuestion.difficulty}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value })}
                      className="text-input"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Scored Points</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editingQuestion.points}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, points: parseInt(e.target.value, 10) || 1 })}
                      className="text-input"
                    />
                  </div>
                </div>

                {/* Prompt */}
                <div className="form-field-group">
                  <label className="field-label">Question Stem / Prompt *</label>
                  <textarea
                    rows={4}
                    value={editingQuestion.prompt}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, prompt: e.target.value })}
                    placeholder="Enter the complete question prompt, mathematical problem, or textual passage..."
                    className="textarea-input"
                    required
                  />
                </div>

                {/* Choices & Key Selection */}
                <div className="form-field-group">
                  <label className="field-label">
                    Answer Options (Select the radio button beside the correct key) *
                  </label>
                  <div className="choices-editor-list">
                    {editingQuestion.choices.map((choice) => (
                      <div key={choice.id} className="choice-editor-row">
                        <label className="radio-label" title="Mark as correct answer key">
                          <input
                            type="radio"
                            name="correct-choice"
                            checked={editingQuestion.correctChoiceId === choice.id}
                            onChange={() => setEditingQuestion({ ...editingQuestion, correctChoiceId: choice.id })}
                            className="radio-input"
                          />
                          <span className="choice-letter-badge">{choice.id.toUpperCase()}</span>
                        </label>
                        <input
                          type="text"
                          value={choice.text}
                          onChange={(e) => {
                            const updatedChoices = editingQuestion.choices.map(c =>
                              c.id === choice.id ? { ...c, text: e.target.value } : c
                            );
                            setEditingQuestion({ ...editingQuestion, choices: updatedChoices });
                          }}
                          placeholder={`Option ${choice.id.toUpperCase()} text...`}
                          className="choice-text-input"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setIsQuestionModalOpen(false);
                    setEditingQuestion(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit-save">
                  Save to Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM PUBLISH REVISION */}
      {isPublishModalOpen && (
        <div className="guidance-modal-overlay" role="dialog" aria-modal="true">
          <div className="guidance-modal-card publish-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <ShieldCheck size={22} className="text-emerald-600" />
                <h3>Publish New Exam Revision</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsPublishModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll">
              <div className="publish-summary-card">
                <p className="publish-hero-text">
                  You are about to publish <strong>Revision #{(publishedRevision?.revisionNumber || 0) + 1}</strong> of the 
                  SCMBT Institutional Freshman Entrance Examination.
                </p>

                <div className="publish-spec-grid">
                  <div className="spec-box">
                    <span className="spec-lbl">Exam Mode</span>
                    <span className="spec-val">
                      {examType === 'official_100' ? 'Official (100 Items)' : 'Demo (10 Items)'}
                    </span>
                  </div>
                  <div className="spec-box">
                    <span className="spec-lbl">Timed Duration</span>
                    <span className="spec-val">{timeLimitMinutes} Minutes (1h 30m)</span>
                  </div>
                  <div className="spec-box">
                    <span className="spec-lbl">Overall Passing Cutoff</span>
                    <span className="spec-val">{overallPassingScore.toFixed(1)}%</span>
                  </div>
                  <div className="spec-box">
                    <span className="spec-lbl">Total Attempts Allowed</span>
                    <span className="spec-val">3 (1 Initial + 2 Retakes)</span>
                  </div>
                </div>

                <div className="categories-breakdown-box">
                  <h4>Category Quota Summary</h4>
                  <ul className="category-summary-list">
                    {categories.map((c) => (
                      <li key={c.id}>
                        <span className="c-name">{c.name}:</span>
                        <span className="c-quota">
                          {examType === 'official_100' ? c.officialQuota : c.demoQuota} items (Min pass: {c.minPassScore}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="security-notice">
                  <ShieldCheck size={16} />
                  <span>
                    Answer keys will be stored in restricted database table <code>exam_answer_keys</code> with server-side validation. Applicant exam sessions will never receive key payloads.
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsPublishModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-confirm-publish"
                onClick={handlePublishRevision}
              >
                <Check size={16} />
                <span>Confirm &amp; Publish Active Revision</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: APPLICANT PAPER SIMULATION PREVIEW */}
      {isPreviewModalOpen && (
        <div className="guidance-modal-overlay" role="dialog" aria-modal="true">
          <div className="guidance-modal-card preview-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <Eye size={20} className="text-navy-900" />
                <h3>Applicant Exam Paper Preview &bull; {targetTotalQuota} Items</h3>
              </div>
              <div className="preview-header-controls">
                <button
                  type="button"
                  className={`key-toggle-btn ${previewShowKeys ? 'active' : ''}`}
                  onClick={() => setPreviewShowKeys(prev => !prev)}
                >
                  <ShieldCheck size={14} />
                  <span>{previewShowKeys ? 'Hide Answer Keys' : 'Inspect Answer Keys'}</span>
                </button>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsPreviewModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="modal-body-scroll paper-preview-body">
              {/* Institutional Header Paper Simulation */}
              <div className="paper-institutional-header">
                <div className="inst-header-text">
                  <h3>SOUTHWESTERN COLLEGE OF MARITIME, BUSINESS AND TECHNOLOGY</h3>
                  <p>Admissions Office &bull; Guidance Testing Directorate</p>
                  <h4>FRESHMAN ENTRANCE EXAMINATION &bull; TEST QUESTIONNAIRE</h4>
                </div>
                <div className="paper-meta-strip">
                  <span>Time Limit: {timeLimitMinutes} Minutes</span>
                  <span>Passing Criterion: {overallPassingScore}%</span>
                  <span>Attempts: 3 Total</span>
                </div>
              </div>

              {/* Questions list simulation */}
              <div className="paper-questions-flow">
                {questions.slice(0, targetTotalQuota).map((q, idx) => {
                  const cat = categories.find(c => c.id === q.categoryId);
                  return (
                    <div key={q.id} className="paper-item">
                      <div className="paper-item-header">
                        <span className="paper-item-num">Item {idx + 1}.</span>
                        <span className="paper-item-cat">[{cat?.name}]</span>
                      </div>
                      <p className="paper-prompt">{q.prompt}</p>
                      <div className="paper-options-list">
                        {q.choices.map((c) => {
                          const isCorrect = c.id === q.correctChoiceId;
                          return (
                            <div
                              key={c.id}
                              className={`paper-option-line ${previewShowKeys && isCorrect ? 'highlight-key' : ''}`}
                            >
                              <span className="opt-bubble">({c.id})</span>
                              <span className="opt-text">{c.text}</span>
                              {previewShowKeys && isCorrect && (
                                <span className="opt-key-flag">CORRECT KEY</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer">
              <span className="paper-footer-note">
                Showing {Math.min(questions.length, targetTotalQuota)} of {targetTotalQuota} items scheduled for this revision.
              </span>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
