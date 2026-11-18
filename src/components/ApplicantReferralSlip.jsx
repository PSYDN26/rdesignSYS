import React, { useState } from 'react';
import { INITIAL_REFERRAL_SLIP } from '../data/examMockData';
import crestEmblem from '../assets/SCMBT_Crest.png';
import {
  Printer,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  QrCode,
  ArrowLeft,
  Share2
} from 'lucide-react';
import './ApplicantReferralSlip.css';

export default function ApplicantReferralSlip({
  onBackToExam,
  onProceedToAptitudeResults
}) {
  const referral = INITIAL_REFERRAL_SLIP;
  const [isCopied, setIsCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referral.referralCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="applicant-referral-canvas">
      {/* Top Banner Toolbar (Non-printable) */}
      <div className="referral-top-toolbar no-print">
        <div className="toolbar-left">
          <button
            type="button"
            className="btn-back-link"
            onClick={onBackToExam}
            title="Return to Entrance Exam Runner"
          >
            <ArrowLeft size={16} />
            <span>Return to Entrance Examination</span>
          </button>
          <div className="referral-status-tag">
            <span className="pulse-dot"></span>
            <span>Guidance Office Visit Required</span>
          </div>
        </div>

        <div className="toolbar-right">
          <button
            type="button"
            className="btn-action-outline"
            onClick={handleCopyCode}
            title="Copy Referral Reference Code"
          >
            <Share2 size={16} />
            <span>{isCopied ? 'Code Copied!' : 'Copy Reference'}</span>
          </button>

          <button
            type="button"
            className="btn-action-primary-print"
            onClick={handlePrint}
            title="Print or Save PDF"
          >
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Physical Bond Paper Form Sheet (Standard 8.5" width constraint) */}
      <div className="bond-paper-sheet" id="printable-referral-slip">
        {/* Document Border Frame */}
        <div className="bond-paper-inner-frame">
          {/* Institutional Letterhead Header */}
          <header className="institutional-doc-header">
            <div className="doc-logo-col">
              <img
                src={crestEmblem}
                alt="SCMBT Institutional Crest"
                className="doc-crest-img"
              />
            </div>

            <div className="doc-title-col">
              <span className="doc-subhead-republic">Republic of the Philippines</span>
              <h1 className="doc-inst-name">
                SOUTHWESTERN COLLEGE OF MARITIME, BUSINESS AND TECHNOLOGY
              </h1>
              <p className="doc-office-name">
                OFFICE OF STUDENT GUIDANCE &amp; TESTING SERVICES &bull; ADMISSIONS DIRECTORATE
              </p>
              <div className="doc-divider-line"></div>
              <h2 className="doc-form-title">
                OFFICIAL REFERRAL SLIP FOR WRITTEN APTITUDE TESTING
              </h2>
            </div>

            <div className="doc-code-col">
              {/* Simulated QR & Barcode */}
              <div className="qr-box" title={`Referral: ${referral.referralCode}`}>
                <QrCode size={52} className="qr-icon" />
              </div>
              <span className="doc-ref-number tabular-nums">{referral.referralCode}</span>
              <span className="doc-control-number">{referral.formControlNumber}</span>
            </div>
          </header>

          {/* Urgent Directive Callout Banner */}
          <section className="directive-banner">
            <div className="directive-icon-col">
              <Building size={24} className="text-navy-900" />
            </div>
            <div className="directive-text-col">
              <h3>Action Required: In-Person Guidance Center Appearance</h3>
              <p>
                The applicant is officially directed to visit the <strong>Guidance Testing Office</strong> within five (5) working days from this issuance to schedule and undergo the <strong>Proctored Written Aptitude Test</strong>.
              </p>
            </div>
            <div className="directive-badge-col">
              <span className="badge-deadline">Room 204 &bull; Admin Bldg</span>
            </div>
          </section>

          {/* Section 1: Candidate & Application Profile */}
          <section className="doc-section-block">
            <div className="doc-section-header">
              <span className="sec-num">I.</span>
              <h3 className="sec-title">APPLICANT &amp; APPLICATION PROFILE</h3>
            </div>

            <div className="doc-meta-grid">
              <div className="meta-cell">
                <span className="meta-lbl">Candidate Full Name:</span>
                <span className="meta-val font-bold">{referral.applicantName}</span>
              </div>
              <div className="meta-cell">
                <span className="meta-lbl">Application Reference No.:</span>
                <span className="meta-val tabular-nums font-bold text-navy-900">
                  {referral.applicationNumber}
                </span>
              </div>
              <div className="meta-cell">
                <span className="meta-lbl">Target Degree Program:</span>
                <span className="meta-val font-semibold">{referral.targetProgram}</span>
              </div>
              <div className="meta-cell">
                <span className="meta-lbl">SHS Strand / Background:</span>
                <span className="meta-val">{referral.shsStrand}</span>
              </div>
              <div className="meta-cell">
                <span className="meta-lbl">Contact Number:</span>
                <span className="meta-val tabular-nums">{referral.contactNumber}</span>
              </div>
              <div className="meta-cell">
                <span className="meta-lbl">Date &amp; Time Issued:</span>
                <span className="meta-val tabular-nums">
                  {new Date(referral.dateIssued).toLocaleDateString('en-PH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </section>

          {/* Section 2: Online Examination History & Referral Basis */}
          <section className="doc-section-block">
            <div className="doc-section-header">
              <span className="sec-num">II.</span>
              <h3 className="sec-title">ONLINE ENTRANCE EXAMINATION ATTEMPT HISTORY</h3>
            </div>

            <p className="doc-prose-text">
              <strong>Referral Basis:</strong> {referral.referralReason}
            </p>

            <table className="doc-history-table">
              <thead>
                <tr>
                  <th>Attempt</th>
                  <th>Date Taken</th>
                  <th>Score Obtained</th>
                  <th>Raw Score</th>
                  <th>Passing Cutoff</th>
                  <th>Recorded Outcome</th>
                </tr>
              </thead>
              <tbody>
                {referral.attemptsHistory.map((item) => (
                  <tr key={item.attempt}>
                    <td className="font-semibold">Attempt {item.attempt}</td>
                    <td className="tabular-nums">{item.date}</td>
                    <td className="tabular-nums font-bold text-red-700">{item.scorePct.toFixed(1)}%</td>
                    <td className="tabular-nums">{item.rawScore}</td>
                    <td className="tabular-nums font-semibold">50.0%</td>
                    <td>
                      <span className="table-outcome-tag deficit">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Section 3: Guidance Office Testing Location & What to Bring */}
          <section className="doc-section-block">
            <div className="doc-section-header">
              <span className="sec-num">III.</span>
              <h3 className="sec-title">TESTING SCHEDULE &amp; MANDATORY REQUIREMENTS</h3>
            </div>

            <div className="guidance-location-box">
              <div className="loc-item">
                <MapPin size={17} className="text-amber-600" />
                <div>
                  <strong>Testing Center Venue:</strong>
                  <p>{referral.testingCenter.room}</p>
                </div>
              </div>
              <div className="loc-item">
                <Clock size={17} className="text-amber-600" />
                <div>
                  <strong>Guidance Office Operating Hours:</strong>
                  <p>{referral.testingCenter.officeHours}</p>
                </div>
              </div>
            </div>

            <div className="requirements-checklist">
              <h4 className="req-title">Mandatory Documents &amp; Testing Materials to Bring:</h4>
              <ul className="req-list">
                {referral.instructions.map((inst, index) => (
                  <li key={index}>
                    <span className="req-bullet">&bull;</span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4: Admissions & Intake Stepper Tracker */}
          <section className="doc-section-block">
            <div className="doc-section-header">
              <span className="sec-num">IV.</span>
              <h3 className="sec-title">APTITUDE TESTING &amp; ENROLLMENT CLEARANCE ROADMAP</h3>
            </div>

            <div className="admissions-milestone-track">
              <div className="milestone-step done">
                <div className="step-circle">
                  <CheckCircle2 size={14} />
                </div>
                <span className="step-label">1. Referral Issued</span>
                <span className="step-status">Completed</span>
              </div>
              <div className="step-connector done"></div>

              <div className="milestone-step current">
                <div className="step-circle">2</div>
                <span className="step-label">2. Guidance Intake</span>
                <span className="step-status current-tag">Next Step</span>
              </div>
              <div className="step-connector"></div>

              <div className="milestone-step upcoming">
                <div className="step-circle">3</div>
                <span className="step-label">3. Written Test</span>
                <span className="step-status">Pending</span>
              </div>
              <div className="step-connector"></div>

              <div className="milestone-step upcoming">
                <div className="step-circle">4</div>
                <span className="step-label">4. RPM Encoding</span>
                <span className="step-status">Pending</span>
              </div>
              <div className="step-connector"></div>

              <div className="milestone-step upcoming">
                <div className="step-circle">5</div>
                <span className="step-label">5. Admission Result</span>
                <span className="step-status">Pending</span>
              </div>
            </div>
          </section>

          {/* Section 5: Institutional Signatures & Verification Area */}
          <footer className="doc-signatures-footer">
            <div className="sig-col">
              <div className="sig-line">
                <span className="sig-printed-name">{referral.issuedByOfficer}</span>
                <span className="sig-role-title">{referral.officerRole}</span>
                <span className="sig-license tabular-nums">{referral.officerLicense}</span>
              </div>
              <span className="sig-caption">ISSUING GUIDANCE OFFICER (SIGNATURE &amp; SEAL)</span>
            </div>

            <div className="sig-col middle-seal">
              <div className="institutional-emboss-seal">
                <ShieldCheck size={28} className="text-navy-900" />
                <span>SCMBT GUIDANCE SEAL</span>
                <span className="seal-verified">OFFICIAL RECORD</span>
              </div>
            </div>

            <div className="sig-col">
              <div className="sig-line candidate-line">
                <span className="sig-candidate-name">{referral.applicantName}</span>
                <span className="sig-candidate-date">Date Signed: _______________</span>
              </div>
              <span className="sig-caption">APPLICANT ACKNOWLEDGEMENT &amp; SIGNATURE</span>
            </div>
          </footer>

          {/* Document Footer Control Note */}
          <div className="doc-legal-footer">
            <span>
              This is a standardized SCMBT institutional document governed under Republic Act 10029 (Psychology Act of the Philippines).
              Tampering or presentation of unauthorized copies will invalidate admission eligibility.
            </span>
          </div>
        </div>
      </div>

      {/* Reviewer Bottom Action Bar (Non-printable) */}
      <div className="reviewer-nav-bar no-print">
        <div className="nav-info">
          <span className="nav-step-badge">Gate 3 Deliverable</span>
          <span className="nav-step-text">
            Applicant Guidance Referral Slip generated. Once the applicant visits the Guidance Office, the Registered Psychometrician encodes the result in Gate 4.
          </span>
        </div>

        <button
          type="button"
          className="btn-jump-gate"
          onClick={onProceedToAptitudeResults}
        >
          <span>Preview Guidance Office: RPM Aptitude Results (Gate 4)</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
