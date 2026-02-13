import React, { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';

import InputPanel from './components/InputPanel';
import ConfigPanel from './components/ConfigPanel';
import TreeOutput from './components/TreeOutput';
import { Panel, Btn, Spinner, Toast } from './components/UI';
import { FILE_ICONS } from './constants';
import {
  parseFolderPath,
  parseReadmeTree,
  fetchGithubTree,
  githubItemsToTree,
  parseGithubUrl,
  filterDepth,
  countItems,
  sortTree,
} from './utils';

export default function App() {
  // ── Input state ─────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('path');
  const [pathValue, setPathValue] = useState('');
  const [readmeValue, setReadmeValue] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [githubStatus, setGithubStatus] = useState(null);

  // ── Config state ────────────────────────────────────────
  const [depthMode, setDepthMode] = useState('top');
  const [customDepth, setCustomDepth] = useState('4');
  const [showIcons, setShowIcons] = useState(true);
  const [iconsOpen, setIconsOpen] = useState(false);
  const [userIcons, setUserIcons] = useState({ ...FILE_ICONS });
  const [sortMode, setSortMode] = useState('none');

  // ── Tree state ──────────────────────────────────────────
  const [treeData, setTreeData] = useState(null);
  const [filteredTree, setFilteredTree] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // ── Toast ───────────────────────────────────────────────
  const [toast, setToast] = useState({ visible: false, icon: '', message: '' });
  const toastTimer = useRef(null);

  function showToast(icon, message) {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, icon, message });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2400);
  }

  // ── Tree ref for canvas export ──────────────────────────
  const treeRef = useRef(null);

  // ── Recompute filtered tree ─────────────────────────────
  const applyFilter = useCallback((data, mode, depth, sort = 'none') => {
    if (!data) return;
    let filtered = filterDepth(data, mode, depth);
    if (sort !== 'none') {
      filtered = sortTree(filtered, sort);
    }
    setFilteredTree(filtered);
    setItemCount(countItems(filtered));
  }, []);

  // ── Generate ────────────────────────────────────────────
  async function handleGenerate() {
    setIsGenerating(true);
    let parsed = null;

    try {
      if (activeTab === 'path') {
        if (!pathValue.trim()) { showToast('⚠️', 'Please enter a folder path'); return; }
        parsed = parseFolderPath(pathValue);
      } else if (activeTab === 'readme') {
        if (!readmeValue.trim()) { showToast('⚠️', 'Please paste a README tree'); return; }
        parsed = parseReadmeTree(readmeValue);
      } else if (activeTab === 'github') {
        if (!githubUrl.trim()) { showToast('⚠️', 'Please enter a GitHub URL'); return; }
        const info = parseGithubUrl(githubUrl);
        if (!info) { showToast('⚠️', 'Invalid GitHub URL'); return; }
        setGithubStatus(null);
        const result = await fetchGithubTree(
          info.owner, info.repo, githubToken,
          (type, message) => setGithubStatus({ type, message })
        );
        parsed = githubItemsToTree(result.items, result.repoName);
      }

      if (!parsed) { showToast('⚠️', 'Could not parse input'); return; }

      setTreeData(parsed);
      applyFilter(parsed, depthMode, customDepth, sortMode);
    } catch (e) {
      setGithubStatus({ type: 'error', message: '✗ ' + e.message });
      showToast('⚠️', e.message);
    } finally {
      setIsGenerating(false);
    }
  }

  // ── Re-filter when depth changes (if tree already loaded) ─
  function handleDepthChange(mode) {
    setDepthMode(mode);
    if (treeData) applyFilter(treeData, mode, customDepth, sortMode);
  }

  function handleCustomDepthChange(val) {
    setCustomDepth(val);
    if (treeData && depthMode === 'custom') applyFilter(treeData, 'custom', val, sortMode);
  }

  function handleSortChange(mode) {
    setSortMode(mode);
    if (treeData) applyFilter(treeData, depthMode, customDepth, mode);
  }

  function handleIconsChange(val) {
    setShowIcons(val);
    if (!val) setIconsOpen(false);
  }

  // ── PNG export ──────────────────────────────────────────
  async function captureCanvas() {
    if (!treeRef.current) return null;
    return html2canvas(treeRef.current, {
      backgroundColor: '#f8f9fb',
      scale: 2,
      useCORS: true,
      logging: false,
    });
  }

  async function handleCopyPng() {
    if (!filteredTree) return showToast('⚠️', 'Generate a tree first');
    const canvas = await captureCanvas();
    if (!canvas) return;
    canvas.toBlob(blob => {
      if (!blob) return showToast('⚠️', 'Could not generate image');
      try {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          .then(() => showToast('📋', 'PNG copied to clipboard!'))
          .catch(() => showToast('⚠️', 'Clipboard access denied'));
      } catch {
        showToast('⚠️', 'Browser does not support image clipboard');
      }
    }, 'image/png');
  }

  async function handleDownloadPng() {
    if (!filteredTree) return showToast('⚠️', 'Generate a tree first');
    const canvas = await captureCanvas();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'folder-structure.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('🖼️', 'PNG downloaded!');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        width: '100%', maxWidth: 900,
        padding: '40px 24px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: 'var(--accent)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17,
            boxShadow: '0 0 18px var(--accent-glow)',
          }}>
            📁
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 600, fontSize: 17,
            letterSpacing: '-0.02em',
          }}>
            Folder<span style={{ color: 'var(--accent)' }}>IO</span>
          </span>
        </div>
        <span style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          folder structure → visual tree
        </span>
      </header>

      {/* Main */}
      <main style={{
        width: '100%', maxWidth: 900,
        padding: '28px 24px 60px',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>

        {/* Input */}
        <InputPanel
          activeTab={activeTab} setActiveTab={setActiveTab}
          pathValue={pathValue} setPathValue={setPathValue}
          readmeValue={readmeValue} setReadmeValue={setReadmeValue}
          githubUrl={githubUrl} setGithubUrl={setGithubUrl}
          githubToken={githubToken} setGithubToken={setGithubToken}
          githubStatus={githubStatus}
        />

        {/* Config */}
        <ConfigPanel
          depthMode={depthMode} setDepthMode={handleDepthChange}
          customDepth={customDepth} setCustomDepth={handleCustomDepthChange}
          showIcons={showIcons} setShowIcons={handleIconsChange}
          iconsOpen={iconsOpen} setIconsOpen={setIconsOpen}
          userIcons={userIcons} setUserIcons={setUserIcons}
          sortMode={sortMode} setSortMode={handleSortChange}
        />

        {/* Generate button row */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Btn
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{ padding: '12px 32px', fontSize: 15, borderRadius: 'var(--radius)' }}
          >
            {isGenerating ? <><Spinner /> Fetching…</> : <><span>✦</span> Generate Tree</>}
          </Btn>
        </div>

        {/* Output */}
        {filteredTree && (
          <Panel style={{ animation: 'fadeSlideIn 0.3s ease' }}>
            {/* Output toolbar */}
            <div style={{
              display: 'flex', gap: 8, alignItems: 'center',
              padding: '12px 20px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface)',
            }}>
              <span style={{
                fontSize: 12, fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                <span style={{ color: 'var(--accent)' }}>{itemCount}</span> item{itemCount !== 1 ? 's' : ''}
              </span>
              <div style={{ flex: 1 }} />
              <Btn onClick={handleCopyPng} style={{ fontSize: 12, padding: '6px 14px' }}>
                📋 Copy PNG
              </Btn>
              <Btn onClick={handleDownloadPng} style={{ fontSize: 12, padding: '6px 14px' }}>
                ⬇️ Download PNG
              </Btn>
            </div>

            {/* Tree */}
            <TreeOutput
              treeRef={treeRef}
              filteredTree={filteredTree}
              showIcons={showIcons}
              userIcons={userIcons}
            />
          </Panel>
        )}
      </main>

      <Toast visible={toast.visible} icon={toast.icon} message={toast.message} />
    </div>
  );
}
