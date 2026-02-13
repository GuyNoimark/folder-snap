import React from 'react';
import { Panel, PanelHeader, Btn, Hint, Code } from './UI';
import { DEMO_TREE } from '../constants';

const TAB_STYLE_BASE = {
  padding: '7px 16px',
  borderRadius: '7px 7px 0 0',
  fontSize: 13, fontWeight: 500,
  cursor: 'pointer',
  border: '1px solid transparent',
  borderBottom: 'none',
  background: 'transparent',
  fontFamily: 'var(--font-body)',
  transition: 'all 0.2s',
};

const TEXTAREA_STYLE = {
  width: '100%',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  lineHeight: 1.6,
  padding: '14px 16px',
  resize: 'vertical',
  outline: 'none',
  marginTop: 16,
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const INPUT_STYLE = {
  width: '100%',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  padding: '12px 16px',
  outline: 'none',
  marginTop: 16,
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const TABS = [
  { id: 'path',   label: '📂 Folder Path' },
  { id: 'readme', label: '📄 README Tree' },
  { id: 'github', label: '🐙 GitHub URL' },
];

export default function InputPanel({
  activeTab, setActiveTab,
  pathValue, setPathValue,
  readmeValue, setReadmeValue,
  githubUrl, setGithubUrl,
  githubToken, setGithubToken,
  githubStatus,
}) {
  const focusStyle = {
    borderColor: 'var(--accent)',
    boxShadow: '0 0 0 3px var(--accent-dim)',
  };

  function handleLoadDemo() {
    setReadmeValue(DEMO_TREE);
    setActiveTab('readme');
  }

  return (
    <Panel>
      <PanelHeader title="Input" />

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '16px 20px 0', gap: 4 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...TAB_STYLE_BASE,
              ...(activeTab === tab.id
                ? {
                    background: 'var(--surface2)',
                    borderColor: 'var(--border)',
                    color: 'var(--accent)',
                  }
                : { color: 'var(--text-muted)' }),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content area */}
      <div style={{
        background: 'var(--surface2)',
        borderTop: '1px solid var(--border)',
        padding: '0 20px 20px',
      }}>

        {/* ── Folder Path ── */}
        {activeTab === 'path' && (
          <>
            <textarea
              value={pathValue}
              onChange={e => setPathValue(e.target.value)}
              placeholder={
                'Paste one path per line. First line = root:\n\n' +
                'C:\\Users\\username\\Projects\\my-app\n' +
                'C:\\Users\\username\\Projects\\my-app\\frontend\n' +
                'C:\\Users\\username\\Projects\\my-app\\backend'
              }
              rows={5}
              style={TEXTAREA_STYLE}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <Hint>
              One full path per line. First line = root. Works with Windows{' '}
              <Code>\</Code> and Unix <Code>/</Code> paths.
            </Hint>
          </>
        )}

        {/* ── README Tree ── */}
        {activeTab === 'readme' && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 16, marginBottom: 0,
            }}>
              <Hint style={{ padding: 0 }}>
                Supports <Code>├──</Code> <Code>└──</Code> <Code>│</Code> tree characters.
              </Hint>
              <Btn
                onClick={handleLoadDemo}
                style={{ fontSize: 12, padding: '5px 12px', marginLeft: 12 }}
              >
                🌲 Load demo
              </Btn>
            </div>
            <textarea
              value={readmeValue}
              onChange={e => setReadmeValue(e.target.value)}
              placeholder={
                'my-project/\n├── src/\n│   ├── components/\n│   └── utils/\n├── public/\n└── package.json'
              }
              rows={8}
              style={TEXTAREA_STYLE}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </>
        )}

        {/* ── GitHub URL ── */}
        {activeTab === 'github' && (
          <>
            <input
              type="text"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              style={INPUT_STYLE}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />

            {/* Status */}
            {githubStatus && (
              <div style={{
                marginTop: 10,
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                display: 'flex', alignItems: 'center', gap: 6,
                color: githubStatus.type === 'error'
                  ? 'var(--red)'
                  : githubStatus.type === 'success' || githubStatus.type === 'warn'
                    ? 'var(--green)'
                    : 'var(--text-secondary)',
              }}>
                {githubStatus.type === 'loading' && (
                  <div style={{
                    width: 12, height: 12, flexShrink: 0,
                    border: '2px solid var(--border-light)',
                    borderTopColor: 'var(--accent)',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                )}
                {githubStatus.message}
              </div>
            )}

            <Hint style={{ marginTop: 8 }}>
              Any public GitHub repo URL. Uses the GitHub API via CORS proxy.
              Large repos may be truncated by GitHub.
            </Hint>

            <input
              type="password"
              value={githubToken}
              onChange={e => setGithubToken(e.target.value)}
              placeholder="Optional: GitHub token for private repos or higher rate limits"
              style={{ ...INPUT_STYLE, marginTop: 10, fontSize: 12 }}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </>
        )}
      </div>
    </Panel>
  );
}
