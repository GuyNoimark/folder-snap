# 📁 FolderSnap

A folder structure visualizer — paste a folder path, README tree, or GitHub URL and get a beautiful visual tree you can export as PNG.

## Features

- **3 input modes:** Folder path, README tree, GitHub repo URL
- **Depth control:** Top level, 2–3 levels, full, or custom
- **File type icons:** 40+ file extensions with customizable emoji
- **Export:** Copy PNG to clipboard or download
- **GitHub integration:** Fetches any public repo's full file tree via the GitHub API

## Getting Started

### Prerequisites

- Node.js 16+
- npm 8+

### Install & Run

```bash
npm install
npm start
```

The app opens at `http://localhost:3000`.

### Build for production

```bash
npm run build
```

Output goes to the `build/` folder.

---

## Deploy to GitHub Pages

### One-time setup

1. Create a repo on GitHub (e.g. `folderio`)

2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/folderio.git
git push -u origin main
```

3. In `package.json`, update the `homepage` field:

```json
"homepage": "https://YOUR-USERNAME.github.io/folderio"
```

4. Install the deploy tool:

```bash
npm install --save-dev gh-pages
```

### Deploy

```bash
npm run deploy
```

Your app will be live at `https://YOUR-USERNAME.github.io/folderio` within ~1 minute.

### Auto-deploy on push (optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

## Project Structure

```
folderio/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── UI.jsx          # Shared primitives (Panel, Btn, Toggle, Toast…)
│   │   ├── InputPanel.jsx  # Tab-based input (path / README / GitHub)
│   │   ├── ConfigPanel.jsx # Depth + icon settings
│   │   └── TreeOutput.jsx  # Visual tree renderer
│   ├── App.jsx             # Main app, state management
│   ├── constants.js        # FILE_ICONS map + DEMO_TREE
│   ├── utils.js            # Parsers, GitHub fetch, tree filters
│   ├── index.js
│   └── index.css
└── package.json
```
