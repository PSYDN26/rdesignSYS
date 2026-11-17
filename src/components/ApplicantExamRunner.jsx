import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  INITIAL_EXAM_CONFIG, 
  INITIAL_QUESTION_BANK, 
  INITIAL_PUBLISHED_REVISION, 
  INITIAL_APPLICANT,
  EXAM_ANSWER_KEYS 
} from '../data/examMockData';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Award,
  ArrowRight,
  RotateCcw,
  FileText,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import './ApplicantExamRunner.css';

export default function ApplicantExamRunner({ 
  onNavigateToReferral,
  onNavigateToCourseSelection,
  onBackToExamBank
}) {
  // Exam Stage: 'briefing' | 'active' | 'results'
  const [examStage, setExamStage] = useState('briefing');
  
  // Applicant & Attempt tracking state
  const applicant = INITIAL_APPLICANT;
  const [attemptNumber, setAttemptNumber] = useState(1); // 1, 2, or 3
  
  // Timer state: 90 minutes (5400 seconds)
  const initialSeconds = INITIAL_PUBLISHED_REVISION.timeLimitMinutes * 60; // 5400s
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const timerRef = useRef(null);

  // Active question index in session
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Questions allocated for this session (demo 10 items)
  const sessionQuestions = useMemo(() => {
    return INITIAL_QUESTION_BANK.slice(0, INITIAL_PUBLISHED_REVISION.totalItems);
  }, []);

  // Applicant responses: { [questionId]: choiceId }
  const [userAnswers, setUserAnswers] = useState({});
  const userAnswersRef = useRef(userAnswers);
  useEffect(() => {
    userAnswersRef.current = userAnswers;
  }, [userAnswers]);
  
  // Flagged for review questions: Set of questionIds
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  // Confirm submit modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Scored Result State
  const [scoredResult, setScoredResult] = useState(null);

  // Grade and calculate outcome
  const calculateResults = (finalAnswers) => {
    let rawCorrect = 0;
    const catScores = {};

    INITIAL_EXAM_CONFIG.categories.forEach((c) => {
      catScores[c.id] = { correct: 0, total: 0, minPass: c.minPassScore };
    });

    sessionQuestions.forEach((q) => {
      if (catScores[q.categoryId]) {
        catScores[q.categoryId].total += 1;
      }
      const selected = finalAnswers[q.id];
      const correct = EXAM_ANSWER_KEYS[q.id];
      if (selected && selected === correct) {
        rawCorrect += 1;
        if (catScores[q.categoryId]) {
          catScores[q.categoryId].correct += 1;
        }
      }
    });

    const overallPct = (rawCorrect / sessionQuestions.length) * 100;
    const cutoff = INITIAL_PUBLISHED_REVISION.overallPassingScore; // 50%

    // Check category thresholds
    let allCategoriesPassed = true;
    const categoryBreakdown = Object.entries(catScores).map(([catId, data]) => {
      const catConfig = INITIAL_EXAM_CONFIG.categories.find((c) => c.id === catId);
      const pct = data.total > 0 ? (data.correct / data.total) * 100 : 0;
      const passed = pct >= data.minPass;
      if (!passed) allCategoriesPassed = false;
      return {
        id: catId,
        name: catConfig ? catConfig.name : catId,
        correct: data.correct,
        total: data.total,
        percentage: pct,
        minPassScore: data.minPass,
        passed,
      };
    });

    const passed = overallPct >= cutoff && allCategoriesPassed;

    return {
      attemptNumber,
      rawCorrect,
      totalCount: sessionQuestions.length,
      overallPercentage: overallPct,
      passingCutoff: cutoff,
      passed,
      categoryBreakdown,
      submittedAt: new Date().toISOString(),
      exhaustedAllAttempts: !passed && attemptNumber >= 3,
    };
  };

  // Timer Effect
  useEffect(() => {
    if (examStage === 'active') {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            alert('Time has expired! Your answers are being automatically submitted for grading.');
            const result = calculateResults(userAnswersRef.current);
            setScoredResult(result);
            setExamStage('results');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStage, attemptNumber]);

  // Format seconds to HH:MM:SS
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  // Start Exam
  const handleStartExam = () => {
    setSecondsRemaining(initialSeconds);
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setCurrentQuestionIndex(0);
    setExamStage('active');
  };

  // Select Answer
  const handleSelectChoice = (choiceId) => {
    const activeQ = sessionQuestions[currentQuestionIndex];
    if (!activeQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [activeQ.id]: choiceId,
    }));
  };

  // Toggle Flag
  const handleToggleFlag = (questionId) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // Progress metrics
  const answeredCount = Object.keys(userAnswers).length;
  const totalCount = sessionQuestions.length;
  const unansweredCount = totalCount - answeredCount;

  // Submission handler
  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    const result = calculateResults(userAnswersRef.current);
    setScoredResult(result);
    setExamStage('results');
  };

  // Retake attempt handler
  const handleStartRetake = () => {
    if (attemptNumber < 3) {
      setAttemptNumber((prev) => prev + 1);
      setExamStage('briefing');
    }
  };

  // Fast pre-fill simulation for tester convenience
  const handleQuickFill = (outcomeType) => {
    const answers = {};
    sessionQuestions.forEach((q, idx) => {
      if (outcomeType === 'pass') {
        // Answer 80% correctly
        answers[q.id] = idx < 8 ? EXAM_ANSWER_KEYS[q.id] : (EXAM_ANSWER_KEYS[q.id] === 'a' ? 'b' : 'a');
      } else {
        // Answer only 30% correctly (Fail)
        answers[q.id] = idx < 3 ? EXAM_ANSWER_KEYS[q.id] : (EXAM_ANSWER_KEYS[q.id] === 'a' ? 'b' : 'a');
      }
    });
    setUserAnswers(answers);
  };

  const currentQ = sessionQuestions[currentQuestionIndex];
  const isFlagged = currentQ ? flaggedQuestions.has(currentQ.id) : false;

  return (
    <div className="applicant-runner-canvas">
      {/* =========================================================
          STAGE 1: BRIEFING & INSTRUCTIONS SCREEN
          ========================================================= */}
      {examStage === 'briefing' && (
        <div className="runner-briefing-card">
          <div className="briefing-header">
            <div className="briefing-inst-seal">
              <GraduationCap size={28} className="text-white" />
            </div>
            <div className="briefing-title-group">
              <span className="inst-subhead">Southwestern College of Maritime, Business and Technology</span>
              <h1 className="briefing-main-title">Freshman Entrance Examination</h1>
              <p className="briefing-desc">
                Academic Year 2026–2027 &bull; Automated Cognitive &amp; Aptitude Assessment
              </p>
            </div>
          </div>

          {/* Applicant & Attempt Spec Strip */}
          <div className="briefing-spec-grid">
            <div className="spec-tile">
              <span className="tile-label">Applicant Name</span>
              <span className="tile-value">{applicant.fullName}</span>
              <span className="tile-sub">{applicant.applicationNumber}</span>
            </div>

            <div className="spec-tile">
              <span className="tile-label">Target Degree Program</span>
              <span className="tile-value">{applicant.targetProgram}</span>
              <span className="tile-sub">{applicant.shsStrand}</span>
            </div>

            <div className="spec-tile">
              <span className="tile-label">Examination Attempt</span>
              <span className="tile-value">
                Attempt {attemptNumber} of {applicant.maxAttempts}
              </span>
              <span className="tile-sub">
                {attemptNumber === 1
                  ? 'Initial Attempt'
                  : attemptNumber === 2
                  ? 'First Retake'
                  : 'Final Online Retake'}
              </span>
            </div>

            <div className="spec-tile">
              <span className="tile-label">Session Duration</span>
              <span className="tile-value">90 Minutes</span>
              <span className="tile-sub">1 hr 30 mins (Continuous countdown)</span>
            </div>
          </div>

          {/* Policy & Rules Card */}
          <div className="briefing-rules-box">
            <h3 className="rules-heading">
              <FileText size={18} className="text-navy-900" />
              <span>Examination Instructions &amp; Institutional Honor Code</span>
            </h3>
            <ul className="rules-list">
              <li>
                <strong>Total Items &amp; Categories:</strong> This session consists of{' '}
                <strong>{sessionQuestions.length} scored questions</strong> covering Numerical Reasoning,
                Intellectual &amp; Abstract Logic, Verbal Aptitude, and Spatial Relations.
              </li>
              <li>
                <strong>Passing Benchmark:</strong> The overall passing cutoff is set at{' '}
                <strong>{INITIAL_PUBLISHED_REVISION.overallPassingScore}%</strong>. In addition, each category carries an institutional minimum proficiency requirement.
              </li>
              <li>
                <strong>Attempt Policy:</strong> Each applicant is granted a maximum of <strong>3 online attempts</strong> (1 initial attempt + 2 retakes). If all three attempts result in non-qualifying scores, the system will issue an official referral for a <strong>Written Aptitude Test</strong> administered by the Guidance Office.
              </li>
              <li>
                <strong>Synchronized Timer:</strong> The 90-minute countdown runs continuously once started. If the timer elapses, any recorded answers will be automatically submitted and scored by the system.
              </li>
              <li>
                <strong>Review Feature:</strong> You may navigate freely between items, change your answers, and flag questions for later review prior to submitting.
              </li>
            </ul>
          </div>

          {/* Quick Simulation Bar (Convenient testing controls for evaluator) */}
          <div className="simulation-tester-bar">
            <span className="sim-title">Evaluator Quick Preset:</span>
            <button
              type="button"
              className="btn-sim-preset"
              onClick={() => setAttemptNumber(1)}
            >
              Set Attempt 1 (Initial)
            </button>
            <button
              type="button"
              className="btn-sim-preset"
              onClick={() => setAttemptNumber(2)}
            >
              Set Attempt 2 (Retake 1)
            </button>
            <button
              type="button"
              className="btn-sim-preset"
              onClick={() => setAttemptNumber(3)}
            >
              Set Attempt 3 (Final Retake)
            </button>
          </div>

          {/* Action Row */}
          <div className="briefing-action-bar">
            <button
              type="button"
              className="btn-secondary-guidance"
              onClick={onBackToExamBank}
            >
              Return to Exam Bank Setup
            </button>
            <button
              type="button"
              className="btn-start-exam"
              onClick={handleStartExam}
            >
              <span>Begin Examination Now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 2: ACTIVE 90-MIN TIMED EXAM RUNNER
          ========================================================= */}
      {examStage === 'active' && currentQ && (
        <div className="runner-active-stage">
          {/* Top Sticky Test Bar: Timer, Progress & Quick Submit */}
          <header className="active-exam-top-bar">
            <div className="top-bar-left">
              <span className="exam-code-tag">SCMBT-ENTRANCE-2026</span>
              <span className="attempt-pill">Attempt {attemptNumber} of 3</span>
            </div>

            {/* Continuous 90-Min Tabular Countdown Timer */}
            <div
              className={`digital-timer-display ${
                secondsRemaining <= 120
                  ? 'urgent-pulse'
                  : secondsRemaining <= 600
                  ? 'warning-low'
                  : ''
              }`}
              title="Continuous exam session countdown"
            >
              <Clock size={18} />
              <span className="timer-digits tabular-nums">{formatTime(secondsRemaining)}</span>
              <span className="timer-subtext">Remaining</span>
            </div>

            {/* Right: Progress and Finish Action */}
            <div className="top-bar-right">
              <div className="answered-metric">
                <span className="metric-text">
                  <strong>{answeredCount}</strong> of {totalCount} Answered
                </span>
                <div className="progress-tiny-track">
                  <div
                    className="progress-tiny-fill"
                    style={{ width: `${(answeredCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                type="button"
                className="btn-submit-exam-top"
                onClick={() => setIsSubmitModalOpen(true)}
              >
                Submit Exam
              </button>
            </div>
          </header>

          {/* Quick Simulation Testing Helper Strip */}
          <div className="tester-fill-strip">
            <span className="tester-label">Demo Quick Actions:</span>
            <button
              type="button"
              className="tester-btn"
              onClick={() => handleQuickFill('pass')}
            >
              Simulate Passing Answers (80%)
            </button>
            <button
              type="button"
              className="tester-btn"
              onClick={() => handleQuickFill('fail')}
            >
              Simulate Failing Answers (30%)
            </button>
            <button
              type="button"
              className="tester-btn"
              onClick={() => setSecondsRemaining(10)}
            >
              Test Timer Expiration (10s Left)
            </button>
          </div>

          {/* Main Question & Navigation Workspace */}
          <div className="exam-workspace-split">
            {/* Left: Active Question Card */}
            <main className="question-runner-card">
              <div className="question-meta-bar">
                <div className="meta-left">
                  <span className="item-number-badge">
                    Question {currentQuestionIndex + 1} of {totalCount}
                  </span>
                  <span className="cat-badge">
                    {INITIAL_EXAM_CONFIG.categories.find((c) => c.id === currentQ.categoryId)?.name ||
                      currentQ.categoryId}
                  </span>
                </div>

                {/* Bookmark Flag */}
                <button
                  type="button"
                  className={`btn-flag-toggle ${isFlagged ? 'flagged' : ''}`}
                  onClick={() => handleToggleFlag(currentQ.id)}
                  title={isFlagged ? 'Flagged for review (Click to unflag)' : 'Flag for review'}
                >
                  <Bookmark size={15} fill={isFlagged ? '#f98809' : 'none'} />
                  <span>{isFlagged ? 'Flagged' : 'Flag for Review'}</span>
                </button>
              </div>

              {/* Question Stem Prompt */}
              <div className="question-stem-container">
                <p className="question-stem-text">{currentQ.prompt}</p>
              </div>

              {/* Multiple Choice Options List */}
              <div className="choices-interactive-list" role="radiogroup" aria-label="Answer options">
                {currentQ.choices.map((choice) => {
                  const isSelected = userAnswers[currentQ.id] === choice.id;
                  return (
                    <label
                      key={choice.id}
                      className={`choice-card-option ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQ.id}`}
                        value={choice.id}
                        checked={isSelected}
                        onChange={() => handleSelectChoice(choice.id)}
                        className="choice-radio-hidden"
                      />
                      <span className="choice-circle-letter">{choice.id.toUpperCase()}</span>
                      <span className="choice-text-content">{choice.text}</span>
                    </label>
                  );
                })}
              </div>

              {/* Bottom Nav Pager Buttons */}
              <footer className="question-footer-nav">
                <button
                  type="button"
                  className="btn-pager"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex < totalCount - 1 ? (
                  <button
                    type="button"
                    className="btn-pager next"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalCount - 1, prev + 1))}
                  >
                    <span>Next Item</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-finish-exam"
                    onClick={() => setIsSubmitModalOpen(true)}
                  >
                    <span>Review &amp; Submit</span>
                    <CheckCircle2 size={16} />
                  </button>
                )}
              </footer>
            </main>

            {/* Right: Question Matrix Navigator */}
            <aside className="exam-sidebar-matrix" aria-label="Question Matrix Navigator">
              <div className="matrix-card">
                <h3 className="matrix-title">Questions Navigator</h3>

                {/* Legend */}
                <div className="matrix-legend">
                  <div className="legend-item">
                    <span className="legend-box answered"></span>
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-box flagged"></span>
                    <span>Flagged ({flaggedQuestions.size})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-box unanswered"></span>
                    <span>Unanswered ({unansweredCount})</span>
                  </div>
                </div>

                {/* Grid of question buttons */}
                <div className="matrix-buttons-grid">
                  {sessionQuestions.map((q, idx) => {
                    const isAnswered = !!userAnswers[q.id];
                    const isQFlagged = flaggedQuestions.has(q.id);
                    const isCurrent = idx === currentQuestionIndex;

                    let statusClass = 'unanswered';
                    if (isAnswered) statusClass = 'answered';
                    if (isQFlagged) statusClass += ' flagged';
                    if (isCurrent) statusClass += ' current-focus';

                    return (
                      <button
                        key={q.id}
                        type="button"
                        className={`matrix-grid-btn ${statusClass}`}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        title={`Go to Question ${idx + 1}`}
                      >
                        <span className="btn-num">{idx + 1}</span>
                        {isQFlagged && <span className="matrix-flag-dot"></span>}
                      </button>
                    );
                  })}
                </div>

                {/* Final Submit action at bottom of matrix */}
                <div className="matrix-footer-action">
                  <button
                    type="button"
                    className="btn-submit-matrix-bottom"
                    onClick={() => setIsSubmitModalOpen(true)}
                  >
                    <CheckCircle2 size={16} />
                    <span>Submit &amp; Finish</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* SUBMIT CONFIRMATION MODAL */}
          {isSubmitModalOpen && (
            <div className="runner-modal-overlay" role="dialog" aria-modal="true">
              <div className="runner-modal-card">
                <div className="modal-icon-header">
                  {unansweredCount > 0 ? (
                    <div className="modal-icon-bubble warn">
                      <AlertTriangle size={24} className="text-amber-500" />
                    </div>
                  ) : (
                    <div className="modal-icon-bubble success">
                      <CheckCircle2 size={24} className="text-emerald-600" />
                    </div>
                  )}
                  <h3>Confirm Examination Submission</h3>
                </div>

                <div className="modal-body-content">
                  {unansweredCount > 0 ? (
                    <div className="unanswered-warning-box">
                      <AlertCircle size={18} />
                      <div>
                        <strong>You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}.</strong>
                        <p>Unanswered items will receive 0 points during grading.</p>
                      </div>
                    </div>
                  ) : (
                    <p className="ready-text">
                      You have answered all <strong>{totalCount} questions</strong>.
                    </p>
                  )}

                  <div className="confirm-summary-stats">
                    <div className="stat-line">
                      <span>Total Questions:</span>
                      <strong>{totalCount}</strong>
                    </div>
                    <div className="stat-line">
                      <span>Questions Answered:</span>
                      <strong>{answeredCount}</strong>
                    </div>
                    <div className="stat-line">
                      <span>Flagged for Review:</span>
                      <strong>{flaggedQuestions.size}</strong>
                    </div>
                    <div className="stat-line">
                      <span>Time Remaining:</span>
                      <strong className="tabular-nums">{formatTime(secondsRemaining)}</strong>
                    </div>
                  </div>

                  <p className="submission-disclaimer">
                    Once submitted, your answers will be securely graded and your attempt #{attemptNumber} will be recorded.
                  </p>
                </div>

                <div className="modal-footer-buttons">
                  <button
                    type="button"
                    className="btn-back-to-test"
                    onClick={() => setIsSubmitModalOpen(false)}
                  >
                    Continue Answering
                  </button>
                  <button
                    type="button"
                    className="btn-confirm-final-submit"
                    onClick={handleConfirmSubmit}
                  >
                    Yes, Submit Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          STAGE 3: SCORED RESULTS & ADMISSIONS ROUTING DECISION
          ========================================================= */}
      {examStage === 'results' && scoredResult && (
        <div className="runner-results-stage">
          {/* Banner: Passed vs Failed */}
          <div className={`results-hero-banner ${scoredResult.passed ? 'passed' : 'failed'}`}>
            <div className="hero-icon-bubble">
              {scoredResult.passed ? (
                <Award size={36} className="text-white" />
              ) : (
                <ShieldAlert size={36} className="text-white" />
              )}
            </div>

            <div className="hero-text-group">
              <span className="hero-meta-badge">
                Attempt {scoredResult.attemptNumber} of {applicant.maxAttempts} &bull; Recorded on{' '}
                {new Date(scoredResult.submittedAt).toLocaleDateString('en-PH', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <h2 className="hero-heading">
                {scoredResult.passed
                  ? 'Congratulations! You Have Passed the Entrance Examination.'
                  : scoredResult.exhaustedAllAttempts
                  ? 'Official Written Aptitude Test Referral Required'
                  : 'Examination Score Below Institutional Passing Benchmark'}
              </h2>
              <p className="hero-subtext">
                {scoredResult.passed
                  ? `Your overall score of ${scoredResult.overallPercentage.toFixed(1)}% satisfies the SCMBT institutional admission cutoff of ${scoredResult.passingCutoff.toFixed(1)}%. You are eligible to proceed to program course selection.`
                  : scoredResult.exhaustedAllAttempts
                  ? `All ${applicant.maxAttempts} online attempts for Application ${applicant.applicationNumber} have been utilized without achieving the passing threshold. Under SCMBT Admissions Policy, you are now referred to the Guidance Office for a proctored Written Aptitude Test.`
                  : `You obtained ${scoredResult.overallPercentage.toFixed(1)}%, which is below the passing cutoff of ${scoredResult.passingCutoff.toFixed(1)}%. You have ${applicant.maxAttempts - scoredResult.attemptNumber} retake chance(s) remaining.`}
              </p>
            </div>

            {/* Score Ring / Pill */}
            <div className="hero-score-badge">
              <span className="score-val tabular-nums">
                {scoredResult.overallPercentage.toFixed(1)}%
              </span>
              <span className="score-lbl">
                {scoredResult.rawCorrect} of {scoredResult.totalCount} Correct
              </span>
              <span className="score-status-tag">
                {scoredResult.passed ? 'PASSED' : 'NOT QUALIFIED'}
              </span>
            </div>
          </div>

          {/* Category Proficiency Breakdown Table */}
          <div className="results-card">
            <h3 className="results-card-title">Category Proficiency Breakdown</h3>
            <p className="results-card-desc">
              Evaluation across individual cognitive domains against minimum category criteria.
            </p>

            <div className="category-results-table">
              <div className="cat-res-head">
                <span>Category Domain</span>
                <span>Items Correct</span>
                <span>Category Score</span>
                <span>Min Required</span>
                <span>Status</span>
              </div>

              <div className="cat-res-body">
                {scoredResult.categoryBreakdown.map((c) => (
                  <div key={c.id} className="cat-res-row">
                    <span className="cat-res-name font-semibold">{c.name}</span>
                    <span className="cat-res-items tabular-nums">
                      {c.correct} / {c.total}
                    </span>
                    <span className="cat-res-pct tabular-nums font-bold">
                      {c.percentage.toFixed(1)}%
                    </span>
                    <span className="cat-res-req tabular-nums text-slate-500">
                      {c.minPassScore.toFixed(1)}%
                    </span>
                    <span>
                      <span className={`outcome-pill ${c.passed ? 'pass' : 'fail'}`}>
                        {c.passed ? 'Passed' : 'Deficit'}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTION ROUTE DECISION CARD */}
          <div className="results-routing-card">
            {scoredResult.passed ? (
              /* OUTCOME A: PASSED -> COURSE SELECTION UNLOCK */
              <div className="routing-outcome-box pass">
                <div className="route-header">
                  <CheckCircle2 size={24} className="text-emerald-600" />
                  <div>
                    <h4>Admission Requirement Satisfied</h4>
                    <p>Course selection for freshman enrollment is now unlocked.</p>
                  </div>
                </div>
                <div className="route-action-row">
                  <button
                    type="button"
                    className="btn-action-primary emerald"
                    onClick={onNavigateToCourseSelection}
                  >
                    <span>Proceed to Course Selection</span>
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            ) : scoredResult.exhaustedAllAttempts ? (
              /* OUTCOME C: FAILED ALL 3 ATTEMPTS -> REFERRAL SLIP TO WRITTEN TEST */
              <div className="routing-outcome-box referral">
                <div className="route-header">
                  <AlertTriangle size={24} className="text-amber-600" />
                  <div>
                    <h4>Guidance Office Referral Issued</h4>
                    <p>
                      All 3 online attempts exhausted. Your application has been automatically transferred to the Guidance Testing Directorate for paper aptitude scheduling.
                    </p>
                  </div>
                </div>
                <div className="route-action-row">
                  <button
                    type="button"
                    className="btn-action-primary amber"
                    onClick={onNavigateToReferral}
                  >
                    <span>View Official Guidance Referral Slip (Gate 3)</span>
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            ) : (
              /* OUTCOME B: FAILED WITH RETAKES REMAINING */
              <div className="routing-outcome-box retake">
                <div className="route-header">
                  <RotateCcw size={24} className="text-blue-600" />
                  <div>
                    <h4>Retake Chance Available</h4>
                    <p>
                      You have used Attempt {scoredResult.attemptNumber} of {applicant.maxAttempts}. You have{' '}
                      <strong>{applicant.maxAttempts - scoredResult.attemptNumber} retake(s) remaining</strong>.
                    </p>
                  </div>
                </div>
                <div className="route-action-row">
                  <button
                    type="button"
                    className="btn-action-primary navy"
                    onClick={handleStartRetake}
                  >
                    <RotateCcw size={16} />
                    <span>Start Retake Attempt {scoredResult.attemptNumber + 1}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
