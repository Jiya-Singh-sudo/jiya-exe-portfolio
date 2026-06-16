import { Project, Book, DaySegment, Achievement, InteractiveAchievement, Certificate, LessonLeaned, GardenNode, StarNode, ShopItem, WeatherConfig, SecretSector, Goal } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'lok-bhavan',
    title: 'Lok Bhavan Guest Management System',
    category: 'GovTech Platform',
    shortDesc: 'A centralized digital guest management and workflow system built for government departments.',
    problem: 'Government guest management relied heavily on manual coordination between departments, creating delays in accommodation allocation, transportation scheduling, approval workflows, and record maintenance. Managing official visits at scale required a centralized and auditable system.',
    process: 'Designed and developed a comprehensive guest management platform supporting guest registrations, visit requests, room allocation, vehicle assignment, staff coordination, approval workflows, notifications, and report generation. Implemented role-based access control and workflow automation to streamline operations across departments.',
    exploration: `* Multi-role administration architecture
* Approval workflow design
* React Native companion application
* Real-time status tracking
* Large-scale form handling
* Government-grade data organization`,
    outcome: `✓ Reduced manual paperwork and coordination overhead
✓ Centralized guest lifecycle management
✓ Improved operational transparency and auditability
✓ Enabled end-to-end digital management of official visits`,
    techStack: ['Next.js', 'React', 'React Native', 'TypeScript'],
    goals: [
      { text: 'Track guest lifecycle from arrival to check-out', done: true },
      { text: 'Automate approval workflows between departments', done: true },
      { text: 'Build companion React Native mobile application', done: true },
      { text: 'Enable multi-tenant government configurations', done: false }
    ],
    statsGained: [
      { name: 'System Design', value: 15 },
      { name: 'Backend Logic', value: 10 },
      { name: 'Mobile Engineering', value: 8 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Pixel art of a modern government building, clean structural lines with golden highlights'
  },
  {
    id: 'guardia',
    title: 'Guardia – FinTech Fraud Detection Platform',
    category: 'FinTech Platform',
    shortDesc: 'An end-to-end transactional fraud analysis pipeline integrating Explainable AI risk modeling.',
    problem: 'Real-world banking datasets are messy, inconsistent, and often incomplete. Traditional fraud detection systems struggle when faced with missing values, duplicate records, schema drift, and noisy transaction streams.',
    process: 'Built an end-to-end fraud analytics platform capable of cleaning, transforming, and analyzing transaction data before applying machine learning models for fraud detection. Integrated interactive dashboards and explainable risk scoring mechanisms.',
    exploration: `* Data cleaning pipelines
* Behavioral feature engineering
* Fraud prediction models
* Risk scoring systems
* Interactive analytics dashboards
* Explainable AI workflows`,
    outcome: `✓ Automated fraud risk assessment
✓ Improved transaction anomaly detection
✓ Produced explainable fraud insights
✓ Simulated production-grade banking workflows`,
    techStack: ['FastAPI', 'Next.js', 'Python', 'Supabase', 'Machine Learning'],
    goals: [
      { text: 'Design behavioral feature engineering pipelines', done: true },
      { text: 'Integrate explainable AI risk scoring visualizer', done: true },
      { text: 'Optimize real-time transaction processing latency', done: false }
    ],
    statsGained: [
      { name: 'AI Engineering', value: 15 },
      { name: 'Data Science', value: 12 },
      { name: 'Security Architecture', value: 10 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Cyberpunk shield overlaying transaction code lines, glowing red danger vectors'
  },
  {
    id: 'sheetsync',
    title: 'SheetSync',
    category: 'Computer Vision Tool',
    shortDesc: 'An OCR-powered digitization pipeline exporting structured data directly into Google Sheets.',
    problem: 'Organizations still spend countless hours manually transferring information from paper forms into spreadsheets, creating bottlenecks and increasing human error.',
    process: 'Developed an OCR-powered document digitization platform that captures form images, preprocesses them using computer vision techniques, extracts text with OCR, and automatically exports structured data into Google Sheets.',
    exploration: `* OpenCV image preprocessing
* OCR extraction workflows
* Google OAuth integration
* Structured data parsing
* Cloud document synchronization
* Human-in-the-loop verification`,
    outcome: `✓ Automated paper-to-digital conversion
✓ Reduced manual data entry effort
✓ Improved OCR accuracy through preprocessing
✓ Enabled seamless Google Sheets integration`,
    techStack: ['Next.js', 'TypeScript', 'Tesseract.js', 'OpenCV.js', 'Google Sheets API'],
    goals: [
      { text: 'Integrate Tesseract.js character recognition', done: true },
      { text: 'Preprocess templates with OpenCV crop filters', done: true },
      { text: 'Perform full OAuth sync and dynamic sheet export', done: true },
      { text: 'Enforce manual correction overlay for low-confidence text', done: false }
    ],
    statsGained: [
      { name: 'Computer Vision', value: 14 },
      { name: 'API Integrations', value: 10 },
      { name: 'UI/UX Magic', value: 6 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Mechanical scanner arm digitizing old paper schematics, yellow light beam'
  },
  {
    id: 'hotel-management',
    title: 'Hotel Management System',
    category: 'ASP.NET Core Application',
    shortDesc: 'A centralized hotel manager with room tracking, booking workflows, and role-based permissions.',
    problem: 'Hotel operations often depend on disconnected booking records, customer data, and room management processes, leading to inefficiencies and poor visibility.',
    process: 'Built a hotel operations platform with customer management, room tracking, booking workflows, authentication, and administrator controls using ASP.NET Core MVC and PostgreSQL.',
    exploration: `* Role-based authentication
* Booking lifecycle management
* Database relationship modeling
* Secure password storage
* Administrative dashboards
* Entity Framework architecture`,
    outcome: `✓ Streamlined hotel booking operations
✓ Improved room utilization tracking
✓ Enhanced administrative control
✓ Secured customer information`,
    techStack: ['ASP.NET Core', 'PostgreSQL', 'Entity Framework Core', 'C#'],
    goals: [
      { text: 'Build database schema mapping in EF Core', done: true },
      { text: 'Deploy administrator dashboards for room status', done: true },
      { text: 'Implement automated invoicing email alerts', done: false }
    ],
    statsGained: [
      { name: 'Database Modeling', value: 12 },
      { name: 'Enterprise Logic', value: 10 },
      { name: 'Security Architecture', value: 6 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Pixel outline of a luxury hotel lobby, retro RPG tavern look'
  },
  {
    id: 'medical-image-detection',
    title: 'Medical Image Detection System',
    category: 'Computer Vision Pipeline',
    shortDesc: 'Batch processing image system generating segmentation masks and structured medical reports.',
    problem: 'Medical image analysis often requires extensive manual inspection. Identifying anomalies consistently across large image sets is time-consuming and difficult to scale.',
    process: 'Built an automated image analysis pipeline capable of processing batches of medical images, generating detection masks, producing visual overlays, and exporting detailed analytical reports.',
    exploration: `* Computer vision workflows
* Image segmentation
* Batch processing pipelines
* Detection overlays
* Automated report generation
* Medical image interpretation`,
    outcome: `✓ Automated image analysis workflows
✓ Generated visual detection insights
✓ Produced structured analytical reports
✓ Improved scalability of image review processes`,
    techStack: ['Python', 'Computer Vision'],
    goals: [
      { text: 'Build batch image input loading utility', done: true },
      { text: 'Render pixel segmentation overlay masks', done: true },
      { text: 'Export PDF analytical logs for diagnostic review', done: false }
    ],
    statsGained: [
      { name: 'Computer Vision', value: 15 },
      { name: 'Data Science', value: 10 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Microscopic digital cell structure scan with neon grid markers'
  },
  {
    id: 'library-management',
    title: 'Library Management System',
    category: 'Web Application',
    shortDesc: 'A centralized web database tracking user borrows, books catalog, and system operations.',
    problem: 'Managing books, users, and borrowing records manually leads to inefficiencies and limited visibility into library resources.',
    process: 'Developed a centralized web platform for managing library inventory, user records, and resource tracking through a modern Next.js interface.',
    exploration: `* Resource management systems
* User access workflows
* Inventory tracking
* Modern web architecture
* Type-safe development
* Responsive interfaces`,
    outcome: `✓ Centralized library operations
✓ Improved resource tracking
✓ Enhanced user experience
✓ Simplified administration`,
    techStack: ['Next.js', 'TypeScript'],
    goals: [
      { text: 'Construct type-safe borrowing schemas', done: true },
      { text: 'Implement live search filter for catalog items', done: true },
      { text: 'Auto-calculate late return penalty invoices', done: false }
    ],
    statsGained: [
      { name: 'UI/UX Magic', value: 12 },
      { name: 'Backend Logic', value: 8 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Endless pixel bookshelves fading into quiet ambient purple light'
  },
  {
    id: 'pomodoro-timer',
    title: 'Pomodoro Timer',
    category: 'Productivity Application',
    shortDesc: 'A time-tracking productivity timer supporting custom work intervals and sound chimes.',
    problem: 'Maintaining focus for extended periods is difficult without structured work and rest intervals.',
    process: 'Created a productivity application implementing the Pomodoro Technique with configurable work sessions, short breaks, and long-break cycles.',
    exploration: `* Timer management
* Session tracking
* Productivity workflows
* User interaction design
* Time management systems`,
    outcome: `✓ Encouraged focused work sessions
✓ Reduced procrastination
✓ Promoted sustainable productivity habits`,
    techStack: ['HTML', 'CSS', 'JavaScript'],
    goals: [
      { text: 'Set up precise browser background interval clocks', done: true },
      { text: 'Design cozy notification sound wave chimes', done: true },
      { text: 'Log total completed focus hours into local charts', done: false }
    ],
    statsGained: [
      { name: 'UI/UX Magic', value: 10 },
      { name: 'Front-end Speed', value: 10 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Pixel hourglass containing glowing sands next to a coffee mug'
  },
  {
    id: 'smart-irrigation',
    title: 'Smart Irrigation System',
    category: 'IoT Mobile System',
    shortDesc: 'An Android application that automates agricultural watering based on environmental soil sensors.',
    problem: 'Traditional irrigation methods often waste water due to fixed schedules and lack of environmental awareness.',
    process: 'Developed an IoT-enabled irrigation platform that monitors environmental conditions and automates watering decisions through an Android application.',
    exploration: `* IoT integration
* Sensor communication
* Android development
* Real-time monitoring
* Automated control systems`,
    outcome: `✓ Reduced water wastage
✓ Automated irrigation workflows
✓ Enabled remote monitoring
✓ Won 1st Place at SCOE Avishkar`,
    techStack: ['Android', 'Firebase', 'IoT'],
    goals: [
      { text: 'Establish Firebase real-time data sync with sensor', done: true },
      { text: 'Formulate automated watering threshold rules', done: true },
      { text: 'Design Android app control triggers for manual override', done: true },
      { text: 'Integrate weather forecasting API hooks', done: false }
    ],
    statsGained: [
      { name: 'Mobile Engineering', value: 15 },
      { name: 'IoT Architecture', value: 12 },
      { name: 'System Design', value: 10 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1463123081488-729f60c3c544?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Glowing green plant nursery with blue irrigation sensors, pixel style'
  },
  {
    id: 'vulnerability-scanner',
    title: 'Vulnerability Scanning Tool',
    category: 'Cybersecurity Script',
    shortDesc: 'A security scanner performing port analysis, banner grabbing, and misconfiguration checks.',
    problem: 'Small organizations often lack affordable tools to identify exposed services, misconfigurations, and basic security weaknesses.',
    process: 'Built a lightweight vulnerability scanner capable of port scanning, service fingerprinting, default webpage detection, and security logging.',
    exploration: `* Socket programming
* Network scanning
* Banner grabbing
* Security analysis
* Packet inspection
* Logging systems`,
    outcome: `✓ Detected exposed services
✓ Identified common misconfigurations
✓ Improved network visibility
✓ Strengthened cybersecurity understanding`,
    techStack: ['Python', 'Scapy', 'Networking'],
    goals: [
      { text: 'Program raw packet headers using Scapy framework', done: true },
      { text: 'Extract software version string via banner grabbing', done: true },
      { text: 'Log output reports in human-readable formats', done: true },
      { text: 'Integrate CVE database API search lookup', done: false }
    ],
    statsGained: [
      { name: 'Security Architecture', value: 15 },
      { name: 'Network Mechanics', value: 12 },
      { name: 'Scripting Power', value: 10 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Glowing matrix data streams showing threat signatures'
  },
  {
    id: 'urja-dashboard',
    title: 'Urja',
    category: 'Control Panel Website',
    shortDesc: 'A unified command panel to monitor and toggle CCTV systems, agricultural sprayers, and home lighting.',
    problem: 'Managing multiple smart devices through separate interfaces creates friction and operational complexity.',
    process: 'Built a web-based dashboard for monitoring and controlling IoT devices including CCTV systems, agricultural sprayers, and smart lighting.',
    exploration: `* Dashboard design
* IoT interfaces
* Device categorization
* Monitoring workflows
* Control panel architecture`,
    outcome: `✓ Unified device management experience
✓ Simplified hardware interaction
✓ Improved accessibility and monitoring`,
    techStack: ['HTML', 'CSS', 'JavaScript'],
    goals: [
      { text: 'Mock websocket connections for toggle signals', done: true },
      { text: 'Design visual grid listing device status cards', done: true },
      { text: 'Implement battery and signal strength indicators', done: true },
      { text: 'Support custom automation schedules', done: false }
    ],
    statsGained: [
      { name: 'UI/UX Magic', value: 12 },
      { name: 'Front-end Speed', value: 10 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Minimal modern dashboard listing smart devices with neon status glows'
  },
  {
    id: 'ai-threat-detection',
    title: 'AI Cybersecurity Threat Detection System',
    category: 'Machine Learning Platform',
    shortDesc: 'Orchestrated AI model pipeline classifying phishing vectors and mobile threat logs.',
    problem: 'Cyber threats emerge across multiple vectors including phishing, malware, suspicious network traffic, and malicious code. Traditional single-model systems fail to provide comprehensive protection.',
    process: 'Developed a multi-model AI platform that orchestrates LSTMs, transformers, anomaly detection models, and threat classification pipelines through a FastAPI backend and Flutter mobile application.',
    exploration: `* LSTM behavior analysis
* Transformer-based phishing detection
* Malware analysis workflows
* Multi-model orchestration
* Mobile threat monitoring
* Cloud-native deployment`,
    outcome: `✓ Real-time threat detection
✓ Multi-vector security analysis
✓ Cross-platform monitoring
✓ Production-ready cloud deployment`,
    techStack: ['FastAPI', 'TensorFlow', 'PyTorch', 'Flutter', 'Firebase', 'GCP'],
    goals: [
      { text: 'Deploy LSTM model predicting sequential threat logs', done: true },
      { text: 'Build Flutter mobile application log dashboard', done: true },
      { text: 'Integrate FastAPI model gateway pipeline', done: true },
      { text: 'Optimize tensor compilation for embedded mobile devices', done: false }
    ],
    statsGained: [
      { name: 'AI Engineering', value: 15 },
      { name: 'Security Architecture', value: 12 },
      { name: 'System Design', value: 10 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'High tech digital locks and binary matrix streams overlaying code logs'
  },
  {
    id: 'stockmaster',
    title: 'StockMaster',
    category: 'Full-Stack Web App',
    shortDesc: 'A database warehouse inventory tracking stock movements, delivery lists, and authorizations.',
    problem: 'Businesses often rely on spreadsheets and manual registers to track inventory, creating visibility and accuracy issues.',
    process: 'Built a modern inventory management platform supporting warehouse operations, stock movement tracking, analytics, authentication, and delivery workflows.',
    exploration: `* Inventory architecture
* Warehouse modeling
* Role-based access control
* Business analytics
* Database design
* Operational workflows`,
    outcome: `✓ Centralized inventory management
✓ Improved stock visibility
✓ Enhanced warehouse operations
✓ Scalable business infrastructure`,
    techStack: ['Next.js', 'PostgreSQL', 'Drizzle ORM', 'Better Auth'],
    goals: [
      { text: 'Model multi-warehouse stock transfer schemas', done: true },
      { text: 'Integrate Better Auth access control restrictions', done: true },
      { text: 'Generate low-stock auto replenishment warning logs', done: true },
      { text: 'Connect barcode scanner scanning APIs', done: false }
    ],
    statsGained: [
      { name: 'Database Modeling', value: 14 },
      { name: 'Backend Logic', value: 12 },
      { name: 'Security Architecture', value: 8 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Massive warehouse with pixel boxes under spotlight grid'
  },
  {
    id: 'nestjs-starter',
    title: 'Next.js + NestJS Full-Stack Starter',
    category: 'Framework Template',
    shortDesc: 'A production-ready full-stack starter template with Prisma, Docker, and Gemini AI integration.',
    problem: 'Setting up production-ready applications repeatedly requires significant boilerplate effort before actual development can begin.',
    process: 'Created a reusable full-stack foundation with authentication, email services, database integration, API clients, LLM support, Docker deployment, and type-safe architecture.',
    exploration: `* Authentication systems
* Reusable architecture
* Type-safe APIs
* Docker deployment
* LLM integrations
* Developer experience optimization`,
    outcome: `✓ Accelerated project bootstrapping
✓ Reduced repetitive setup work
✓ Standardized architecture patterns
✓ Improved development velocity`,
    techStack: ['Next.js', 'NestJS', 'Prisma', 'TypeScript', 'Docker', 'Gemini API'],
    goals: [
      { text: 'Set up Prisma database schema migrations', done: true },
      { text: 'Formulate Docker Compose orchestration files', done: true },
      { text: 'Integrate type-safe OpenAPI compiler docs', done: true },
      { text: 'Incorporate automated CI test suite configurations', done: false }
    ],
    statsGained: [
      { name: 'System Design', value: 15 },
      { name: 'Backend Logic', value: 12 },
      { name: 'API Integrations', value: 10 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Grid blueprint showing architecture blocks and modules, glowing cyber blue lines'
  }
];

export const BOOKS: Book[] = [
  {
    id: 'think-and-grow-rich',
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    category: 'Mindset Scroll',
    type: 'book',
    rarity: 'Epic',
    stars: 4,
    quote: 'Whatever the mind can conceive and believe, it can achieve.',
    summary: 'A classic exploration of desire, persistence, self-belief, and long-term goal setting. Reinforced the importance of having a clear vision and unwavering commitment to achieving it.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    imageAlt: 'Think and Grow Rich book cover'
  },

  {
    id: 'winning-people-without-losing-yourself',
    title: 'Winning People Without Losing Yourself',
    author: 'Ankur Warikoo',
    category: 'Social Skill Tome',
    type: 'book',
    rarity: 'Rare',
    stars: 4,
    quote: 'Boundaries are not walls; they are bridges to healthier relationships.',
    summary: 'Practical lessons on communication, influence, self-respect, and setting boundaries while maintaining authentic relationships.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    imageAlt: 'Winning People Without Losing Yourself book cover'
  },

  {
    id: 'art-of-spending-money',
    title: 'The Art of Spending Money',
    author: 'Morgan Housel',
    category: 'Wealth Codex',
    type: 'book',
    rarity: 'Epic',
    stars: 5,
    quote: 'Money is a tool to build a better life, not a scorecard.',
    summary: 'Explores the psychology behind spending decisions and emphasizes aligning money with values, experiences, and long-term happiness.',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
    imageAlt: 'The Art of Spending Money book cover'
  },

  {
    id: 'master-your-emotions',
    title: 'Master Your Emotions',
    author: 'Thibaut Meurisse',
    category: 'Resilience Manual',
    type: 'book',
    rarity: 'Rare',
    stars: 4,
    quote: 'You cannot always control events, but you can control your response.',
    summary: 'A practical guide for understanding emotions, reducing negativity, and building emotional awareness during stressful situations.',
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400',
    imageAlt: 'Master Your Emotions book cover'
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Productivity Scroll',
    type: 'book',
    rarity: 'Legendary',
    stars: 5,
    quote: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    summary: 'A comprehensive guide on how to build good habits and break bad ones. Compounding daily improvements by just 1% results in a massive 37x improvement over a year.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    imageAlt: 'Atomic Habits book cover'
  }
];

export const BOOK_LESSONS = [
  "Clarity of purpose compounds faster than motivation.",
  "The quality of your relationships determines the quality of your opportunities.",
  "Money should buy freedom, not status.",
  "Emotional control is a competitive advantage."
];

export const DAY_SEGMENTS: DaySegment[] = [
  {
    id: 'morning',
    title: 'Training Arc',
    desc: 'Movement, discipline, and focused preparation before the world gets noisy.',
    logs: [
      {
        time: '07:00 AM',
        title: 'Gym Session',
        desc: 'Strength training, cardio, and building consistency one workout at a time.',
        icon: 'fitness_center',
        statusText: 'Completed'
      },
      {
        time: '09:00 AM',
        title: 'GATE Deep Work',
        desc: 'Studying core CS subjects, solving problems, and strengthening fundamentals.',
        icon: 'school',
        statusText: 'Completed'
      }
    ],
    imageUrl: '/Gym_image.png',
    imageAlt: 'Morning workout and focused study setup'
  },

  {
    id: 'work',
    title: 'Opportunity Board',
    desc: 'Applications, networking, and opportunities hunting.',
    logs: [
      {
        time: '11:30 AM',
        title: 'Job Applications',
        desc: 'Applying strategically, tailoring resumes, and reaching out to recruiters.',
        icon: 'work',
        statusText: 'Completed'
      },
      {
        time: '12:30 PM',
        title: 'Network Building',
        desc: 'Connecting with professionals, alumni, and expanding opportunities.',
        icon: 'groups',
        statusText: 'Completed'
      }
    ],
    imageUrl: '/networking.png',
    imageAlt: 'Job applications and professional networking'
  },

  {
    id: 'evening',
    title: 'Forge',
    desc: 'Turning ideas into products and strengthening engineering skills.',
    logs: [
      {
        time: '02:00 PM',
        title: 'Project Development',
        desc: 'Building products, shipping features, and improving existing systems.',
        icon: 'code',
        statusText: 'Completed'
      },
      {
        time: '06:00 PM',
        title: 'Interview Preparation',
        desc: 'DSA practice, CS fundamentals, system design, and technical revision.',
        icon: 'psychology',
        statusText: 'Completed'
      }
    ],
    imageUrl: '/work.png',
    imageAlt: 'Coding an  d engineering workflow'
  },

  {
    id: 'night',
    title: 'Campfire',
    desc: 'Learning, planning, and preparing for tomorrow.',
    logs: [
      {
        time: '08:00 PM',
        title: 'Learning Session',
        desc: 'Exploring AI, cybersecurity, research papers, or new technologies.',
        icon: 'auto_stories',
        statusText: 'Completed'
      },
      {
        time: '10:30 PM',
        title: 'Shutdown Protocol',
        desc: 'Reviewing progress, planning the next day, and getting proper rest.',
        icon: 'dark_mode',
        statusText: 'Active'
      }
    ],
    imageUrl: '/study.png',
    imageAlt: 'Night planning and reflection'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "nic",
    title: "Government Software Engineer",
    desc: "Built production-grade backend systems and APIs at National Informatics Center (NIC), Government of India.",
    icon: "account_balance"
  },
  {
    id: "deepcytes",
    title: "Cybersecurity Analyst",
    desc: "Worked as a Cyber Analyst Fellow at DeepCytes Cyber Labs (UK), conducting vulnerability assessments and security research.",
    icon: "security"
  },
  {
    id: "odoo",
    title: "19,000+ Competitors",
    desc: "Selected among 19,000+ participants at Odoo Hackathon 2025 after shipping QuickCourt in 48 hours.",
    icon: "rocket_launch"
  },
  {
    id: "research",
    title: "Published Researcher",
    desc: "Published peer-reviewed research papers in AI-powered data sanitation and IoT-based smart irrigation systems.",
    icon: "school"
  }
];

export const INTERACTIVE_ACHIEVEMENTS: InteractiveAchievement[] = [
  { id: 'cartographer', title: 'Cartographer', desc: 'Wander the digital grid. Visited at least 5 different village sectors on the map.', icon: 'explore', xpReward: 100, goldReward: 40, condition: 'Visit 5 distinct tabs' },
  { id: 'grand-architect', title: 'Grand Architect', desc: 'Incorporate pristine requirements. Inspect all 4 spec tabs of any project at the Forge.', icon: 'construction', xpReward: 120, goldReward: 50, condition: 'Inspect problem, process, exploration, and outcome specs' },
  { id: 'secret-seeker', title: 'Secret Seeker', desc: 'Unravel deep spatial folklore. Discovered a secret area or clickable easter egg on the world map.', icon: 'emoji_events', xpReward: 150, goldReward: 60, condition: 'Find a map easter egg (fountain, boat, or campfire)' },
  { id: 'spell-binder', title: 'Spell Binder', desc: 'Consult the spell codex volumes. Open and read any archive book scroll.', icon: 'auto_stories', xpReward: 80, goldReward: 30, condition: 'Open and read any book summary in the Library' },
  { id: 'cast-first-spell', title: 'Sonic Apprentice', desc: 'Cast your first custom synthesizer spell.', icon: 'volume_up', xpReward: 50, goldReward: 15, condition: 'Play 1 custom sound' },
  { id: 'create-5-sounds', title: 'Sound Weaver', desc: 'Cast 5 different sound spells in the laboratory.', icon: 'music_note', xpReward: 80, goldReward: 25, condition: 'Play 5 custom sounds' },
  { id: 'try-all-oscillators', title: 'Frequency Adept', desc: 'Try all 4 wave oscillators: Sine, Square, Sawtooth, and Triangle.', icon: 'waves', xpReward: 100, goldReward: 35, condition: 'Play sounds with all 4 oscillator shapes' }
];

export const CERTIFICATES: Certificate[] = [
  {
    id: "avishkar-2023",
    title: "1st Place - SCOE Avishkar",
    issuer: "SCOE Project Competition",
    date: "Feb 2023",
    icon: "emoji_events",
    badgeColor: "#facc15"
  },
  {
    id: "msbte-2023",
    title: "State Level Finalist",
    issuer: "MSBTE Project Competition",
    date: "Mar 2023",
    icon: "workspace_premium",
    badgeColor: "#60a5fa"
  },
  {
    id: "ijrpr-paper",
    title: "Smart Irrigation Research Publication",
    issuer: "IJRPR Journal",
    date: "Apr 2023",
    icon: "article",
    badgeColor: "#22c55e"
  },
  {
    id: "iiht-cyber",
    title: "Cybersecurity Certification",
    issuer: "IIHT",
    date: "2024",
    icon: "security",
    badgeColor: "#f97316"
  },
  {
    id: "iitb-php",
    title: "PHP & MySQL",
    issuer: "IIT Bombay",
    date: "2024",
    icon: "code",
    badgeColor: "#3b82f6"
  },
  {
    id: "deepcytes-fellowship",
    title: "Cyber Analyst Fellow",
    issuer: "DeepCytes Cyber Labs (UK)",
    date: "Aug 2025 - Dec 2025",
    icon: "security",
    badgeColor: "#f97316"
  },
  {
    id: "odoo-hackathon",
    title: "Odoo Hackathon Finalist",
    issuer: "Selected among 19,000+ Participants",
    date: "Aug 2025",
    icon: "rocket_launch",
    badgeColor: "#eab308"
  },
  {
    id: "jetir-publication",
    title: "Research Publication",
    issuer: "JETIR",
    date: "Apr 2025",
    icon: "article",
    badgeColor: "#22c55e"
  },
  {
    id: "nic-internship",
    title: "Software Engineer Intern",
    issuer: "National Informatics Center",
    date: "Dec 2025 - May 2026",
    icon: "work",
    badgeColor: "#60a5fa"
  },
  {
    id: "hackoverflow",
    title: "HackOverflow 4.0",
    issuer: "National Hackathon",
    date: "Mar 2026",
    icon: "smart_toy",
    badgeColor: "#a855f7"
  },
  {
    id: "final-year-rep",
    title: "Final Year Representative",
    issuer: "SCOE Department Coordinator",
    date: "2026",
    icon: "groups",
    badgeColor: "#fb7185"
  }
];

export const LESSONS_LEARNED: LessonLeaned[] = [
  {
    id: "l1",
    text: "The fastest way to learn is to build something real. Every project leaves behind a lesson worth keeping."
  },
  {
    id: "l2",
    text: "Working on production systems taught me that reliability matters more than clever code."
  },
  {
    id: "l3",
    text: "Hackathons taught me that constraints often reveal the most creative solutions."
  },
  {
    id: "l4",
    text: "Cybersecurity taught me that every system is only as strong as the assumptions behind it."
  }
];

export const GARDEN_NODES: GardenNode[] = [
  { id: 'jiya', label: 'JIYA', x: 50, y: 50, group: 'root', description: 'Curious human, builder, full-stack wizard.' },

  // First Layer Branches
  { id: 'engineering', label: 'Engineering', x: 25, y: 40, group: 'engineering', description: 'Structuring robust systems, data flows, and clean architectures.' },
  { id: 'ai', label: 'AI', x: 50, y: 22, group: 'ai', description: 'Integrating LLMs, prompt engineering, and intelligent agents.' },
  { id: 'productivity', label: 'Productivity', x: 75, y: 40, group: 'productivity', description: 'Systems for focused output, habit loops, and tracking progress.' },
  { id: 'creativity', label: 'Creativity', x: 65, y: 75, group: 'creative', description: 'Writing logs, capturing photography, and building side products.' },
  { id: 'life', label: 'Life', x: 35, y: 75, group: 'life', description: 'Health investments, personal finance, books, and traveling.' },

  // Engineering Leaves
  { id: 'system-design', label: 'System Design', x: 10, y: 25, group: 'engineering', description: 'Learning how large-scale software systems stay reliable, scalable, and maintainable.' },
  { id: 'backend-arch', label: 'Backend Architecture', x: 8, y: 35, group: 'engineering', description: 'Designing robust database adapters, routing layers, and microservices queues.' },
  { id: 'apis', label: 'APIs', x: 7, y: 45, group: 'engineering', description: 'Designing secure, clean, RESTful and GraphQL API endpoints.' },
  { id: 'databases', label: 'Databases', x: 9, y: 55, group: 'engineering', description: 'Relational data indexing, aggregation, and caching patterns (SQL/NoSQL).' },
  { id: 'scalability', label: 'Scalability', x: 15, y: 65, group: 'engineering', description: 'Load balancers, replication, partitioning index strategies, and memory optimization.' },
  { id: 'clean-code', label: 'Clean Code', x: 22, y: 22, group: 'engineering', description: 'Writing readable, reusable, modular code enforcing DRY/SOLID paradigms.' },
  { id: 'security', label: 'Security', x: 12, y: 15, group: 'engineering', description: 'Penetration testing, encryption standards, vulnerability checks, and security designs.' },

  // AI Leaves
  { id: 'gemini-api', label: 'Gemini API', x: 36, y: 12, group: 'ai', description: 'Leveraging Gemini flash and pro models to generate dynamic contextual quest content.' },
  { id: 'ai-agents', label: 'AI Agents', x: 43, y: 8, group: 'ai', description: 'Systems that can reason, act, and automate workflows with minimal human intervention.' },
  { id: 'prompt-eng', label: 'Prompt Engineering', x: 50, y: 6, group: 'ai', description: 'Configuring rigid model system prompts and JSON outputs schemas.' },
  { id: 'nlp', label: 'NLP', x: 57, y: 8, group: 'ai', description: 'Parsing, text classification, entities extraction, and structural text processing.' },
  { id: 'rag', label: 'RAG', x: 64, y: 12, group: 'ai', description: 'Retrieval Augmented Generation using semantic search vector databases.' },
  { id: 'embeddings', label: 'Embeddings', x: 70, y: 18, group: 'ai', description: 'Mathematical representations of text semantics used in similarity lookups.' },
  { id: 'automation', label: 'Automation', x: 30, y: 18, group: 'ai', description: 'Scripting tools, web scrappers, and automated agent action chains.' },

  // Productivity Leaves
  { id: 'atomic-habits', label: 'Atomic Habits', x: 88, y: 25, group: 'productivity', description: 'Structuring visual checks to build tiny, atomic daily habits that compound.' },
  { id: 'deep-work', label: 'Deep Work', x: 91, y: 35, group: 'productivity', description: 'Blocking distractions and concentrating on cognitively demanding developer tasks.' },
  { id: 'second-brain', label: 'Second Brain', x: 92, y: 45, group: 'productivity', description: 'Organizing book summaries, insights, and archives into digital databases.' },
  { id: 'focus-systems', label: 'Focus Systems', x: 90, y: 55, group: 'productivity', description: 'Structuring Pomodoro intervals and visual tracking logs.' },
  { id: 'goal-tracking', label: 'Goal Tracking', x: 86, y: 65, group: 'productivity', description: 'Breaking yearly aspirations into weekly milestones and deliverables.' },
  { id: 'learning-systems', label: 'Learning Systems', x: 80, y: 22, group: 'productivity', description: 'Structured active recall, spaced repetition, and index building.' },

  // Creativity Leaves
  { id: 'photography', label: 'Photography', x: 80, y: 80, group: 'creative', description: 'Capturing landscapes, street layout perspectives, and digital pixel art.' },
  { id: 'writing', label: 'Writing', x: 74, y: 88, group: 'creative', description: 'Writing logs, dev diaries, tutorials, and documentations.' },
  { id: 'ui-design', label: 'UI Design', x: 65, y: 92, group: 'creative', description: 'Crafting responsive layout blueprints, micro-animations, and CSS tokens.' },
  { id: 'storytelling', label: 'Storytelling', x: 56, y: 90, group: 'creative', description: 'Drafting quests, procedurally forged scrolls, and roleplaying scenarios.' },
  { id: 'side-projects', label: 'Building Side Projects', x: 85, y: 70, group: 'creative', description: 'Synthesizing simple web applications, tools, and scripts in real time.' },

  // Life Leaves
  { id: 'fitness', label: 'Fitness', x: 20, y: 80, group: 'life', description: 'Consistency over intensity. Small daily investments compound over time.' },
  { id: 'books', label: 'Books', x: 26, y: 88, group: 'life', description: 'A collection of ideas borrowed from authors who spent decades learning things the hard way.' },
  { id: 'travel', label: 'Travel', x: 35, y: 92, group: 'life', description: 'Backpacking through scenic routes, historic villages, and new cities.' },
  { id: 'finance', label: 'Finance', x: 44, y: 90, group: 'life', description: 'Tracking gold balances, investment principles, and long-term security.' },
  { id: 'food', label: 'Food', x: 15, y: 70, group: 'life', description: 'Cooking recipes, local street food trails, and tracking macro nutrients.' },
  { id: 'personal-growth', label: 'Personal Growth', x: 10, y: 60, group: 'life', description: 'Emotions awareness, resilience training, and building strong focus limits.' }
];

export const STAR_NODES: StarNode[] = [
  {
    id: "lifelong-learning",
    name: "Lifelong Learning",
    x: 50,
    y: 56,
    category: "learning",
    description: "Continuous improvement, mastering CS fundamentals, and staying curious about computing systems.",
    achieved: true
  },
  {
    id: "software-eng",
    name: "Software Engineering",
    x: 63,
    y: 13,
    category: "career",
    description: "I want to build reliable, high-performance, and maintainable systems that scale to millions of users.",
    achieved: true
  },
  {
    id: "research-innov",
    name: "Research & Innovation",
    x: 52,
    y: 70,
    category: "ai-research",
    description: "Published peer-reviewed research papers in AI and IoT domains, and actively exploring new computing models.",
    achieved: true
  },
  {
    id: "master-ai",
    name: "Master AI",
    x: 38,
    y: 36,
    category: "ai-research",
    description: "From agents to automation, I want to build intelligent systems that augment human capability.",
    achieved: false
  },
  {
    id: "travel",
    name: "Travel the world",
    x: 73,
    y: 25,
    category: "personal",
    description: "Wandering through scenic mountains, photographic valleys, and exploring remote corners of India.",
    achieved: false
  },
  {
    id: "build-products",
    name: "Build products people love",
    x: 13,
    y: 44,
    category: "career",
    description: "I want to create software that solves real problems and feels delightful to use.",
    achieved: false
  },
  {
    id: "financial-freedom",
    name: "Create financial freedom",
    x: 52,
    y: 22,
    category: "personal",
    description: "Freedom to choose projects, opportunities, and experiences without constraints.",
    achieved: false
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'potion-red', name: 'Health Potion of Focus', desc: 'Restores developer stamina. Grants instant +10% daily quest motivation.', cost: 40, purchased: false, icon: 'science', effect: 'Play beautiful red fluid chime and restore 10 HP!' },
  { id: 'elixir-blue', name: 'Coding Mana Elixir', desc: 'Instantly completes a random custom active quest in your log!', cost: 75, purchased: false, icon: 'wine_bar', effect: 'Instantly autocomplete any customizable quest and pocket G.' },
  { id: 'wisdom-scroll', name: 'Scroll of Ancient Code', desc: 'Unlocks a rare, secret retrospective log written by Jiya during an outage.', cost: 120, purchased: false, icon: 'scroll', effect: 'Reveal the secret logs of a legendary dev outage.' },
  { id: 'legendary-cape', name: 'Armor of the Architect', desc: 'Offers total defense against imposter syndrome. Upgrades HUD class badge!', cost: 200, purchased: false, icon: 'military_tech', effect: 'Converts name title from Engineer to "Architect Overseer"!' }
];

export const WEATHER_CONDITIONS: WeatherConfig[] = [
  {
    id: 'clear',
    name: 'Clear Skylands',
    icon: 'wb_sunny',
    color: 'text-amber-400',
    xpModifier: 1.0,
    effectClass: 'weather-clear',
    desc: "Perfect blue skies over Jiya's grid. Standard learning efficiency."
  },
  {
    id: 'rain',
    name: 'Electric Rainstorm',
    icon: 'thunderstorm',
    color: 'text-indigo-400',
    xpModifier: 1.25,
    effectClass: 'weather-rain',
    desc: 'Atmospheric spark storms ignite servers. Experience multipliers are boosted by +25%!'
  },
  {
    id: 'snow',
    name: 'Aether Blizzard',
    icon: 'ac_unit',
    color: 'text-sky-300',
    xpModifier: 1.2,
    effectClass: 'weather-snow',
    desc: 'Biting cold slows down physical servers but crystallizes mental focus. Gaining +20% more XP.'
  },
  {
    id: 'fog',
    name: 'Arcane Fog',
    icon: 'blur_on',
    color: 'text-purple-300',
    xpModifier: 1.15,
    effectClass: 'weather-fog',
    desc: 'Mystic mist overlays the village layout, revealing hidden codex runes. Gaining +15% more XP.'
  }
];

export const SECRET_SECTORS: SecretSector[] = [
  {
    id: 'fountain',
    name: 'The Sunken Crystal Fountain',
    coords: 'X: 45 Y: 30',
    description: 'An ancient debugging crystal tossed into the village fountain. Glimmers with golden retro magic when retrieved.',
    hint: 'A lost debugging artifact rests beneath the splashing waters at coordinates near X: 45 Y: 30. Try tossing some coins.',
    icon: 'waves'
  },
  {
    id: 'boat',
    name: 'The Pixel Hollow Boat',
    coords: 'X: 12 Y: 20',
    description: 'A rustic wooden boat drifting quietly in the serene, reflecting waters of the village lake.',
    hint: 'A lonely, rowable vessel floats silently near the western waters around X: 12 Y: 20.',
    icon: 'directions_boat'
  },
  {
    id: 'campfire',
    name: 'The Whispering Campfire Wood',
    coords: 'X: 38 Y: 56',
    description: 'A cozy fireplace where Jiya roast marshmallows while logging her early dev-outages.',
    hint: 'Warm glowing embers crackle endlessly in the cozy forests near X: 38 Y: 56. Pay it a visit.',
    icon: 'local_fire_department'
  },
  {
    id: 'star',
    name: 'The Celestial Zenith Star',
    coords: 'X: 78 Y: 3',
    description: 'A distant, faint pulsar star nesting in the upper skies, beaming secret cosmic metadata.',
    hint: 'Look closely at the dark northern sky near X: 78 Y: 3. A faint star glimmers with celestial telemetry.',
    icon: 'star'
  }
];

export const GOALS: Goal[] = [
  { id: 'gate', title: 'Crack GATE Exam', progress: 60 },
  { id: 'portfolio', title: 'Finish RPG Portfolio', progress: 90 },
  { id: 'research', title: 'AI Agent Frameworks', progress: 40 }
];

