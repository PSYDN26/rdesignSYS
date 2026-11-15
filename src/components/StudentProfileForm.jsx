import React, { useState } from 'react';
import { 
  AlertCircle,
  Camera,
  ChevronRight, 
  ChevronLeft, 
  Save, 
  CheckCircle2
} from 'lucide-react';

export default function StudentProfileForm({ currentStep = 1, onStepChange, onSaveSuccess }) {
  const [sameAsResidential, setSameAsResidential] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Form State (Clean Philippine PDS Data)
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    surname: 'Dela Cruz',
    firstName: 'Juan',
    nameExtension: 'N/A',
    middleName: 'Santos',
    dob: '2005-06-15',
    pobCity: 'Quezon City',
    pobProvince: 'Metro Manila',
    sex: 'Male',
    civilStatus: 'Single',
    citizenship: 'Filipino',
    religion: 'Roman Catholic',
    height: '172',
    weight: '64',
    bloodType: 'O+',
    mobileNumber: '0917-123-4567',
    email: 'juan.delacruz@student.edu.ph',
    landline: 'N/A',
    resHouseNo: 'Lot 14 Blk 2',
    resStreet: 'Acacia St.',
    resSubdivision: 'Villa Heights',
    resBarangay: 'Brgy. Commonwealth',
    resCity: 'Quezon City',
    resProvince: 'Metro Manila',
    resZip: '1121',
    permHouseNo: 'Lot 14 Blk 2',
    permStreet: 'Acacia St.',
    permSubdivision: 'Villa Heights',
    permBarangay: 'Brgy. Commonwealth',
    permCity: 'Quezon City',
    permProvince: 'Metro Manila',
    permZip: '1121',
    lrnNumber: '109823451290',
    philSysId: '4920-1284-9102-3910',
    tinNumber: 'N/A',

    // Step 2: Family Background
    fatherName: 'Dela Cruz, Jose Santos',
    fatherOccupation: 'Electrical Technician',
    fatherEducation: 'College Graduate',
    fatherContact: '0918-234-5678',
    fatherStatus: 'Living',
    motherMaidenName: 'Santos, Maria Reyes',
    motherOccupation: 'Public School Teacher',
    motherEducation: 'College Graduate',
    motherContact: '0919-876-5432',
    motherStatus: 'Living',
    annualIncome: 'Below ₱150,000 (4Ps / Indigent)',
    guardianName: 'Dela Cruz, Jose Santos',
    guardianRelationship: 'Father',
    guardianContact: '0918-234-5678',
    guardianAddress: 'Same as Residential Address',

    // Step 3: Educational Background
    elemSchool: 'Commonwealth Elementary School',
    elemYearGrad: '2017',
    jhsSchool: 'Quezon City High School',
    jhsYearGrad: '2021',
    shsSchool: 'National University Nazareth School',
    shsTrackStrand: 'STEM',
    shsYearGrad: '2023',
    shsGwa: '94.50',
    academicHonors: 'With High Honors',

    // Step 4: Program & Enrollment
    heiName: 'Polytechnic University of the Philippines',
    heiCampus: 'Sta. Mesa, Manila',
    degreeProgram: 'Bachelor of Science in Computer Science',
    major: 'Software Engineering',
    yearLevel: '1st Year',

    // Step 5: Verification
    declarationAgree: true,
    signatureName: 'JUAN SANTOS DELA CRUZ',
    dateAccomplished: new Date().toISOString().split('T')[0],
  });

  const stepsList = [
    { num: 1, label: '1. Personal' },
    { num: 2, label: '2. Family' },
    { num: 3, label: '3. Education' },
    { num: 4, label: '4. Program' },
    { num: 5, label: '5. Photo & Sign' },
  ];

  const completedSteps = [1, 2, 3, 4];
  const progressPercent = Math.round((completedSteps.length / stepsList.length) * 100);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSameAddressToggle = (checked) => {
    setSameAsResidential(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permHouseNo: prev.resHouseNo || 'N/A',
        permStreet: prev.resStreet || 'N/A',
        permSubdivision: prev.resSubdivision || 'N/A',
        permBarangay: prev.resBarangay || 'N/A',
        permCity: prev.resCity || 'N/A',
        permProvince: prev.resProvince || 'N/A',
        permZip: prev.resZip || 'N/A',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.declarationAgree) {
      alert('Please confirm the accuracy declaration before submitting.');
      return;
    }
    alert('✓ Student Profile Document Saved & Verified!');
    if (onSaveSuccess) onSaveSuccess(formData);
  };

  return (
    <div className="bond-paper-canvas">
      
      {/* THE PHYSICAL BOND PAPER SHEET */}
      <article className="bond-paper-sheet" aria-label="Official Student Profile Form">
        
        {/* Document Header removed per request - title is now shown in top navigation container capsule */}

        {/* MOBILE VIEW ONLY: Progress Bar & Section Tabs (Visible < 900px) */}
        <div className="mobile-profile-progress">
          {/* Progress Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>
              Progress: <strong style={{ color: 'var(--amber)' }}>{progressPercent}%</strong>
            </span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>
              {completedSteps.length} of {stepsList.length} sections done
            </span>
          </div>

          {/* Linear Progress Fill Bar */}
          <div style={{ width: '100%', height: 6, background: 'var(--line)', borderRadius: 9999, overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${progressPercent}%`, 
                height: '100%', 
                background: 'var(--amber)', 
                borderRadius: 9999,
                transition: 'width 0.3s ease'
              }} 
            />
          </div>

          {/* Horizontal Scrollable Tabs */}
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* =========================================================================
              STEP 1: PERSONAL INFORMATION
              ========================================================================= */}
          {currentStep === 1 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Monochrome Header Banner */}
              <div style={{ background: '#f8fafc', padding: '9px 12px', borderRadius: 6, border: '1px solid #e2e8f0', borderLeft: '3px solid #111827' }}>
                <h2 style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', margin: 0 }}>
                  Personal Information (Full Name)
                </h2>
              </div>

              {/* Line 1: Surname + First Name */}
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

              {/* Line 2: Middle Name + Extension */}
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
                  <label className="form-label">Extension</label>
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

              {/* Line 3: Birth & Demographics (4 fields) */}
              <div className="form-grid-4">
                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={formData.dob} 
                    onChange={(e) => handleChange('dob', e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Place of Birth (City) *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.pobCity} 
                    onChange={(e) => handleChange('pobCity', e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sex</label>
                  <select 
                    className="form-select"
                    value={formData.sex}
                    onChange={(e) => handleChange('sex', e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Blood Type</label>
                  <select 
                    className="form-select"
                    value={formData.bloodType}
                    onChange={(e) => handleChange('bloodType', e.target.value)}
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>

              {/* Line 4: Mobile Number + Email + PhilSys */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={formData.mobileNumber} 
                    onChange={(e) => handleChange('mobileNumber', e.target.value)} 
                    required 
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
                <div className="form-group">
                  <label className="form-label">PhilSys / National ID No.</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                    value={formData.philSysId} 
                    onChange={(e) => handleChange('philSysId', e.target.value)} 
                  />
                </div>
              </div>

              {/* Complete Address Box - Structured Layout */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '12px 14px', background: '#fafafa' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                  Residential Address
                </div>
                <div className="form-grid-address">
                  <input type="text" className="form-input" placeholder="House/Lot No." value={formData.resHouseNo} onChange={(e) => handleChange('resHouseNo', e.target.value)} />
                  <input type="text" className="form-input" placeholder="Street / Subd." value={formData.resStreet} onChange={(e) => handleChange('resStreet', e.target.value)} />
                  <input type="text" className="form-input" placeholder="Barangay *" value={formData.resBarangay} onChange={(e) => handleChange('resBarangay', e.target.value)} required />
                  <input type="text" className="form-input" placeholder="City / Municipality *" value={formData.resCity} onChange={(e) => handleChange('resCity', e.target.value)} required />
                  <input type="text" className="form-input" placeholder="Province *" value={formData.resProvince} onChange={(e) => handleChange('resProvince', e.target.value)} required />
                  <input type="text" className="form-input" placeholder="ZIP Code *" value={formData.resZip} onChange={(e) => handleChange('resZip', e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input 
                  id="same-addr"
                  type="checkbox" 
                  checked={sameAsResidential}
                  onChange={(e) => handleSameAddressToggle(e.target.checked)}
                  style={{ accentColor: 'var(--amber)' }}
                />
                <label htmlFor="same-addr" style={{ fontSize: 11.5, color: '#475569', cursor: 'pointer' }}>
                  Permanent Address is identical to Residential Address
                </label>
              </div>
            </section>
          )}

          {/* =========================================================================
              STEP 2: FAMILY BACKGROUND
              ========================================================================= */}
          {currentStep === 2 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#f8fafc', padding: '9px 12px', borderRadius: 6, border: '1px solid #e2e8f0', borderLeft: '3px solid #111827' }}>
                <h2 style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', margin: 0 }}>
                  Family Background
                </h2>
              </div>

              {/* Father's Info */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12, background: '#fafafa' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Father's Details</div>
                <div className="form-grid-3">
                  <input type="text" className="form-input" placeholder="Father's Full Name *" value={formData.fatherName} onChange={(e) => handleChange('fatherName', e.target.value)} required />
                  <input type="text" className="form-input" placeholder="Occupation" value={formData.fatherOccupation} onChange={(e) => handleChange('fatherOccupation', e.target.value)} />
                  <input type="tel" className="form-input" placeholder="Contact Number" value={formData.fatherContact} onChange={(e) => handleChange('fatherContact', e.target.value)} />
                </div>
              </div>

              {/* Mother's Maiden Info */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12, background: '#fafafa' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Mother's Maiden Name</div>
                <div className="form-grid-3">
                  <input type="text" className="form-input" placeholder="Mother's Full Maiden Name *" value={formData.motherMaidenName} onChange={(e) => handleChange('motherMaidenName', e.target.value)} required />
                  <input type="text" className="form-input" placeholder="Occupation" value={formData.motherOccupation} onChange={(e) => handleChange('motherOccupation', e.target.value)} />
                  <input type="tel" className="form-input" placeholder="Contact Number" value={formData.motherContact} onChange={(e) => handleChange('motherContact', e.target.value)} />
                </div>
              </div>

              {/* Income & Guardian */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Annual Gross Household Income *</label>
                  <select 
                    className="form-select"
                    value={formData.annualIncome}
                    onChange={(e) => handleChange('annualIncome', e.target.value)}
                  >
                    <option value="Below ₱150,000 (4Ps / Indigent)">Below ₱150,000 (4Ps / Indigent)</option>
                    <option value="₱150,001 - ₱250,000">₱150,001 - ₱250,000</option>
                    <option value="₱250,001 - ₱400,000">₱250,001 - ₱400,000</option>
                    <option value="Above ₱400,000">Above ₱400,000</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Legal Guardian / Emergency Contact *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.guardianName} 
                    onChange={(e) => handleChange('guardianName', e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </section>
          )}

          {/* =========================================================================
              STEP 3: EDUCATIONAL BACKGROUND
              ========================================================================= */}
          {currentStep === 3 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#f8fafc', padding: '9px 12px', borderRadius: 6, border: '1px solid #e2e8f0', borderLeft: '3px solid #111827' }}>
                <h2 style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', margin: 0 }}>
                  Educational Background
                </h2>
              </div>

              <div className="form-grid-uneven-2-1-1">
                <div className="form-group">
                  <label className="form-label">Senior High School *</label>
                  <input type="text" className="form-input" value={formData.shsSchool} onChange={(e) => handleChange('shsSchool', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">SHS Track / Strand *</label>
                  <select className="form-select" value={formData.shsTrackStrand} onChange={(e) => handleChange('shsTrackStrand', e.target.value)}>
                    <option value="STEM">Academic: STEM</option>
                    <option value="ABM">Academic: ABM</option>
                    <option value="HUMSS">Academic: HUMSS</option>
                    <option value="GAS">Academic: GAS</option>
                    <option value="TVL">Tech-Voc (TVL)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">GWA *</label>
                  <input type="text" className="form-input" style={{ fontVariantNumeric: 'tabular-nums' }} value={formData.shsGwa} onChange={(e) => handleChange('shsGwa', e.target.value)} required />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Junior High School (JHS) *</label>
                  <input type="text" className="form-input" value={formData.jhsSchool} onChange={(e) => handleChange('jhsSchool', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Elementary School *</label>
                  <input type="text" className="form-input" value={formData.elemSchool} onChange={(e) => handleChange('elemSchool', e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Academic Honors / Scholarships Received</label>
                <input type="text" className="form-input" value={formData.academicHonors} onChange={(e) => handleChange('academicHonors', e.target.value)} />
              </div>
            </section>
          )}

          {/* =========================================================================
              STEP 4: PROGRAM & ENROLLMENT
              ========================================================================= */}
          {currentStep === 4 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#f8fafc', padding: '9px 12px', borderRadius: 6, border: '1px solid #e2e8f0', borderLeft: '3px solid #111827' }}>
                <h2 style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', margin: 0 }}>
                  Program &amp; Enrollment
                </h2>
              </div>

              <div className="form-grid-uneven-2-1">
                <div className="form-group">
                  <label className="form-label">
                    Higher Education Institution (HEI) <span style={{ fontWeight: 400, color: '#64748b' }}>(Only needed for transferee)</span>
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Previous college/university (if transferee)"
                    value={formData.heiName} 
                    onChange={(e) => handleChange('heiName', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Campus / Branch</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Campus"
                    value={formData.heiCampus} 
                    onChange={(e) => handleChange('heiCampus', e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-grid-uneven-2-1-1">
                <div className="form-group">
                  <label className="form-label">Degree Program *</label>
                  <input type="text" className="form-input" value={formData.degreeProgram} onChange={(e) => handleChange('degreeProgram', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Major</label>
                  <input type="text" className="form-input" value={formData.major} onChange={(e) => handleChange('major', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Year Level *</label>
                  <select className="form-select" value={formData.yearLevel} onChange={(e) => handleChange('yearLevel', e.target.value)}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================================
              STEP 5: PHOTO & CERTIFICATION
              ========================================================================= */}
          {currentStep === 5 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#f8fafc', padding: '9px 12px', borderRadius: 6, border: '1px solid #e2e8f0', borderLeft: '3px solid #111827' }}>
                <h2 style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', margin: 0 }}>
                  Photo &amp; Certification
                </h2>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* 2x2 Photo Box styled like physical bond paper photo slot */}
                <div 
                  className="dashed-create-container"
                  style={{ width: 160, minHeight: 160, padding: 12, position: 'relative', borderRadius: 8, margin: '0 auto' }}
                >
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    title="Upload 2x2 Photo"
                  />
                  {photoPreview ? (
                    <img src={photoPreview} alt="2x2 ID" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 4 }} />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <Camera size={24} color="var(--control-border)" style={{ margin: '0 auto 6px' }} />
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>2x2 ID Photo</div>
                      <div style={{ fontSize: 9.5, color: 'var(--muted)' }}>White background</div>
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 240, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6, background: 'var(--control)', padding: 14, borderRadius: 8, border: '1px solid var(--line)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={14} color="var(--amber)" /> Legal Notice &amp; Compliance:
                  </div>
                  <p style={{ margin: 0 }}>
                    In accordance with Republic Act No. 10173 (Data Privacy Act of 2012), all personal information provided herein will be held strictly confidential and utilized solely for student verification.
                  </p>
                </div>
              </div>

              {/* Digital Signature */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14 }}>
                  <input 
                    id="decl-agree"
                    type="checkbox" 
                    checked={formData.declarationAgree}
                    onChange={(e) => handleChange('declarationAgree', e.target.checked)}
                    style={{ accentColor: 'var(--amber)', marginTop: 2 }}
                    required
                  />
                  <label htmlFor="decl-agree" style={{ fontSize: 11.5, color: 'var(--ink)', cursor: 'pointer' }}>
                    I declare under oath that this Student Profile has been accomplished by me personally and that the entries are true, correct, and complete.
                  </label>
                </div>

                <div className="form-grid-uneven-2-1">
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 11 }}>Digital Signature (Full Printed Name) *</label>
                    <input type="text" className="form-input" value={formData.signatureName} onChange={(e) => handleChange('signatureName', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 11 }}>Date Accomplished *</label>
                    <input type="date" className="form-input" value={formData.dateAccomplished} onChange={(e) => handleChange('dateAccomplished', e.target.value)} required />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Document Grounded Footer Controls */}
          <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--blue)', paddingTop: 16, marginTop: 12 }}>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
              Section {currentStep} of 5
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => onStepChange(currentStep - 1)}
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: '7px 16px' }}
                >
                  <ChevronLeft size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Previous
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => onStepChange(currentStep + 1)}
                  className="btn-primary-action"
                  style={{ fontSize: 12, padding: '7px 18px' }}
                >
                  <span>Next Section</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary-action"
                  style={{ fontSize: 12, padding: '7px 20px' }}
                >
                  <Save size={14} />
                  <span>Submit Profile</span>
                </button>
              )}
            </div>
          </footer>

        </form>
      </article>

    </div>
  );
}
