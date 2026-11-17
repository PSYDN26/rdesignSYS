// ============================================================================
// SCMBT ADMISSIONS & EXAM SYSTEM MOCK DATA STORE
// Modeled directly from database/schema.sql
// ============================================================================

export const STAFF_ROLES = {
  GUIDANCE_HEAD: {
    id: 'guidance_head',
    title: 'Guidance Center Head',
    department: 'Guidance Office',
  },
  GUIDANCE_OFFICER: {
    id: 'guidance_officer',
    title: 'Guidance Counselor / Officer',
    department: 'Guidance Office',
  },
  RPM_OFFICER: {
    id: 'rpm_officer',
    title: 'Registered Psychometrician (RPM)',
    department: 'Guidance Office',
  },
  EXECUTIVE_VP: {
    id: 'executive_vp',
    title: 'Executive Vice President',
    department: 'Executive',
  },
  FACULTY_MEMBER: {
    id: 'faculty_member',
    title: 'Professor / Instructor',
    department: 'Faculty',
  },
};

export const CURRENT_STAFF_USER = {
  id: 'usr-rpm-001',
  employeeId: 'EMP-2022-0418',
  name: 'Maria Elena Santos, RPM',
  email: 'm.santos@scmbt.edu.ph',
  roleId: 'rpm_officer',
  rpmLicenseNumber: 'PRC-RPM-0048192',
  department: 'Guidance Office',
};

// Default Exam Configuration Initial State
export const INITIAL_EXAM_CONFIG = {
  examCode: 'SCMBT-ENTRANCE-2026',
  title: 'SCMBT Institutional Freshman Entrance Examination',
  description: 'Standardized entrance examination assessing cognitive capacity, numerical proficiency, verbal comprehension, and intellectual aptitude for maritime and collegiate degree programs.',
  examType: 'official_100', // 'official_100' or 'demo_10'
  timeLimitMinutes: 90, // 1 hour 30 mins (5400 seconds)
  overallPassingScore: 50.0, // Configurable passing percentage (default 50%)
  maxRetakes: 2, // 1 initial + 2 retakes = 3 total attempts
  categories: [
    {
      id: 'num',
      name: 'Numerical Reasoning',
      officialQuota: 30,
      demoQuota: 3,
      minPassScore: 50.0, // Min passing % in this category
      description: 'Arithmetic operations, proportions, algebraic logic, and maritime nautical calculations.',
    },
    {
      id: 'intel',
      name: 'Intellectual & Abstract',
      officialQuota: 30,
      demoQuota: 3,
      minPassScore: 50.0,
      description: 'Pattern recognition, sequential inductive logic, and non-verbal matrix deductions.',
    },
    {
      id: 'verb',
      name: 'Verbal Aptitude',
      officialQuota: 25,
      demoQuota: 2,
      minPassScore: 50.0,
      description: 'English vocabulary, contextual sentence comprehension, and technical analogy.',
    },
    {
      id: 'spatial',
      name: 'Spatial & Mechanical',
      officialQuota: 15,
      demoQuota: 2,
      minPassScore: 45.0,
      description: '3D rotation, gear mechanisms, directional bearings, and nautical chart perspectives.',
    },
  ],
};

// Sample Question Bank Items
export const INITIAL_QUESTION_BANK = [
  // --- Category: Numerical Reasoning (num) ---
  {
    id: 'q-num-01',
    categoryId: 'num',
    prompt: 'A vessel is steaming at a constant speed of 18 knots. If 1 nautical mile equals 1.852 kilometers, what is the vessel’s approximate speed in kilometers per hour?',
    choices: [
      { id: 'a', text: '28.4 km/h' },
      { id: 'b', text: '33.3 km/h' },
      { id: 'c', text: '35.8 km/h' },
      { id: 'd', text: '40.2 km/h' },
    ],
    correctChoiceId: 'b',
    points: 1,
    difficulty: 'Medium',
  },
  {
    id: 'q-num-02',
    categoryId: 'num',
    prompt: 'A fuel tank on board is currently 35% full with 420 barrels of heavy fuel oil. What is the total fuel capacity of the tank when completely full?',
    choices: [
      { id: 'a', text: '1,050 barrels' },
      { id: 'b', text: '1,120 barrels' },
      { id: 'c', text: '1,200 barrels' },
      { id: 'd', text: '1,400 barrels' },
    ],
    correctChoiceId: 'c',
    points: 1,
    difficulty: 'Easy',
  },
  {
    id: 'q-num-03',
    categoryId: 'num',
    prompt: 'Solve for x in the linear proportion equation: (3x - 4) / 5 = (2x + 6) / 4.',
    choices: [
      { id: 'a', text: 'x = 23' },
      { id: 'b', text: 'x = 18' },
      { id: 'c', text: 'x = 21' },
      { id: 'd', text: 'x = 14' },
    ],
    correctChoiceId: 'a',
    points: 1,
    difficulty: 'Medium',
  },
  {
    id: 'q-num-04',
    categoryId: 'num',
    prompt: 'If the ratio of deck cadets to engine cadets in a training division is 5:3 and there are 120 cadets in total, how many deck cadets are enrolled?',
    choices: [
      { id: 'a', text: '75' },
      { id: 'b', text: '60' },
      { id: 'c', text: '80' },
      { id: 'd', text: '45' },
    ],
    correctChoiceId: 'a',
    points: 1,
    difficulty: 'Easy',
  },

  // --- Category: Intellectual & Abstract (intel) ---
  {
    id: 'q-intel-01',
    categoryId: 'intel',
    prompt: 'Identify the next number in the following sequence: 3, 7, 16, 35, 74, ?',
    choices: [
      { id: 'a', text: '148' },
      { id: 'b', text: '153' },
      { id: 'c', text: '149' },
      { id: 'd', text: '155' },
    ],
    correctChoiceId: 'b', // rule: * 2 + 1, * 2 + 2, * 2 + 3, * 2 + 4 -> 74 * 2 + 5 = 153
    points: 1,
    difficulty: 'Hard',
  },
  {
    id: 'q-intel-02',
    categoryId: 'intel',
    prompt: 'If ALL vessels entering the strait require a licensed pilot, and SHIP DELTA is currently traversing the strait without a pilot, which conclusion is logically sound?',
    choices: [
      { id: 'a', text: 'Ship Delta has a special dispensation or is in direct violation of strait regulations.' },
      { id: 'b', text: 'All pilots are currently on board Ship Delta.' },
      { id: 'c', text: 'The strait is closed to navigation.' },
      { id: 'd', text: 'Ship Delta is not a vessel.' },
    ],
    correctChoiceId: 'a',
    points: 1,
    difficulty: 'Medium',
  },
  {
    id: 'q-intel-03',
    categoryId: 'intel',
    prompt: 'Which word does NOT belong with the others in the group?',
    choices: [
      { id: 'a', text: 'Sextant' },
      { id: 'b', text: 'Chronometer' },
      { id: 'c', text: 'Altimeter' },
      { id: 'd', text: 'Azimuth' },
    ],
    correctChoiceId: 'd', // Azimuth is an angular measurement, others are navigational physical instruments
    points: 1,
    difficulty: 'Medium',
  },

  // --- Category: Verbal Aptitude (verb) ---
  {
    id: 'q-verb-01',
    categoryId: 'verb',
    prompt: 'Choose the word most nearly OPPOSITE in meaning to the capitalized word: "The master commended the crew for their METICULOUS attention to mooring lines."',
    choices: [
      { id: 'a', text: 'Scrupulous' },
      { id: 'b', text: 'Perfunctory' },
      { id: 'c', text: 'Punctilious' },
      { id: 'd', text: 'Diligent' },
    ],
    correctChoiceId: 'b',
    points: 1,
    difficulty: 'Hard',
  },
  {
    id: 'q-verb-02',
    categoryId: 'verb',
    prompt: 'Complete the analogy: RUDDER : STEERING :: ANCHOR : ?',
    choices: [
      { id: 'a', text: 'PROPULSION' },
      { id: 'b', text: 'MOORING' },
      { id: 'c', text: 'HOLDING' },
      { id: 'd', text: 'BALLAST' },
    ],
    correctChoiceId: 'c',
    points: 1,
    difficulty: 'Easy',
  },
  {
    id: 'q-verb-03',
    categoryId: 'verb',
    prompt: 'Select the correctly punctuated and grammatically sound sentence according to standard administrative protocol:',
    choices: [
      { id: 'a', text: 'Neither the chief mate nor the watchstanders was informed of the schedule change.' },
      { id: 'b', text: 'Neither the chief mate nor the watchstanders were informed of the schedule change.' },
      { id: 'c', text: 'Neither the chief mate or the watchstanders was informed of the schedule change.' },
      { id: 'd', text: 'Neither the chief mate or the watchstanders were informed of the schedule change.' },
    ],
    correctChoiceId: 'b',
    points: 1,
    difficulty: 'Medium',
  },

  // --- Category: Spatial & Mechanical (spatial) ---
  {
    id: 'q-spatial-01',
    categoryId: 'spatial',
    prompt: 'A right-handed screw thread is rotated clockwise when viewed directly from the head. In which direction does the screw advance along its axis?',
    choices: [
      { id: 'a', text: 'Away from the observer (Inward)' },
      { id: 'b', text: 'Toward the observer (Outward)' },
      { id: 'c', text: 'Counter-clockwise oscillation' },
      { id: 'd', text: 'Stationary axial translation' },
    ],
    correctChoiceId: 'a',
    points: 1,
    difficulty: 'Easy',
  },
  {
    id: 'q-spatial-02',
    categoryId: 'spatial',
    prompt: 'If Gear A with 40 teeth drives Gear B with 20 teeth, and Gear A rotates at 120 RPM clockwise, what is the rotational speed and direction of Gear B?',
    choices: [
      { id: 'a', text: '60 RPM, clockwise' },
      { id: 'b', text: '240 RPM, counter-clockwise' },
      { id: 'c', text: '240 RPM, clockwise' },
      { id: 'd', text: '120 RPM, counter-clockwise' },
    ],
    correctChoiceId: 'b',
    points: 1,
    difficulty: 'Medium',
  },
];

// Published Revision Snapshot
export const INITIAL_PUBLISHED_REVISION = {
  revisionNumber: 4,
  examType: 'demo_10',
  status: 'published',
  publishedBy: 'Maria Elena Santos, RPM (Guidance Office)',
  publishedAt: '2026-11-10T08:30:00Z',
  timeLimitMinutes: 90,
  overallPassingScore: 50.0,
  totalItems: 10,
  categorySummary: [
    { id: 'num', name: 'Numerical Reasoning', quota: 3, minPassScore: 50.0 },
    { id: 'intel', name: 'Intellectual & Abstract', quota: 3, minPassScore: 50.0 },
    { id: 'verb', name: 'Verbal Aptitude', quota: 2, minPassScore: 50.0 },
    { id: 'spatial', name: 'Spatial & Mechanical', quota: 2, minPassScore: 45.0 },
  ],
};
