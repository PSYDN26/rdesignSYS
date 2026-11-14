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

    // Step 2: Family & Socio-Economic
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
      
      {/* THE PHYSICAL BOND PAPER SHEET (Standard 8.5" x 11" Bounds, Unslop Principles Applied) */}
      <article className="bond-paper-sheet" aria-label="Official Student Profile Form">
        
        {/* Document Formal Header (Philippine DepEd / CHED / CSC Institutional Header) */}
        <header className="bond-paper-header">
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#64748b', marginBottom: 2 }}>
              Republic of the Philippines • CHED / DepEd Institutional Format
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', margin: 0, textWrap: 'balance' }}>
              PERSONAL DATA SHEET &amp; STUDENT PROFILE
            </h1>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>
              CS Form No. 212 / CHED StuFAPs Revised Form • Standard 8.5" × 11" Bond Paper Dimension
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ 
              fontSize: 10.5, 
              fontWeight: 700, 
              background: '#f1f5f9', 
              color: '#334155', 
              padding: '3px 8px', 
              borderRadius: 4, 
              display: 'inline-block',
              fontVariantNumeric: 'tabular-nums'
            }}>
              LRN: {formData.lrnNumber}
            </span>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
              Status: <span style={{ color: '#00c06d', fontWeight: 700 }}>● Active Submission</span>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* =========================================================================
              STEP 1: PERSONAL INFORMATION
              ========================================================================= */}
          {currentStep === 1 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 6, borderLeft: '4px solid #0f172a' }}>
                <h2 style={{ fontSize: 12.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', margin: 0 }}>
                  I. Personal Information (as written on PSA Birth Certificate)
                </h2>
              </div>

              {/* Name Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Surname *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.surname} 
                    onChange={(e) => handleChange('surname', e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>First Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.firstName} 
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Middle Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.middleName} 
                    onChange={(e) => handleChange('middleName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Extension</label>
                  <select 
                    className="form-select"
                    value={formData.nameExtension}
                    onChange={(e) => handleChange('nameExtension', e.target.value)}
                  >
                    <option value="N/A">N/A</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="III">III</option>
                  </select>
                </div>
              </div>

              {/* Birth & Demographics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Date of Birth *</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={formData.dob} 
                    onChange={(e) => handleChange('dob', e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Place of Birth (City) *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.pobCity} 
                    onChange={(e) => handleChange('pobCity', e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Sex</label>
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
                  <label className="form-label" style={{ fontSize: 11 }}>Blood Type</label>
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

              {/* Identification & Contact Numbers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Mobile Number *</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={formData.mobileNumber} 
                    onChange={(e) => handleChange('mobileNumber', e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Email Address *</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={formData.email} 
                    onChange={(e) => handleChange('email', e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>PhilSys / National ID No.</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                    value={formData.philSysId} 
                    onChange={(e) => handleChange('philSysId', e.target.value)}
                  />
                </div>
              </div>

              {/* Complete Address Box */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '14px 16px', background: '#fafbfc' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 8 }}>
                  Residential Address (House No., Street, Barangay, City, Province, ZIP)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
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
                  style={{ accentColor: '#00c06d' }}
                />
                <label htmlFor="same-addr" style={{ fontSize: 11.5, color: '#475569', cursor: 'pointer' }}>
                  Permanent Address is identical to Residential Address
                </label>
              </div>
            </section>
          )}

          {/* =========================================================================
              STEP 2: FAMILY & SOCIO-ECONOMIC
              ========================================================================= */}
          {currentStep === 2 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 6, borderLeft: '4px solid #0f172a' }}>
                <h2 style={{ fontSize: 12.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', margin: 0 }}>
                  II. Family &amp; Socio-Economic Background (CHED TDP / TES Criteria)
                </h2>
              </div>

              {/* Father's Info */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, background: '#fafbfc' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Father's Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  <input type="text" className="form-input" placeholder="Father's Full Name *" value={formData.fatherName} onChange={(e) => handleChange('fatherName', e.target.value)} required />
                  <input type="text" className="form-input" placeholder="Occupation" value={formData.fatherOccupation} onChange={(e) => handleChange('fatherOccupation', e.target.value)} />
                  <input type="tel" className="form-input" placeholder="Contact Number" value={formData.fatherContact} onChange={(e) => handleChange('fatherContact', e.target.value)} />
                </div>
              </div>

              {/* Mother's Maiden Info */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, background: '#fafbfc' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Mother's Maiden Name (as registered on PSA Birth Certificate)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  <input type="text" className="form-input" placeholder="Mother's Full Maiden Name *" value={formData.motherMaidenName} onChange={(e) => handleChange('motherMaidenName', e.target.value)} required />
                  <input type="text" className="form-input" placeholder="Occupation" value={formData.motherOccupation} onChange={(e) => handleChange('motherOccupation', e.target.value)} />
                  <input type="tel" className="form-input" placeholder="Contact Number" value={formData.motherContact} onChange={(e) => handleChange('motherContact', e.target.value)} />
                </div>
              </div>

              {/* Income & Guardian */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Combined Annual Gross Household Income *</label>
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
                  <label className="form-label" style={{ fontSize: 11 }}>Legal Guardian / Emergency Contact *</label>
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
            <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 6, borderLeft: '4px solid #0f172a' }}>
                <h2 style={{ fontSize: 12.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', margin: 0 }}>
                  III. Educational Background &amp; Academic Honors
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Senior High School (Do not abbreviate) *</label>
                  <input type="text" className="form-input" value={formData.shsSchool} onChange={(e) => handleChange('shsSchool', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>SHS Track / Strand *</label>
                  <select className="form-select" value={formData.shsTrackStrand} onChange={(e) => handleChange('shsTrackStrand', e.target.value)}>
                    <option value="STEM">Academic: STEM</option>
                    <option value="ABM">Academic: ABM</option>
                    <option value="HUMSS">Academic: HUMSS</option>
                    <option value="GAS">Academic: GAS</option>
                    <option value="TVL">Tech-Voc (TVL)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>General Weighted Avg (GWA) *</label>
                  <input type="text" className="form-input" style={{ fontVariantNumeric: 'tabular-nums' }} value={formData.shsGwa} onChange={(e) => handleChange('shsGwa', e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Junior High School (JHS) *</label>
                  <input type="text" className="form-input" value={formData.jhsSchool} onChange={(e) => handleChange('jhsSchool', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Elementary School *</label>
                  <input type="text" className="form-input" value={formData.elemSchool} onChange={(e) => handleChange('elemSchool', e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: 11 }}>Academic Honors / Scholarships Received</label>
                <input type="text" className="form-input" value={formData.academicHonors} onChange={(e) => handleChange('academicHonors', e.target.value)} />
              </div>
            </section>
          )}

          {/* =========================================================================
              STEP 4: PROGRAM & ENROLLMENT
              ========================================================================= */}
          {currentStep === 4 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 6, borderLeft: '4px solid #0f172a' }}>
                <h2 style={{ fontSize: 12.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', margin: 0 }}>
                  IV. Higher Education Program &amp; Enrollment Details
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Higher Education Institution (HEI) *</label>
                  <input type="text" className="form-input" value={formData.heiName} onChange={(e) => handleChange('heiName', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Campus / Branch *</label>
                  <input type="text" className="form-input" value={formData.heiCampus} onChange={(e) => handleChange('heiCampus', e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Degree Program *</label>
                  <input type="text" className="form-input" value={formData.degreeProgram} onChange={(e) => handleChange('degreeProgram', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Major</label>
                  <input type="text" className="form-input" value={formData.major} onChange={(e) => handleChange('major', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Year Level *</label>
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
              STEP 5: ATTACHMENTS & CERTIFICATION
              ========================================================================= */}
          {currentStep === 5 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 6, borderLeft: '4px solid #0f172a' }}>
                <h2 style={{ fontSize: 12.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', margin: 0 }}>
                  V. Official 2x2 ID Photo &amp; Applicant Certification
                </h2>
              </div>

              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                {/* 2x2 Photo Box styled like physical bond paper photo slot */}
                <div 
                  className="dashed-create-container"
                  style={{ width: 170, minHeight: 170, padding: 12, position: 'relative', borderRadius: 8 }}
                >
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    title="Upload 2x2 Photo"
                  />
                  {photoPreview ? (
                    <img src={photoPreview} alt="2x2 ID" style={{ width: 130, height: 130, objectFit: 'cover', borderRadius: 4 }} />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <Camera size={26} color="#64748b" style={{ margin: '0 auto 6px' }} />
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>2x2 ID Photo</div>
                      <div style={{ fontSize: 9.5, color: '#94a3b8' }}>White background with name tag</div>
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, fontSize: 11.5, color: '#475569', lineHeight: 1.6, background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={14} color="#00c06d" /> Legal Notice &amp; Compliance:
                  </div>
                  <p style={{ margin: 0 }}>
                    In accordance with Republic Act No. 10173 (Data Privacy Act of 2012), all personal information provided herein will be held strictly confidential and utilized solely for student verification and scholarship processing.
                  </p>
                </div>
              </div>

              {/* Digital Signature */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14 }}>
                  <input 
                    id="decl-agree"
                    type="checkbox" 
                    checked={formData.declarationAgree}
                    onChange={(e) => handleChange('declarationAgree', e.target.checked)}
                    style={{ accentColor: '#000000', marginTop: 2 }}
                    required
                  />
                  <label htmlFor="decl-agree" style={{ fontSize: 11.5, color: '#1e293b', cursor: 'pointer' }}>
                    I declare under oath that this Student Profile has been accomplished by me personally and that the entries are true, correct, and complete.
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
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
          <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #0f172a', paddingTop: 16, marginTop: 12 }}>
            <div style={{ fontSize: 10.5, color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
              Section {currentStep} of 5 • Philippine Standard Form
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
                  style={{ background: '#00c06d', fontSize: 12, padding: '7px 20px' }}
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
