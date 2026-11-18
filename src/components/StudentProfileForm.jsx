import React, { useState } from 'react';
import { 
  AlertCircle,
  Camera,
  ChevronRight, 
  ChevronLeft, 
  Save, 
  CheckCircle2,
  UploadCloud,
  FileCheck2,
  User,
  Users,
  MapPin,
  GraduationCap,
  ShieldCheck,
  Plus,
  Trash2
} from 'lucide-react';
import './StudentProfileForm.css';

const DEFAULT_ACCOMPLISHED_DATE = '2024-08-15';

export default function StudentProfileForm({ currentStep = 1, onStepChange, onSaveSuccess }) {
  // Smart Address Auto-fill Flags
  const [samePermanent, setSamePermanent] = useState(true);
  const [sameGuardian, setSameGuardian] = useState(true);

  // Dynamic Education Blocks
  const [showTertiary, setShowTertiary] = useState(false);
  const [showVocational, setShowVocational] = useState(false);

  // Photo Preview State
  const [photoPreview, setPhotoPreview] = useState(null);

  // Comprehensive Form State with 100% of User Requested Fields
  const [formData, setFormData] = useState({
    // ==========================================
    // 1. PERSONAL INFORMATION - STUDENT DETAILS
    // ==========================================
    surname: 'Dela Cruz',
    firstName: 'Juan',
    middleName: 'Santos',
    nameExtension: 'N/A',
    age: '19',
    mobileNumber: '0917-123-4567',
    altMobileNumber: '0928-765-4321',
    dob: '2005-06-15',
    pob: 'Quezon City',
    gender: 'Male',
    email: 'juan.delacruz@student.edu.ph',
    languagesSpoken: 'Filipino, English',
    motherTongue: 'Tagalog',
    maritalStatus: 'Single',
    religion: 'Roman Catholic',
    citizenship: 'Filipino',
    ethnicity: 'Tagalog',
    spouseFullName: '',
    spouseMarriageCertName: '',
    hadPsychConsultation: 'no', // 'yes' | 'no'
    isSpecialNeeds: false,
    isAthleticBackground: true,
    isExistingScmbtStudent: false,

    // ==========================================
    // 1. PERSONAL INFORMATION - FATHER'S DETAILS
    // ==========================================
    fatherFullName: 'Jose Santos Dela Cruz',
    fatherMobile: '0918-234-5678',
    fatherEmail: 'jose.delacruz@gmail.com',
    fatherOccupation: 'Electrical Technician',
    fatherGrossIncome: '₱15,000–₱30,000',
    fatherEducation: 'College Graduate',
    fatherLivingWith: true,

    // ==========================================
    // 1. PERSONAL INFORMATION - MOTHER'S DETAILS
    // ==========================================
    motherMaidenName: 'Maria Reyes Santos',
    motherMobile: '0919-876-5432',
    motherEmail: 'maria.santos@gmail.com',
    motherOccupation: 'Public School Teacher',
    motherGrossIncome: '₱15,000–₱30,000',
    motherEducation: 'College Graduate',
    motherLivingWith: true,

    // ==========================================
    // 1. PERSONAL INFORMATION - GUARDIAN'S DETAILS
    // ==========================================
    guardianMaidenName: 'Jose Santos Dela Cruz',
    guardianMobile: '0918-234-5678',
    guardianEmail: 'jose.delacruz@gmail.com',
    guardianRelationship: 'Father',

    // ==========================================
    // 2. ADDRESS INFORMATION
    // ==========================================
    // Current Address
    currentAddress: 'Lot 14 Blk 2, Acacia St., Villa Heights, Brgy. Commonwealth',
    currentCountry: 'Philippines',
    currentState: 'Metro Manila',
    currentCity: 'Quezon City',
    currentZip: '1121',

    // Permanent Address
    permAddress: 'Lot 14 Blk 2, Acacia St., Villa Heights, Brgy. Commonwealth',
    permCountry: 'Philippines',
    permState: 'Metro Manila',
    permCity: 'Quezon City',
    permZip: '1121',

    // Guardian's Address
    guardianAddress: 'Lot 14 Blk 2, Acacia St., Villa Heights, Brgy. Commonwealth',
    guardianCountry: 'Philippines',
    guardianState: 'Metro Manila',
    guardianCity: 'Quezon City',
    guardianZip: '1121',

    // ==========================================
    // 3. EDUCATIONAL BACKGROUND
    // ==========================================
    // Primary
    primarySchoolName: 'Commonwealth Elementary School',
    primarySchoolType: 'Public',
    primaryYearCompleted: '2017',
    primaryCountry: 'Philippines',
    primaryState: 'Metro Manila',
    primaryCity: 'Quezon City',

    // Secondary
    secondarySchoolName: 'Quezon City High School',
    secondarySchoolType: 'Public',
    secondaryProgramStudied: 'Academic Track - STEM',
    secondaryYearCompleted: '2023',
    secondaryCountry: 'Philippines',
    secondaryState: 'Metro Manila',
    secondaryCity: 'Quezon City',

    // Tertiary (If Applicable)
    tertiarySchoolName: '',
    tertiarySchoolType: 'Public',
    tertiaryAcademicLevel: 'Undergraduate',
    tertiaryProgramStudied: '',
    tertiaryYearCompleted: '',
    tertiaryCountry: 'Philippines',
    tertiaryState: '',
    tertiaryCity: '',

    // Vocational (If Applicable)
    vocationalSchoolName: '',
    vocationalSchoolType: 'Public',
    vocationalAcademicLevel: 'TESDA NC II',
    vocationalProgramStudied: '',
    vocationalYearCompleted: '',
    vocationalCountry: 'Philippines',
    vocationalState: '',
    vocationalCity: '',

    // ==========================================
    // 4. DOCUMENTS REPOSITORY
    // ==========================================
    docForm9: 'SF9_Report_Card_Final.pdf',
    docForm10: 'SF10_Transcript_Form137.pdf',
    docGoodMoral: 'Certificate_Good_Moral_Character.pdf',
    docBirthCert: 'PSA_Birth_Certificate_Certified.pdf',
    docIdPhoto: '1x1_Cadet_White_Background.jpg',
    docTorTransferee: '',
    docHonorableDismissal: '',
    docMedicalCert: 'DOH_Accredited_Maritime_Medical.pdf',

    // ==========================================
    // 5. LEGAL OATH & SIGNATURE
    // ==========================================
    declarationAgree: true,
    signatureName: 'JUAN SANTOS DELA CRUZ',
    dateAccomplished: DEFAULT_ACCOMPLISHED_DATE,
  });

  const stepsList = [
    { num: 1, label: '1. Personal Details', icon: User },
    { num: 2, label: '2. Family Background', icon: Users },
    { num: 3, label: '3. Address Information', icon: MapPin },
    { num: 4, label: '4. Education History', icon: GraduationCap },
    { num: 5, label: '5. Documents & Oath', icon: ShieldCheck },
  ];

  const completedSteps = [1, 2, 3, 4];
  const progressPercent = Math.round((completedSteps.length / stepsList.length) * 100);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Smart Auto-copy toggles
  const handleToggleSamePermanent = (checked) => {
    setSamePermanent(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permAddress: prev.currentAddress,
        permCountry: prev.currentCountry,
        permState: prev.currentState,
        permCity: prev.currentCity,
        permZip: prev.currentZip,
      }));
    }
  };

  const handleToggleSameGuardian = (checked) => {
    setSameGuardian(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        guardianAddress: prev.currentAddress,
        guardianCountry: prev.currentCountry,
        guardianState: prev.currentState,
        guardianCity: prev.currentCity,
        guardianZip: prev.currentZip,
      }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, docIdPhoto: file.name }));
    }
  };

  const handleDocumentSimulateUpload = (field, defaultName) => {
    const fileName = prompt('Simulate uploading document (enter file name or accept default):', defaultName);
    if (fileName) {
      handleChange(field, fileName);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.declarationAgree) {
      alert('Please confirm the accuracy declaration oath before submitting.');
      return;
    }
    alert('✓ Student Profile Document Successfully Verified & Saved to Registry!');
    if (onSaveSuccess) onSaveSuccess(formData);
  };

  return (
    <div className="bond-paper-canvas">
      
      {/* THE PHYSICAL BOND PAPER SHEET */}
      <article className="bond-paper-sheet" aria-label="Official Student Profile Form">
        
        {/* MOBILE VIEW ONLY: Progress Bar & Section Tabs (Visible < 900px) */}
        <div className="mobile-profile-progress">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#042b4e' }}>
              Progress: <strong style={{ color: '#f98809' }}>{progressPercent}%</strong>
            </span>
            <span style={{ fontSize: 10, color: '#64748b' }}>
              {completedSteps.length} of {stepsList.length} sections done
            </span>
          </div>

          <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${progressPercent}%`, 
                height: '100%', 
                background: '#f98809', 
                borderRadius: 9999,
                transition: 'width 0.3s ease'
              }} 
            />
          </div>

          <div className="mobile-tabs-scroll">
            {stepsList.map((s) => {
              const isActive = currentStep === s.num;
              const isDone = completedSteps.includes(s.num);
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => onStepChange(s.num)}
                  className={`mobile-tab-pill ${isActive ? 'active' : isDone ? 'completed' : ''}`}
                >
                  {isDone && <CheckCircle2 size={12} strokeWidth={2.4} />}
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* =========================================================================
              STEP 1: STUDENT PERSONAL DETAILS
              ========================================================================= */}
          {currentStep === 1 && (
            <section className="profile-section-card">
              <div className="profile-step-banner">
                <h2>1. Student Personal Information</h2>
                <span className="profile-step-badge">Section 1 of 5</span>
              </div>

              {/* Existing Student Highlight Box */}
              <div className="institutional-highlight-box">
                <input
                  id="chk-existing-student"
                  type="checkbox"
                  checked={formData.isExistingScmbtStudent}
                  onChange={(e) => handleChange('isExistingScmbtStudent', e.target.checked)}
                  style={{ accentColor: '#f98809', width: 16, height: 16 }}
                />
                <label htmlFor="chk-existing-student">
                  Are you an Existing Student of Southwestern College of Maritime, Business &amp; Technology Inc.?
                </label>
              </div>

              {/* Student Name: Surname, First Name */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Surname *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.surname} 
                    onChange={(e) => handleChange('surname', e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.firstName} 
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* Middle Name + Extension */}
              <div className="form-grid-uneven-2-1">
                <div className="form-group">
                  <label className="form-label">Middle Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.middleName} 
                    onChange={(e) => handleChange('middleName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Name Extension</label>
                  <select 
                    className="form-select"
                    value={formData.nameExtension}
                    onChange={(e) => handleChange('nameExtension', e.target.value)}
                  >
                    <option value="N/A">N/A</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                </div>
              </div>

              {/* Demographics: Date of Birth, Age, Place of Birth, Gender */}
              <div className="form-grid-4">
                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={formData.dob} 
                      onChange={(e) => handleChange('dob', e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                    value={formData.age} 
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="e.g. 19"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Place of Birth *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.pob} 
                    onChange={(e) => handleChange('pob', e.target.value)}
                    placeholder="City / Municipality"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select 
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Contacts: Mobile, Alt Mobile, Email */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={formData.mobileNumber} 
                    onChange={(e) => handleChange('mobileNumber', e.target.value)} 
                    placeholder="0917-123-4567"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Alternate Mobile Number</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={formData.altMobileNumber} 
                    onChange={(e) => handleChange('altMobileNumber', e.target.value)} 
                    placeholder="Optional secondary contact"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={formData.email} 
                    onChange={(e) => handleChange('email', e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {/* Language Spoken, Mother Tongue, Marital Status, Religion */}
              <div className="form-grid-4">
                <div className="form-group">
                  <label className="form-label">Language Spoken</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.languagesSpoken} 
                    onChange={(e) => handleChange('languagesSpoken', e.target.value)} 
                    placeholder="e.g. Filipino, English"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mother Tongue</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.motherTongue} 
                    onChange={(e) => handleChange('motherTongue', e.target.value)} 
                    placeholder="e.g. Tagalog, Cebuano"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Marital Status</label>
                  <select 
                    className="form-select"
                    value={formData.maritalStatus}
                    onChange={(e) => handleChange('maritalStatus', e.target.value)}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Religion</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.religion} 
                    onChange={(e) => handleChange('religion', e.target.value)} 
                    placeholder="e.g. Roman Catholic"
                  />
                </div>
              </div>

              {/* Citizenship & Ethnicity */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Citizenship</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.citizenship} 
                    onChange={(e) => handleChange('citizenship', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ethnicity</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.ethnicity} 
                    onChange={(e) => handleChange('ethnicity', e.target.value)} 
                    placeholder="e.g. Tagalog, Ilocano, Bisaya"
                  />
                </div>
              </div>

              {/* Conditional Spouse Details (if Married) */}
              {formData.maritalStatus === 'Married' && (
                <div className="profile-block-card">
                  <div className="profile-block-header">
                    <span className="profile-block-title">Spouse Information &amp; Marriage Document</span>
                    <span className="profile-block-tag">Required for Married Students</span>
                  </div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Spouse’s Full Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.spouseFullName} 
                        onChange={(e) => handleChange('spouseFullName', e.target.value)} 
                        placeholder="Full name of spouse"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Marriage Certificate</label>
                      <button
                        type="button"
                        className="btn-doc-upload"
                        onClick={() => handleDocumentSimulateUpload('spouseMarriageCertName', 'PSA_Marriage_Certificate.pdf')}
                      >
                        <UploadCloud size={13} />
                        <span>{formData.spouseMarriageCertName || 'Upload Certificate (PDF / Image)'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Health, Developmental Consultation & Athletics Background Block */}
              <div className="profile-block-card">
                <div className="profile-block-header">
                  <span className="profile-block-title">Health, Special Needs &amp; Athletic Profile</span>
                  <span className="profile-block-tag">Institutional Guidance</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>
                      Has your child previously had a consultation with a Developmental Pediatrician/Psychologist or the like?
                    </span>
                    <div className="radio-pill-group">
                      <button
                        type="button"
                        className={`radio-pill-btn ${formData.hadPsychConsultation === 'yes' ? 'active' : ''}`}
                        onClick={() => handleChange('hadPsychConsultation', 'yes')}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`radio-pill-btn ${formData.hadPsychConsultation === 'no' ? 'active' : ''}`}
                        onClick={() => handleChange('hadPsychConsultation', 'no')}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ borderTop: '1px solid #edf2f7', paddingTop: 8 }}>
                    <label className="institutional-check-item">
                      <input 
                        type="checkbox" 
                        checked={formData.isSpecialNeeds}
                        onChange={(e) => handleChange('isSpecialNeeds', e.target.checked)}
                      />
                      <span>Are you a student with special needs?</span>
                    </label>

                    <label className="institutional-check-item">
                      <input 
                        type="checkbox" 
                        checked={formData.isAthleticBackground}
                        onChange={(e) => handleChange('isAthleticBackground', e.target.checked)}
                      />
                      <span>Are you a student with an athletic background?</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 1 Footer Controls */}
              <div className="profile-step-footer">
                <button
                  type="button"
                  className="btn-step-next"
                  onClick={() => onStepChange(2)}
                >
                  <span>Continue to Family Background</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </section>
          )}

          {/* =========================================================================
              STEP 2: FAMILY BACKGROUND
              ========================================================================= */}
          {currentStep === 2 && (
            <section className="profile-section-card">
              <div className="profile-step-banner">
                <h2>2. Family Background</h2>
                <span className="profile-step-badge">Section 2 of 5</span>
              </div>

              {/* Father's Details Card */}
              <div className="profile-block-card">
                <div className="profile-block-header">
                  <span className="profile-block-title">Father’s Details</span>
                  <label className="institutional-check-item" style={{ padding: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={formData.fatherLivingWith}
                      onChange={(e) => handleChange('fatherLivingWith', e.target.checked)}
                    />
                    <span style={{ fontSize: 11.5 }}>Living with this family member</span>
                  </label>
                </div>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Father’s Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.fatherFullName} 
                      onChange={(e) => handleChange('fatherFullName', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Father’s Mobile Number *</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={formData.fatherMobile} 
                      onChange={(e) => handleChange('fatherMobile', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Father’s Email Address (Optional)</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={formData.fatherEmail} 
                      onChange={(e) => handleChange('fatherEmail', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Father’s Occupation</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.fatherOccupation} 
                      onChange={(e) => handleChange('fatherOccupation', e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gross Monthly Income</label>
                    <select 
                      className="form-select"
                      value={formData.fatherGrossIncome}
                      onChange={(e) => handleChange('fatherGrossIncome', e.target.value)}
                    >
                      <option value="Below ₱15,000">Below ₱15,000</option>
                      <option value="₱15,000–₱30,000">₱15,000–₱30,000</option>
                      <option value="₱30,001–₱50,000">₱30,001–₱50,000</option>
                      <option value="Above ₱50,000">Above ₱50,000</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Highest Educational Attainment</label>
                    <select 
                      className="form-select"
                      value={formData.fatherEducation}
                      onChange={(e) => handleChange('fatherEducation', e.target.value)}
                    >
                      <option value="Elementary Graduate">Elementary Graduate</option>
                      <option value="High School Graduate">High School Graduate</option>
                      <option value="Vocational / Tech-Voc">Vocational / Tech-Voc</option>
                      <option value="College Undergraduate">College Undergraduate</option>
                      <option value="College Graduate">College Graduate</option>
                      <option value="Post-Graduate / Masteral">Post-Graduate / Masteral</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mother's Details Card */}
              <div className="profile-block-card">
                <div className="profile-block-header">
                  <span className="profile-block-title">Mother’s Details</span>
                  <label className="institutional-check-item" style={{ padding: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={formData.motherLivingWith}
                      onChange={(e) => handleChange('motherLivingWith', e.target.checked)}
                    />
                    <span style={{ fontSize: 11.5 }}>Living with this family member</span>
                  </label>
                </div>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Mother’s Maiden Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.motherMaidenName} 
                      onChange={(e) => handleChange('motherMaidenName', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mother’s Mobile Number *</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={formData.motherMobile} 
                      onChange={(e) => handleChange('motherMobile', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mother’s Email Address (Optional)</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={formData.motherEmail} 
                      onChange={(e) => handleChange('motherEmail', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Mother’s Occupation</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.motherOccupation} 
                      onChange={(e) => handleChange('motherOccupation', e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gross Monthly Income</label>
                    <select 
                      className="form-select"
                      value={formData.motherGrossIncome}
                      onChange={(e) => handleChange('motherGrossIncome', e.target.value)}
                    >
                      <option value="Below ₱15,000">Below ₱15,000</option>
                      <option value="₱15,000–₱30,000">₱15,000–₱30,000</option>
                      <option value="₱30,001–₱50,000">₱30,001–₱50,000</option>
                      <option value="Above ₱50,000">Above ₱50,000</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Highest Educational Attainment</label>
                    <select 
                      className="form-select"
                      value={formData.motherEducation}
                      onChange={(e) => handleChange('motherEducation', e.target.value)}
                    >
                      <option value="Elementary Graduate">Elementary Graduate</option>
                      <option value="High School Graduate">High School Graduate</option>
                      <option value="Vocational / Tech-Voc">Vocational / Tech-Voc</option>
                      <option value="College Undergraduate">College Undergraduate</option>
                      <option value="College Graduate">College Graduate</option>
                      <option value="Post-Graduate / Masteral">Post-Graduate / Masteral</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Guardian's Details Card */}
              <div className="profile-block-card">
                <div className="profile-block-header">
                  <span className="profile-block-title">Guardian’s Details (Emergency Contact)</span>
                  <span className="profile-block-tag">Authorized Representative</span>
                </div>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Guardian’s Maiden / Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.guardianMaidenName} 
                      onChange={(e) => handleChange('guardianMaidenName', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Guardian’s Mobile Number *</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={formData.guardianMobile} 
                      onChange={(e) => handleChange('guardianMobile', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Guardian’s Email Address (Optional)</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={formData.guardianEmail} 
                      onChange={(e) => handleChange('guardianEmail', e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 Footer Controls */}
              <div className="profile-step-footer">
                <button
                  type="button"
                  className="btn-step-prev"
                  onClick={() => onStepChange(1)}
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  className="btn-step-next"
                  onClick={() => onStepChange(3)}
                >
                  <span>Continue to Address Information</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </section>
          )}

          {/* =========================================================================
              STEP 3: ADDRESS INFORMATION
              ========================================================================= */}
          {currentStep === 3 && (
            <section className="profile-section-card">
              <div className="profile-step-banner">
                <h2>3. Address Information</h2>
                <span className="profile-step-badge">Section 3 of 5</span>
              </div>

              {/* 1. Current Address Card */}
              <div className="profile-block-card">
                <div className="profile-block-header">
                  <span className="profile-block-title">Current Address</span>
                  <span className="profile-block-tag">Present Residence</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Street / House No. / Building / Barangay *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.currentAddress} 
                    onChange={(e) => {
                      handleChange('currentAddress', e.target.value);
                      if (samePermanent) handleChange('permAddress', e.target.value);
                      if (sameGuardian) handleChange('guardianAddress', e.target.value);
                    }} 
                    required 
                  />
                </div>
                <div className="form-grid-4">
                  <div className="form-group">
                    <label className="form-label">Current Country *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.currentCountry} 
                      onChange={(e) => handleChange('currentCountry', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State / Province *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.currentState} 
                      onChange={(e) => handleChange('currentState', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City / Municipality *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.currentCity} 
                      onChange={(e) => handleChange('currentCity', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Zip Code / Postal Code *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                      value={formData.currentZip} 
                      onChange={(e) => handleChange('currentZip', e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* 2. Permanent Address Card with Auto-Copy */}
              <div className="profile-block-card">
                <div className="profile-block-header">
                  <span className="profile-block-title">Permanent Address</span>
                  <span className="profile-block-tag">Domicile of Origin</span>
                </div>

                <div className="smart-copy-bar">
                  <label className="smart-copy-label">
                    <input 
                      type="checkbox" 
                      checked={samePermanent}
                      onChange={(e) => handleToggleSamePermanent(e.target.checked)}
                      style={{ accentColor: '#f98809', width: 14, height: 14 }}
                    />
                    <span>Permanent Address is identical to Current Address</span>
                  </label>
                  <span className="smart-copy-hint">Synchronized with Current</span>
                </div>

                {!samePermanent && (
                  <>
                    <div className="form-group" style={{ marginTop: 8 }}>
                      <label className="form-label">Address *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.permAddress} 
                        onChange={(e) => handleChange('permAddress', e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-grid-4">
                      <div className="form-group">
                        <label className="form-label">Country *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.permCountry} 
                          onChange={(e) => handleChange('permCountry', e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State / Province *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.permState} 
                          onChange={(e) => handleChange('permState', e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.permCity} 
                          onChange={(e) => handleChange('permCity', e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Zip Code / Postal Code *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.permZip} 
                          onChange={(e) => handleChange('permZip', e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 3. Guardian’s Address Card with Auto-Copy */}
              <div className="profile-block-card">
                <div className="profile-block-header">
                  <span className="profile-block-title">Guardian’s Address</span>
                  <span className="profile-block-tag">Emergency Dispatch</span>
                </div>

                <div className="smart-copy-bar">
                  <label className="smart-copy-label">
                    <input 
                      type="checkbox" 
                      checked={sameGuardian}
                      onChange={(e) => handleToggleSameGuardian(e.target.checked)}
                      style={{ accentColor: '#f98809', width: 14, height: 14 }}
                    />
                    <span>Guardian’s Address is identical to Current Address</span>
                  </label>
                  <span className="smart-copy-hint">Synchronized with Current</span>
                </div>

                {!sameGuardian && (
                  <>
                    <div className="form-group" style={{ marginTop: 8 }}>
                      <label className="form-label">Address *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.guardianAddress} 
                        onChange={(e) => handleChange('guardianAddress', e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-grid-4">
                      <div className="form-group">
                        <label className="form-label">Country *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.guardianCountry} 
                          onChange={(e) => handleChange('guardianCountry', e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State / Province *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.guardianState} 
                          onChange={(e) => handleChange('guardianState', e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.guardianCity} 
                          onChange={(e) => handleChange('guardianCity', e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Zip Code / Postal Code *</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.guardianZip} 
                          onChange={(e) => handleChange('guardianZip', e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Step 3 Footer Controls */}
              <div className="profile-step-footer">
                <button
                  type="button"
                  className="btn-step-prev"
                  onClick={() => onStepChange(2)}
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  className="btn-step-next"
                  onClick={() => onStepChange(4)}
                >
                  <span>Continue to Educational Background</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </section>
          )}

          {/* =========================================================================
              STEP 4: EDUCATIONAL BACKGROUND
              ========================================================================= */}
          {currentStep === 4 && (
            <section className="profile-section-card">
              <div className="profile-step-banner">
                <h2>4. Educational Background</h2>
                <span className="profile-step-badge">Section 4 of 5</span>
              </div>

              {/* Primary Education */}
              <div className="profile-block-card">
                <div className="profile-block-header">
                  <span className="profile-block-title">Primary Education (Elementary)</span>
                  <span className="profile-block-tag">Required</span>
                </div>
                <div className="form-grid-uneven-2-1">
                  <div className="form-group">
                    <label className="form-label">School Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.primarySchoolName} 
                      onChange={(e) => handleChange('primarySchoolName', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">School Type *</label>
                    <select 
                      className="form-select"
                      value={formData.primarySchoolType}
                      onChange={(e) => handleChange('primarySchoolType', e.target.value)}
                    >
                      <option value="Public">Public School</option>
                      <option value="Private">Private School</option>
                    </select>
                  </div>
                </div>
                <div className="form-grid-4">
                  <div className="form-group">
                    <label className="form-label">Year Completed *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                      value={formData.primaryYearCompleted} 
                      onChange={(e) => handleChange('primaryYearCompleted', e.target.value)} 
                      placeholder="e.g. 2017"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.primaryCountry} 
                      onChange={(e) => handleChange('primaryCountry', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State / Province *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.primaryState} 
                      onChange={(e) => handleChange('primaryState', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.primaryCity} 
                      onChange={(e) => handleChange('primaryCity', e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Education */}
              <div className="profile-block-card">
                <div className="profile-block-header">
                  <span className="profile-block-title">Secondary Education (Junior / Senior High)</span>
                  <span className="profile-block-tag">Required</span>
                </div>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">School Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.secondarySchoolName} 
                      onChange={(e) => handleChange('secondarySchoolName', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">School Type *</label>
                    <select 
                      className="form-select"
                      value={formData.secondarySchoolType}
                      onChange={(e) => handleChange('secondarySchoolType', e.target.value)}
                    >
                      <option value="Public">Public School</option>
                      <option value="Private">Private School</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Program / Course Studied *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.secondaryProgramStudied} 
                      onChange={(e) => handleChange('secondaryProgramStudied', e.target.value)} 
                      placeholder="e.g. STEM, TVL, GAS"
                      required 
                    />
                  </div>
                </div>
                <div className="form-grid-4">
                  <div className="form-group">
                    <label className="form-label">Year Completed *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                      value={formData.secondaryYearCompleted} 
                      onChange={(e) => handleChange('secondaryYearCompleted', e.target.value)} 
                      placeholder="e.g. 2023"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.secondaryCountry} 
                      onChange={(e) => handleChange('secondaryCountry', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State / Province *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.secondaryState} 
                      onChange={(e) => handleChange('secondaryState', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.secondaryCity} 
                      onChange={(e) => handleChange('secondaryCity', e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Tertiary Education (If Applicable) */}
              <div className="profile-block-card">
                <div className="profile-block-header">
                  <span className="profile-block-title">Tertiary Education (College / University)</span>
                  <button
                    type="button"
                    className="btn-doc-upload"
                    onClick={() => setShowTertiary(!showTertiary)}
                  >
                    {showTertiary ? <Trash2 size={12} color="#dc2626" /> : <Plus size={12} />}
                    <span>{showTertiary ? 'Remove Tertiary' : 'Add Tertiary (If Transferee / Graduate)'}</span>
                  </button>
                </div>

                {showTertiary ? (
                  <>
                    <div className="form-grid-4">
                      <div className="form-group">
                        <label className="form-label">School Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.tertiarySchoolName} 
                          onChange={(e) => handleChange('tertiarySchoolName', e.target.value)} 
                          placeholder="College / University"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">School Type</label>
                        <select 
                          className="form-select"
                          value={formData.tertiarySchoolType}
                          onChange={(e) => handleChange('tertiarySchoolType', e.target.value)}
                        >
                          <option value="Public">State University / SUC</option>
                          <option value="Private">Private Institution</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Academic Level</label>
                        <select 
                          className="form-select"
                          value={formData.tertiaryAcademicLevel}
                          onChange={(e) => handleChange('tertiaryAcademicLevel', e.target.value)}
                        >
                          <option value="Undergraduate">Undergraduate / College</option>
                          <option value="Associate">Associate Degree</option>
                          <option value="Post-Graduate">Post-Graduate / Masteral</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Program / Course Studied</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.tertiaryProgramStudied} 
                          onChange={(e) => handleChange('tertiaryProgramStudied', e.target.value)} 
                          placeholder="e.g. BSMT, BSMarE, BSCS"
                        />
                      </div>
                    </div>
                    <div className="form-grid-4">
                      <div className="form-group">
                        <label className="form-label">Year Completed</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.tertiaryYearCompleted} 
                          onChange={(e) => handleChange('tertiaryYearCompleted', e.target.value)} 
                          placeholder="e.g. 2024"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.tertiaryCountry} 
                          onChange={(e) => handleChange('tertiaryCountry', e.target.value)} 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State / Province</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.tertiaryState} 
                          onChange={(e) => handleChange('tertiaryState', e.target.value)} 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.tertiaryCity} 
                          onChange={(e) => handleChange('tertiaryCity', e.target.value)} 
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <p style={{ margin: '4px 0 0', fontSize: 11.5, color: '#64748b' }}>
                    Click "+ Add Tertiary" above if you have prior collegiate coursework or are applying as a college transferee.
                  </p>
                )}
              </div>

              {/* Vocational Education (If Applicable) */}
              <div className="profile-block-card">
                <div className="profile-block-header">
                  <span className="profile-block-title">Vocational (TESDA / Tech-Voc)</span>
                  <button
                    type="button"
                    className="btn-doc-upload"
                    onClick={() => setShowVocational(!showVocational)}
                  >
                    {showVocational ? <Trash2 size={12} color="#dc2626" /> : <Plus size={12} />}
                    <span>{showVocational ? 'Remove Vocational' : 'Add Vocational (If Applicable)'}</span>
                  </button>
                </div>

                {showVocational ? (
                  <>
                    <div className="form-grid-4">
                      <div className="form-group">
                        <label className="form-label">School Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.vocationalSchoolName} 
                          onChange={(e) => handleChange('vocationalSchoolName', e.target.value)} 
                          placeholder="Training Institute"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">School Type</label>
                        <select 
                          className="form-select"
                          value={formData.vocationalSchoolType}
                          onChange={(e) => handleChange('vocationalSchoolType', e.target.value)}
                        >
                          <option value="Public">Public / TESDA Center</option>
                          <option value="Private">Private Training Center</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Academic Level</label>
                        <select 
                          className="form-select"
                          value={formData.vocationalAcademicLevel}
                          onChange={(e) => handleChange('vocationalAcademicLevel', e.target.value)}
                        >
                          <option value="TESDA NC I">TESDA NC I</option>
                          <option value="TESDA NC II">TESDA NC II</option>
                          <option value="TESDA NC III">TESDA NC III</option>
                          <option value="TESDA Diploma">TESDA Diploma</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Program / Course Studied</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.vocationalProgramStudied} 
                          onChange={(e) => handleChange('vocationalProgramStudied', e.target.value)} 
                          placeholder="e.g. Maritime Deck Rating"
                        />
                      </div>
                    </div>
                    <div className="form-grid-4">
                      <div className="form-group">
                        <label className="form-label">Year Completed</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.vocationalYearCompleted} 
                          onChange={(e) => handleChange('vocationalYearCompleted', e.target.value)} 
                          placeholder="e.g. 2023"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.vocationalCountry} 
                          onChange={(e) => handleChange('vocationalCountry', e.target.value)} 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State / Province</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.vocationalState} 
                          onChange={(e) => handleChange('vocationalState', e.target.value)} 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.vocationalCity} 
                          onChange={(e) => handleChange('vocationalCity', e.target.value)} 
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <p style={{ margin: '4px 0 0', fontSize: 11.5, color: '#64748b' }}>
                    Click "+ Add Vocational" if you completed technical-vocational or TESDA national certifications.
                  </p>
                )}
              </div>

              {/* Step 4 Footer Controls */}
              <div className="profile-step-footer">
                <button
                  type="button"
                  className="btn-step-prev"
                  onClick={() => onStepChange(3)}
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  className="btn-step-next"
                  onClick={() => onStepChange(5)}
                >
                  <span>Continue to Required Documents</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </section>
          )}

          {/* =========================================================================
              STEP 5: OFFICIAL DOCUMENTS & LEGAL OATH
              ========================================================================= */}
          {currentStep === 5 && (
            <section className="profile-section-card">
              <div className="profile-step-banner">
                <h2>5. Official Documents &amp; Legal Oath</h2>
                <span className="profile-step-badge">Section 5 of 5</span>
              </div>

              {/* 8 Required Philippine Academic Documents */}
              <div className="doc-uploads-grid">
                
                {/* 1. High School Card (SF9) */}
                <div className="doc-upload-card">
                  <div className="doc-info-block">
                    <div className="doc-title-row">
                      <span className="doc-title">High School Card (SF 9)</span>
                      <span className="doc-badge-optional">Secondary</span>
                    </div>
                    <span className={`doc-status-text ${formData.docForm9 ? '' : 'empty'}`}>
                      {formData.docForm9 ? <><FileCheck2 size={12} /><span>{formData.docForm9}</span></> : 'No document uploaded'}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className={`btn-doc-upload ${formData.docForm9 ? 'uploaded' : ''}`}
                    onClick={() => handleDocumentSimulateUpload('docForm9', 'School_Form_9_Report_Card.pdf')}
                  >
                    <UploadCloud size={13} />
                    <span>{formData.docForm9 ? 'Replace' : 'Upload'}</span>
                  </button>
                </div>

                {/* 2. Form 137 (SF10) */}
                <div className="doc-upload-card">
                  <div className="doc-info-block">
                    <div className="doc-title-row">
                      <span className="doc-title">Form 137 (SF 10)</span>
                      <span className="doc-badge-optional">Permanent Record</span>
                    </div>
                    <span className={`doc-status-text ${formData.docForm10 ? '' : 'empty'}`}>
                      {formData.docForm10 ? <><FileCheck2 size={12} /><span>{formData.docForm10}</span></> : 'No document uploaded'}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className={`btn-doc-upload ${formData.docForm10 ? 'uploaded' : ''}`}
                    onClick={() => handleDocumentSimulateUpload('docForm10', 'School_Form_10_Form137.pdf')}
                  >
                    <UploadCloud size={13} />
                    <span>{formData.docForm10 ? 'Replace' : 'Upload'}</span>
                  </button>
                </div>

                {/* 3. Good Moral Certificate */}
                <div className="doc-upload-card">
                  <div className="doc-info-block">
                    <div className="doc-title-row">
                      <span className="doc-title">Good Moral Certificate</span>
                      <span className="doc-badge-optional">Discipline</span>
                    </div>
                    <span className={`doc-status-text ${formData.docGoodMoral ? '' : 'empty'}`}>
                      {formData.docGoodMoral ? <><FileCheck2 size={12} /><span>{formData.docGoodMoral}</span></> : 'No document uploaded'}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className={`btn-doc-upload ${formData.docGoodMoral ? 'uploaded' : ''}`}
                    onClick={() => handleDocumentSimulateUpload('docGoodMoral', 'Good_Moral_Certificate.pdf')}
                  >
                    <UploadCloud size={13} />
                    <span>{formData.docGoodMoral ? 'Replace' : 'Upload'}</span>
                  </button>
                </div>

                {/* 4. Original Birth Certificate (Required) */}
                <div className="doc-upload-card required">
                  <div className="doc-info-block">
                    <div className="doc-title-row">
                      <span className="doc-title">Original Birth Certificate</span>
                      <span className="doc-badge-required">Required (PSA)</span>
                    </div>
                    <span className={`doc-status-text ${formData.docBirthCert ? '' : 'empty'}`}>
                      {formData.docBirthCert ? <><FileCheck2 size={12} /><span>{formData.docBirthCert}</span></> : 'Pending mandatory upload'}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className={`btn-doc-upload ${formData.docBirthCert ? 'uploaded' : ''}`}
                    onClick={() => handleDocumentSimulateUpload('docBirthCert', 'PSA_Birth_Certificate.pdf')}
                  >
                    <UploadCloud size={13} />
                    <span>{formData.docBirthCert ? 'Replace' : 'Upload'}</span>
                  </button>
                </div>

                {/* 5. ID Picture (1x1) (Required) */}
                <div className="doc-upload-card required">
                  {photoPreview && (
                    <img 
                      src={photoPreview} 
                      alt="Thumbnail" 
                      style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: 6, border: '1px solid #cbd5e1', flexShrink: 0 }} 
                    />
                  )}
                  <div className="doc-info-block">
                    <div className="doc-title-row">
                      <span className="doc-title">ID Picture (1x1 or 2x2)</span>
                      <span className="doc-badge-required">Required</span>
                    </div>
                    <span className={`doc-status-text ${formData.docIdPhoto ? '' : 'empty'}`}>
                      {formData.docIdPhoto ? <><FileCheck2 size={12} /><span>{formData.docIdPhoto}</span></> : 'White background required'}
                    </span>
                  </div>
                  <label className="btn-doc-upload" style={{ cursor: 'pointer' }}>
                    <Camera size={13} />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* 6. Transferee: TOR / Certificate of Grades */}
                <div className="doc-upload-card">
                  <div className="doc-info-block">
                    <div className="doc-title-row">
                      <span className="doc-title">Transferee TOR / Grades</span>
                      <span className="doc-badge-optional">For Transferee</span>
                    </div>
                    <span className={`doc-status-text ${formData.docTorTransferee ? '' : 'empty'}`}>
                      {formData.docTorTransferee ? <><FileCheck2 size={12} /><span>{formData.docTorTransferee}</span></> : 'Optional (if Transferee)'}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className={`btn-doc-upload ${formData.docTorTransferee ? 'uploaded' : ''}`}
                    onClick={() => handleDocumentSimulateUpload('docTorTransferee', 'Official_Transcript_Of_Records.pdf')}
                  >
                    <UploadCloud size={13} />
                    <span>{formData.docTorTransferee ? 'Replace' : 'Upload'}</span>
                  </button>
                </div>

                {/* 7. Honorable Dismissal */}
                <div className="doc-upload-card">
                  <div className="doc-info-block">
                    <div className="doc-title-row">
                      <span className="doc-title">Honorable Dismissal</span>
                      <span className="doc-badge-optional">Transfer Clearance</span>
                    </div>
                    <span className={`doc-status-text ${formData.docHonorableDismissal ? '' : 'empty'}`}>
                      {formData.docHonorableDismissal ? <><FileCheck2 size={12} /><span>{formData.docHonorableDismissal}</span></> : 'Optional (if Transferee)'}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className={`btn-doc-upload ${formData.docHonorableDismissal ? 'uploaded' : ''}`}
                    onClick={() => handleDocumentSimulateUpload('docHonorableDismissal', 'Certificate_Of_Honorable_Dismissal.pdf')}
                  >
                    <UploadCloud size={13} />
                    <span>{formData.docHonorableDismissal ? 'Replace' : 'Upload'}</span>
                  </button>
                </div>

                {/* 8. Medical Certificate */}
                <div className="doc-upload-card">
                  <div className="doc-info-block">
                    <div className="doc-title-row">
                      <span className="doc-title">Medical Certificate</span>
                      <span className="doc-badge-optional">DOH / MARINA</span>
                    </div>
                    <span className={`doc-status-text ${formData.docMedicalCert ? '' : 'empty'}`}>
                      {formData.docMedicalCert ? <><FileCheck2 size={12} /><span>{formData.docMedicalCert}</span></> : 'No document uploaded'}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className={`btn-doc-upload ${formData.docMedicalCert ? 'uploaded' : ''}`}
                    onClick={() => handleDocumentSimulateUpload('docMedicalCert', 'DOH_Medical_Certificate.pdf')}
                  >
                    <UploadCloud size={13} />
                    <span>{formData.docMedicalCert ? 'Replace' : 'Upload'}</span>
                  </button>
                </div>

              </div>

              {/* Legal Notice & RA 10173 Compliance Box */}
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#042b4e' }}>
                  <AlertCircle size={15} color="#f98809" />
                  <span>Republic Act No. 10173 (Data Privacy Act of 2012) Compliance</span>
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: '#475569', lineHeight: 1.5 }}>
                  The personal and sensitive data collected on this official Student Profile will be held strictly confidential and used solely by the Southwestern College of Maritime, Business &amp; Technology Registrar and Admissions Directorate for legitimate student evaluation, registration, and academic tracking.
                </p>
              </div>

              {/* Digital Oath & Signature */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label className="institutional-check-item">
                  <input 
                    type="checkbox" 
                    checked={formData.declarationAgree}
                    onChange={(e) => handleChange('declarationAgree', e.target.checked)}
                    required
                  />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                    I declare under oath that this Student Profile has been accomplished by me personally and that the entries are true, correct, and complete.
                  </span>
                </label>

                <div className="form-grid-uneven-2-1">
                  <div className="form-group">
                    <label className="form-label">Digital Signature (Full Printed Name) *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.signatureName} 
                      onChange={(e) => handleChange('signatureName', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date Accomplished *</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                      value={formData.dateAccomplished} 
                      onChange={(e) => handleChange('dateAccomplished', e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Step 5 Footer Controls: Final Submit */}
              <div className="profile-step-footer">
                <button
                  type="button"
                  className="btn-step-prev"
                  onClick={() => onStepChange(4)}
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>
                <button
                  type="submit"
                  className="btn-step-submit"
                >
                  <Save size={14} />
                  <span>Submit &amp; Verify Profile</span>
                </button>
              </div>
            </section>
          )}

        </form>
      </article>

    </div>
  );
}
