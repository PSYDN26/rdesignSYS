import React, { useState } from 'react';
import { 
  User, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  AlertCircle,
  Camera,
  FileCheck
} from 'lucide-react';

export default function StudentProfileForm({ onBack, onSaveSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [sameAsResidential, setSameAsResidential] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    surname: '',
    firstName: '',
    nameExtension: 'N/A',
    middleName: '',
    dob: '',
    pobCity: '',
    pobProvince: '',
    sex: 'Male',
    civilStatus: 'Single',
    citizenship: 'Filipino',
    religion: 'Roman Catholic',
    height: '',
    weight: '',
    bloodType: 'O+',
    mobileNumber: '',
    email: '',
    landline: 'N/A',
    resHouseNo: '',
    resStreet: '',
    resSubdivision: '',
    resBarangay: '',
    resCity: '',
    resProvince: '',
    resZip: '',
    permHouseNo: '',
    permStreet: '',
    permSubdivision: '',
    permBarangay: '',
    permCity: '',
    permProvince: '',
    permZip: '',
    lrnNumber: '',
    philSysId: 'N/A',
    tinNumber: 'N/A',

    // Step 2: Family & Socio-Economic
    fatherName: '',
    fatherOccupation: '',
    fatherEducation: 'College Graduate',
    fatherContact: '',
    fatherStatus: 'Living',
    motherMaidenName: '',
    motherOccupation: '',
    motherEducation: 'College Graduate',
    motherContact: '',
    motherStatus: 'Living',
    annualIncome: 'Below ₱150,000 (4Ps / Indigent)',
    guardianName: '',
    guardianRelationship: 'Mother',
    guardianContact: '',
    guardianAddress: '',

    // Step 3: Educational Background
    elemSchool: '',
    elemYearGrad: '',
    jhsSchool: '',
    jhsYearGrad: '',
    shsSchool: '',
    shsTrackStrand: 'STEM',
    shsYearGrad: '',
    shsGwa: '',
    academicHonors: 'With Honors',

    // Step 4: Program & Enrollment
    heiName: 'University of the Philippines',
    heiCampus: 'Diliman, Quezon City',
    degreeProgram: 'Bachelor of Science in Computer Science',
    major: 'Software Engineering',
    yearLevel: '1st Year',

    // Step 5: Verification
    declarationAgree: false,
    signatureName: '',
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

  const steps = [
    { num: 1, title: 'Personal Information', icon: User, desc: 'Name, PSA birth details & address' },
    { num: 2, title: 'Family & Socio-Economic', icon: Users, desc: 'Parents, household income & guardian' },
    { num: 3, title: 'Educational Background', icon: GraduationCap, desc: 'Schools attended, SHS strand & GWA' },
    { num: 4, title: 'Program & Enrollment', icon: BookOpen, desc: 'HEI institution, degree & year level' },
    { num: 5, title: 'Verification & Attachments', icon: FileCheck, desc: '2x2 ID photo, signature & review' },
  ];

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
      alert('Please check the confirmation declaration before submitting.');
      return;
    }
    alert('✓ Profile submitted and verified successfully!');
    if (onSaveSuccess) onSaveSuccess(formData);
  };

  return (
    <div className="profile-form-shell" style={{ width: '100%', maxWidth: 1100, margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* Top Header & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #ebeef2' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: '#e6f9f0', color: '#00c06d', padding: '2px 8px', borderRadius: 9999 }}>
              CHED &amp; Institutional Format
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>Student Biodata / PDS Form</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#11141a', letterSpacing: '-0.5px' }}>
            Student Profile &amp; Enrollment Information
          </h1>
        </div>

        {onBack && (
          <button 
            type="button" 
            onClick={onBack}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </button>
        )}
      </div>

      {/* Stepper Navigation Pills (Matches ClassIn Capsule Design) */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8, 
        overflowX: 'auto', 
        paddingBottom: 16, 
        marginBottom: 24,
        scrollbarWidth: 'none' 
      }}>
        {steps.map((s) => {
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setCurrentStep(s.num)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 9999,
                background: isActive ? '#000000' : isDone ? '#e6f9f0' : '#f4f5f7',
                color: isActive ? '#ffffff' : isDone ? '#00c06d' : '#64748b',
                fontSize: 12.5,
                fontWeight: isActive ? 700 : 600,
                whiteSpace: 'nowrap',
                border: isActive ? '1px solid #000000' : '1px solid #ebedf2',
                transition: 'all 0.15s ease'
              }}
            >
              {isDone ? (
                <CheckCircle2 size={15} color="#00c06d" strokeWidth={2.5} />
              ) : (
                <span style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: isActive ? '#ffffff' : '#e2e8f0',
                  color: isActive ? '#000000' : '#64748b',
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>
                  {s.num}
                </span>
              )}
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Card */}
      <form onSubmit={handleSubmit} style={{ background: '#ffffff', border: '1px solid #ebeef2', borderRadius: 16, padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        
        {/* =========================================================================
            STEP 1: PERSONAL INFORMATION
            ========================================================================= */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                1. Full Legal Name (as written on PSA Birth Certificate)
              </h2>
              <p style={{ fontSize: 12, color: '#8c93a1' }}>
                Ensure spelling matches your Philippine Statistics Authority (PSA) Birth Certificate or Passport.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Surname / Last Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Dela Cruz" 
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
                  placeholder="e.g. Juan" 
                  value={formData.firstName} 
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Middle Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Leave as N/A if none" 
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
                  <option value="N/A">N/A (None)</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #f1f3f5' }} />

            {/* Birth Details & Demographics */}
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                Birth Details &amp; Demographics
              </h2>
              <p style={{ fontSize: 12, color: '#8c93a1' }}>
                Standard civil registry and health identifiers.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Date of Birth (MM/DD/YYYY) *</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formData.dob} 
                  onChange={(e) => handleChange('dob', e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Place of Birth (City/Municipality) *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Quezon City" 
                  value={formData.pobCity} 
                  onChange={(e) => handleChange('pobCity', e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Place of Birth (Province) *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Metro Manila / Cebu" 
                  value={formData.pobProvince} 
                  onChange={(e) => handleChange('pobProvince', e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sex *</label>
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
                <label className="form-label">Civil Status</label>
                <select 
                  className="form-select"
                  value={formData.civilStatus}
                  onChange={(e) => handleChange('civilStatus', e.target.value)}
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

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
                <label className="form-label">Blood Type</label>
                <select 
                  className="form-select"
                  value={formData.bloodType}
                  onChange={(e) => handleChange('bloodType', e.target.value)}
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm) / Weight (kg)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Height (cm)" 
                    value={formData.height} 
                    onChange={(e) => handleChange('height', e.target.value)}
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Weight (kg)" 
                    value={formData.weight} 
                    onChange={(e) => handleChange('weight', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #f1f3f5' }} />

            {/* Contact Details & Addresses */}
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#11141a', marginBottom: 4 }}>
                Contact &amp; Identification Numbers
              </h2>
              <p style={{ fontSize: 12, color: '#8c93a1' }}>
                Learner Reference Number (LRN), PhilSys/National ID, and active mobile numbers.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="0917-000-0000" 
                  value={formData.mobileNumber} 
                  onChange={(e) => handleChange('mobileNumber', e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Personal Email Address *</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="name@example.com" 
                  value={formData.email} 
                  onChange={(e) => handleChange('email', e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Learner Reference Number (12-digit LRN) *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="123456789012" 
                  value={formData.lrnNumber} 
                  onChange={(e) => handleChange('lrnNumber', e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">PhilSys / National ID No.</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Write N/A if not yet issued" 
                  value={formData.philSysId} 
                  onChange={(e) => handleChange('philSysId', e.target.value)}
                />
              </div>
            </div>

            {/* Residential Address */}
            <div style={{ background: '#fcfdfe', border: '1px solid #f1f3f5', borderRadius: 12, padding: 16 }}>
              <h3 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 12, color: '#11141a' }}>
                Complete Residential Address
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="House/Lot/Block No." 
                  value={formData.resHouseNo} 
                  onChange={(e) => handleChange('resHouseNo', e.target.value)} 
                />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Street" 
                  value={formData.resStreet} 
                  onChange={(e) => handleChange('resStreet', e.target.value)} 
                />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Subdivision / Village" 
                  value={formData.resSubdivision} 
                  onChange={(e) => handleChange('resSubdivision', e.target.value)} 
                />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Barangay *" 
                  value={formData.resBarangay} 
                  onChange={(e) => handleChange('resBarangay', e.target.value)} 
                  required 
                />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="City / Municipality *" 
                  value={formData.resCity} 
                  onChange={(e) => handleChange('resCity', e.target.value)} 
                  required 
                />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Province *" 
                  value={formData.resProvince} 
                  onChange={(e) => handleChange('resProvince', e.target.value)} 
                  required 
                />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="ZIP Code *" 
                  value={formData.resZip} 
                  onChange={(e) => handleChange('resZip', e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Permanent Address Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                id="same-addr"
                type="checkbox" 
                checked={sameAsResidential}
                onChange={(e) => handleSameAddressToggle(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#00c06d' }}
              />
              <label htmlFor="same-addr" style={{ fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                Permanent Address is the same as Residential Address
              </label>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: FAMILY & SOCIO-ECONOMIC BACKGROUND
            ========================================================================= */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                2. Parents' Information &amp; Socio-Economic Background
              </h2>
              <p style={{ fontSize: 12, color: '#8c93a1' }}>
                Required for CHED scholarships (TDP, TES, StuFAPs) and financial assistance records.
              </p>
            </div>

            {/* Father's Info */}
            <div style={{ background: '#f8fafc', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>
                Father's Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Father's Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Surname, First Name, Middle Name" 
                    value={formData.fatherName} 
                    onChange={(e) => handleChange('fatherName', e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Occupation</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Farmer, Employee, N/A" 
                    value={formData.fatherOccupation} 
                    onChange={(e) => handleChange('fatherOccupation', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Highest Educational Attainment</label>
                  <select 
                    className="form-select"
                    value={formData.fatherEducation}
                    onChange={(e) => handleChange('fatherEducation', e.target.value)}
                  >
                    <option>Elementary Graduate</option>
                    <option>High School Graduate</option>
                    <option>Vocational / Technical</option>
                    <option>College Graduate</option>
                    <option>Post-Graduate</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={formData.fatherStatus}
                    onChange={(e) => handleChange('fatherStatus', e.target.value)}
                  >
                    <option value="Living">Living</option>
                    <option value="Deceased">Deceased</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mother's Info */}
            <div style={{ background: '#f8fafc', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>
                Mother's Full Maiden Name (as registered on her PSA Birth Certificate)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Mother's Maiden Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Maiden Surname, First Name, Middle Name" 
                    value={formData.motherMaidenName} 
                    onChange={(e) => handleChange('motherMaidenName', e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Occupation</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Self-employed, N/A" 
                    value={formData.motherOccupation} 
                    onChange={(e) => handleChange('motherOccupation', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Highest Educational Attainment</label>
                  <select 
                    className="form-select"
                    value={formData.motherEducation}
                    onChange={(e) => handleChange('motherEducation', e.target.value)}
                  >
                    <option>Elementary Graduate</option>
                    <option>High School Graduate</option>
                    <option>Vocational / Technical</option>
                    <option>College Graduate</option>
                    <option>Post-Graduate</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={formData.motherStatus}
                    onChange={(e) => handleChange('motherStatus', e.target.value)}
                  >
                    <option value="Living">Living</option>
                    <option value="Deceased">Deceased</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Household Income & Emergency Contact */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Combined Annual Gross Household Income *</label>
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
                <label className="form-label">Guardian / Emergency Contact Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Full Name" 
                  value={formData.guardianName} 
                  onChange={(e) => handleChange('guardianName', e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relationship to Guardian</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Mother, Father, Aunt" 
                  value={formData.guardianRelationship} 
                  onChange={(e) => handleChange('guardianRelationship', e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Guardian Contact Number *</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="0918-000-0000" 
                  value={formData.guardianContact} 
                  onChange={(e) => handleChange('guardianContact', e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: EDUCATIONAL BACKGROUND
            ========================================================================= */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                3. Educational Background &amp; Academic Honors
              </h2>
              <p style={{ fontSize: 12, color: '#8c93a1' }}>
                State full school names without abbreviation (DepEd / CHED standard).
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Senior High School (SHS) Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Do not abbreviate school name" 
                  value={formData.shsSchool} 
                  onChange={(e) => handleChange('shsSchool', e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">SHS Track &amp; Strand *</label>
                <select 
                  className="form-select"
                  value={formData.shsTrackStrand}
                  onChange={(e) => handleChange('shsTrackStrand', e.target.value)}
                >
                  <option value="STEM">Academic: STEM (Science, Tech, Engineering, Math)</option>
                  <option value="ABM">Academic: ABM (Accountancy, Business &amp; Management)</option>
                  <option value="HUMSS">Academic: HUMSS (Humanities &amp; Social Sciences)</option>
                  <option value="GAS">Academic: General Academic Strand (GAS)</option>
                  <option value="TVL">Technical-Vocational-Livelihood (TVL / ICT)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Year Graduated (SHS) *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 2024" 
                  value={formData.shsYearGrad} 
                  onChange={(e) => handleChange('shsYearGrad', e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">General Weighted Average (GWA) *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 93.50 or 1.25" 
                  value={formData.shsGwa} 
                  onChange={(e) => handleChange('shsGwa', e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Junior High School (JHS) Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Full JHS name" 
                  value={formData.jhsSchool} 
                  onChange={(e) => handleChange('jhsSchool', e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Elementary School Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Full Elementary name" 
                  value={formData.elemSchool} 
                  onChange={(e) => handleChange('elemSchool', e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Academic Honors / Scholarships Received</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. With Honors, Class Valedictorian, DepEd Voucher (write N/A if none)" 
                  value={formData.academicHonors} 
                  onChange={(e) => handleChange('academicHonors', e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: PROGRAM & ENROLLMENT DETAILS
            ========================================================================= */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                4. Program &amp; Higher Education Institution (HEI)
              </h2>
              <p style={{ fontSize: 12, color: '#8c93a1' }}>
                Details of the college or university degree you are currently attending or admitted to.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Higher Education Institution (HEI) Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. University of the Philippines, Polytechnic University" 
                  value={formData.heiName} 
                  onChange={(e) => handleChange('heiName', e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Campus / Branch Address *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Diliman, Manila, Cebu" 
                  value={formData.heiCampus} 
                  onChange={(e) => handleChange('heiCampus', e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Degree Program / Course *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Bachelor of Science in Accountancy" 
                  value={formData.degreeProgram} 
                  onChange={(e) => handleChange('degreeProgram', e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Major (write N/A if none)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Financial Management, Software Dev" 
                  value={formData.major} 
                  onChange={(e) => handleChange('major', e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Year Level *</label>
                <select 
                  className="form-select"
                  value={formData.yearLevel}
                  onChange={(e) => handleChange('yearLevel', e.target.value)}
                >
                  <option value="Incoming Freshman">Incoming Freshman</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year (Engineering/Architecture)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: VERIFICATION, ATTACHMENTS & SIGNATURE
            ========================================================================= */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                5. Standard Attachments &amp; Certification
              </h2>
              <p style={{ fontSize: 12, color: '#8c93a1' }}>
                Upload your official 2x2 passport-style ID photo with white background and sign declaration.
              </p>
            </div>

            {/* Signature Dashed Upload Card (Matching ClassIn Design Language) */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <div 
                className="dashed-create-container"
                style={{ maxWidth: 280, minHeight: 180, padding: 20, position: 'relative' }}
              >
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  title="Upload 2x2 Photo"
                />
                
                {photoPreview ? (
                  <div style={{ textAlign: 'center' }}>
                    <img 
                      src={photoPreview} 
                      alt="Uploaded 2x2 ID" 
                      style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, margin: '0 auto 8px', border: '1px solid #e2e8f0' }} 
                    />
                    <span style={{ fontSize: 11, color: '#00c06d', fontWeight: 700 }}>✓ 2x2 Photo Ready</span>
                  </div>
                ) : (
                  <>
                    <div className="create-icon-bubble">
                      <Camera size={22} strokeWidth={2.2} />
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: '#11141a', marginBottom: 2 }}>
                      Upload 2x2 ID Photo
                    </span>
                    <span style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
                      White background with printed name tag
                    </span>
                  </>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 260, fontSize: 12.5, color: '#475569', lineHeight: 1.6, background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertCircle size={15} color="#00c06d" /> DepEd &amp; CHED Verification Rules:
                </div>
                <ul style={{ paddingLeft: 18, listStyleType: 'disc' }}>
                  <li><strong>No Blank Fields:</strong> Fields that do not apply must have <code>"N/A"</code> entered.</li>
                  <li><strong>Full Legal Names:</strong> Names must match your PSA birth certificate and official school records.</li>
                  <li><strong>Certificates of Indigency / ITR:</strong> Keep your parents' income proofs on hand if applying for UniFAST TDP/TES.</li>
                </ul>
              </div>
            </div>

            {/* Declaration & Signature */}
            <div style={{ padding: 18, background: '#fafbfc', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <input 
                  id="decl-agree"
                  type="checkbox" 
                  checked={formData.declarationAgree}
                  onChange={(e) => handleChange('declarationAgree', e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#000000', marginTop: 2 }}
                  required
                />
                <label htmlFor="decl-agree" style={{ fontSize: 12.5, color: '#1e293b', lineHeight: 1.5, cursor: 'pointer' }}>
                  I hereby certify that all information supplied herein is true, complete, and correct according to the best of my knowledge and belief. I understand that any false statement or omission of facts may lead to the revocation of scholarship or disqualification.
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, paddingTop: 10, borderTop: '1px solid #eef2f6' }}>
                <div className="form-group">
                  <label className="form-label">Full Printed Name (Digital Signature) *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter your full name" 
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
                    value={formData.dateAccomplished} 
                    onChange={(e) => handleChange('dateAccomplished', e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Footer Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, paddingTop: 16, borderTop: '1px solid #f1f3f5' }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
          ) : <div />}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="btn-primary-action"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>Next Step</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              className="btn-primary-action"
              style={{ background: '#00c06d', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Save size={16} />
              <span>Submit &amp; Save Profile</span>
            </button>
          )}
        </div>
      </form>

    </div>
  );
}
