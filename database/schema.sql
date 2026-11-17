-- ============================================================================
-- SCMBT INSTITUTIONAL PORTAL & ADMISSIONS SYSTEM
-- Entrance Examination, Written Aptitude Test & Legacy Migration Schema
-- Engine: PostgreSQL 14+ (Optimized with JSONB & Versioning)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. STAFF & ROLE-BASED ACCESS CONTROL
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS staff_roles (
    id VARCHAR(30) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL, -- e.g. 'Guidance Office', 'Executive', 'Faculty'
    description TEXT
);

INSERT INTO staff_roles (id, title, department, description) VALUES
('guidance_head', 'Guidance Center Head', 'Guidance Office', 'Oversees admissions testing, exam bank publishing, and faculty releases'),
('guidance_officer', 'Guidance Counselor / Officer', 'Guidance Office', 'Coordinates test schedules, intakes, and legacy draft migrations'),
('rpm_officer', 'Registered Psychometrician (RPM)', 'Guidance Office', 'Authorized to administer paper aptitude tests and encode psychological evaluations'),
('executive_vp', 'Executive Vice President', 'Executive', 'Authorized to review and approve manual legacy student data migrations'),
('faculty_member', 'Professor / Instructor', 'Faculty', 'Authorized to view released aptitude results for students on assigned class roster')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS staff_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role_id VARCHAR(30) NOT NULL REFERENCES staff_roles(id),
    rpm_license_number VARCHAR(50), -- Required if role_id = 'rpm_officer' (PRC License)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. APPLICANT RECORD (MOCK / REFERENCE INTEGRATION)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'APP-2026-00891'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    target_program VARCHAR(100) NOT NULL, -- e.g. 'BS Marine Transportation'
    shs_strand VARCHAR(50) NOT NULL,
    application_status VARCHAR(30) NOT NULL DEFAULT 'exam_pending' 
        CHECK (application_status IN ('exam_pending', 'exam_passed', 'aptitude_referred', 'course_selection', 'enrolled', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. EXAM BANK & VERSIONED POLICY REVISIONS (GUIDANCE OFFICE)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'SCMBT-ONLINE-ENTRANCE'
    title VARCHAR(150) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    revision_number INT NOT NULL,
    exam_type VARCHAR(20) NOT NULL CHECK (exam_type IN ('official_100', 'demo_10')),
    time_limit_seconds INT NOT NULL DEFAULT 5400, -- 1 Hour 30 Minutes (90 mins)
    overall_passing_score NUMERIC(5,2) NOT NULL DEFAULT 50.00, -- Configurable, default 50%
    max_retakes INT NOT NULL DEFAULT 2, -- 1 initial + 2 retakes = 3 total attempts
    
    -- Category quotas & minimum passing threshold configurations
    -- Example structure:
    -- [
    --   {"id": "num", "name": "Numerical Reasoning", "quota": 40, "min_pass_score": 40.00},
    --   {"id": "intel", "name": "Intellectual / Abstract", "quota": 30, "min_pass_score": 45.00},
    --   {"id": "verb", "name": "Verbal Aptitude", "quota": 30, "min_pass_score": 50.00}
    -- ]
    categories JSONB NOT NULL,
    
    -- Question items (Question prompts, choices, category references, point values)
    -- Answers keys are strictly excluded from this payload
    questions JSONB NOT NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_by UUID REFERENCES staff_accounts(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(exam_id, revision_number)
);

-- Separate restricted answer key table (Server-side grading security)
CREATE TABLE IF NOT EXISTS exam_answer_keys (
    revision_id UUID PRIMARY KEY REFERENCES exam_revisions(id) ON DELETE CASCADE,
    answer_keys JSONB NOT NULL, -- Map: {"q1": "b", "q2": "d", ...}
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. ONLINE EXAM SESSIONS & ATTEMPTS (APPLICANT)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    revision_id UUID NOT NULL REFERENCES exam_revisions(id),
    attempt_number INT NOT NULL CHECK (attempt_number BETWEEN 1 AND 3),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL, -- started_at + time_limit_seconds (90 mins)
    submitted_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress' 
        CHECK (status IN ('in_progress', 'submitted', 'expired')),
    
    -- Frozen shuffled item order assigned to this specific session
    shuffled_item_order JSONB NOT NULL,
    
    -- Submitted answer map: {"q1": "a", "q2": "c", ...}
    submitted_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Category score details: {"num": {"correct": 28, "total": 40, "pct": 70.0, "passed": true}}
    category_scores JSONB DEFAULT '{}'::jsonb,
    
    total_score NUMERIC(5,2), -- Overall percentage e.g. 74.50%
    passed BOOLEAN, -- True if overall >= overall_passing_score AND all category thresholds met
    UNIQUE(application_id, attempt_number)
);

-- ----------------------------------------------------------------------------
-- 5. WRITTEN APTITUDE REFERRALS & RPM ASSESSMENTS (GUIDANCE OFFICE)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS aptitude_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID UNIQUE NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    referral_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'REF-2026-00412'
    referral_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scheduled_test_date DATE,
    scheduled_session VARCHAR(50), -- e.g. 'Morning Session (09:00 AM - 11:30 AM)'
    testing_room VARCHAR(50) DEFAULT 'Guidance Testing Hall Room 204',
    
    referral_status VARCHAR(25) NOT NULL DEFAULT 'pending_visit' 
        CHECK (referral_status IN ('pending_visit', 'scheduled', 'tested', 'encoded', 'released')),
    
    -- Registered Psychometrician (RPM) Encoding Section
    encoded_by_rpm_id UUID REFERENCES staff_accounts(id),
    rpm_license_snapshot VARCHAR(50), -- Saved PRC license string at time of encoding
    encoded_at TIMESTAMPTZ,
    
    -- Evaluation format mode: 'structured' (psychometric matrix) or 'narrative' (rich text paragraph letter)
    evaluation_mode VARCHAR(20) CHECK (evaluation_mode IN ('structured', 'narrative')),
    
    -- Mode A: Structured Psychometric Fields
    raw_score INT,
    total_items INT,
    percentile_rank NUMERIC(5,2) CHECK (percentile_rank >= 0 AND percentile_rank <= 100),
    stanine INT CHECK (stanine BETWEEN 1 AND 9),
    iq_equivalent VARCHAR(30), -- e.g. '112 (Average)' or 'Superior'
    qualitative_interpretation VARCHAR(50) 
        CHECK (qualitative_interpretation IN ('Superior', 'Above Average', 'Average', 'Below Average', 'Low')),
    
    -- Mode B: Narrative Evaluation (Rich Text paragraph format)
    narrative_evaluation_html TEXT,
    
    -- Admission Outcome
    admission_recommendation VARCHAR(30) 
        CHECK (admission_recommendation IN ('recommended', 'conditional', 'not_recommended')),
    
    -- Conditional Endorsement (Guidance Center Head or College Dean)
    conditional_endorsement_by UUID REFERENCES staff_accounts(id),
    conditional_endorsed_at TIMESTAMPTZ,
    conditional_remarks TEXT,
    
    -- Faculty Visibility Release Mechanism
    is_released_to_faculty BOOLEAN NOT NULL DEFAULT FALSE,
    released_by UUID REFERENCES staff_accounts(id),
    released_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. LEGACY STUDENT EXAM MIGRATION WITH EXECUTIVE VP APPROVAL
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS legacy_exam_migrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_reference VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'MIG-BATCH-2026-01'
    source_description VARCHAR(255) NOT NULL, -- e.g. 'Ay 2024-2025 Transferees Paper Archive'
    created_by_staff_id UUID NOT NULL REFERENCES staff_accounts(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    status VARCHAR(25) NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'pending_evp', 'evp_approved', 'evp_rejected')),
    
    -- Payload of migrated student records (Individual or CSV import array)
    -- [
    --   {
    --     "student_number": "SCMBT-2024-0012",
    --     "full_name": "Reyes, Mark Anthony",
    --     "program_code": "BSMT",
    --     "test_type": "written_aptitude",
    --     "test_date": "2024-06-15",
    --     "stanine": 7,
    --     "score_pct": 78.5,
    --     "recommendation": "recommended",
    --     "original_rpm_name": "L. Santos, RPM"
    --   }
    -- ]
    migrated_records JSONB NOT NULL,
    total_records_count INT NOT NULL DEFAULT 0,
    
    -- Executive VP Approval Sign-off
    approved_by_evp_id UUID REFERENCES staff_accounts(id),
    evp_decision_at TIMESTAMPTZ,
    evp_remarks TEXT,
    evp_digital_signature_hash VARCHAR(255),
    
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. AUDIT TRAIL LOGGING
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS exam_system_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES staff_accounts(id),
    actor_name VARCHAR(150) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- e.g. 'EXAM_PUBLISHED', 'RESULT_ENCODED', 'FACULTY_RELEASE', 'EVP_MIGRATION_APPROVED'
    target_entity VARCHAR(50) NOT NULL, -- e.g. 'exam_revision', 'aptitude_referral', 'legacy_migration'
    target_id UUID NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. INDEXES FOR PERFORMANCE & CONCURRENCY
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_exam_revisions_status ON exam_revisions(status);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_app ON exam_attempts(application_id, attempt_number);
CREATE INDEX IF NOT EXISTS idx_aptitude_referrals_app ON aptitude_referrals(application_id);
CREATE INDEX IF NOT EXISTS idx_aptitude_referrals_status ON aptitude_referrals(referral_status);
CREATE INDEX IF NOT EXISTS idx_aptitude_referrals_faculty ON aptitude_referrals(is_released_to_faculty);
CREATE INDEX IF NOT EXISTS idx_legacy_migrations_status ON legacy_migrations(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON exam_system_audit_logs(actor_id, action_type);
