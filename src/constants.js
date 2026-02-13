export const FILE_ICONS = {
  // Code
  java: '☕', js: '🟨', ts: '🔷', py: '🐍',
  cpp: '⚙️', c: '⚙️', h: '📎', cs: '🔵',
  html: '🌐', css: '🎨', json: '📋', xml: '📄',
  gradle: '🐘', sh: '🖥️', rb: '💎', go: '🐹',
  // Docs
  pdf: '📕', docx: '📘', doc: '📘', xlsx: '📗',
  xls: '📗', pptx: '📙', ppt: '📙', txt: '📝',
  md: '📝', csv: '📊',
  // Design
  psd: '🎭', ai: '🖌️', fig: '🎨', svg: '🔷',
  png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', webp: '🖼️',
  // 3D / CAD
  stl: '🧊', step: '🔩', sldprt: '🔧', sldasm: '🔧',
  obj: '🧊', fbx: '🧊',
  // Media
  mp4: '🎬', mov: '🎬', avi: '🎬', mp3: '🎵', wav: '🎵', mkv: '🎬',
  // Archives
  zip: '🗜️', rar: '🗜️', gz: '🗜️', tar: '🗜️',
  // Config
  env: '🔐', yaml: '⚙️', yml: '⚙️', toml: '⚙️', ini: '⚙️', cfg: '⚙️',
  // Default
  default: '📄',
};

export const DEMO_TREE = `my-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Button.jsx
│   │   │   └── Modal.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Settings.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useFetch.js
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   └── theme.css
│   │   └── App.jsx
│   ├── public/
│   │   ├── logo.png
│   │   └── favicon.ico
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   └── dataController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Session.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── api.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   └── index.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── api.test.js
│   └── package.json
├── database/
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   └── 002_create_sessions.sql
│   └── seeds/
│       └── demo_data.sql
├── docs/
│   ├── api_reference.pdf
│   ├── setup_guide.md
│   └── architecture.png
├── .env
├── docker-compose.yml
└── README.md`;
